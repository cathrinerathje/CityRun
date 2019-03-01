import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';

declare var google: any;

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

}
