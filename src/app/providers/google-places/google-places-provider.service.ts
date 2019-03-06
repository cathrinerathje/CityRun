import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


class Sight{
  name: string;
  checked: boolean; 
  lat: number;
  lng: number;
  rating: number;

  constructor(name: string, lat: number, lng: number, rating: number){
    this.checked = false;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.rating = rating;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesProviderService {

  constructor(private http: HttpClient) { }

  getPlaces(): Observable<Sight[]> {
    let proxyurl = 'https://cors-anywhere.herokuapp.com/';
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&fbclid=IwAR3xTppa3ZySlFo4bKRvwOs-7BgGCVpBf2KOe0WVauiZO-oWb6J4NlTCJbY';
    return this.http.get(proxyurl + url)
      .pipe(map(res => {
        return res.results.map(item => {
          return new Sight(
            item.name,
            item.geometry.location.lat,
            item.geometry.location.lng,
            item.rating
          );
        });
    }));
  }
}
