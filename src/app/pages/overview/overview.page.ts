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

  sights: any; 

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;


  constructor(public navCtrl: NavProviderService) { 
    this.sights = this.navCtrl.get();
    console.log("test result:" + this.sights);

  }

  ngOnInit() {
    this.loadMap();
    this.startNavigation();
  }

  loadMap(){
    
    let latLng = new google.maps.LatLng(this.sights[0].lat, this.sights[0].lng);

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

    let waypoints = [];
   
    this.sights.map((sight, index) => {
      let waypoint = new Waypoint(new google.maps.LatLng(sight.lat, sight.lng));
      //let w = new waypoint(new google.maps.LatLng(sight.lat, sight.lng), true);
      //waypoint.location = new google.maps.LatLng(sight.lat, sight.lng);  
      
      waypoints.push(waypoint);
    })

    directionsService.route({

      origin: new google.maps.LatLng(55.690460, 12.595370), 
      destination: new google.maps.LatLng(55.690460, 12.595370),
      waypoints,
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
