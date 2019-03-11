import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

/**
 * Provides the ability to navigate a page forward, pass data to a page and retrieve the data from 
 * the page that was navigated to.
 */
export class NavProviderService {
  data: any;

  constructor(public navCtrl: NavController) { }

  /**
   * Saves the passed data for later retrieval and navigates to a specified url.
   * @param {string} url - The url of the page being navigated to.
   * @param {any} data - The data to be saved and retrived later.
   */
  push(url: string, data: any){
    this.data = data;
    this.navCtrl.navigateForward('/'+ url);
  }

  /**
   * Returns the stored data.
   * @return {any} - The stored data.
   */
  get(){
    return this.data;
  }
}

