import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import { defaultWeather, Forecast, Weather} from "../classes/weather";
import {WeatherService} from "../services/weather.service";
import {Subject, takeUntil} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit {

  @Input() cityName: string |  undefined  = "";
  private destroy$ = new Subject<undefined>();

  firstWeekForecast: Array<Forecast> = [];

  constructor(
    private weatherService: WeatherService,
  ) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {

    console.log("forecast city name: ", changes["cityName"].currentValue);

    if (this.cityName !== null && this.cityName !== undefined && this.cityName !== "") {
      this.weatherService.createResponseForecastByCity(this.cityName).subscribe( value => {
          this.firstWeekForecast = value.list.map((forecastByDay: any) => this.weatherService.handleResponseForecastData(forecastByDay));
        }

      )
    }

  }

}
