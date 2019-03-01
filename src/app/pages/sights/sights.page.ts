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
    this.sights.push(new Sight('Amalienborg', 55.694510, 12.594650));
    this.sights.push(new Sight('Vor Frelser Kirke', 55.672791, 12.594050));

    
  }

  ngOnInit() {
  }

  checkSight(event: any, sight: Sight) {
    console.log("status: " + sight.checked);
    if (event.target.checked) {
      this.numberOfSightsChecked--;
      sight.checked = false;
      console.log("status: " + sight.checked);
    
    } else {
      this.numberOfSightsChecked++;
      sight.checked = true;
      console.log("status: " + sight.checked);
      
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
    console.log("true sights: " + selectedSights.length);

    this.navCtrl.push('overview', selectedSights); 

  
  }



}
