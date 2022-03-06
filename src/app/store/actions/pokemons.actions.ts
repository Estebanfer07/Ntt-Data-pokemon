import { createAction, props } from '@ngrx/store';
import { Pokemon } from '../../models/pokemon';

export const cargarPokemons = createAction('[Pokemons] Cargar Pokemons');
export const cargarPokemonsSuccess = createAction(
  '[Pokemons] Cargar Pokemons Success',
  props<{ pokemons: Pokemon[] }>()
);
export const setCurrPokemon = createAction(
  '[Pokemons] Setear Pokemon Seleccionado',
  props<{ pokemon: Pokemon | null }>()
);
export const removePokemon = createAction(
  '[Pokemons] Eliminar Pokemon',
  props<{ id: number }>()
);
export const addPokemon = createAction(
  '[Pokemons] Add Pokemon',
  props<{ pokemon: Pokemon }>()
);
export const editPokemon = createAction(
  '[Pokemons] Edit Pokemon',
  props<{ pokemon: Pokemon }>()
);
