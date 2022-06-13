import {
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
} from '@angular/core/testing';

import { CreateEditFormComponent } from './create-edit-form.component';
import { Pokemon } from '../../models/pokemon';
import { StoreModule } from '@ngrx/store';
import { appReducers, AppState } from '../../store/app.reducer';
import { HttpClientModule } from '@angular/common/http';
import { PokemonService } from '../../services/pokemon.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderComponent } from '../slider/slider.component';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('CreateEditFormComponent', () => {
  let component: CreateEditFormComponent;
  let fixture: ComponentFixture<CreateEditFormComponent>;
  let service: PokemonService;
  let store: MockStore<AppState>;
  let alert: jasmine.Spy;

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
  const initialState: AppState = {
    pokemons: {
      pokemons,
      loaded: true,
      loading: false,
      currPokemon: pokemons[0],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditFormComponent, SliderComponent],
      imports: [
        StoreModule.forRoot(appReducers),
        HttpClientModule,
        ReactiveFormsModule,
      ],
      providers: [
        PokemonService,
        provideMockStore<AppState>({
          initialState,
        }),
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });

    fixture = TestBed.createComponent(CreateEditFormComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PokemonService);
    store = TestBed.inject(MockStore);

    alert = spyOn(window, 'alert');

    component.ngOnInit();
  });

  it('debe crearse el formulario con los campos requeridos', () => {
    expect(component).toBeTruthy();
    expect(component.registroForm.contains('name')).toBeTruthy();
    expect(component.registroForm.contains('attack')).toBeTruthy();
    expect(component.registroForm.contains('defense')).toBeTruthy();
    expect(component.registroForm.contains('hp')).toBeTruthy();
    expect(component.registroForm.contains('image')).toBeTruthy();
    expect(component.registroForm.contains('type')).toBeTruthy();
  });

  it('debe inicializase el formulario con los datos de un pokemon', () => {
    expect(component.registroForm.get('name')?.value).toBe(pokemons[0].name);
    expect(component.registroForm.get('attack')?.value).toBe(
      pokemons[0].attack
    );
    expect(component.registroForm.get('defense')?.value).toBe(
      pokemons[0].defense
    );
    expect(component.registroForm.get('hp')?.value).toBe(pokemons[0].hp);
    expect(component.registroForm.get('image')?.value).toBe(pokemons[0].image);
    expect(component.registroForm.get('type')?.value).toBe(pokemons[0].type);
  });

  it('debe llamarse la función para editar cuando se de click en el botón con los datos correctos del formulario y cerrar el formulario', async () => {
    fixture.whenStable().then(() => {
      const form = fixture.debugElement.query(By.css('form'));
      const editService = spyOn(service, 'editPokemon').and.returnValue(
        of(pokemons[0])
      );

      let closeFormFlag = false;
      component.closeForm.subscribe((_) => (closeFormFlag = true));

      form.triggerEventHandler('submit', null);

      expect(editService).toHaveBeenCalledWith(
        pokemons[0].id,
        component.registroForm.value
      );
      expect(alert).toHaveBeenCalledWith('Pokemon editado correctamente');
      expect(closeFormFlag).toBeTruthy();
    });
  });
  it('debe llamarse la función para guardar nuevo Pokemon cuando se de click en el botón con los datos correctos del formulario y cerrar el formulario', async () => {
    fixture.whenStable().then(() => {
      //seteo el id de edit a -1 para que se tome como si fuera una creación
      component.editID = -1;

      const form = fixture.debugElement.query(By.css('form'));
      const saveService = spyOn(service, 'addPokemon').and.returnValue(
        of(pokemons[0])
      );

      let closeFormFlag = false;
      component.closeForm.subscribe((_) => (closeFormFlag = true));

      form.triggerEventHandler('submit', null);

      expect(saveService).toHaveBeenCalledWith({
        ...component.registroForm.value,
        idAuthor: 1,
      });
      expect(alert).toHaveBeenCalledWith('Pokemon creado correctamente');
      expect(closeFormFlag).toBeTruthy();
    });
  });

  it('debe llamarse al evento para cerrar el formulario al dar click en el botón de cancelar', async () => {
    fixture.whenStable().then(() => {
      const cancelBtn = fixture.debugElement.query(
        By.css('button[type="button"]')
      );

      let closeFormFlag = false;
      component.closeForm.subscribe((_) => (closeFormFlag = true));

      cancelBtn.triggerEventHandler('click', null);

      expect(closeFormFlag).toBeTruthy();
    });
  });

  it('debe cargar el formulario vacío', () => {
    spyOn(store, 'select').and.callFake((_) => {
      return of({ currPokemon: null });
    });

    component.ngOnInit();

    expect(component.editID).toEqual(-1);
  });

  it('debe mostrar mensajes de error cuando hay un problema al crear o editar', () => {
    spyOn(service, 'addPokemon').and.returnValue(throwError(() => {}));
    spyOn(service, 'editPokemon').and.returnValue(throwError(() => {}));

    component.submit();
    expect(alert).toHaveBeenCalledWith('Hubo un error al editar pokemon');

    component.editID = -1;
    component.submit();
    expect(alert).toHaveBeenCalledWith('Hubo un error al crear pokemon');
  });

  it('no debe hacer submit si el formulario es invalido', () => {
    const saveService = spyOn(service, 'addPokemon');
    component.registroForm.controls['name'].setValue('');

    component.submit();

    expect(saveService).not.toHaveBeenCalled();
  });
});
