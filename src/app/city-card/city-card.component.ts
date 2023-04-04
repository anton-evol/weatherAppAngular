import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StoredCities } from '../app.component';

@Component({
  selector: 'app-city-card',
  templateUrl: './city-card.component.html',
  styleUrls: ['./city-card.component.css'],
})
export class CityCardComponent {
  @Input() city: StoredCities = {};
  @Output() updWeather: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteCity: EventEmitter<string> = new EventEmitter<string>();

  timeSlot: number = 0;

  constructor() {}

  getTimeSlot(timeSlot: string) {
    this.timeSlot = +timeSlot;
  }

  updateCity(city: string, country: string) {
    this.updWeather.emit(`${city}, ${country}`);
  }

  removeCity(city: string, country: string) {
    this.deleteCity.emit(`${city}, ${country}`);
  }
}
