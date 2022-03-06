import { Component, OnInit } from '@angular/core';
import { PokemonService } from './services/pokemon.service';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.reducer';
import { cargarPokemonsSuccess } from './store/actions';
import {
  cargarPokemons,
  setCurrPokemon,
} from './store/actions/pokemons.actions';
import { Pokemon } from './models/pokemon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss', '../styles.scss'],
})
export class AppComponent implements OnInit {
  showForm: boolean = false;

  constructor(
    private pokemonService: PokemonService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(cargarPokemons());

    this.pokemonService.searchPokemons().subscribe({
      next: (pokemons) =>
        this.store.dispatch(cargarPokemonsSuccess({ pokemons })),
      error: (err) => console.log(err),
    });
  }

  showPokemonForm(pokemon?: Pokemon) {
    this.store.dispatch(setCurrPokemon({ pokemon: pokemon || null }));
    this.showForm = true;
  }

  hideForm() {
    this.showForm = false;
  }
}
