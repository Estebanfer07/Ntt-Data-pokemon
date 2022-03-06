import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { SliderComponent } from './slider.component';

describe('SliderComponent', () => {
  let component: SliderComponent;
  let fixture: ComponentFixture<SliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SliderComponent],
      imports: [ReactiveFormsModule],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
    fixture = TestBed.createComponent(SliderComponent);
    component = fixture.componentInstance;

    component.initialVal = 20;
    component.parentForm = new FormBuilder().group({
      slider: [20, Validators.required],
    });
    component.controlName = 'slider';

    // component.ngAfterViewInit();
  });

  it('debe crear el componente con un form con el campo slider', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(component.parentForm.contains('slider')).toBeTruthy();
  }));
});
