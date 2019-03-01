import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';

declare var google: any;

class Waypoint {
  //location: string;
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
  waypoints;
  sights: any; 
  origin;
  destination;

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;


  constructor(public navCtrl: NavProviderService) { 
    this.sights = this.navCtrl.get();
    this.waypoints= [];
    console.log("test result:" + this.sights);

  }
  

  ngOnInit() {
    this.constructWaypoints().then(() =>{
      console.log("contructed waypoints finished");
      
      this.loadMap();
      this.startNavigation();
    });
    console.log("ngOnInit");
    console.log("waypoints:" + this.waypoints)
    
  }

  /*
  ngAfterViewInit(){
    this.loadMap();
    this.startNavigation();
    console.log("nfAfterViewInit");
  }
  */

 constructWaypoints(){
    return new Promise((resolve, reject) => {
      this.sights.map((sight) => {
        let waypoint = new Waypoint(new google.maps.LatLng(sight.lat, sight.lng));
        
        this.waypoints.push(waypoint);
      });
      this.origin = new google.maps.LatLng(this.sights[0].lat, this.sights[0].lng);
      this.destination = new google.maps.LatLng(this.sights[0].lat, this.sights[0].lng);
      console.log("contructed waypoints");
      resolve();
    }).catch((error) => {
      console.log("error");
    });
  }

  loadMap(){
    console.log("loadMap stated");
    
    let latLng = this.origin;

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  startNavigation() {
    console.log("startnavigation stated");
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
