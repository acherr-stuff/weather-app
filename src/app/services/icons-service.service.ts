import { Injectable } from '@angular/core';
import * as iconsDataByCode from './icons.data.json';


@Injectable({
  providedIn: 'root'
})
export class IconsServiceService {

  private iconsDataByCode: any;

  constructor() {
    this.iconsDataByCode = iconsDataByCode;
  }

  getIconClassNameByCode(code: number, sunsetTimestamp: number = 0): string {
    const classPrefix = 'wi wi-';
    let iconClassname = this.iconsDataByCode[code].icon;
    let dayPrefix = '';

    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
      const dateNowTimestamp = Math.round(Date.now() / 1000);
      dayPrefix = (sunsetTimestamp && (dateNowTimestamp > sunsetTimestamp)) ? 'night-' : 'day-';

      if (sunsetTimestamp && dateNowTimestamp > sunsetTimestamp && iconClassname === 'sunny') {
        dayPrefix = 'night-clear';
        iconClassname = '';
      }
    }

    return `${classPrefix}${dayPrefix}${iconClassname}`;
  }
}
