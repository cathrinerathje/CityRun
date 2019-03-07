import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Observable } from 'rxjs';
import { GooglePlacesProviderService } from '../../providers/google-places/google-places-provider.service';
import { HttpClient } from '@angular/common/http';
import { Sight } from '../../providers/google-places/google-places-provider.service';
import { LoadingController, PopoverController } from '@ionic/angular';
import { ViewInfoComponent } from '../../components/view-info/view-info.component';


@Component({
  selector: 'app-sights',
  templateUrl: './sights.page.html',
  styleUrls: ['./sights.page.scss'],
})

export class SightsPage implements OnInit {
  sightChecked: boolean;
  numberOfSightsChecked: number;

  data1: Observable<Sight[]>;
  data2: Observable<Sight[]>;
  sights: Array<Sight>;

  //public loadingController: LoadingController;

  constructor(private router: Router, public navCtrl: NavProviderService, public googlePlaces: GooglePlacesProviderService, private http: HttpClient, public loadingController: LoadingController, private popoverController: PopoverController) {

    this.numberOfSightsChecked = 0;
    this.data1 = new Observable<Sight[]>();
    this.data2 = new Observable<Sight[]>();
    this.sights = [];
  }

  //First we call the retrieve data, when the data is "fetched", the data is formatted
  async ngOnInit() {
    const loading = await this.loadingController.create({});

    loading.present().then(()=>{
      this.retrieveData().then(() => {
        this.formatSights().then(() => {
          console.log(this.sights);
          loading.dismiss();
        });
      });
    })
  }

  /* filterSights() {
    console.log('called');
    return new Promise((resolve, reject) => {
      console.log('inside promise');
      this.filteredSights = [];
      this.filteredSights = this.sights.filter((sight: Sight) => sight.name === "Kastellet");
      console.log('filtered: ' + this.filteredSights.length);
      resolve();
    });
  } */

  // Using the service and call the method getPlaces, data is know observables<Sight[]>
  retrieveData() {
    let url1 = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=copenhagen+point+of+interest&language=en&key=AIzaSyB-BMH5xlaB1EqizZDiCjwl_-kWqjxmQWo&fbclid=IwAR3xTppa3ZySlFo4bKRvwOs-7BgGCVpBf2KOe0WVauiZO-oWb6J4NlTCJbY';
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
    });
  }

  //data is know "transformed" from observables<Sight[]> to an array of sights
  formatSights() {
    return new Promise((resolve, reject) => {
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
  //an array of only the sights that was selected(sight.checked=true) will be passed on
  navigateToOverviewPage() {
    let selectedSights = [];
    selectedSights = this.sights.filter(sight => sight.checked == true);
    this.navCtrl.push('overview', selectedSights);
  }

  async viewInfo(sight: Sight){
    console.log('viewInfo was called')
    const popover = await this.popoverController.create({
      component: ViewInfoComponent,
      componentProps: sight,
      //event: ev,
      translucent: false
    });
    return await popover.present();
  }
}
