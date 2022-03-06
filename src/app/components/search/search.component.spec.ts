import { SearchComponent } from './search.component';
import { PokemonService } from '../../services/pokemon.service';
import { appReducers, AppState } from '../../store/app.reducer';
import { of } from 'rxjs';
import {
  TestBed,
  ComponentFixture,
  ComponentFixtureAutoDetect,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import * as actions from '../../store/actions/pokemons.actions';
import { Pokemon } from '../../models/pokemon';
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let service: PokemonService;

  let input: DebugElement;
  let store: MockStore<AppState>;

  const testInputVal = 'test';
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
      image:
        'https://assets.pokemon.com/assets/cms2/img/pokedex/full/448_f2.png',
      type: 'poison',
      hp: 34,
      attack: 40,
      defense: 77,
      idAuthor: 1,
      created_at: new Date('2022-02-28T15:56:24.375Z'),
      updated_at: new Date('2022-03-06T03:38:48.230Z'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [StoreModule.forRoot(appReducers), HttpClientModule],
      providers: [
        PokemonService,
        provideMockStore<AppState>(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;

    component.ngAfterViewInit();

    service = TestBed.inject(PokemonService);
    store = TestBed.inject(MockStore);
    input = fixture.debugElement.query(By.css('input'));
    input.nativeElement.value = testInputVal;
  });

  afterAll(() => {
    component.ngOnDestroy();
  });

  it('Debe crearse el componente Search', () => {
    expect(component).toBeTruthy();
  });

  it('Debe escuchar cambios en el input y llamar servicio de busqueda pokemon', fakeAsync(() => {
    const searchPokemons = spyOn(service, 'searchPokemonsByName').and.callFake(
      () => of()
    );

    input.nativeElement.dispatchEvent(new KeyboardEvent('keyup', {}));
    //espero el tiempo del debounce
    tick(500);
    expect(searchPokemons).toHaveBeenCalledWith(testInputVal);
  }));

  it('Debe llamar dispatch de cargarPokemons y cargarPokemonsSuccess', fakeAsync(() => {
    spyOn(service, 'searchPokemonsByName').and.returnValue(of(pokemons));
    const dispatch = spyOn(store, 'dispatch').and.callFake(() => of());

    input.nativeElement.dispatchEvent(new KeyboardEvent('keyup', {}));
    //espero el tiempo del debounce
    tick(500);

    //debe llamarse una vez para iniciar carga y una cuando ya tiene la información
    expect(dispatch).toHaveBeenCalledWith(actions.cargarPokemons());
    expect(dispatch).toHaveBeenCalledWith(
      actions.cargarPokemonsSuccess({ pokemons })
    );
  }));
});
