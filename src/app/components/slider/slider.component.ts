import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit {
  @ViewChild('thumb') thumb!: ElementRef;
  @Input() parentForm!: FormGroup;
  @Input() initialVal!: number;
  @Input() controlName!: string;

  el!: HTMLElement;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.el = this.thumb.nativeElement;

    // escuchar cambios en range para mover thumb
    this.parentForm.get(this.controlName)?.valueChanges.subscribe((val) => {
      this.el.style.left = this.calcRangeThumbPos(val);
    });

    this.el.style.left = this.calcRangeThumbPos(this.initialVal);
  }

  calcRangeThumbPos(val: number) {
    return `${(val * 195) / 100}px`;
  }
}
