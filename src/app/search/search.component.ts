import { Component, EventEmitter, Output } from '@angular/core';
import { GetNamesService } from '../get-names.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  @Output() cityName: EventEmitter<string> = new EventEmitter<string>();

  inputName: string = '';

  predictedNames: Array<string> = [];

  constructor(private getNamesService: GetNamesService) {}

  onInput() {
    if (this.inputName.length >= 3) {
      let namesArr: Array<string> = [];
      this.getNamesService.getNames(this.inputName).subscribe(
        (response) => {
          response.geonames.forEach((geoname: any) => {
            const name: string = `${geoname.name}, ${geoname.countryCode}`;
            if (!namesArr.includes(name)) {
              namesArr.push(name);
            }
          });
        },
        null,
        () => {
          this.predictedNames = namesArr;
        }
      );
    } else {
      this.predictedNames.length = 0;
    }
  }

  onEnter() {
    this.cityName.emit(this.inputName);
    this.inputName = '';
    this.predictedNames = [];
  }

  onClick(index: number) {
    this.cityName.emit(this.predictedNames[index]);
    this.inputName = '';
    this.predictedNames = [];
  }
}
