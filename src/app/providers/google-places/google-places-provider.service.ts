import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GooglePlacesProviderService {

  constructor(private http: HttpClient) { }

  getPlaces() {
    let data = this.http.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&fbclid=IwAR3xTppa3ZySlFo4bKRvwOs-7BgGCVpBf2KOe0WVauiZO-oWb6J4NlTCJbY');
    console.log(data);
    return data;
  }
}
