import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import {UserInitInfo} from "../../types/user_init_info.type"
import { UserAdmin } from '../../types/user-admin.type';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class UserService {

  private _user:firebase.User;
  public username:string = "";
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
  set user(tmpuser:firebase.User){
    this._user = tmpuser;
  }
  get user():firebase.User{
    return this._user;
  }

  getCurrentUser(){
    this.user = firebase.auth().currentUser;
    console.log(this.user)
  }
  isUserAdmin(){
    return new Promise((resolve, reject)=>{
      if(this.user){
        firebase.database().ref(`users/${this.user.uid}`).once("value").then( snapshot => {
          console.log("isUserAdmin");
          console.log(snapshot.val().isAdmin);
          if (snapshot.val() && snapshot.val().isAdmin){
            
              resolve(snapshot.val().isAdmin);
          }
          reject(false);
       });
        
      }else{
        reject("no user found");
      }
    })
  }
  hasUsername():Promise<any>{
    console.log("hasUsername")
    return new Promise((resolve, reject)=>{
      if(this.user){
        console.log("in if state");
        console.log(`users/${this.user.uid}`)
        console.log(firebase.auth().currentUser.uid);
        firebase.database().ref(`users/${this.user.uid}`).once("value").then( snapshot => {
          console.log("Result");
          console.log(snapshot);
          if (snapshot.val() && snapshot.val().username){
              resolve(snapshot.val().username);
          }
          reject("no username");
       });
        
      }else{
        reject("no user found");
      }
    })
  }
  getUserUsernameAndProfilePicture():Promise<UserInitInfo>{
    return new Promise((resolve, reject)=>{
      if(this.user){
        firebase.database().ref(`users/${this.user.uid}`).once("value").then( snapshot => {
          if (snapshot.val() && snapshot.val().username){
            let result:UserInitInfo = {username:snapshot.val().username, profile_picture:snapshot.val().profile_picture}
            resolve(result);
          }
          reject("no info");
       });
        
      }else{
        reject("no user found");
      }
    })
  }
  getUsersData():Promise<any>{
    return new Promise((resolve, reject)=>{
        firebase.database().ref(`users`).once("value").then( snapshot => {
          if (snapshot.val()){
            let object = snapshot.val();
            let data:UserAdmin[] = [];
            for(var key in object){
              if(key !== this.user.uid)
                  data.push(new UserAdmin(key, object[key].profile_picture, object[key].username, object[key].isAdmin));
            }
            resolve(data);
          }
          reject("no info");
       });
        

    })
  }
  updateUserRights(uid:string, value:boolean){
    return firebase.database().ref(`users/${uid}`).update({
      isAdmin : value
    });
  }
  isUsernameTaken(tmpUsername:string):Promise<any>{
    console.log("isUsernameTaken");
    console.log(tmpUsername);
    var rootRef = firebase.database().ref("users");
    let query = firebase;
    let taken = false;
    return new Promise((resolve, reject)=>{
      rootRef.once("value")
      .then((r)=>{
        console.log("isUsernameTaken result");
        let object = r.val();
        if(r.val()){
          console.log(r.val().keys);
          for (var key in object) {
            if (object.hasOwnProperty(key)) {
                console.log(key + " -> " + object[key].username);
                if(object[key].username === tmpUsername){
                  console.log("taken");
                  taken=true;
                  reject("taken")
                }
            }
        }
        }
        if(!taken){
          console.log("free");
          resolve("free");  
        }      
      })
      .catch((e)=>{
        reject(e);
      })
    })
  }
  writeUserName(name:string, imageUrl:string) {
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).set({
      username: name,
      profile_picture : imageUrl,
      isAdmin:false
    });
  }
  updateUserImage(imageUrl:string){
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).update({
      profile_picture : imageUrl
    });
  }
  updateUsername(name:string){
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).update({
      username: name,
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

