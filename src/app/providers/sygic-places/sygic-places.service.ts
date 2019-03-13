import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SygicPlacesService {

  constructor(private http: Http) { }

  getPlaces(): any {
    let url = 'https://api.sygictravelapi.com/1.1/en/places/list?parents=city:8&categories=sightseeing&limit=23';
    let header = new Headers();
    header.append('x-api-key', 'HQyCeEZ4EO7nxSQkPUzmx1D5qTiQEdWF1aSpy6iZ');

    return this.http.get(url, {headers: header}).pipe(map(res => res.json()));
  }
}
