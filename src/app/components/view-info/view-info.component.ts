import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-info',
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

/**
 * Defines a popover viewport.
 */
export class ViewInfoComponent implements OnInit {
  sightName: string;
  rating: number;
  types: Array<string>;

  /**
   * @constructor
   * Uses PopoverController to control the popover and NavParams to retrieve and display 
   * data from the clicked element.
   */
  constructor(private popController: PopoverController, private navParams: NavParams) {
    this.sightName = navParams.get('name');
    this.rating = navParams.get('rating');
    this.types = navParams.get('types');
  }

  ngOnInit() {}

  /**
   * @function
   * Dismisses the popover when the user closes it.
   */
  close() {
    this.popController.dismiss();
  }
}