import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})
export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;
  selectedSights = [3];

  constructor(private router: Router) { 
    this.sightChecked = false;
    this.numberOfSightsChecked = 0;
  }

  ngOnInit() {
  }

  checkSight(event: any, id: number) {
    console.log('id :' + id);
    console.log('array :' + this.selectedSights.toString());
    if (event.target.checked) {
      this.numberOfSightsChecked--;
      this.selectedSights.splice(id, 1);
      console.log('array :' + this.selectedSights.toString());
    } else {
      this.numberOfSightsChecked++;
      this.selectedSights.splice(id, 1, id);
      console.log('array :' + this.selectedSights.toString());
    }
    if (this.numberOfSightsChecked === 0) {
      this.sightChecked = false;
    } else {
      this.sightChecked = true;
    }
  }

  navigateToOverviewPage() {
    this.router.navigateByUrl('/overview');
  }

}
