import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-view-info',
  templateUrl: './view-info.component.html',
  styleUrls: ['./view-info.component.scss'],
})

/** Defines a popover viewport */
export class ViewInfoComponent implements OnInit {
  sightName: string;
  originalName: string;
  description: string;
  thumbnail: string;
  rating: number;
  markers: string;
  tags: Array<string>;

  /**
   * Uses PopoverController to control the popover and NavParams to retrieve and display 
   * data from the clicked element.
   */
  constructor(private popController: PopoverController, private navParams: NavParams) {
    this.sightName = navParams.get('name');
    this.originalName = navParams.get('originalName');
    this.description = navParams.get('description');
    this.thumbnail = navParams.get('thumbnail');
    this.markers = navParams.get('markers');
    this.tags = navParams.get('tags');
  }

  ngOnInit() {
    this.formatMarkers();
  }

  formatMarkers() {
    if (this.markers != "") {
      let splitted = this.markers.split(':');
      splitted.forEach((marker) => {
        if (marker != "other") {
          //no duplicates
          if (!this.tags.includes(marker)) {
            this.tags.push(marker);
          }
        }
      });
    } 
  }

  /** Dismisses the popover when the user closes it */
  close() {
    this.popController.dismiss();
  }
}