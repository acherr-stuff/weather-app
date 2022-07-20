import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-forecast-item',
  templateUrl: './forecast-item.component.html',
  styleUrls: ['./forecast-item.component.scss']
})
export class ForecastItemComponent implements OnInit {

  @Input() currentDay: boolean = false;

  @Input() date: number = 0;
  @Input() temperatureDay: number = 0;
  @Input() temperatureNight: number= 0;
  @Input() description: string = "";
  @Input() iconClassname: string = "";
  @Input() measureOfTemp: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
