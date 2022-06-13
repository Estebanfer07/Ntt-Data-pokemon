import { getTestBed, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';
import { environment } from '../../environments/environment.prod';
import { Pokemon } from '../models/pokemon';

const pokemons: Pokemon[] = [
  {
    id: 645,
    name: 'Pikachu',
    image:
      'https://imagenpng.com/wp-content/uploads/2016/09/Pikachu-png-1-635x624.png',
    type: 'fire',
    hp: 77,
    attack: 100,
    defense: 100,
    idAuthor: 1,
    created_at: new Date('2022-02-24T16:09:23.247Z'),
    updated_at: new Date('2022-03-05T22:55:29.095Z'),
  },
  {
    id: 668,
    name: 'LUCARIO editado',
    image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/448_f2.png',
    type: 'poison',
    hp: 34,
    attack: 40,
    defense: 77,
    idAuthor: 1,
    created_at: new Date('2022-02-28T15:56:24.375Z'),
    updated_at: new Date('2022-03-06T03:38:48.230Z'),
  },
];

describe('TetsService', () => {
  let service: PokemonService;
  let injector: TestBed;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    injector = getTestBed();
    service = TestBed.inject(PokemonService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debe buscar pokemon por nombre', (done) => {
    const result: Pokemon[] = pokemons;

    service.searchPokemonsByName('Pikachu').subscribe((response) => {
      expect(response.length).toBe(1);
      done();
    });

    const req = httpMock.expectOne(`${environment.url}/?idAuthor=1`);
    expect(req.request.method).toBe('GET');

    req.flush(result); //ejecuto el request y devuelvo el resultado deseado
  });

  it('Debe eliminar un pokemon por id', (done) => {
    const result = pokemons[0];
    const id = pokemons[0].id;

    service.removePokemon(id).subscribe((response) => {
      expect(response).toBe(pokemons[0]);
      done();
    });

    const req = httpMock.expectOne(`${environment.url}/${id}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(result); //ejecuto el request y devuelvo el resultado deseado
  });

  it('Debe añadir un pokemon', (done) => {
    const result = pokemons[0];

    service.addPokemon(pokemons[0]).subscribe((response) => {
      expect(response).toBe(pokemons[0]);
      done();
    });

    const req = httpMock.expectOne(
      `${environment.url}/?idAuthor=1`,
      JSON.stringify(pokemons[0])
    );
    expect(req.request.method).toBe('POST');

    req.flush(result); //ejecuto el request y devuelvo el resultado deseado
  });

  it('Debe editar un pokemon', (done) => {
    const result = pokemons[0];
    const id = pokemons[0].id;

    service.editPokemon(id, pokemons[0]).subscribe((response) => {
      expect(response).toBe(pokemons[0]);
      done();
    });

    const req = httpMock.expectOne(
      `${environment.url}/${id}`,
      JSON.stringify(pokemons[0])
    );
    expect(req.request.method).toBe('PUT');

    req.flush(result); //ejecuto el request y devuelvo el resultado deseado
  });
});
