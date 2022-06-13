import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pokemon } from '../models/pokemon';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  showModal: boolean = true;

  constructor(private http: HttpClient) {}

  toggleModal() {
    this.showModal = !this.showModal;
  }

  /**
   * Buscar Todos los pokemon
   * @returns Pokemon[]
   */
  searchPokemons() {
    return this.http.get<Pokemon[]>(`${environment.url}/?idAuthor=1`);
  }

  /**
   * Buscar Pokemon por nombre (como no hay un endpoint
   * especifico para esto, voy a simularlo)
   * @returns Pokemon[]
   */
  searchPokemonsByName(text: string) {
    return this.http.get<Pokemon[]>(`${environment.url}/?idAuthor=1`).pipe(
      map((pokemons) => {
        return pokemons.filter((p) =>
          p.name.toLowerCase().includes(text.toLowerCase())
        );
      })
    );
  }

  /**
   * Eliminar pokemon
   * @returns Pokemon
   */
  removePokemon(id: number) {
    return this.http.delete<Pokemon>(`${environment.url}/${id}`);
  }

  /**
   * Editar pokemon
   * @returns Pokemon
   */
  editPokemon(id: number, data: {}) {
    return this.http.put<Pokemon>(`${environment.url}/${id}`, { ...data });
  }

  /**
   * Add pokemon
   * @returns Pokemon
   */
  addPokemon(data: {}) {
    return this.http.post<Pokemon>(`${environment.url}/?idAuthor=1`, {
      ...data,
    });
  }
}
