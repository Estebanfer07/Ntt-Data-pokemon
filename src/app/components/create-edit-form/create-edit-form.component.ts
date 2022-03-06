import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { pokTypes } from '../../models/pokemon';
import { AppState } from '../../store/app.reducer';
import { Subscription } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { addPokemon, editPokemon } from '../../store/actions/pokemons.actions';

@Component({
  selector: 'app-create-edit-form',
  templateUrl: './create-edit-form.component.html',
  styleUrls: ['./create-edit-form.component.scss', '../../../styles.scss'],
})
export class CreateEditFormComponent implements OnInit {
  @Output() closeForm = new EventEmitter();

  registroForm!: FormGroup;

  pokemonTypes = ['todos', ...pokTypes];

  currPokSubs!: Subscription;

  initialValues = {
    name: '',
    attack: 50,
    defense: 50,
    hp: 0,
    image: '',
    type: 'todos',
  };

  editID: number = -1;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      name: ['', Validators.required],
      attack: [this.initialValues.attack, Validators.required],
      defense: [this.initialValues.defense, Validators.required],
      hp: [this.initialValues.hp, Validators.required],
      image: [''],
      type: ['normal', Validators.required],
    });

    //cargar datos de pokemon a editar
    this.store.select('pokemons').subscribe(({ currPokemon }) => {
      if (currPokemon) {
        this.editID = currPokemon.id;
        this.registroForm.patchValue({ ...currPokemon });
        this.initialValues.attack = currPokemon?.attack;
        this.initialValues.defense = currPokemon?.defense;
        this.initialValues.hp = currPokemon?.hp;
      } else {
        this.editID = -1;
        this.registroForm.patchValue({ ...this.initialValues });
      }
    });
  }

  submit() {
    if (!this.registroForm.valid) return;

    if (this.editID === -1) {
      //Creo uno nuevo
      this.pokemonService
        .addPokemon({ ...this.registroForm.value, idAuthor: 1 })
        .subscribe({
          next: (p) => {
            this.store.dispatch(addPokemon({ pokemon: { ...p } }));
            this.closeForm.emit();
          },
          error: (_) => alert('Hubo un error al crear pokemon'),
        });
    } else {
      //editar
      this.pokemonService
        .editPokemon(this.editID, this.registroForm.value)
        .subscribe({
          next: (p) => {
            this.store.dispatch(editPokemon({ pokemon: p }));
            this.closeForm.emit();
          },
          error: (_) => alert('Hubo un error al editar pokemon'),
        });
    }
  }

  cancel() {
    this.closeForm.emit();
  }
}
