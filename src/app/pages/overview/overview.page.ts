import { Component, OnInit } from '@angular/core';
import { NavProviderService } from '../../providers/nav/nav-provider.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {

  sights: any; 


  constructor(public navCtrl: NavProviderService) { 
    this.sights = this.navCtrl.get();
    console.log("test result:" + this.sights);

  }

  ngOnInit() {
  }

}
