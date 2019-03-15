import { Component, OnInit } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { SygicPlacesService } from '../../providers/sygic-places/sygic-places.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ViewInfoComponent } from '../../components/view-info/view-info.component';

/** Defines a sight */
export class Sight{
  name: string;
  originalName: string;
  checked: boolean;
  lat: number;
  lng: number;
  description: string;
  thumbnail: string;
  rating: number;
  tags: Array<string>;

  /**
   * A sight consist of the following params: 
   * @param {string} name 
   * @param {string} originalName
   * @param {number} lat 
   * @param {number} lng 
   * @param {string} description
   * @param {string} thumbnail
   * @param {number} rating 
   * @param {Array<string>} tags - List of tags describing the sight 
   */
  constructor(name: string, originalName: string, lat: number, lng: number, description: string, thumbnail: string, rating: number, tags: Array<string>){
    this.checked = false;
    this.name = name;
    this.originalName = originalName;
    this.lat = lat;
    this.lng = lng;
    this.description = description;
    this.thumbnail = thumbnail;
    this.rating = rating;
    this.tags = tags;
  }
}

@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})

/** Controls the list of sights page */
export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;

  data: any;
  sights: Array<Sight>;

  /**
   * Uses the following params: 
   * @param navCtrl - To navigate to other pages
   * @param googlePlaces - To fetch data from Google Places API
   * @param http - To perform a get request 
   * @param loadingController - To run a spinner while loading the list of sights  
   * @param popoverController - To initiate a popover
   */
  constructor(public navCtrl: NavProviderService, public sygicPlaces: SygicPlacesService, public googlePlaces: GooglePlacesProviderService, private http: HttpClient, public loadingController: LoadingController, private popoverController: PopoverController) {
    this.numberOfSightsChecked = 0;
    this.data = [];
    this.sights = [];
  }

  /**
   * Controls the loading and fetching of data with Promises to ensure the execution of a new method does not happen 
   * before the first method called is finished executing. 
   * Calls retriveData(), when the data is fetched the data is formatted by the filterSights() method. 
   */
  async ngOnInit() {
    const loading = await this.loadingController.create({});
    loading.present().then(()=>{
      this.retrieveData().then(() => {
        this.filterSights().then(() => {
          console.log(this.sights);
          loading.dismiss();
        });
      });
    })
  }

  /** Uses the googlePlaces service to fetch two pages of data. Then uses Promise.all() to wait
   * for the two data calls to finish before resolving.
   * @returns {Promise}
   */
  retrieveData() {
    return new Promise((resolve, reject) => {
      //this.data1 = this.sygicPlaces.getPlaces();
      this.data = this.sygicPlaces.getPlaces();
      resolve();
    }).catch((error) => {
      console.log(error);
    });
  }

  /**  
   * Subscribes to the Observable<Sight[]> in order to access the data inside. Then filters the
   * array of sights to not contain certain sights.
   */
  filterSights() {
    return new Promise((resolve, reject) => {
      this.data.subscribe(sights => {
        console.log(sights);
        sights.data.places.map(sight => {
          let formattedSight = new Sight(
            sight.name,
            sight.original_name,
            sight.location.lat,
            sight.location.lng,
            sight.perex,
            sight.thumbnail_url,
            sight.rating.toFixed(2),
            sight.categories
          );
          this.sights.push(formattedSight);
        });
      });
      resolve();
    });
  }

  /**
   * Controls the generate button(active or not) with a counter and sets the checked attribute to false or true.
   * @param {any} event - The performed action from the user  
   * @param {Sight} sight - The sight that is being checked  
   */
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

  /**
   * Navigates to overview page when generate button is clicked.
   * An array of only the sights that was selected (sight.checked=true) is passed on.
   */
  navigateToOverviewPage() {
    let selectedSights = [];
    selectedSights = this.sights.filter(sight => sight.checked == true);
    this.navCtrl.push('overview', selectedSights);
  }

  /**
   * Activates a popover of extra information about a sight and pass the information of the clicked. 
   * @param {Sight} sight - The Sight object for which the view button was pressed.
   * @return {Promise<void>} - Present the popover overlay after it has been created.
   */
  async viewInfo(sight: Sight){
    console.log('viewInfo was called')
    const popover = await this.popoverController.create({
      component: ViewInfoComponent,
      componentProps: sight,
      translucent: false
    });
    return await popover.present();
  }
}
