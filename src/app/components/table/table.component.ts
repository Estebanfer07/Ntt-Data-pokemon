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
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

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

  ngOnDestroy(): void {
    this.pokemonsSubs.unsubscribe();
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
  goTopPage(page: number) {
    this.currentPage = page;
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

    this.goTopPage(1);
  }

  edit(pokemon: Pokemon) {
    this.editPokemon.emit(pokemon);
  }

  remove(pokemon: Pokemon) {
    const confirmar = confirm('seguro que desea eliminar?');

    if (confirmar) {
      this.pokemonService.removePokemon(pokemon.id).subscribe({
        next: (p) => {
          this.store.dispatch(removePokemon({ id: p.id }));
        },
        error: (_) => alert('Hubo un error al eliminar Pokemon'),
      });

      alert('Pokemon eliminado correctamemte');
    }
  }

  handleTypeChange({ target }: Event) {
    this.currType = (target as HTMLInputElement)!.value as PokemonType;
    this.filterList();
  }
}
