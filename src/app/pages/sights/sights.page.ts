import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavProviderService } from '../../providers/nav/nav-provider.service';

class Sight{
  name: string;
  checked: boolean; 
  lat: number;
  lng: number;

  constructor(name: string, lat: number, lng: number){
    this.checked = false;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
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
  sights: Array<Sight>;

  data: any;

  constructor(private router: Router, public navCtrl: NavProviderService) { 
    this.numberOfSightsChecked = 0;
    this.sights = [];
    this.sights.push(new Sight('Kastellet', 55.690460, 12.595370));
    this.sights.push(new Sight('Amalienborg', 55.684440, 12.592430));
    this.sights.push(new Sight('Vor Frelser Kirke', 55.672790, 12.594050));
    this.sights.push(new Sight('Storkespringvandet', 55.678950, 12.579040));
    this.sights.push(new Sight('Marmor Kirken', 55.685060, 12.589260));
  }

  ngOnInit() {
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
