import { Component } from '@angular/core';
import { Config } from './shared/config/env.config';
import './operators';
import * as firebase from "firebase";
/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyB2_J-2ckxTMIV2_bYH44GyTSRLC443BEE",
      authDomain: "gamesfirebase.firebaseapp.com",
      databaseURL: "https://gamesfirebase.firebaseio.com",
      projectId: "gamesfirebase",
      storageBucket: "gamesfirebase.appspot.com",
      messagingSenderId: "1077680727287"
	}
    console.log('Environment config', Config);
    firebase.initializeApp(firebaseConfig);
  }
}
