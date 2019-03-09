import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

/**
 * First page of the app the user can interact with
 */
export class HomePage {
  
  /**
   * @constructor
   * Uses a router to nagivate to other pages.. 
   * @param {Router} router 
   */
  constructor(private router: Router) {}
  
  /**
   * @function navigateToSightsPage
   * Navigates to sights page when ion-card is clicked
   */
  navigateToSightsPage() {
    this.router.navigateByUrl('/sights');
  }

}
