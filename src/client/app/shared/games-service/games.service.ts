import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import { UserInitInfo } from "../../types/user_init_info.type"
import { Game } from '../../types/game.type';
import { Challenge } from '../../types/challenge.type';
import { ChallengeComplete } from '../../types/challenge_complete.type';
import { CasualModeResult } from '../../types/casual_mode_result.type';
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
  challengeFriend(myuid: string, useruid: string, gamename: string, score: number, username: string) {

    return firebase.database().ref(`users/${useruid}/challenges/${gamename}/${myuid}`).update({
      score: score,
      username: username
    })
  }

  saveCasualModeResult(gamename: string, score: number, timestamp: string) {
    
    return firebase.database().ref(`users/${this.user.uid}/casualmoderesults/${gamename}/${timestamp}`).update({
      score: score
    })
  }
  getCasulModeResults(gamename:string): Promise<any> {
    return new Promise((resolve, reject) => {
        firebase.database().ref(`users/${this.user.uid}/casualmoderesults/${gamename}/`).once("value").then(snapshot => {
          if (snapshot.val()) {
            let object = snapshot.val();
            let result:CasualModeResult[] = []
            for(let key in object){
              result.push(new CasualModeResult(gamename, object[key].score, key))
            }
            resolve(result);
          }
          reject("no info");
        });

    })
  }
  completeChallenge(username: string, newScore: number, oldScore: number, gamename: string, useruid: string) {
    let timestamp = Date.now()
    let res = ""+timestamp;
    return firebase.database().ref(`users/${useruid}/completeChallenges/${res}`).update({
      friendusername: username,
      friendscore: newScore,
      challengescore: oldScore,
      gamename: gamename
    })
      .then((r) => {
        this.challengeFriend(useruid, this.user.uid, gamename, null, null);
      })
      .catch((e) => {
        console.log("Error completeChallenges");
        console.log(e)
      })
  }
  removeCompleteChallenge(timestamp: string) {
    return firebase.database().ref(`users/${this.user.uid}/completeChallenges/${timestamp}`).update({
      friendusername: null,
      friendscore: null,
      challengescore: null,
      gamename: null
    })
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
            let savedData = undefined;
            if (rates) {
              for (var ratekey in rates) {
                if (ratekey === this.user.uid) {
                  userRate = rates[ratekey].rate;
                }
                avrgRate += rates[ratekey].rate;
                ratesNumber += 1;
              }
            }
            if (object[key].savedData) {
              if (object[key].savedData[this.user.uid])
                savedData = object[key].savedData[this.user.uid];
              console.log("---------------------------");
              console.log(object[key].savedData);
              console.log("---------------------------");
            }
            else {
              ratesNumber = 1;
            }
            gamesArray.push(new Game(key, userRate, avrgRate / ratesNumber, true, object[key].windowWidth, object[key].windowHeight, savedData, object[key].imageUri));
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
  getAllGames(): Promise<any> {
    console.log("hasUsername")
    return new Promise((resolve, reject) => {
      firebase.database().ref(`games`).once("value").then((games) => {
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
            let savedData = undefined;
            if (rates) {
              for (var ratekey in rates) {
                if (ratekey === this.user.uid) {
                  userRate = rates[ratekey].rate;
                  if (object[key].savedData) {
                    if (object[key].savedData[this.user.uid])
                      savedData = object[key].savedData;
                  }
                }
                avrgRate += rates[ratekey].rate;
                ratesNumber += 1;
              }
            }
            else {
              ratesNumber = 1;
            }

            gamesArray.push(new Game(key, userRate, avrgRate / ratesNumber, true, object[key].windowWidth, object[key].windowHeight, savedData, object[key].imageUri, object[key].active, object[key].mobileCompatible));
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
  getGameChallenges(gamename: string): Promise<any> {
    
    return new Promise((resolve, reject) => {
      let result:Challenge[] = [];
      firebase.database().ref(`users/${this.user.uid}/challenges/${gamename}`).once("value").then(snapshot => {
        if (snapshot.val()) {
          let object = snapshot.val();
          for (let key in object) {
            
            result.push(new Challenge(gamename, object[key].username,object[key].score, key));
          }
          resolve(result);
        }
        reject("no challenges");
      });


    })
  }
  getGameCompletedChallenges(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      let result:ChallengeComplete[] = [];
      firebase.database().ref(`users/${this.user.uid}/completeChallenges/`).once("value").then(snapshot => {
        if (snapshot.val()) {
          let object = snapshot.val();
          for (let key in object) {
            
            result.push(new ChallengeComplete(object[key].friendusername, object[key].gamename,object[key].challengescore,object[key].friendscore, key));
          }
          resolve(result);
        }
        reject("no compchallenges");
      });


    })
  }
  isGameNameTaken(gamename: string): Promise<any> {
    console.log("isUsernameTaken");
    console.log(gamename);
    var rootRef = firebase.database().ref("games");
    let taken = false;
    return new Promise((resolve, reject) => {
      rootRef.once("value")
        .then((r) => {
          console.log("isUsernameTaken result");
          let object = r.val();
          if (r.val()) {
            console.log(r.val().keys);
            for (var key in object) {
              if (key === gamename) {
                console.log("taken");
                taken = true;
                reject("taken")
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
  doesUserLiveScoreExists(gamename: string, username: string): Promise<any> {
    console.log("isUsernameTaken");
    console.log(username);
    var rootRef = firebase.database().ref(`games/${gamename}/livescores/`);
    let exists = false;
    return new Promise((resolve, reject) => {
      rootRef.once("value")
        .then((r) => {
          console.log("isUsernameTaken result");
          let object = r.val();
          if (r.val()) {
            console.log(r.val().keys);
            for (var key in object) {
              if (key === username) {
                console.log("taken");
                exists = true;
                resolve("exists")
              }
            }
          }
          if (!exists) {
            console.log("free");
            resolve("norecord");
          }
        })
        .catch((e) => {
          reject(e);
        })
    })
  }
  createUserLiveScore(gamename: string, username: string) {
    // let userId = this.user.uid;
    return firebase.database().ref(`games/${gamename}/livescores/${username}`).set({
      score: 0,
      timestamp: Date.now()
    });
  }

  updateUserLiveScore(gamename: string, username: string, newscore: number) {
    // let userId = this.user.uid;
    return firebase.database().ref(`games/${gamename}/livescores/${username}`).update({
      score: newscore,
      timestamp: Date.now()
    });
  }
  createNewGame(gameName: string, windowWidth: number, windowHeight: number) {
    // let userId = this.user.uid;
    return firebase.database().ref(`games/${gameName}`).set({
      active: false,
      mobileCompetibale:false,
      windowWidth: windowWidth,
      imageUri:"https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/games%2Fimages%2Fnew_game.jpeg?alt=media&token=ad100168-8ed9-4de9-8325-0ad276511a07",
      windowHeight: windowHeight,
      livescores: {
        admin: {
          score: -1,
          timestamp: Date.now()
        }
      }
    });
  }
  
  updateGameInfo(gameName: string, windowWidth: number, windowHeight: number) {
    // let userId = this.user.uid;
    return firebase.database().ref(`games/${gameName}`).update({
      windowWidth: windowWidth,
      windowHeight: windowHeight
    });
  }
  setupusergamerate(gamename: string, currentuserrate: number, newuserrate: number) {
    let userId = this.user.uid;
    if (currentuserrate === 0) {
      return firebase.database().ref(`games/${gamename}/usersRating/${userId}`).set({
        rate: newuserrate
      });
    }
    else {
      return firebase.database().ref(`games/${gamename}/usersRating/${userId}`).update({
        rate: newuserrate
      });
    }
  }
  getgameratings(gamename: string): Promise<any> {
    console.log("gate rating")
    return new Promise((resolve, reject) => {
      firebase.database().ref(`games/${gamename}/usersRating`).once("value").then((usersRating) => {
        console.log("Games redult");
        console.log(usersRating.val());

        if (usersRating.val()) {
          let userRate = 0;
          let ratesNumber = 0;
          let avrgRate = 0;
          let rates = usersRating.val();
          if (rates) {
            for (var ratekey in rates) {
              if (ratekey === this.user.uid) {
                userRate = rates[ratekey].rate;
              }
              avrgRate += rates[ratekey].rate;
              ratesNumber += 1;
            }
            if (ratesNumber < 1) {
              ratesNumber = 1;
            }
          }
          else {
            ratesNumber = 1;
          }
          console.log("User rate data");
          console.log({ userRate: userRate, avrgRate: avrgRate });
          resolve({ userRate: userRate, avrgRate: (avrgRate / ratesNumber) });
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
  setupusersaveddata(gamename: string, currentUserSavedData: any, newUserSavedData: any) {
    let userId = this.user.uid;
    if (currentUserSavedData) {
      return firebase.database().ref(`games/${gamename}/savedData/${userId}`).update({
        data: newUserSavedData
      });
    }
    else {
      return firebase.database().ref(`games/${gamename}/savedData/${userId}`).set({
        data: newUserSavedData
      });
    }
  }
  updateGameImage(imageUri: string, gamename:string) {
    return firebase.database().ref(`games/${gamename}`).update({
      imageUri: imageUri
    });
  }
  updateUsername(name: string) {
    let userId = this.user.uid;
    return firebase.database().ref(`users/${userId}`).update({
      username: name,
    });
  }
  updateGameStatus(name: string, value: boolean) {
    return firebase.database().ref(`games/${name}`).update({
      active: value,
    });
  }
  updateGameStatusMobileCompatible(name: string, value: boolean) {
    return firebase.database().ref(`games/${name}`).update({
      mobileCompatible: value,
    });
  }
  deleteGame(name: string) {
    return firebase.database().ref(`games/${name}/`).remove()
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

