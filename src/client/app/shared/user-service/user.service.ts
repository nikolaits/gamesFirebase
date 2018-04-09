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
export class UserService {

  private user:firebase.User;
  constructor(private cookiesService:CookieService) {
    this.user = firebase.auth().currentUser;
    console.log("UserService")
    console.log(this.user);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // get(): Observable<string[]> {
  //   return this.http.get('assets/data.json')
  //   //              .do(data => console.log('server data:', data))  // debug
  //                   .catch(this.handleError);
  // }
  hasUsername(){
    if(this.user){
      firebase
      
    }else{
      return "no user found";
    }
  }
  writeUserName(name:string, imageUrl:string) {
    let userId = this.user.uid;
    firebase.database().ref('users/' + userId).set({
      username: name,
      // email: email,
      // profile_picture : imageUrl
    });
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

