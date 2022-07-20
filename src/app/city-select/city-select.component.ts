import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {WeatherService} from "../services/weather.service";
import {MatFormField} from "@angular/material/form-field";
import {debounce, debounceTime, Observable, startWith} from "rxjs";
import {apiConfig, appConfig} from "../config";
import {HttpClient} from "@angular/common/http";
import {Forecast} from "../classes/weather";
import {map} from "rxjs/operators";
import {FormControl} from "@angular/forms";

class CityItem {
  constructor(
    public cityName: string,
    public country: string
  ) {
  }

}

export interface User {
  name: string;
}


@Component({
  selector: 'app-city-select',
  templateUrl: './city-select.component.html',
  styleUrls: ['./city-select.component.scss']
})
export class CitySelectComponent implements OnInit {

  //@Output() buttonClick: string = "";
  public city: string = "";
  private subscribers: any = {};

  public citiesList: Array<CityItem> = [];
  public cities: any;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<CityItem[]>;
  constructor(
    private router: Router,
    private weatherService: WeatherService,
    private http: HttpClient,

  ) {

    this.getAllCitiesList().then(value =>
    {
      value.subscribe((val: any) => {
            val.data.forEach((country: any)=>{
             // console.log("el: ", el)
              country.cities.forEach((city: any) => {
                //  console.log("city el: ", city)
                  this.citiesList.push({cityName: city, country: country})
              })
            })
            console.log("cities list: ", this.citiesList)

      })
    })
   //   this.getAllCitiesList().then(value => {
   //    console.log("cities val: ", value.data);
   //    this.cities=value.data;
   //
   //  });
    //console.log("cities: ", this.cities)
   //  this.cities.subscribe(
   //    (val: any) => {
   //      console.log("cities: ", val)
   //    }
   //  )
  }

  ngOnInit(): void {
    // const returnedFunction = debounce(function() {
    //   // Что то делаем
    //   console.log('debounce');
    // }, 250);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }


  private _filter(value: string): CityItem[] {
    console.log("value filter: ", value)

    const filterValue = value.toLowerCase();
    let citiesList: any;

    if (filterValue.length > 2) {
      citiesList = this.citiesList.filter(option => option.cityName.toLowerCase().includes(filterValue));
      console.log("filtered cities list: ",citiesList)
    }
    return citiesList
  }
  ngAfterViewInit(): void {
    //console.log("cities: ", this.cities.data)

  }

  selectCity(cityName: string) {
    console.log("cities list: ", this.citiesList)

    this.router.navigate([`/${cityName}`]);

  }

  // getWeatherByСurrentLocation(): Promise<any> {
  //   // this.showLoader();
  //   if (this.subscribers.city) {
  //     this.subscribers.city.unsubscribe();
  //   }
  //
  //   return new Promise((resolve, reject) => {
  //     window.navigator.geolocation.getCurrentPosition((position) => {
  //       const { latitude, longitude } = position.coords;
  //
  //       this.subscribers.city = this.getWeatherByLocation(latitude, longitude).subscribe((weather) => {
  //         console.log("curr weather: ", weather)
  //         resolve(weather);
  //
  //         // this.hideLoader();
  //       });
  //     }, (error) => {
  //       if (error.code === 1) { // if user didn't approve geolocation
  //         this.subscribers.city = this.getWeatherByLocation(
  //           appConfig.defaultCity.coord.latitude,
  //           appConfig.defaultCity.coord.longitude
  //         ).subscribe((weather) => {
  //           resolve(weather);
  //
  //           // this.hideLoader();
  //         });
  //       } else {
  //         console.error(error);
  //         // this.hideLoader();
  //       }
  //     });
  //   });
  // }

  // public async getAllCitiesList(): Promise<any> {
  //   // this.showLoader();
  //   // if (this.subscribers.city) {
  //   //   this.subscribers.city.unsubscribe();
  //   // }
  //
  //   return new Promise((resolve, reject) => {
  //
  //     this.http.get(
  //       `https://countriesnow.space/api/v0.1/countries`
  //     ).subscribe(async citiesResponse => {
  //       await resolve(citiesResponse)
  //     })
  //     // window.navigator.geolocation.getCurrentPosition((position) => {
  //     //   const { latitude, longitude } = position.coords;
  //     //
  //     //   this.subscribers.city = this.getWeatherByLocation(latitude, longitude).subscribe((weather) => {
  //     //     console.log("curr weather: ", weather)
  //     //     resolve(weather);
  //     //
  //     //    // this.hideLoader();
  //     //   });
  //     // })
  //
  //   });
  // }

  public async getAllCitiesList(): Promise<any> {
    let cities = await this.http.get(
      `https://countriesnow.space/api/v0.1/countries`
    )
    return cities
  }
}
