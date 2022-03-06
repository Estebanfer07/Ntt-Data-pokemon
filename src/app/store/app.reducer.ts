import { ActionReducerMap } from '@ngrx/store';
import * as reducers from './reducers';

export interface AppState {
  pokemons: reducers.PokemonsState;
}

export const appReducers: ActionReducerMap<AppState> = {
  pokemons: reducers.pokemonsReducer,
};
