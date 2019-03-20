import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

/** First page of the app the user can interact with */
export class HomePage {
  
  /**
   * Uses a router to navigate to other pages.
   * @param {Router} router - The router used to navigate forward.
   */
  constructor(private router: Router, private tts: TextToSpeech) {}
  
  /** Navigates to sights page when ion-card is clicked */
  navigateToSightsPage() {
    this.router.navigateByUrl('/sights');
  }

  speech() {
    this.tts.speak('Hello World')
    .then(() => console.log('Success'))
    .catch((reason: any) => console.log(reason));
  }

}
