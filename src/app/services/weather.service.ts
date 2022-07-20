import {Injectable, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, interval, Observable, Subject} from "rxjs";
import {apiConfig, appConfig} from "../config";
import {Router} from "@angular/router";
import {Weather, defaultWeather, Forecast} from "../classes/weather"
import {IconsServiceService} from "./icons-service.service";
import {NavigationService} from "./navigation.service";
import {ForecastComponent} from "../forecast/forecast.component";
import {LoaderService} from "./loader.service";




@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private unitSystem: string = 'metric';
  // private weather: Subject<Weather> = new Subject<Weather>();
  private weatherUpdateInterval = apiConfig.updateInterval.weather;
  private weather$ = new BehaviorSubject<Weather>(defaultWeather)
  public weather: Object = {};
  private currentWeatherTimestamp: number = 0;

  public coords = {latitude: 0, longitude: 0};
  private subscribers: any = {};
  @ViewChild(ForecastComponent, {static: false})
  private forecastComponent: ForecastComponent|undefined;


  constructor(
    private http: HttpClient,
    private iconsService: IconsServiceService,
    private loaderService: LoaderService,
  private router: Router,
  ) {

  }

  getCurrentWeatherTimestamp(): number {
    return this.currentWeatherTimestamp;
  }

  getWindDirection(windDegree: number): string {
    const windDirectionIndex = Math.round((windDegree - 11.25) / 22.5);
    const windNames = [
      'North', 'North Northeast', 'Northeast', 'East Northeast', 'East',
      'East Southeast', 'Southeast', 'South Southeast', 'South', 'South Southwest',
      'Southwest', 'West Southwest', 'West', 'West Northwest', 'Northwest', 'North Northwest'
    ];

    return windNames[windDirectionIndex];
  }

  getWindBeaufortScaleByMeterInSecond(windSpeed: number): string {
    const beaufortWindScale = [
      'calm', 'light air', 'light breeze', 'gentle breeze', 'moderate breeze', 'fresh breeze',
      'strong breeze', 'high wind, near gale', 'gale', 'severe gale', 'storm', 'violent storm', 'hurricane'
    ];
    let windSpeedIndex = 0;
    const windSpeedScale = [
      [0, 0.3],
      [0.4, 1.6],
      [1.7, 3.5],
      [3.6, 5.5],
      [5.6, 8],
      [8.1, 10.8],
      [10.9, 13.9],
      [14, 17.2],
      [17.3, 20.8],
      [20.9, 24.5],
      [24.6, 28.5],
      [28.6, 32.7],
      [32.8, 1000]
    ];

    windSpeedScale.forEach((speedInterval, index) => {
      if (windSpeedScale[index][0] <= windSpeed && windSpeed <= windSpeedScale[index][1]) {
        windSpeedIndex = index;
      }
    });


    return beaufortWindScale[windSpeedIndex];
  }

  getPressureInMmHg(pressureInHpa: number): number {
    return Math.round(pressureInHpa * 0.75006375541921);
  }


  public getWeatherByCity(cityName: string): Observable<Object> {
    return this.http.get(
      `${apiConfig.host}/weather?appid=${apiConfig.appId}&q=${cityName}&units=${this.unitSystem}`
    );
  }

  public getWeeklyForeastByCity(cityName: string): Observable<Object> {
    return this.http.get(
      `${apiConfig.host}/forecast/daily?q=${cityName}&appid=${apiConfig.appId}&units=${this.unitSystem}&cnt=${apiConfig.amountForecastDays}`
    )
  }


  isItCurrentDayByTimestamps(firstTimestamp: any, secondTimestamp: any): boolean {
    const days = [firstTimestamp, secondTimestamp].map(timestamp => Math.floor(timestamp / (3600 * 24)));

    return days[0] === days[1];
  }

  handleResponseForecastData(responseData: any): Forecast {
    const { dt, temp, weather } = responseData;
    const currentWeatherTimestamp = this.getCurrentWeatherTimestamp();

    const currentDay = this.isItCurrentDayByTimestamps(dt, currentWeatherTimestamp);
    const date = dt * 1000;
    const iconClassname = this.iconsService.getIconClassNameByCode(weather[0].id);
    const temperatureDay = Math.round(temp.day);
    const temperatureNight = Math.round(temp.night);

    return new Forecast(
      currentDay,
      date,
      iconClassname,
      temperatureDay,
      temperatureNight,
      weather[0].description
    );
  }

  public handleResponseWeatherData(responseData: any): Weather {

    const { name, main, weather, wind, sys, dt, clouds } = responseData;
    this.currentWeatherTimestamp = dt;
    console.log("clouds: ", clouds);
    const updateAt = new Date().getTime();
    const country = sys.country;
    const iconClassname = this.iconsService.getIconClassNameByCode(weather[0].id, sys.sunset);
    const temperature = Math.round(main.temp);
    const pressureInHpa = Math.round(main.pressure);
    const pressure = (this.unitSystem === appConfig.defaultUnit) ?
    this.getPressureInMmHg(pressureInHpa) : pressureInHpa;
    const windDegrees = Math.round(wind.deg);
    const windDirection = this.getWindDirection(windDegrees);
    const windBeaufortScale = this.getWindBeaufortScaleByMeterInSecond(wind.speed);
    const max_temp = main.temp_max;
    const min_temp = main.temp_min;
    const sunriseTime = new Date(sys.sunrise * 1000).getHours() + ":" + new Date(sys.sunrise * 1000).getMinutes();
    const sunsetTime = new Date(sys.sunset * 1000).getHours() + ":" + new Date(sys.sunset * 1000).getMinutes();

    console.log(updateAt, temperature,pressureInHpa, pressure, windDegrees, windDirection, windBeaufortScale, sunriseTime, sunsetTime)
    return new Weather(
      updateAt,
      name,
      country,
      iconClassname,
      temperature,
      main.humidity,
      pressure,
      weather[0].description,
      sunriseTime,
      sunsetTime,
      windDirection,
      wind.speed,
      windBeaufortScale,
      max_temp,
      min_temp
    );
  }

  getWeatherByLocation(latitude: number, longitude: number): Observable<any> {
    return this.http.get(
      `${apiConfig.host}/weather?appid=${apiConfig.appId}&lat=${latitude}&lon=${longitude}&units=${this.unitSystem}`
    )
  }

  createResponseWeatherByCity(city: string): Promise<any> {
    this.showLoader();
    if (this.subscribers.city) {
      this.subscribers.city.unsubscribe();
    }

    return new Promise((resolve, reject) => {
      this.subscribers.city = this.getWeatherByCity(city).subscribe((weather) => {
        resolve(weather);

        this.hideLoader();
      }, (error) => {
        reject(error);
        this.hideLoader();
      });
    });
  }

  // createResponseForecastByCity(city: string): Promise<any> {
  //   this.showLoader();
  //   if (this.subscribers.forecast) {
  //     this.subscribers.forecast.unsubscribe();
  //   }
  //
  //   return new Promise((resolve, reject) => {
  //     this.subscribers.forecast = this.getWeeklyForeastByCity(city).subscribe((forecast) => {
  //       resolve(forecast);
  //
  //       this.hideLoader();
  //     },
  //     (error) => {
  //       reject(error);
  //       this.hideLoader();
  //     });
  //   });
  // }

  createResponseForecastByCity(city: string): Observable<any> {
    this.showLoader();
    if (this.subscribers.forecast) {
      this.subscribers.forecast.unsubscribe();
    }

    return Observable.create(obs => {
      try {
        this.subscribers.forecast = this.getWeeklyForeastByCity(city).subscribe((forecast) => {
        obs.next(forecast);

        this.hideLoader();})
      }
      catch(err) {
        obs.error(err);
        this.hideLoader();
        }
    });
  }


  getWeatherByСurrentLocation(): Promise<any> {

    this.showLoader();
    if (this.subscribers.city) {
      this.subscribers.city.unsubscribe();
    }

    return new Promise((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        this.subscribers.city = this.getWeatherByLocation(latitude, longitude).subscribe((weather) => {
          console.log("curr weather: ", weather)
          resolve(weather);

         this.hideLoader();
        });
      }, (error) => {
        if (error.code === 1) { // if user didn't approve geolocation
          this.subscribers.city = this.getWeatherByLocation(
            appConfig.defaultCity.coord.latitude,
            appConfig.defaultCity.coord.longitude
          ).subscribe((weather) => {
            resolve(weather);

           this.hideLoader();
          });
        } else {
          console.error(error);
          this.hideLoader();
        }
      });
    });
  }

  getForecastByLocation(latitude: number, longitude: number): Observable<any> {
    return this.http.get(`${apiConfig.host}/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=${16}&appid=${apiConfig.appId}
`)
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }


}
