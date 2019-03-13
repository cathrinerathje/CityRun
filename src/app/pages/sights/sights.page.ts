import { Component, OnInit } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { GooglePlacesProviderService } from '../../providers/google-places/google-places-provider.service';
import { SygicPlacesService } from '../../providers/sygic-places/sygic-places.service';
import { HttpClient } from '@angular/common/http';
//import { Sight } from '../../providers/google-places/google-places-provider.service';
import { Sight } from '../../providers/sygic-places/sygic-places.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ViewInfoComponent } from '../../components/view-info/view-info.component';


@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})

/** Controls the list of sights page */
export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;

  data1: Observable<Response>;
  data2: Observable<Sight[]>;
  sights: Array<Sight>;
  
  sygicSights: any;
  ss: Observable<Sight[]>;

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
    //this.data1 = new Observable<Sight[]>();
    this.data2 = new Observable<Sight[]>();
    this.sights = [];

    this.ss = new Observable<Sight[]>();
    this.sygicSights = [];

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
    /* let url1 = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&fbclid=IwAR3xTppa3ZySlFo4bKRvwOs-7BgGCVpBf2KOe0WVauiZO-oWb6J4NlTCJbY';
    let url2 = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&r&hasNextPage=true4&nextPage()=true&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&pagetoken=CsQEMwIAAAzw65jb0-BT0anHr8resqzujj9YJgg4QoOmFTH3Ex1CDP_zPz4DIgkDtAYr38qQEVu-RxuauZVM_SB9SX1wtay-ispTwp9IELvv88xSfnebbfBcTBDYGHVnyoANZOrrV0jcYqFrxfTBYce2-HkjlYCb5VYVfSKAJ3nRo-ciCqY97b3pxU3qScQBW6w1KJ2aM69Awah-X7XGowyZRz-9nk8nHfZBoUppugLTKWdld3gK2XUFuHHd3o9yOnB_OvP_jucROtaxML3JnuLYq-VfXQhb4wf3oUQLbiTIuSUeXsmUNBV3RjS5mV0yLck7YypswHSaoLPMB99UIFgjW07ExCJ9wXhtJcScBaLB13dC1URsrM8sGGvVhH-1Lgst7eLkfacCdiSAJcU-cVXorA-4oYsj7PUHSEn6N8UlUWNX6GZK1fzeio94CN2Kdo5puvAkkc14aRGzKMZomwuKqkLZmEEzT-0eSJWvZraCW8pHMn_D1qKj51jXiHToKQsH6sZ5y9mKgzr_oIApE7vzxyllmw-QlZPG8KuwDFQ2QRza-gf9Ub-7F3ZyHJ9niX57Kf3-LpObNdqVn-kHZeEkRuiZw-Ah8LysZeAXKMjbjP94KCIC8UZ5dCSsDDzarxzD-6qiYuSjGtPWn0lLR75wmICzTJKMWQDRo8voTv_AOmsWHcovn7jmk_-Y1CxJL7lPMVrLm6jtA7mRoKzGnQCJB1Jg9c3DAGn3xPyqgYya7-IItOMiL4I-q0YnJdvxtnnQUhgWiBIQ18Vw6h6DY17fQaWc6Nrt-RoU3MvKyzatN8EDkYzp5s_9fgxEIBw';
    return new Promise((resolve, reject) => {
      this.data1 = this.googlePlaces.getPlaces(url1);
      this.data2 = this.googlePlaces.getPlaces(url2);
      console.log('retrived data first page: ' + this.data1);
      console.log('retrived data second page: ' + this.data2)
      Promise.all([this.data1, this.data2]).then((values) =>{
        console.log('values: '+ values);
      });
      resolve();
    }).catch((error) => {
      console.log(error);
    }); */

    return new Promise((resolve, reject) => {
      //this.data1 = this.sygicPlaces.getPlaces();
      this.ss = this.sygicPlaces.getPlaces();
      console.log('called sygic: ' + this.ss);
      
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
    /* return new Promise((resolve, reject) => {
      this.data1.subscribe(sights => {
        sights.map(sight => {
          if (!(sight.name.toUpperCase().includes('TOUR')) && !(sight.name.toUpperCase().includes('TIVOLI')) && sight.lat > 55.660000) {
            this.sights.push(sight);
          }
        });
      });
      this.data2.subscribe(sights => {
        sights.map(sight => {
          if (!(sight.name.toUpperCase().includes('TOUR')) && !(sight.name.toUpperCase().includes('TIVOLI')) && sight.lat > 55.660000) {
            this.sights.push(sight);
          }
        });
      });
      resolve();
    });*/
    return new Promise((resolve, reject) => {
    
      this.ss.subscribe(sights => {
        console.log('filtersights');
        sights.map(sight => {
          this.sights.push(sight);
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
