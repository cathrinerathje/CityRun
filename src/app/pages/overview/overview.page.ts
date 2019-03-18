import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { ViewInfoComponent } from 'src/app/components/view-info/view-info.component';
import { PopoverController, NavController, AlertController } from '@ionic/angular';
import * as $ from 'jquery'; 
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Sight } from '../sights/sights.page';

declare var google: any;

/** Defines a Waypoint as a point along a route */
class Waypoint {
  location: string;
  stopover: boolean;

  /** Creates a new Waypoint.
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
  directionsHidden: boolean = false;
  currentLat: any;
  currentLng: any;
  marker: any;
  isTracking: boolean;

  positionSubscription: Subscription;
  trackedRoute = [];
  currentMapTrack = null;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  /** Uses NavProviderService to retrieve data from previous page and PopoverController to initiate a popover */
  constructor(public navProvider: NavProviderService, private popoverController: PopoverController, private geolocation: Geolocation, private navCtrl: NavController, public alertController: AlertController) { 
    this.waypoints = [];
    this.sights = this.navProvider.get();
  }
  
  /**
   * Executes functions synchronously using Promises.
   * When constructWaypoints() resolves, loadMap() and startNavigation() executes asynchronously. 
   */
  ngOnInit() {
    this.getCurrentPosition().then(()=>{
      this.constructWaypoints().then(() =>{      
        this.loadMap();
        this.startNavigation();
      });
    });
  }
  /**
   * @todo
   */
  getCurrentPosition(){
    return new Promise((resolve, reject)=>{
      this.geolocation.getCurrentPosition().then(position =>{
        let currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.origin = currentPosition;
        this.destination = currentPosition;
        resolve();
      }).catch((error)=>{
        console.log('Error getting location', error);
        reject();
      });
    });
  }

  /* trackMe() {
    console.log('trackMe called');
    if (navigator.geolocation) {
      this.isTracking = true;
      navigator.geolocation.watchPosition((position) => {
        this.showTrackingPosition(position);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  } */

  /**
   * @todo 
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
        resolve();
      } else {
        reject();
      }
    }).catch((error) => {
      console.log("error");
    });
  }

  /** Sets map options and initializes a new map */
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
   * the navigation directions on the page.
   */
  startNavigation() {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer({
      //Remove all default markers
      suppressMarkers: true
    });

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

          //Create start/end location marker
          /* let startMarker = new google.maps.Marker({
            position: this.origin,
            map: this.map
          });

          let label: string = 'Start/end location';
          this.addInfoWindow(startMarker, label); */

          //Create markers for all waypoints
          this.addMarkers();

      } else {
          console.warn(status);
      }
    });
  }

  /* showTrackingPosition(position) {
    console.log(`tracking postion:  ${position.coords.latitude} - ${position.coords.longitude}`);
    this.currentLat = position.coords.latitude;
    this.currentLng = position.coords.longitude;

    let location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    this.map.panTo(location);

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: location,
        map: this.map,
        title: 'Got you!'
      });
    }
    else {
      this.marker.setPosition(location);
    }
  } */

  addMarkers() {
    this.sights.map((sight) => {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(sight.lat, sight.lng),
        map: this.map
      });

      let label: string = sight.name;
      this.addInfoWindow(marker, label);
    });
  }

  addInfoWindow(marker, label){
    let infoWindow = new google.maps.InfoWindow({
      content: label
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
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
   * @return {Promise<void>} - Present the popover overlay after it has been created.
   */
  async viewInfo(sight: Sight){
    const popover = await this.popoverController.create({
      component: ViewInfoComponent,
      componentProps: sight,
      translucent: false
    });
    return await popover.present();
  }

  /**
   * @todo
   */
  run(){
    $(document).ready(()=>{
      $('#sights').hide();
      $('#directions-header').hide();
      $('ion-toggle').hide();
      $('#map').css('height', '100%');
      $('ion-card').css({'max-height': '200px', 'overflow': 'scroll', 'position': 'absolute', 'z-index': '100', 'top': '0px', 'left': '0px', 'background': 'var(--ion-color-tertiary-tint)'});
      $('.end-run-button').css('display', 'block');
      $('.fab').show();
    });
    this.startTracking();
  }

  toggleDirections() {
    if (!this.directionsHidden) {
      $(document).ready(() => {
        $('ion-card').hide();
        $('.up-icon').attr('name', 'arrow-dropdown');
        $('.fab').css('top', '0px');
        this.directionsHidden = true;
      });
    } else {
      $(document).ready(() => {
        $('ion-card').show();
        $('.up-icon').attr('name', 'arrow-dropup');
        $('.fab').css('top', '180px');
        this.directionsHidden = false;
      });
    }
  }

  /**
   * @todo
   */
  startTracking(){
    this.positionSubscription = this.geolocation.watchPosition()
    .pipe(
      filter((p)=> p.coords !== undefined)
    )
    .subscribe(data =>{
      setTimeout(()=>{
        this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
        this.redrawPath(this.trackedRoute);
      }, 0);
    });
    this.map.setCenter(this.origin);
    this.map.setZoom(20);

    //this.watchPosition();
  }

  /* watchPosition() {
    var myMarker = null;

    // get current position
    navigator.geolocation.getCurrentPosition(showPosition);

    // show current position on map
    function showPosition(position) {
      myMarker = new google.maps.Marker({
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          map: this.map
      });
    }

    // watch user's position
    navigator.geolocation.watchPosition(watchSuccess);

    // change marker location everytime position is updated
    function watchSuccess(position) {
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        // set marker position
        this.marker.setPosition(latLng);
    }
  } */

  /**
   * @todo
   * @param path 
   */
  redrawPath(path){
    if (this.currentMapTrack) {
      this.currentMapTrack.setMap(null);
    }
 
    if (path.length > 1) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 5
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  async stopTrackingAlert() {
    const alert = await this.alertController.create({
      header: 'Stop tracking?',
      message: 'Are you sure you want to stop tracking?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Yes',
          handler: () => {
            this.endRun();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * @todo
   */
  endRun(){
    this.positionSubscription.unsubscribe();
    this.currentMapTrack.setMap(null);
    console.log('tracking stopped');

    //reload overview page
    this.ngOnInit();
    $(document).ready(()=>{
      $('#sights').show();
      $('#directions-header').show();
      $('ion-toggle').show();
      $('#map').css('height', '70%');
      $('ion-card').css({'top': '', 'left': ''});
      $('.end-run-button').css('display', 'none');
      $('.fab').hide();
    });
  }
}
