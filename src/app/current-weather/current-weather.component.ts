import {Component, Input, OnInit} from '@angular/core';
import {CurrentWeather, Weather,defaultWeather} from "../classes/weather";

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss']
})
export class CurrentWeatherComponent implements OnInit {

  @Input() currentWeater: Weather = defaultWeather;
  constructor() { }

  ngOnInit(): void {
  }

}
