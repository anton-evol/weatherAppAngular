import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetWeatherService {
  constructor(private http: HttpClient) {}

  getWeather(cityName: string): Observable<any> {
    const API_KEY = 'afd7b214d53206d052ca1c1826164dc8';
    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${API_KEY}&lang=ru&units=metric&q=${cityName}`;
    return this.http.get(API_URL);
  }
}
