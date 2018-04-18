import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class AuthService {

  
  constructor(private cookiesService:CookieService) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // get(): Observable<string[]> {
  //   return this.http.get('assets/data.json')
  //   //              .do(data => console.log('server data:', data))  // debug
  //                   .catch(this.handleError);
  // }
  isUserSignIn():Promise<any>{
    console.log("in isUserSignIn")
    // let user = firebase.auth().currentUser;
    
    // let token = this.cookiesService.get("geitDevGamesToken");
    // if(token){
      // firebase.auth().signOut();
      return new Promise((resolve, reject)=>{

        firebase.auth().onAuthStateChanged((user) =>{
          if (user) {
            // User is signed in.
            console.log("in if")
            console.log(user);
            resolve(user)
          } else {
            // No user is signed in.
            console.log("No user is signed in.");
            reject("No user is signed in.");
          }
        });
      });
    
    //   return firebase.auth().signInWithCustomToken(token);
    // }

    // return null
  }
  saveSignInToken(token:string){
    console.log("in the saveSignInToken")
    let date = new Date();
    date.setDate(date.getDate() + 1);
    console.log(`Token date ${date}`);
    this.cookiesService.set("geitDevGamesToken", token, date);
  }
  signup(email:string, password:string):firebase.Promise<any>{
    // firebase.database.
    return firebase.auth().setPersistence('local')
    .then(function() {
      return firebase.auth().createUserWithEmailAndPassword(email, password);
    })
    .catch(function(error) {
      // Handle Errors here.
      this.handleError(error)
    });
    
  }
  signin(email:string, password:string):firebase.Promise<any>{
    // firebase.auth().setPersistence()
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .catch(function(error) {
      // Handle Errors here.
      return error;
    });
    
  }
  signInGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      return firebase.auth().signInWithPopup(provider);
    })
    .catch(function(error) {
      // Handle Errors here.
      this.handleError(error)
    });
    
  }
  passwordResetRequest(email:string):firebase.Promise<any>{
    return firebase.auth().sendPasswordResetEmail(email);
  }
  logOut(){
    return firebase.auth().signOut();
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

