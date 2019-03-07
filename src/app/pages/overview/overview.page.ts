import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { Sight } from 'src/app/providers/google-places/google-places-provider.service';
import { ViewInfoComponent } from 'src/app/components/view-info/view-info.component';
import { PopoverController } from '@ionic/angular';

declare var google: any;

/** Defines a Waypoint as a point along a route */
class Waypoint {
  location: string;
  stopover: boolean;

  /**
   * Creates a Waypoint.
   * @param {string} location - The location.
   */
  constructor(location: string){
    this.location = location;
    this.stopover = true;
  }
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})

/** Defines the overview page of a generated route */
export class OverviewPage implements OnInit {
  waypoints: Array<Waypoint>;
  sights: any; 
  origin: any;
  destination: any;
  distance: string;
  map: any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  constructor(public navCtrl: NavProviderService, private popoverController: PopoverController) { 
    this.waypoints= [];
    this.sights = this.navCtrl.get();
  }
  
  /**
   * Executes functions synchronously using Promises.
   * When constructWaypoints() resolves, loadMap() and startNavigation() executes asynchronously. 
   */
  ngOnInit() {
    this.constructWaypoints().then(() =>{      
      this.loadMap();
      this.startNavigation();
    });
  }

  /**
   * Constructs an array of Waypoints by mapping over each selected sight and extracting its location.
   * Sets origin and destination to the first sight selected.
   * @return {Promise} - A Promise either resolved or rejected.
   */
  constructWaypoints(){
    return new Promise((resolve, reject) => {
      if (this.sights) {
        this.sights.map((sight) => {
          let waypoint = new Waypoint(new google.maps.LatLng(sight.lat, sight.lng));
          this.waypoints.push(waypoint);
        });
        let originAndDestination = new google.maps.LatLng(this.sights[0].lat, this.sights[0].lng);
        this.origin = originAndDestination;
        this.destination = originAndDestination;
        resolve();
      } else {
        reject();
      }
      
    }).catch((error) => {
      console.log("error");
    });
  }

  /**
   * Sets map options and initializes a new map.
   */
  loadMap(){    
    let latLng = this.origin;

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  /**
   * Initializes route navigation with Google's DirectionsService and DirectionsRenderer.
   * The DirectionsService generates the route, passing origin, destination, waypoints 
   * and travel mode to it's route() method.
   * If the DirectionsStatus of the response is OK, the DirectionsRenderer sets and displays
   * the navigation directions.
   */
  startNavigation() {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    directionsDisplay.setPanel(this.directionsPanel.nativeElement);
    directionsService.route({

      origin: this.origin,
      destination: this.destination,
      waypoints: this.waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode['WALKING']
    }, (res, status) => {

      if(status == google.maps.DirectionsStatus.OK){
          directionsDisplay.setDirections(res);
          console.log(res);
          
          //Calculate route distance
          let legs = res.routes[0].legs;
          console.log(legs);
          this.distance = this.calculateDistance(legs);

      } else {
          console.warn(status);
      }
    });
  }

  /**
   * Calculates the distance of a route.
   * @param {Array<any>} legs - The individual routes between each waypoint.
   * @return {string} - The total distance of the route in meters.
   */
  calculateDistance(legs: Array<any>): string {
    let distanceInMeters = 0;
    legs.map((leg) => {
      distanceInMeters += leg.distance.value;
    });
    return (distanceInMeters/1000).toFixed(1);
  }

  /**
   * Activates a popover of extra information about a sight.
   * @param {Sight} sight - The Sight object for which the view button was pressed.
   * @return {} - The total distance of the route in meters.
   */
  async viewInfo(sight: Sight){
    const popover = await this.popoverController.create({
      component: ViewInfoComponent,
      componentProps: sight,
      translucent: false
    });
    return await popover.present();
  }
}
