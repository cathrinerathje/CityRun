import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { GooglePlacesProviderService } from '../../providers/google-places/google-places-provider.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})

export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;

  //Array of sights
  sights: Observable<Sight[]>;
  data: Observable<any>;
  //sights: any;
  //data: any;

  constructor(private router: Router, public navCtrl: NavProviderService, public googlePlaces: GooglePlacesProviderService, private http: HttpClient) { 
    this.numberOfSightsChecked = 0;
    /* this.sights = [];
    this.sights.push(new Sight('Kastellet', 55.690460, 12.595370));
    this.sights.push(new Sight('Amalienborg', 55.684440, 12.592430));
    this.sights.push(new Sight('Vor Frelser Kirke', 55.672790, 12.594050));
    this.sights.push(new Sight('Storkespringvandet', 55.678950, 12.579040));
    this.sights.push(new Sight('Marmor Kirken', 55.685060, 12.589260)); */
  }

  /* ngOnInit() {
    this.sights = this.http.get('https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&fbclid=IwAR3xTppa3ZySlFo4bKRvwOs-7BgGCVpBf2KOe0WVauiZO-oWb6J4NlTCJbY');
    this.sights.subscribe(data => {
      console.log('my data: ', data);
    });
  } */

  ngOnInit() {
    this.retrieveData().then(() => {
      //console.log('efter retrieve: ' +this.data.results);
      this.formatSights();
    });
    //console.log(this.data);
    
  }

  retrieveData() {
    return new Promise((resolve, reject) => {
      console.log('called');
      this.sights = this.googlePlaces.getPlaces();
      /* this.googlePlaces.getPlaces().subscribe(data => {
        this.sights = data;
      }); */
      console.log('hentet');
      console.log(this.sights);
      console.log('retrived data: ' + this.sights);
      resolve();
    }).catch((error) => {
      console.log(error);
    });
  }

  formatSights() {
    console.log('inden i format');
    /* this.sights.pipe(map((item) => {
      console.log('inden i map' + item);
      let sight = new Sight(item.name, item.geometry.location.lat, item.geometry.location.lng, item.rating);
      this.sights.push(sight);
    })); */
    console.log('formatted: ' + this.sights);
  }

  checkSight(event: any, sight: Sight) {
    
    if (event.target.checked) {
      this.numberOfSightsChecked--;
      sight.checked = false;    
    } else {
      this.numberOfSightsChecked++;
      sight.checked = true;      
    }

    if (this.numberOfSightsChecked === 0) {
      this.sightChecked = false;
    } else {
      this.sightChecked = true;
    }
  }

  navigateToOverviewPage() {
    let selectedSights = [];
    //selectedSights = this.sights.filter(sight => sight.checked == true);

    this.navCtrl.push('overview', selectedSights);   
  }
}
