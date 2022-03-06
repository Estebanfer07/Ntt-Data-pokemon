import {
  ComponentFixtureAutoDetect,
  TestBed,
  ComponentFixture,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { appReducers, AppState } from './store/app.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PokemonService } from './services/pokemon.service';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { By } from '@angular/platform-browser';
import { Pokemon } from './models/pokemon';
import { of } from 'rxjs';
import * as actions from './store/actions/pokemons.actions';
import { CreateEditFormComponent } from './components/create-edit-form/create-edit-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from './components/slider/slider.component';
import { ColorTypeDirective } from './directives/color-type.directive';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let service: PokemonService;
  let store: MockStore<AppState>;

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
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
        StoreModule.forRoot(appReducers),
      ],
      declarations: [
        AppComponent,
        SearchComponent,
        TableComponent,
        CreateEditFormComponent,
        ColorTypeDirective,
        SliderComponent,
      ],
      providers: [
        PokemonService,
        provideMockStore<AppState>(),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    service = TestBed.inject(PokemonService);
    store = TestBed.inject(MockStore);
  });

  it('debe crear la pantalla principal', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los pokemons y llamar la accion cargarPokemonsSuccess', () => {
    const getPokemons = spyOn(service, 'searchPokemons').and.returnValue(
      of(pokemons)
    );
    const dispatch = spyOn(store, 'dispatch').and.callFake(() => of());

    component.ngOnInit();

    expect(getPokemons).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      actions.cargarPokemonsSuccess({ pokemons })
    );
  });

  it('Debe mostrar el formulario al dar click en el botón "Nuevo" y luego cerrar el formulario', () => {
    const newBtn = fixture.debugElement.query(By.css('button'));
    const form = fixture.debugElement.query(By.css('app-create-edit-form'));

    expect(component.showForm).toBeFalsy();

    newBtn.triggerEventHandler('click', null);

    expect(component.showForm).toBeTruthy();
    // expect(form.nativeElement).not.toBeNull();

    component.hideForm();
    expect(component.showForm).toBeFalsy();
  });
});
