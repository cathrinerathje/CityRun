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

//https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&r&hasNextPage=true4&nextPage()=true&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&pagetoken=CsQEMwIAAAzw65jb0-BT0anHr8resqzujj9YJgg4QoOmFTH3Ex1CDP_zPz4DIgkDtAYr38qQEVu-RxuauZVM_SB9SX1wtay-ispTwp9IELvv88xSfnebbfBcTBDYGHVnyoANZOrrV0jcYqFrxfTBYce2-HkjlYCb5VYVfSKAJ3nRo-ciCqY97b3pxU3qScQBW6w1KJ2aM69Awah-X7XGowyZRz-9nk8nHfZBoUppugLTKWdld3gK2XUFuHHd3o9yOnB_OvP_jucROtaxML3JnuLYq-VfXQhb4wf3oUQLbiTIuSUeXsmUNBV3RjS5mV0yLck7YypswHSaoLPMB99UIFgjW07ExCJ9wXhtJcScBaLB13dC1URsrM8sGGvVhH-1Lgst7eLkfacCdiSAJcU-cVXorA-4oYsj7PUHSEn6N8UlUWNX6GZK1fzeio94CN2Kdo5puvAkkc14aRGzKMZomwuKqkLZmEEzT-0eSJWvZraCW8pHMn_D1qKj51jXiHToKQsH6sZ5y9mKgzr_oIApE7vzxyllmw-QlZPG8KuwDFQ2QRza-gf9Ub-7F3ZyHJ9niX57Kf3-LpObNdqVn-kHZeEkRuiZw-Ah8LysZeAXKMjbjP94KCIC8UZ5dCSsDDzarxzD-6qiYuSjGtPWn0lLR75wmICzTJKMWQDRo8voTv_AOmsWHcovn7jmk_-Y1CxJL7lPMVrLm6jtA7mRoKzGnQCJB1Jg9c3DAGn3xPyqgYya7-IItOMiL4I-q0YnJdvxtnnQUhgWiBIQ18Vw6h6DY17fQaWc6Nrt-RoU3MvKyzatN8EDkYzp5s_9fgxEIBw
