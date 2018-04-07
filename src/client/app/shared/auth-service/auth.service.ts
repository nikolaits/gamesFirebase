import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import {AngularFireAuth, AngularFireAuthProvider} from "angularfire2/auth"
import {FirebaseApp, FirebaseAppProvider} from "angularfire2"
import { GoogleAuthProvider, GoogleAuthProvider_Instance } from '@firebase/auth-types';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class AuthService {

  
  constructor(private authService:AngularFireAuth) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // get(): Observable<string[]> {
  //   return this.http.get('assets/data.json')
  //   //              .do(data => console.log('server data:', data))  // debug
  //                   .catch(this.handleError);
  // }
  signup(email:string, password:string):firebase.Promise<any>{
    // firebase.database.
    return this.authService.auth.createUserWithEmailAndPassword(email, password);
    //.auth().createUserWithEmailAndPassword(email, password);
    

  }
  signin(email:string, password:string):Promise<any>{
    return this.authService.auth.setPersistence('local')
    .then(function() {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function(error:any) {
      // Handle Errors here.
      this.handleError(error);
    });
    
  }
  signInGoogle(){
    return this.authService.auth.setPersistence('local')
    .then(function() {
      let provider = new GoogleAuthProvider()
      return this.authService.auth.signInWithPopup(provider);
    })
    .catch(function(error:any) {
      // Handle Errors here.
      this.handleError(error);
    });
    
  }
  isUserSignIn(){
    let currentUser = this.authService.auth.currentUser;
    console.log("currentUser");
    console.log(currentUser);
    if(currentUser){
      return true;
    }
    return false;
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

