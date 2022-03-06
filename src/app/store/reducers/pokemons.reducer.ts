import { Action, createReducer, on } from '@ngrx/store';
import { Pokemon } from '../../models/pokemon';
import {
  removePokemon,
  addPokemon,
  editPokemon,
} from '../actions/pokemons.actions';
import {
  cargarPokemons,
  cargarPokemonsSuccess,
  setCurrPokemon,
} from '../actions';

export interface PokemonsState {
  pokemons: Pokemon[];
  loaded: boolean;
  loading: boolean;
  currPokemon: Pokemon | null;
}

export const pokemonsInitialState: PokemonsState = {
  pokemons: [],
  loaded: false,
  loading: false,
  currPokemon: null,
};

const _pokemonsReducer = createReducer<PokemonsState>(
  pokemonsInitialState,

  on(cargarPokemons, (state) => ({ ...state, loading: true })),
  on(cargarPokemonsSuccess, (state, { pokemons }) => ({
    ...state,
    loading: false,
    loaded: true,
    pokemons: [...pokemons],
  })),
  on(setCurrPokemon, (state, { pokemon }) => ({
    ...state,
    currPokemon: pokemon,
  })),
  on(removePokemon, (state, { id }) => ({
    ...state,
    pokemons: state.pokemons.filter((p) => p.id !== id),
  })),
  on(addPokemon, (state, { pokemon }) => ({
    ...state,
    pokemons: [...state.pokemons, { ...pokemon }],
  })),
  on(editPokemon, (state, { pokemon }) => ({
    ...state,
    pokemons: state.pokemons.map((p) => {
      if (p.id === pokemon.id) return { ...pokemon };
      return { ...p };
    }),
  }))
);

export function pokemonsReducer(state = pokemonsInitialState, action: Action) {
  return _pokemonsReducer(state, action);
}
