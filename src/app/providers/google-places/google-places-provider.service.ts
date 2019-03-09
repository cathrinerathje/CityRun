import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Defines a sight 
 */
export class Sight{
  name: string;
  checked: boolean;
  lat: number;
  lng: number;
  rating: number;
  types: Array<string>;

  /**
   * @constructor
   * A sight consist of the following params: 
   * @param name 
   * @param lat 
   * @param lng 
   * @param rating 
   * @param types 
   */
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

/**
 * Fetches data from the Google Places API
 */
export class GooglePlacesProviderService {

  /**
   * @constructor
   * Uses the http to send get request
   * @param {HttpClient} http 
   */
  constructor(private http: HttpClient) { }

  /**
   * @function getPlaces 
   * Fetches data about places of type point_of_interest and maps it into an Observable of sights  
   * @param {Sting} url the API request
   * @returns {Observable<Sights} sights from the Google Places API
   */
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