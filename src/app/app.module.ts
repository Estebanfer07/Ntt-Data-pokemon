import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { appReducers } from './store/app.reducer';
import { SearchComponent } from './components/search/search.component';
import { TableComponent } from './components/table/table.component';
import { CreateEditFormComponent } from './components/create-edit-form/create-edit-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorTypeDirective } from './directives/color-type.directive';
import { SliderComponent } from './components/slider/slider.component';
import { DetailModalComponent } from './components/detail-modal/detail-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    TableComponent,
    CreateEditFormComponent,
    ColorTypeDirective,
    SliderComponent,
    DetailModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
