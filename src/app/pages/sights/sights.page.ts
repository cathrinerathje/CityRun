import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})
export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;

  constructor() { 
    this.sightChecked = false;
    this.numberOfSightsChecked = 0;
  }

  ngOnInit() {
  }

  checkSight(event) {
    if (event.target.checked) {
      this.numberOfSightsChecked--;
    } else {
      this.numberOfSightsChecked++;
    }
    if (this.numberOfSightsChecked === 0) {
      this.sightChecked = false;
    } else {
      this.sightChecked = true;
    }
  }

}
