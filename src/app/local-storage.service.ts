import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  storedCities: Array<{}> = [];

  constructor() {}

  getData(key: string): string | null {
    return localStorage.getItem(key);
  }

  setData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  removeData(key: string) {
    localStorage.removeItem(key);
  }

  clearData() {
    localStorage.clear();
  }
}
