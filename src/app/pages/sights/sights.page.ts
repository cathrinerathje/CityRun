import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { GooglePlacesProviderService } from '../../providers/google-places/google-places-provider.service';
import { HttpClient } from '@angular/common/http';
import { Sight } from '../../providers/google-places/google-places-provider.service';

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

  ngOnInit() {
    this.retrieveData().then(() => {
      this.formatSights().then(() => {
        console.log(this.sights);
      });
    });
  }

  retrieveData() {
    return new Promise((resolve, reject) => {
      this.data = this.googlePlaces.getPlaces();
      console.log('retrived data: ' + this.data);
      resolve();
    }).catch((error) => {
      console.log(error);
    });
  }

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
    selectedSights = this.sights.filter(sight => sight.checked == true);
    this.navCtrl.push('overview', selectedSights);   
  }
}
