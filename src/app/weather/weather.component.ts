import { Component, OnInit } from '@angular/core';
import {WeatherService} from "../services/weather.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {
  Subject,
  Subscription,
  takeUntil,
  map,
  Observable,
  from,
  merge,
  concat,
  combineLatest,
  switchMap,
  of, tap
} from "rxjs";
import {defaultWeather, Weather} from "../classes/weather";
import {CurrentWeather} from "../classes/weather";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  private destroy$ = new Subject<undefined>();
  public weather: Weather = defaultWeather;
 // public forecast: any;
  public cityName: string | undefined = "";
  public defaultCity: string = "";

  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    const cityPiblisher = this.activatedRoute.params
      .pipe(takeUntil(this.destroy$)) // Observable<Params>
      .pipe(switchMap(params => {
        // ?? означает -  Если params["city"] === undefined ? localStorage.getItem("defaultCity") : params["city"]
        const city = params["city"] ?? localStorage.getItem("defaultCity");
        if (city != undefined) {
          return of(city); // Observable<String>
        } else {
          return from(this.weatherService.getWeatherByСurrentLocation()) // Observable<Weather>
            .pipe(
              map(value => {
                localStorage.setItem("defaultCity", value.name);
                return value.name;
              } ),
            ); // Observable<String>
        }
      })); // Observable<String>
    cityPiblisher.subscribe(city => {
      console.log("MY CITY: " + city);
      this.weatherService.createResponseWeatherByCity(city).then(value => {
        console.log("weather data: ", value)
        this.weather = this.weatherService.handleResponseWeatherData(value);
        console.log("weather all data comp: ", this.weather, ", ", typeof value);
      });
    });
    // this.activatedRoute.params.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe((params: Params) => {
    //
    //   if (params["city"] === undefined ) {
    //     if (localStorage.getItem("defaultCity") === null) {
    //       this.weatherService.getWeatherByСurrentLocation().then(value => {
    //       this.cityName = value.name;
    //       this.weather= this.weatherService.handleResponseWeatherData(value);
    //       console.log("weather all data comp: ", this.weather, ", ", typeof value);
    //       console.log("cityName: ", this.cityName);
    //         localStorage.setItem("defaultCity", this.cityName)
    //         console.log("w storage: ", localStorage.getItem("defaultCity"))
    //       })
    //     } else {
    //       this.weatherService.createResponseWeatherByCity(localStorage.getItem("defaultCity")).then(
    //         value => {
    //           console.log("weather all: ", value)
    //           this.weather = this.weatherService.handleResponseWeatherData(value);
    //         }
    //       )
    //     }
    //   } else {
    //
    //     this.weatherService.createResponseWeatherByCity(params["city"]).then(
    //       value => {
    //         console.log("weather all: ", value)
    //         this.weather = this.weatherService.handleResponseWeatherData(value);
    //       }
    //     )
    //   }
    //
    // });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {


  }

  public ngOnDestroy(): void {
    // @ts-ignore
    this.destroy$.next();
    this.destroy$.complete();
  }


}
