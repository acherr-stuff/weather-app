import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocationInfoComponent } from './location-info/location-info.component';
import { ForecastComponent } from './forecast/forecast.component';
import { WeatherComponent } from './weather/weather.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CitySelectComponent } from './city-select/city-select.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from "@angular/material/input";
import {MatFormField, MatFormFieldModule} from "@angular/material/form-field";
import { ForecastItemComponent } from './forecast-item/forecast-item.component';
import {MatCardModule} from "@angular/material/card";
import {MatOptionModule} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { LoaderComponent } from './loader/loader.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    LocationInfoComponent,
    ForecastComponent,
    WeatherComponent,
    CurrentWeatherComponent,
    NotFoundComponent,
    CitySelectComponent,
    ForecastItemComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatOptionModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
