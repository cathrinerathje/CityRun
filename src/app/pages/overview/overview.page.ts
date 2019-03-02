import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';

declare var google: any;

class Waypoint {
  location: string;
  stopover: boolean;

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

export class OverviewPage implements OnInit {
  waypoints: Array<Waypoint>;
  sights: any; 
  origin: any;
  destination: any;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  constructor(public navCtrl: NavProviderService) { 
    this.waypoints= [];
    this.sights = this.navCtrl.get();
  }
  
  ngOnInit() {
    this.constructWaypoints().then(() =>{      
      this.loadMap();
      this.startNavigation();
    });
  }

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

  loadMap(){    
    let latLng = this.origin;

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

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
      } else {
          console.warn(status);
      }
    });
  }
}