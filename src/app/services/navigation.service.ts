import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  public getLocation(): GeolocationCoordinates {
    let crd: any;

    navigator.geolocation.getCurrentPosition((pos) => {
      crd= pos.coords;
      //{latitude: pos.coords.latitude, longitude: pos.coords.longitude};
      //console.log("crd : ", this.coords)
    })
    console.log(crd)
    return crd
  }
}
