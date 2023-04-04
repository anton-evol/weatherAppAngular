import { Component, Input } from '@angular/core';
import { GetWeatherService } from './get-weather.service';
import { LocalStorageService } from './local-storage.service';

export interface StoredCities {
  [name: string]: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  refreshPeriod: number | undefined = undefined;
  interval: any;
  storedCities: StoredCities | undefined = undefined;
  errorNoCity: string = '';
  minMax: {
    [Температура: string]: Array<[number, string]>;
    'Влажность %': Array<[number, string]>;
    'Ветер м/с': Array<[number, string]>;
  } = { Температура: [], 'Влажность %': [], 'Ветер м/с': [] };

  constructor(
    private localStorageService: LocalStorageService,
    private getWeatherService: GetWeatherService
  ) {}

  ngOnInit() {
    this.getSetRefreshPeriod();
    this.getSetStoredCities();
    this.setUpdateInterval();

    if (this.storedCities !== undefined) {
      let updTimes: number[] = [];
      Object.values(this.storedCities).filter((storedData) => {
        updTimes.push(storedData['lastUpd']);
      });
      updTimes.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      if (
        new Date(updTimes[0]).getTime() + this.refreshPeriod! * 1000 <
        new Date().getTime()
      ) {
        this.periodicalUpdate();
      }
    }
    this.getMinMax();
  }

  getMinMax() {
    for (const param in this.minMax) {
      if (Object.prototype.hasOwnProperty.call(this.minMax, param)) {
        this.minMax[param] = [];
      }
    }
    for (const city in this.storedCities) {
      if (Object.prototype.hasOwnProperty.call(this.storedCities, city)) {
        const cityWeather = this.storedCities[city];
        this.minMax['Температура'].push([
          cityWeather['list'][0].main.temp,
          city,
        ]);
        this.minMax['Влажность %'].push([
          cityWeather['list'][0].main.humidity,
          city,
        ]);
        this.minMax['Ветер м/с'].push([
          cityWeather['list'][0].wind.speed,
          city,
        ]);
      }
    }
    for (const param in this.minMax) {
      if (Object.prototype.hasOwnProperty.call(this.minMax, param)) {
        const parameter = this.minMax[param];
        parameter.sort((a, b) => a[0] - b[0]);
      }
    }
  }

  periodicalUpdate() {
    if (this.storedCities !== undefined) {
      Object.keys(this.storedCities).forEach((city) => {
        this.updWeather(city);
      });
    }
  }

  getSetRefreshPeriod() {
    if (this.refreshPeriod !== undefined) {
      this.localStorageService.setData(
        'refreshPeriod',
        JSON.stringify(this.refreshPeriod)
      );
    } else {
      const localRefreshPeriod =
        this.localStorageService.getData('refreshPeriod');
      this.refreshPeriod = JSON.parse(
        localRefreshPeriod ? localRefreshPeriod : '600'
      );
      this.localStorageService.setData(
        'refreshPeriod',
        JSON.stringify(this.refreshPeriod)
      );
    }
    this.setUpdateInterval();
  }

  setUpdateInterval() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.periodicalUpdate();
    }, this.refreshPeriod! * 1000);
  }

  getSetStoredCities() {
    if (this.storedCities !== undefined) {
      this.localStorageService.setData(
        'storedCities',
        JSON.stringify(this.storedCities)
      );
    } else {
      const localData = this.localStorageService.getData('storedCities');
      this.storedCities = JSON.parse(localData ? localData : '{}');
    }
  }

  updWeather(cityName: string) {
    this.getWeatherService.getWeather(cityName).subscribe(
      (response) => {
        response['lastUpd'] = new Date();
        delete this.storedCities![cityName];
        this.storedCities![
          `${response['city']['name']}, ${response['city']['country']}`
        ] = response;
        this.localStorageService.setData(
          'storedCities',
          JSON.stringify(this.storedCities)
        );
        this.getMinMax();
        this.getSetStoredCities();
      },
      (error) => {
        this.errorNoCity = cityName;
        setTimeout(() => {
          this.errorNoCity = '';
        }, 4000);
      }
    );
  }

  addCity(city: string) {
    this.updWeather(city);
  }

  deleteCity(city: string) {
    delete this.storedCities![city];
    this.getSetStoredCities();
    this.getMinMax();
  }
}
