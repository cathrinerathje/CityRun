import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-info',
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

export class ViewInfoComponent implements OnInit {
  sightName: string;
  rating: number;
  types: Array<string>;

  constructor(private popController: PopoverController, private navParams: NavParams) {
    this.sightName = navParams.get('name');
    this.rating = navParams.get('rating');
    this.types = navParams.get('types');
  }

  ngOnInit() {}

  close() {
    this.popController.dismiss();
  }
}