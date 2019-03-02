import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NavProviderService {
  data: any;

  constructor(public navCtrl: NavController) { }

  push(url: string, data: any){
    this.data = data;
    this.navCtrl.navigateForward('/'+ url);
  }

  get(){
    return this.data;
  }
}

