export class Weather {
  constructor(
    public updateAt: number,
    public name: string | undefined,
    public country: string,
    public iconClassname: string,
    public temp: number,
    public humidity: number,
    public pressure: number,
    public description: string,
    public sunrise: string,
    public sunset: string,
    public windDirection: string,
    public windSpeed: number,
    public windBeaufortScale: string,
    public max_temp: number,
    public min_temp: number
  ) {}
}

// export class ForecastItem {
//   constructor(
//     //  public updateAt: number,
//     //public name: string,
//     // public country: string,
//     public iconClassname: string,
//     public temp_day: number,
//     public temp_eve: number,
//     // public humidity: number,
//     //   public pressure: number,
//     //   public description: string,
//     //   public sunrise: number,
//     //   public sunset: number,
//     //   public windDirection: string,
//     //   public windSpeed: number,
//     //   public windBeaufortScale: string
//   ) {
//   }
// }


// export const defaultForecastItem: ForecastItem = {
//   iconClassname: "",
//   temp_eve: 0,
//   temp_day: 0
//
// }

export const defaultWeather: Weather = {
  updateAt: 0,
  name: '',
  country: "--",
  iconClassname: "",
  temp: 0,
  humidity: 0,
  pressure: 0,
  description: "",
  sunrise: "",
  sunset: "",
  windDirection: "",
  windSpeed: 0,
  windBeaufortScale: "",
  max_temp: 0,
  min_temp: 0
}

export class CurrentWeather {
  constructor(
    public updateAt: number,
    public city: string,
  ) {}

}

export class Forecast {
  constructor(
    public currentDay: boolean,
    public date: number,
    public iconClassname: string,
    public temperatureDay: number,
    public temperatureNight: number,
    public description: string,
  ) { }
}
