import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { UserService } from '../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../types/user_init_info.type';
import * as firebase from "firebase";
import { GamesService } from '../shared/games-service/games.service';
import { Game } from "../types/game.type"
import { setInterval } from 'timers';
import { CookieService } from 'ng2-cookies';
import { Friend } from '../types/friend.type';
import { ChallengeComplete } from '../types/challenge_complete.type';

class GameArgs {
  constructor(public challenges: any, public friends: any, public savedGame: any) { }
}
@Component({
  selector: 'ngbd-modal-content',
  styles: [".modal-header{background-color: 000;}   "],
  template: `
    <div  class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
    </div>
    <div class="modal-body">
      <p>{{notification}}!</p>
      <input type="text" class="form-control" id="username" (input)="onTextChange($event.target.value)" #username name="username" >
      <div *ngIf="error" class="alert alert-danger">
        <div *ngIf="isEmpty">
                Username is required.
        </div>
        <div *ngIf="taken">
          Username is already taken.
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" [ngClass]="{disabled : btnDisabled}" (click)="SubmitUsername(username.value)">Save</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() notification: string;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }
  public error = false;
  public isEmpty = false;
  public btnDisabled = true;
  public taken = false;

  public onTextChange(args: string) {
    this.error = false;
    this.isEmpty = false;
    this.taken = false;
    if (args.replace(/\s/g, '').length < 1) {
      this.error = true;
      this.isEmpty = true;
    }
    this.btnDisabled = this.error;
  }
  public SubmitUsername(result: string) {

    if (!this.error && !this.btnDisabled) {
      this.userService.getCurrentUser();
      this.userService.isUsernameTaken(result)
        .then((r) => {
          if (r === "free") {
            this.saveUserData(result);
          }
        })
        .catch((e) => {
          if (e === "taken") {
            this.error = true;
            this.taken = true;
          } else {
            console.log(e);
          }

        });



    }
  }
  private saveUserData(result: string) {
    let imageUrl = "https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/def_profile_picture.png?alt=media&token=fb6c2ff5-8efc-4ae9-a477-85393611338b";
    this.userService.writeUserName(result, imageUrl)
      .then(() => {
        console.log("username created");
        this.activeModal.close('Close username modal')
      })
      .catch((e) => {
        console.log("Error");
        console.log(e);
      })
  }
}


declare let window: any;
declare let jQuery: any;
// declare let game: any;
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.css'],
})
export class MainPageComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  currentRate = 2;
  containerWidth = 0;
  containerHeight = 0;
  games: Game[] = [];
  public selectedGame = "";
  public changeDisplayedData: boolean = false;
  public showHover: boolean = false;
  public showFriendList: boolean = false;
  public isUnlockedSeason:boolean = false;
  public isCarouselShown = true;
  private currentUsername = "";
  private listenerLiveScore: any;
  private gameRatingListener: any;
  private settimeoutlistener: any;
  private firstLoad = true;
  private starttime = Date.now();
  private openGameChallenge:boolean;
 
  @ViewChild('wrapper') wrapper: any;

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private cookieService: CookieService,config: NgbCarouselConfig) {
    config.interval = 10000;
    config.wrap = true;
    config.keyboard = false;
  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    console.log("main component ngOnInit2");
  }
  ngAfterViewInit() {
    let cookieResult = this.cookieService.get("isFriendListOpened");
    this.openGameChallenge = false;
    let cookieChallengeResult = this.cookieService.get("challengeSelectedEvent");
    if((cookieChallengeResult)&&(cookieChallengeResult !== "")){
      this.openGameChallenge = true;
    }
    if (cookieResult === "yes") {
      setTimeout(() => {
        this.showFriendList = true;
      }, 2000);

    }
    this.authService.isUserSignIn()
      .then((r: firebase.User) => {
        console.log("user exist");
        this.userService.user = r;
        this.userService.hasUsername()
          .then((r) => {
            console.log(r);
            this.activeGames();
            this.gamesService.getCurrentUser();
            this.onSeasonModeUnlockListener();
          })
          .catch((e) => {
            console.log("Error:");
            console.log(e);
            if (e === "no username") {
              this.openModal();
            }
          })
      })
      .catch((e) => {
        console.log("no user found");
        console.log(e);
      });
  }
  onTap() {
    this.gamesService.getCasulModeResults("test")
    .then((r)=>{
      console.log("Result csula mode");
      console.log(r);
    })
    .catch((e)=>{
      console.log("Error");
      console.log(e)

    })
  }
  activeGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getGames()
      .then((result) => {
        console.log("activeGames");
        console.log(result);
        // result[0].isCollapsed=false;
        this.games = result;
        if(this.openGameChallenge){
          this.onVisibilityChange(this.cookieService.get("challengeSelectedEvent"));
        }
      })
      .catch((err) => {
        console.log("Error(activeGames)");
        console.log(err)
      })
  }
  openModal() {
    console.log("firs tap");
    console.log(this.modalService);
    let options: NgbModalOptions = {
      beforeDismiss: () => { return false },
      windowClass: "in"
    }

    const modalRef = this.modalService.open(NgbdModalContent, options);
    modalRef.componentInstance.notification = 'Please enter your username';
    modalRef.result.then((arg: string) => {
      console.log(arg);

      this.changeDisplayedData = true;
    })
  }
  readfilestorage() {

  }

  onRateChange(args: any, game: string) {
    console.log("Rate change");
    console.log(args, game);
    this.games.forEach((element: Game) => {
      if (element.name === game) {
        this.gamesService.setupusergamerate(game, element.userRate, args)
          .then((r) => {
            console.log("Userrate has been change");
            console.log(r);
          })
          .catch((e) => {
            console.log("Error onRateChange");
            console.log(e)
          })
      }

    })

  }
  onVisibilityChange(gamename: string) {
    // while (this.wrapper.firstChild) {
    //   this.wrapper.removeChild(this.wrapper.firstChild);
    // }
    // if((game != null)&&(game !== undefined)) {
    //   game.paused = true;
    //   game.removeAll();
    //   setTimeout(() => {
    //     game.destroy();
    //     this.preloadInitGame(gamename);
    //   }, 500);

    // }
    this.isCarouselShown=true;
    this.showHover = true;
    if (this.gameRatingListener) {
      this.removeGameRatingListener();
    }
    if (this.selectedGame !== "") {
      this.destroyGame(this.selectedGame);
    }
    this.selectedGame = gamename;

    let selectedGame: Game = null;
    this.games.forEach((element) => {
      if (gamename === element.name) {
        element.isCollapsed = false;
        selectedGame = element;
      }
      else {
        element.isCollapsed = true;
      }

    })
    this.containerWidth = selectedGame.windowWidth;
    this.containerHeight = selectedGame.windowHeight;
    console.log("Selectedgame " + gamename);
    this.userService.getUserUsernameAndProfilePicture()
      .then((rusult: UserInitInfo) => {
        this.currentUsername = rusult.username;
        this.gamesService.doesUserLiveScoreExists(gamename, rusult.username)
          .then((r) => {
            if (r === "exists") {
              this.getUserChallenges(gamename, selectedGame);
            }
            else if (r === "norecord") {
              this.gamesService.createUserLiveScore(gamename, rusult.username)
                .then((r) => {
                  this.getUserChallenges(gamename, selectedGame);
                })
                .catch((errCreate) => {
                  console.log("errCreate");
                  console.log(errCreate)
                })
            }

          })
          .catch((e) => {
            console.log(e)
          })
      })
      .catch((err) => {
        console.log("Error");
        console.log(err);
      })
    this.gamesService.getgameratings(this.selectedGame)
      .then((r) => {
        console.log("rating result");
        console.log(r);
        this.updateGameRate(r);
      })
      .catch((err) => {
        console.log("Rating get Error");
      })
    this.detectGamesRatingChange(this.selectedGame);



  }
  updateGameRate(r: any) {
    this.games.forEach((element) => {
      if (element.name === this.selectedGame) {
        element.avrgRate = r.avrgRate;
        element.userRate = r.userRate;
      }
    })
  }
  destroyGame(gamename: string) {
    window['destroy_' + gamename]();
  }
  getUserChallenges(gamename: string, selectedGame: Game) {
    this.gamesService.getGameChallenges(gamename)
      .then((r) => {
        console.log("there is challenge");
        this.preloadInitGame(gamename, selectedGame, r);
      })
      .catch((e) => {
        console.log("no users were found");
        console.log(e);
        this.preloadInitGame(gamename, selectedGame, undefined);
      })
  }
  preloadInitGame(gamename: string, game: Game, challenges: any) {
    let friendList: any[];
    this.userService.getFriendsAcceptedNotPending()
      .then((r) => {
        friendList = r;
        console.log("userlist");
        console.log(JSON.stringify(friendList));

        this.checkifjscssfileisloaded(gamename + '.js', "js")
          .then((args) => {
            if (args === "exist") {
              console.log("script is removed");
              // this.addJSFile("assets/gamesTest/asteroids/src/game.js");
              this.startGame(gamename, 1, game, friendList, challenges);
            }
          })
          .catch((err) => {
            console.log("Error removejscssfile")
            console.log(err);
            this.addJSFile("assets/gamesJavaScript/" + gamename + "/src/" + gamename + ".js");
            this.startGame(gamename, 1000, game, friendList, challenges);
          })
      })
      .catch((err: any) => {
        console.log("No friends were found");
        console.log(err);
        this.startGame(gamename, 1000, game, undefined, challenges);
      })
  }
  startGame(gamename: string, delay: number, game: Game, friends: any[], challenge: any[]) {
    this.isCarouselShown = false;
    setTimeout(() => {
      try {
        let gameArgs: GameArgs = new GameArgs(challenge, friends, game.savedData);
        console.log("gameArgs");
        console.log(gameArgs);
        window['start_' + gamename](game.windowWidth, game.windowHeight, "container_" + gamename, "assets/gamesJavaScript/" + gamename + "/", JSON.stringify(gameArgs), "casualMode",
          (status: string, score: number, game_xp: number, game_id: number, gameArgs: any, unlocklevel: boolean) => {
            console.log('game start 1');
            console.log(score);
            if (status === "Close") {
              this.destroyGame(this.selectedGame);
              this.selectedGame = "";
              this.removeLiveScoreEventListener();
            } else if (status === "SaveGame") {
              this.cookieService.set("FlappyPlaneSaveGame", JSON.stringify(gameArgs));
              this.gamesService.setupusersaveddata(this.selectedGame, game.savedData, gameArgs)
                .then((r) => {
                  //Cookies.get("FlappyPlaneSaveGame")
                  // this.selectedGame;
                  console.log("game info is set")
                })
                .catch((e) => {
                  console.log("Error (setupusersaveddata)");
                  console.log(e);
                })
            } else if (status == "LiveScore") {
              console.log("LiveScore");
              console.log(score);
              this.gamesService.updateUserLiveScore(gamename, this.currentUsername, score);
            } else if (status == "ChallengeComplete") {
              this.gamesService.completeChallenge(this.currentUsername, score, gameArgs.oldScore, this.selectedGame, gameArgs.uid)
                .then((r) => {
                  console.log("new Challenge completed");
                  console.log(r)
                })
                .catch((e) => {
                  console.log("Error completing the challenge");
                  console.log(e);
                })
            } else if (status == "GameOver") {
              this.gamesService.saveCasualModeResult(this.selectedGame, score, "" + Date.now())
                .then(() => {
                  console.log("result saved");
                  if(unlocklevel){
                    this.userService.unlockSeasonmode(unlocklevel)
                    .then((unlockresult)=>{
                      if(!this.isUnlockedSeason){
                        alert("You have unlocked season mode");
                      }
                      
                    })
                    .catch((unlockerror)=>{
                      console.log("Error unlocking season mode");
                      console.log(unlockerror)
                    })
                  }
                })
                .catch((e) => {
                  console.log("Error saving casula mode result");
                  console.log(e)
                })
            } else if(status == "ChallengeFriend"){
              this.gamesService.challengeFriend(this.userService.user.uid, gameArgs.useruid, this.selectedGame, score, this.currentUsername)
              .then(()=>{
                console.log("challenge added");

              })
              .catch((e)=>{
                console.log("Error challenging friend");
                console.log(e)
              })
            }
          });
        this.detectGamesLiveScore(gamename);
        this.showHover = false;
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    }, delay);
  }
  prettifyHeader(name: string) {
    let newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName;
  }
  addJSFile(path: string) {

    const script = document.createElement('script');
    script.src = path;
    document.body.appendChild(script);
  }
  checkifjscssfileisloaded(filename: string, filetype: string) {
    return new Promise((resolve, reject) => {
      let error = true;
      var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
      var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
      var allsuspects = document.getElementsByTagName(targetelement)
      for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
          // allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
          error = false;
          resolve("exist");
        }
      }
      if (error) {
        reject("does not exist");
      }
    })

  }
  // TO DO update the array
  detectGamesRatingChange(gamename: string) {
    this.gameRatingListener = firebase.database().ref(`games/${gamename}/usersRating`).on('value', (usersRating) => {
      if (usersRating.val()) {
        let userRate = 0;
        let ratesNumber = 0;
        let avrgRate = 0;
        let rates = usersRating.val();
        if (rates) {
          for (var ratekey in rates) {
            if (ratekey === this.gamesService.user.uid) {
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
        this.updateGameRate({ userRate: userRate, avrgRate: (avrgRate / ratesNumber) });
      }
    });
  }
  removeGameRatingListener() {
    // this.gameRatingListener.off();
  }

  detectGamesLiveScore(gamename: string) {
    //  this.setintervallistener= setInterval(()=>{
    // let endtime = Date.now();
    // if((endtime - this.starttime)<30 * 1000){
    //   jQuery("#livescore_"+gamename).kendoGrid({
    //     dataSource: {
    //       date:[],
    //       sort: {
    //         field: "score",
    //         dir: "desc"
    //       },
    //       pageSize: 20
    //     },
    //     scrollable: false
    //   });
    // }
    //   }, 1000);
    jQuery("#livescore_" + this.selectedGame).kendoGrid({
      dataSource: {
        data: [],
        sort: {
          field: "score",
          dir: "desc"
        },
        pageSize: 20
      },
      scrollable: false,
      noRecords: true
    });
    let nothingToShow = true;
    this.listenerLiveScore = firebase.database().ref(`games/${gamename}/livescores`).on('value', (snapshot) => {
      // Do whatever
      // console.log("gsmes info chnaged");
      // console.log(snapshot.val());
      this.starttime = Date.now();
      var now = Date.now();
      var cutoff = now - (30 * 1000);
      let object = snapshot.val();
      let data = [];

      for (let key in object) {
        if ((object[key].timestamp > cutoff) && (key !== "admin")) {
          nothingToShow = false;
          if (this.settimeoutlistener) {

            clearTimeout(this.settimeoutlistener);
          }
          data.push({ name: key, score: object[key].score })
        }
      }
      this.showLiveRezultTable(data);
      this.settimeoutlistener = setTimeout(() => {
        this.showLiveRezultTable([]);
      }, 5000);
    });
    if (nothingToShow) {
      this.showLiveRezultTable([]);
    }
  }
  removeLiveScoreEventListener() {
    // this.listenerLiveScore.off();
  }
  showLiveRezultTable(result: any) {
    console.log(this.selectedGame);
    try {
      jQuery("#livescore_" + this.selectedGame).data("kendoGrid").dataSource.data(result);
    } catch (error) {
        console.log("livescore error");
        console.log(error);
    }
    
    

  }
  openFriendList() {
    this.showFriendList = true;

  }
  closeFriendList() {
    this.showFriendList = false;
  }
  onChallengeSelected(gamename: string) {
    console.log("challenge selected");
    console.log(gamename);
    this.onVisibilityChange(gamename);
  }
  onSeasonModeUnlockListener(){
    // let username = this.cookieService.get("geitUsername");
    firebase.database().ref(`users/${this.userService.user.uid}/`).on('value', (snapshot) => {
      if((snapshot.val())&&(snapshot.val().isSeasonModeUnlocked)){
        if(snapshot.val().isSeasonModeUnlocked === true){
          this.isUnlockedSeason = true;
        }
      }
    });
  }
}
