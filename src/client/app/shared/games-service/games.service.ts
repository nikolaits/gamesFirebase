import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import { UserInitInfo } from "../../types/user_init_info.type"
import { Game } from '../../types/game.type';
// import 'rxjs/add/operator/do';  // for debugging

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class GamesService {

  private _user: firebase.User;
  constructor(private cookiesService: CookieService) {
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
  set user(tmpuser: firebase.User) {
    this._user = tmpuser;
  }
  get user(): firebase.User {
    return this._user;
  }

  getCurrentUser() {
    this.user = firebase.auth().currentUser;
    console.log(this.user)
  }

  getGames(): Promise<any> {
    console.log("hasUsername")
    return new Promise((resolve, reject) => {
      firebase.database().ref(`games`).orderByChild("active").equalTo(true).once("value").then((games) => {
        console.log("Games redult");
        console.log(games.val());
        let gamesArray: Game[] = [];

        if (games.val()) {
          let object = games.val();
          for (var key in object) {
            let userRate = 0;
            let ratesNumber = 0;
            let avrgRate = 0;
            console.log(key);
            console.log(object[key].active);
            let rates = object[key].usersRating;
            if(rates){
              for (var ratekey in rates) {
                if (ratekey === this.user.uid) {
                  userRate = rates[ratekey].rate;
                }
                avrgRate += rates[ratekey].rate;
                ratesNumber += 1;
              }
            }
            else{
              ratesNumber = 1;
            }
            gamesArray.push(new Game(key, userRate, avrgRate / ratesNumber, true, object[key].windowWidth, object[key].windowHeight));
          }
          resolve(gamesArray);
        }
        else {
          reject(null);
        }
      })
      .catch((err) => {
          console.log("Error(getGames)");
          console.log(err);
          reject(err);
        })
    })
  }
  getUserUsernameAndProfilePicture(): Promise<UserInitInfo> {
    return new Promise((resolve, reject) => {
      if (this.user) {
        firebase.database().ref(`users/${this.user.uid}`).once("value").then(snapshot => {
          if (snapshot.val() && snapshot.val().username) {
            let result: UserInitInfo = { username: snapshot.val().username, profile_picture: snapshot.val().profile_picture }
            resolve(result);
          }
          reject("no info");
        });

      } else {
        reject("no user found");
      }
    })
  }
  isUsernameTaken(tmpUsername: string): Promise<any> {
    console.log("isUsernameTaken");
    console.log(tmpUsername);
    var rootRef = firebase.database().ref("users");
    let query = firebase;
    let taken = false;
    return new Promise((resolve, reject) => {
      rootRef.once("value")
        .then((r) => {
          console.log("isUsernameTaken result");
          let object = r.val();
          if (r.val()) {
            console.log(r.val().keys);
            for (var key in object) {
              if (object.hasOwnProperty(key)) {
                console.log(key + " -> " + object[key].username);
                if (object[key].username === tmpUsername) {
                  console.log("taken");
                  taken = true;
                  reject("taken")
                }
              }
            }
          }
          if (!taken) {
            console.log("free");
            resolve("free");
          }
        })
        .catch((e) => {
          reject(e);
        })
    })
  }
  setupusergamerate(gamename: string, currentuserrate: number, newuserrate:number) {
    let userId = this.user.uid;
    if(currentuserrate === 0){
      return firebase.database().ref(`games/${gamename}/usersRating/${userId}`).set({
        rate: newuserrate
      });
    }
    else{
      return firebase.database().ref(`games/${gamename}/usersRating/${userId}`).update({
        rate: newuserrate
      });
    }
  }
  updateUserImage(imageUrl: string) {
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).update({
      profile_picture: imageUrl
    });
  }
  updateUsername(name: string) {
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).update({
      username: name,
    });
  }
  /**
    * Handle HTTP error
    */
  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}

