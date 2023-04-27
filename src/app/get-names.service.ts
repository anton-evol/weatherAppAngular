import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetNamesService {
  constructor(private http: HttpClient) {}

  getNames(query: string): Observable<any> {
    // const API_USERNAME = 'Anton_evol';
    // const API_URL = `https://secure.geonames.org/searchJSON?username=${API_USERNAME}&lang=ru&maxRows=10&orderby=relevance&searchlang=ru&name=${query}&adminCode=1&name_startsWith=${query}&fuzzy=0.4`;
    // return this.http.get(API_URL);
    const API_KEY = 'afd7b214d53206d052ca1c1826164dc8';
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`;
    return this.http.get(API_URL);
  }
}
