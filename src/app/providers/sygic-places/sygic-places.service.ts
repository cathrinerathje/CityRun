import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/map';

/** Defines a sight */
export class Sight{
  name: string;
  originalName: string;
  checked: boolean;
  lat: number;
  lng: number;
  description: string;
  thumbnail: string;
  rating: number;
  tags: Array<string>;

  /**
   * A sight consist of the following params: 
   * @param {string} name 
   * @param {string} originalName
   * @param {number} lat 
   * @param {number} lng 
   * @param {string} description
   * @param {string} thumbnail
   * @param {number} rating 
   * @param {Array<string>} tags - List of tags describing the sight 
   */
  constructor(name: string, originalName: string, lat: number, lng: number, description: string, thumbnail: string, rating: number, tags: Array<string>){
    this.checked = false;
    this.name = name;
    this.originalName = originalName;
    this.lat = lat;
    this.lng = lng;
    this.description = description;
    this.thumbnail = thumbnail;
    this.rating = rating;
    this.tags = tags;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SygicPlacesService {

  constructor(private http: Http) { }

  getPlaces(): Observable<Response> {
    let url = 'https://api.sygictravelapi.com/1.1/en/places/list?parents=city:8&categories=sightseeing&limit=23';
    let header = new Headers();
    header.append('x-api-key', 'HQyCeEZ4EO7nxSQkPUzmx1D5qTiQEdWF1aSpy6iZ');

    return this.http.get(url, {headers: header});
      //.pipe(map(res => res.json()));
      /* .pipe(map(res => {
        console.log(res);
        return res.map(item => {
          return new Sight(
            item.name,
            item.original_name,
            item.location.lat,
            item.location.lng,
            item.perex,
            item.thumbnail_url,
            item.rating,
            item.categories
          )
        })
      })); */

      //return this.http.get(url, {headers: header});
  }
    /* getPlaces(url: string): Observable<Sight[]> {
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
    } */
}
