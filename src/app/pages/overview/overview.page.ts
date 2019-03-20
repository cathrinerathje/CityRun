import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';
import { ViewInfoComponent } from 'src/app/components/view-info/view-info.component';
import { PopoverController, NavController, AlertController } from '@ionic/angular';
import * as $ from 'jquery'; 
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Sight } from '../sights/sights.page';
import { Geofence } from '@ionic-native/geofence/ngx';

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

  positionSubscription: Subscription;
  trackedRoute = [];
  currentMapTrack = null;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  /** Uses NavProviderService to retrieve data from previous page and PopoverController to initiate a popover */
  constructor(public navProvider: NavProviderService, private popoverController: PopoverController, private geolocation: Geolocation, private navCtrl: NavController, public alertController: AlertController, private geofence: Geofence) { 
    this.waypoints = [];
    this.sights = this.navProvider.get();
    geofence.initialize().then(()=>{
      console.log('geofence plugin ready'),
      (err)=>{
        console.log(err);
      }
    });
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
          this.distance = this.calculateDistance(legs);

          //Create start/end location marker
          let startMarker = new google.maps.Marker({
            position: this.origin,
            icon: {
              url: '../../../assets/icon/position.png',
              scaledSize: new google.maps.Size(35, 35)
            },
            map: this.map
          });

          let label: string = 'Start/end location';
          this.addInfoWindow(startMarker, label);

          //Create markers for all waypoints
          this.addMarkers();
          console.log('lat '+ this.origin.lat());
          console.log('lng ' +this.origin.lng());
          //add geofencing 
          //this.testAddGeofence();
          /* 
          this.sights.map((sight, index)=>{
            this.addGeofence(sight, index)
          }) */

      } else {
          console.warn(status);
      }
    });
  }

  addMarkers() {
    this.sights.map((sight) => {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(sight.lat, sight.lng),
        icon: {
          url: '../../../assets/icon/point_of_interest.png',
          scaledSize: new google.maps.Size(45, 45)
        },
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
    let marker  = new google.maps.Marker({
      position: this.origin,
      icon: {
        url: '../../../assets/icon/current_position.png',
        scaledSize: new google.maps.Size(45, 45)
      },
      map: this.map
    });
    let label: string = 'Current position';
    this.addInfoWindow(marker, label);

    this.positionSubscription = this.geolocation.watchPosition({
      enableHighAccuracy: true
    })
    .pipe(
      filter((p)=> p.coords !== undefined)
    )
    .subscribe(data =>{
      marker.setPosition({lat: data.coords.latitude, lng: data.coords.longitude});
      this.map.setCenter({lat: data.coords.latitude, lng: data.coords.longitude});
      
      setTimeout(()=>{
        this.trackedRoute.push({lat: data.coords.latitude, lng: data.coords.longitude});
        this.redrawPath(this.trackedRoute);
      }, 0);
    });
    this.map.setCenter(this.origin);
    this.map.setZoom(20);
    
    
    this.testAddGeofence();
    /* 
    this.sights.map((sight, index)=>{
      this.addGeofence(sight, index)
    }) */

  }

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
        strokeColor: '#e0b500',
        strokeOpacity: 1.0,
        strokeWeight: 10
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

  async trackingEndedAlert() {
    const alert = await this.alertController.create({
      header: 'Run ended',
      message: 'You have completed a run!',
      buttons: ['OK']
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
      $('ion-card').show();
      $('#map').css('height', '70%');
      $('ion-card').css({'top': '', 'left': ''});
      $('.end-run-button').css('display', 'none');
      $('.fab').hide();
    });
    this.trackingEndedAlert();
  }

  /*
  private addGeofence(sight: Sight, id: number){
    let fence ={
      id: id,
      latitude: sight.lat,
      longitude: sight.lng,
      radius: 100,
      transitionType: 1,
      notification: {
        id: id,
        title: 'You crossed a sight',
        text: 'You just arrived at '+ sight.name,
        openAppOnClick: true
      }

    }
    this.geofence.addOrUpdate(fence).then(()=>{
      console.log('geofence added'),
      (err) =>{
        console.log('geofence failed to add')
      }
    });

  }
  */

  private testAddGeofence(){
    let fence ={
      id: '123abc',
      latitude: 55.663102,
      longitude: 12.590352,
      radius: 10,
      transitionType: 3,
      notification: {
        id: 1,
        title: 'You crossed a sight',
        text: 'You just arrived at netto',
        vibrate: [2000, 500, 2000],
        openAppOnClick: true
      }

    }
    this.geofence.addOrUpdate(fence).then(()=>{
      console.log('geofence added'),
      (err) =>{
        console.log('geofence failed to add')
      }
    });

  }


}
