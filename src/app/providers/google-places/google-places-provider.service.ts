import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class Sight{
  name: string;
  checked: boolean;
  lat: number;
  lng: number;
  rating: number;
  types: Array<string>;

  constructor(name: string, lat: number, lng: number, rating: number, types: Array<string>){
    this.checked = false;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.rating = rating;
    this.types = types;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesProviderService {

  constructor(private http: HttpClient) { }

  getPlaces(url: string): Observable<Sight[]> {
    let proxyurl = 'https://cors-anywhere.herokuapp.com/';
    return this.http.get(proxyurl + url)
      .pipe(map(res => {
        return res.results.map(item => {
          return new Sight(
            item.name,
            item.geometry.location.lat,
            item.geometry.location.lng,
            item.rating,
            item.types
          );
        });
    }));
  }
}