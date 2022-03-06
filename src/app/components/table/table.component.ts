import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent, pluck, Subscription } from 'rxjs';
import { Pokemon, PokemonType, pokTypes } from '../../models/pokemon';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { AfterViewInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { removePokemon } from '../../store/actions';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('typeSelector') typeSelector!: ElementRef;

  @Output() editPokemon = new EventEmitter<Pokemon>();

  pokemonsSubs!: Subscription;
  typeSubs!: Subscription;

  completePokList: Pokemon[] = [];
  filteredPokList: Pokemon[] = [];
  pageList: Pokemon[] = [];
  loadingPokemons: boolean = false;
  loadedPokemons: boolean = false;
  pokemonsPerPage: number = 5;
  currentPage: number = 1;
  currType: PokemonType | 'todos' = 'todos';
  pokemonTypes = ['todos', ...pokTypes];

  constructor(
    private store: Store<AppState>,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.pokemonsSubs = this.store
      .select('pokemons')
      .subscribe(({ pokemons, loading, loaded }) => {
        this.completePokList = pokemons;
        this.filterList();
        this.loadingPokemons = loading;
        this.loadedPokemons = loaded;
      });
  }

  ngAfterViewInit(): void {
    this.typeSubs = fromEvent(this.typeSelector.nativeElement, 'change')
      .pipe(pluck('target', 'value'))
      .subscribe((type: any) => {
        this.currType = type;
        this.filterList();
      });
  }

  ngOnDestroy(): void {
    this.pokemonsSubs.unsubscribe();
    this.typeSubs.unsubscribe();
  }

  nextPage() {
    if (this.currentPage * this.pokemonsPerPage >= this.filteredPokList.length)
      return;
    this.currentPage++;
    this.getCurrentPageList();
  }

  lastPage() {
    if (this.currentPage === 1) return;
    this.currentPage--;
    this.getCurrentPageList();
  }

  getCurrentPageList() {
    this.pageList = this.filteredPokList.slice(
      this.currentPage * this.pokemonsPerPage - this.pokemonsPerPage,
      this.pokemonsPerPage * this.currentPage
    );
  }

  filterList() {
    if (this.currType === 'todos') {
      this.filteredPokList = this.completePokList;
    } else {
      this.filteredPokList = this.completePokList.filter(
        (p) => p.type === this.currType
      );
    }
    this.getCurrentPageList();
  }

  edit(pokemon: Pokemon) {
    this.editPokemon.emit(pokemon);
  }

  remove(pokemon: Pokemon) {
    this.pokemonService.removePokemon(pokemon.id).subscribe({
      next: (p) => {
        this.store.dispatch(removePokemon({ id: p.id }));
      },
      error: (err) => console.log(err),
    });
  }
}
