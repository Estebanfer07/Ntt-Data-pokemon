import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
})
export class DetailModalComponent implements OnInit {
  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {}

  closeModal() {
    this.pokemonService.toggleModal();
  }
}
