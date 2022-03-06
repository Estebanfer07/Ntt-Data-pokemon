import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Pokemon } from '../models/pokemon';

//Color del nombre en la tabla dependiendo del tipo del pokemon
@Directive({
  selector: '[appColorType]',
})
export class ColorTypeDirective implements AfterViewInit {
  @Input() type: string = 'normal';
  @Input() pok!: Pokemon;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    let color = 'black';
    switch (this.type) {
      case 'normal':
        color = 'black';
        break;
      case 'fire':
        color = 'red';
        break;
      case 'water':
        color = '#8fc5d5';
        break;
      case 'poison':
        color = '#17c900';
        break;
      case 'bug':
        color = '#ffc700';
        break;

      default:
        color = 'black';
        break;
    }

    this.el.nativeElement.style.color = color;
  }
}
