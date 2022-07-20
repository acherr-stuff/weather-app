import {Component, Input, OnInit} from '@angular/core';
import {WeatherService} from "../services/weather.service";
import {defaultWeather, Weather} from "../classes/weather";

@Component({
  selector: 'app-location-info',
  templateUrl: './location-info.component.html',
  styleUrls: ['./location-info.component.scss']
})
export class LocationInfoComponent implements OnInit {

  public currentDay = new Date();
  public days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  //@Input weather: Weather;
  constructor() { }

  @Input() locationInfo: Weather = defaultWeather;

  ngOnInit(): void {

  }

}
