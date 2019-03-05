import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { GooglePlacesProviderService } from '../../providers/google-places/google-places-provider.service';
import { HttpClient } from '@angular/common/http';

//Do we need a sight class? 
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

  data: Observable<Sight[]>;
  sights: Array<Sight>;

  constructor(private router: Router, public navCtrl: NavProviderService, public googlePlaces: GooglePlacesProviderService, private http: HttpClient) { 
    this.numberOfSightsChecked = 0;
    this.data = new Observable<Sight[]>();
    this.sights = [];
  }

  //First we call the retrieve data, when the data is "fetched", the data is formatted  
  ngOnInit() {
    this.retrieveData().then(() => {
      this.formatSights().then(() => {
        console.log(this.sights);
      });
    });
  }

  // Using the service and call the method getPlaces, data is know observables<Sight[]>
  retrieveData() {
    return new Promise((resolve, reject) => {
      this.data = this.googlePlaces.getPlaces();
      console.log('retrived data: ' + this.data);
      resolve();
    }).catch((error) => {
      console.log(error);
    });
  }

  //data is know "transformed" from observables<Sight[]> to an array of sights 
  // I have a question here: how can we transform them to "our" sight? Is it aware of what we did in the service???  
  formatSights() {
    return new Promise((resolve, reject) => {
      this.data.subscribe(sights => {
        sights.map(sight => {
          this.sights.push(sight);
        });
      });
      resolve();
    });
  }

  // Controls the generate button(active or not) with a counter 
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

  //When generate button is clicked the app will continue to the overview page 
  //an array of only the sights that was selected(sight.checked=true) will be passed with  
  navigateToOverviewPage() {
    let selectedSights = [];
    selectedSights = this.sights.filter(sight => sight.checked == true);
    this.navCtrl.push('overview', selectedSights);   
  }
}
