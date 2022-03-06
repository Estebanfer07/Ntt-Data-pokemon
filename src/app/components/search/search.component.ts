import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  debounceTime,
  fromEvent,
  map,
  mergeAll,
  Observable,
  pluck,
  Subscription,
  tap,
} from 'rxjs';
import { AppState } from 'src/app/store/app.reducer';
import {
  cargarPokemons,
  cargarPokemonsSuccess,
} from '../../store/actions/pokemons.actions';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../models/pokemon';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  inputSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.inputSubs = fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        tap((_) => this.store.dispatch(cargarPokemons())),
        debounceTime(500),
        pluck('target', 'value'),
        map<any, Observable<Pokemon[]>>((texto: string) =>
          this.pokemonService.searchPokemonsByName(texto)
        ),
        mergeAll()
      )
      .subscribe({
        next: (pokemons) =>
          this.store.dispatch(cargarPokemonsSuccess({ pokemons })),
        error: (_) => alert('Hubo un error al cargar los pokemons'),
      });
  }

  ngOnDestroy(): void {
    this.inputSubs.unsubscribe();
  }
}
