import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';

import { TableComponent } from './table.component';
import { PokemonService } from '../../services/pokemon.service';
import { AppState, appReducers } from '../../store/app.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { Pokemon } from '../../models/pokemon';
import { PokemonsState } from '../../store/reducers/pokemons.reducer';
import { By } from '@angular/platform-browser';
import { ColorTypeDirective } from '../../directives/color-type.directive';
import { of, throwError } from 'rxjs';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let service: PokemonService;
  let store: MockStore<AppState>;
  // let mockPokemonsSelector: MemoizedSelector<PokemonsState, Pokemon[]>;

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

  const initialState = {
    pokemons: {
      pokemons,
      loaded: true,
      loading: false,
      currPokemon: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent, ColorTypeDirective],
      imports: [StoreModule.forRoot(appReducers), HttpClientModule],
      providers: [
        PokemonService,
        provideMockStore<AppState>({
          initialState,
        }),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PokemonService);
    store = TestBed.inject(MockStore);
    // mockPokemonsSelector = store.overrideSelector('pokemons', pokemons);

    // store.dispatch(cargarPokemonsSuccess({ pokemons }));
    component.ngOnInit();
  });

  // afterAll(() => {
  //   component.ngOnDestroy();
  // });

  it('Debe crear el componente de la tabla', () => {
    expect(component).toBeTruthy();
  });

  it('Debe habe una lista de pokemons en el store', () => {
    let tablePokemons: Pokemon[] = [];
    store.select('pokemons').subscribe((val: PokemonsState) => {
      tablePokemons = val.pokemons;
    });

    expect(tablePokemons.length).toBe(2);
  });

  it('Debe ejecutarse la accion de eliminar al pulsar el icono trash', async () => {
    component.loadedPokemons = true;
    component.loadingPokemons = false;
    component.pageList = pokemons;
    await fixture.whenStable();
    spyOn(window, 'confirm').and.returnValue(true);
    const alert = spyOn(window, 'alert');

    const delBtn = fixture.debugElement.queryAll(By.css('.fas.fa-trash'));

    const deleteService = spyOn(service, 'removePokemon').and.returnValue(
      of(pokemons[0])
    );

    delBtn[0].triggerEventHandler('click', null);

    // expect(component.remove).toHaveBeenCalledWith(pokemons[0]);
    expect(deleteService).toHaveBeenCalledWith(pokemons[0].id);
    expect(alert).toHaveBeenCalledWith('Pokemon eliminado correctamemte');
  });

  it('Debe filtrar la lista de pokemons por el tipo', () => {
    expect(component.filteredPokList.length).toBe(pokemons.length);

    component.currType = 'water';
    component.filterList();
    expect(component.filteredPokList.length).toBe(0);
  });

  it('Debe llamar la funcion para editar', () => {
    const editFnc = spyOn(component.editPokemon, 'emit').and.returnValue();

    component.edit(pokemons[0]);
    expect(editFnc).toHaveBeenCalledWith(pokemons[0]);
  });

  it('No debe ir a la siguiente pagina si esta al final o regresar si está al inicio', () => {
    component.pokemonsPerPage = 5;
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(1);

    component.lastPage();
    expect(component.currentPage).toBe(1);
  });

  it('Debe cambiar de pagina', () => {
    component.pokemonsPerPage = 1;
    component.currentPage = 1;

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.lastPage();
    expect(component.currentPage).toBe(1);
  });

  it('Debe cambiar el tipo de pokemon', () => {
    const filter = spyOn(component, 'filterList');
    const target: any = { value: 'water' };
    component.handleTypeChange({ target } as any);
    expect(filter).toHaveBeenCalled();
    expect(component.currType).toBe('water');
  });

  it('Debe mostrar mensaje de error', () => {
    const alert = spyOn(window, 'alert');
    spyOn(service, 'removePokemon').and.returnValue(throwError(() => {}));
    spyOn(window, 'confirm').and.returnValue(true);

    component.remove(pokemons[0]);

    expect(alert).toHaveBeenCalledWith('Hubo un error al eliminar Pokemon');
  });
});
