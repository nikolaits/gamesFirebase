import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class AuthService {

  
  constructor() {}

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

    return firebase.auth().createUserWithEmailAndPassword(email, password);
    

  }
  signin(email:string, password:string):firebase.Promise<any>{

    return firebase.auth().signInWithEmailAndPassword(email, password);
  }
  signInGoogle(){
    let provider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(provider);
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

