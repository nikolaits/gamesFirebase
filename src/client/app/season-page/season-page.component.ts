import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { UserService } from '../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../types/user_init_info.type';
import * as firebase from "firebase";
import { GamesService } from '../shared/games-service/games.service';
import { Game } from "../types/game.type"
import { setInterval } from 'timers';
import { CookieService } from 'ng2-cookies';
import { Friend } from '../types/friend.type';
import { ChallengeComplete } from '../types/challenge_complete.type';
import { NavigationService } from '../shared/navigation-service/navigation.service';

class GameArgs {
  constructor(public challenges: any, public friends: any, public savedGame: any) { }
}



declare let window: any;
declare let jQuery: any;
declare let EasyStar: any
let gameSeasonMode: any = null;
let callbackFuncton:any = null;
declare let Phaser: any
// declare let game: any;
// declare let maze: any;
// declare let mazeWidth: number;
// declare let mazeHeight: number;
// declare let tileSize: number;
// declare let mazeGraphics: any;

class playGame {
  // public game: any;
  public maze: any = [];
  public mazeWidth: number = 41;
  public mazeHeight: number = 31;
  public tileSize: number = 20;
  public mazeGraphics: any;
  constructor() {
    // this.game=game;
  }
  create() {
    {
      this.mazeGraphics = gameSeasonMode.add.graphics(0, 0);
      var moves: any = [];
      for (var i = 0; i < this.mazeHeight; i++) {
        this.maze[i] = [];
        for (var j = 0; j < this.mazeWidth; j++) {
          this.maze[i][j] = 1;
        }
      }
      var posX = 1;
      var posY = 1;
      this.maze[posX][posY] = 0;
      moves.push(posY + posY * this.mazeWidth);
      gameSeasonMode.time.events.loop(Phaser.Timer.SECOND / 60, function () {
        if (moves.length) {
          var possibleDirections = "";
          if (posX + 2 > 0 && posX + 2 < this.mazeHeight - 1 && this.maze[posX + 2][posY] == 1) {
            possibleDirections += "S";
          }
          if (posX - 2 > 0 && posX - 2 < this.mazeHeight - 1 && this.maze[posX - 2][posY] == 1) {
            possibleDirections += "N";
          }
          if (posY - 2 > 0 && posY - 2 < this.mazeWidth - 1 && this.maze[posX][posY - 2] == 1) {
            possibleDirections += "W";
          }
          if (posY + 2 > 0 && posY + 2 < this.mazeWidth - 1 && this.maze[posX][posY + 2] == 1) {
            possibleDirections += "E";
          }
          if (possibleDirections) {
            var move = gameSeasonMode.rnd.between(0, possibleDirections.length - 1);
            switch (possibleDirections[move]) {
              case "N":
                this.maze[posX - 2][posY] = 0;
                this.maze[posX - 1][posY] = 0;
                posX -= 2;
                break;
              case "S":
                this.maze[posX + 2][posY] = 0;
                this.maze[posX + 1][posY] = 0;
                posX += 2;
                break;
              case "W":
                this.maze[posX][posY - 2] = 0;
                this.maze[posX][posY - 1] = 0;
                posY -= 2;
                break;
              case "E":
                this.maze[posX][posY + 2] = 0;
                this.maze[posX][posY + 1] = 0;
                posY += 2;
                break;
            }
            moves.push(posY + posX * this.mazeWidth);
          }
          else {
            var back = moves.pop();
            posX = Math.floor(back / this.mazeWidth);
            posY = back % this.mazeWidth;
          }
          this.drawMaze(posX, posY);
        }
      }, this);
    }
  }
  drawMaze(posX: number, posY: number) {
    this.mazeGraphics.clear();
    this.mazeGraphics.beginFill(0xcccccc);
    for (let i = 0; i < this.mazeHeight; i++) {
      for (let j = 0; j < this.mazeWidth; j++) {
        if (this.maze[i][j] == 1) {
          this.mazeGraphics.drawRect(j * this.tileSize, i * this.tileSize, this.tileSize, this.tileSize);
        }
      }
      // console.log("Drawer maze")
      // console.log(this.maze);
    }
    this.mazeGraphics.endFill();
    this.mazeGraphics.beginFill(0xff0000);
    this.mazeGraphics.drawRect(posY * this.tileSize, posX * this.tileSize, this.tileSize, this.tileSize);
    this.mazeGraphics.endFill();
  }

}
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'season-page.component.html',
  styleUrls: ['season-page.component.css'],
})
export class SeasonPageComponent implements OnInit {

  errorMessage: string;
  // names: any[] = [];
  // currentRate = 2;
  // containerWidth = 0;
  // containerHeight = 0;
  games: Game[] = [];
  public selectedGame = "";
  public changeDisplayedData: boolean = false;
  public showHover: boolean = false;
  public showFriendList: boolean = false;
  private isDrawing = false;
  private startPosX: number = 1;
  private startPosY: number = 1;
  // private currentUsername = "";
  // private listenerLiveScore: any;
  // private gameRatingListener: any;
  // private settimeoutlistener: any;
  // private firstLoad = true;
  // private starttime = Date.now();


  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private cookieService: CookieService, private navigationService: NavigationService) {

  }

  ngOnInit() {
    console.log("main component ngOnInit2");
    
  }
  ngAfterViewInit() {
    let cookieResult = this.cookieService.get("isFriendListOpened");
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
          })
          .catch((e) => {
            console.log("Error:");
            console.log(e);
            if (e === "no username") {
              // this.openModal();
            }
          })
      })
      .catch((e) => {
        console.log("no user found");
        console.log(e);
      });
      callbackFuncton = (result:any)=>{
        console.log("callbackFuncton");
        console.log(result);
        this.isDrawing = false;
      }
  }

  activeGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getGames()
      .then((result) => {
        console.log("activeGames");
        console.log(result);
        // result[0].isCollapsed=false;
        this.games = result;
        this.initSeasonMode();
      })
      .catch((err) => {
        console.log("Error(activeGames)");
        console.log(err)
      })
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
    this.cookieService.set("challengeSelectedEvent", gamename);
    this.navigationService.goToMainPage();
  }

  initSeasonMode() {
    //seasonmodeContainer
    gameSeasonMode = new Phaser.Game(810, 610, Phaser.CANVAS, "seasonmodeContainer");
    gameSeasonMode.state.add("PlayGame", playGame);
    gameSeasonMode.state.start("PlayGame");
    setTimeout(() => {
      console.log(gameSeasonMode.state.states.drawPath)
    }, 2000);

    setTimeout(() => {
      console.log("phaser game")
      console.log(gameSeasonMode.state.states.PlayGame);
      console.log(gameSeasonMode.input);
      gameSeasonMode.input.onTap.add((pointer: any, doubleTap: any) => {
        console.log("onTap");
        console.log(Math.floor(pointer.x / 20));
        console.log(Math.floor(pointer.y / 20));
        console.log(doubleTap);
        let posX = Math.floor(pointer.x / 20);
        let posY = Math.floor(pointer.y / 20)
        let maze = gameSeasonMode.state.states.PlayGame.maze;
        console.log(maze[posY][posX]);
        if ((doubleTap) && (maze[posY][posX] === 0)&&(!this.isDrawing)) {
          var easystar = new EasyStar.js();
          console.log("in the calculating mode")
          console.log(easystar)
          try {
            this.isDrawing= true;
            easystar.setGrid(maze);
            easystar.setAcceptableTiles([0]);
            easystar.findPath(this.startPosX, this.startPosY, posX, posY, this.drawPath);
            easystar.calculate();
            this.startPosX = posX;
            this.startPosY = posY;
          } catch (error) {
            console.log(error);
          }

        }
      })
    }, 1000);

  }
  drawPath(path: any) {
    var i = 0;
    let playGame = gameSeasonMode.state.states.PlayGame;
    let colorsPalette = [
      0x00ffff,
      0xf0ffff,
      0xf5f5dc,
      0x0000ff,
      0xa52a2a,
      0x00ffff,
      0xff00ff,
      0xffd700,
      0x008000,
      0x4b0082,
      0xf0e68c,
      0xadd8e6,
      0xe0ffff,
      0x90ee90,
      0xffb6c1,
      0xffffe0,
      0x00ff00,
      0xff00ff,
      0x800000,
      0x000080,
      0x808000,
      0xffa500,
      0xffc0cb,
      0x800080,
      0x800080,
      0xff0000,
      0xc0c0c0,
      0xffffff,
      0xffff00
    ]
    var color = colorsPalette[Math.floor(Math.random()*colorsPalette.length)];
    let finishDrawing = false;
    gameSeasonMode.time.events.loop(Phaser.Timer.SECOND / 25, () => {
      if (i < path.length) {
        playGame.mazeGraphics.beginFill(color);
        playGame.mazeGraphics.drawRect(path[i].x * playGame.tileSize + 3, path[i].y * playGame.tileSize + 3, playGame.tileSize - 6, playGame.tileSize - 6);
        i++;
        playGame.mazeGraphics.endFill();
      }
      else if(!finishDrawing){
        finishDrawing = true;
        callbackFuncton("finish drawing path");
        
      }
    })
  }
  // onTap() {
  //   this.gamesService.getCasulModeResults("test")
  //   .then((r)=>{
  //     console.log("Result csula mode");
  //     console.log(r);
  //   })
  //   .catch((e)=>{
  //     console.log("Error");
  //     console.log(e)

  //   })
  // }
  // onRateChange(args: any, game: string) {
  //   console.log("Rate change");
  //   console.log(args, game);
  //   this.games.forEach((element: Game) => {
  //     if (element.name === game) {
  //       this.gamesService.setupusergamerate(game, element.userRate, args)
  //         .then((r) => {
  //           console.log("Userrate has been change");
  //           console.log(r);
  //         })
  //         .catch((e) => {
  //           console.log("Error onRateChange");
  //           console.log(e)
  //         })
  //     }

  //   })

  // }
  // onVisibilityChange(gamename: string) {


  //   this.showHover = true;
  //   if (this.gameRatingListener) {
  //     this.removeGameRatingListener();
  //   }
  //   if (this.selectedGame !== "") {
  //     this.destroyGame(this.selectedGame);
  //   }
  //   this.selectedGame = gamename;

  //   let selectedGame: Game = null;
  //   this.games.forEach((element) => {
  //     if (gamename === element.name) {
  //       element.isCollapsed = false;
  //       selectedGame = element;
  //     }
  //     else {
  //       element.isCollapsed = true;
  //     }

  //   })
  //   this.containerWidth = selectedGame.windowWidth;
  //   this.containerHeight = selectedGame.windowHeight;
  //   console.log("Selectedgame " + gamename);
  //   this.userService.getUserUsernameAndProfilePicture()
  //     .then((rusult: UserInitInfo) => {
  //       this.currentUsername = rusult.username;
  //       this.gamesService.doesUserLiveScoreExists(gamename, rusult.username)
  //         .then((r) => {
  //           if (r === "exists") {
  //             this.getUserChallenges(gamename, selectedGame);
  //           }
  //           else if (r === "norecord") {
  //             this.gamesService.createUserLiveScore(gamename, rusult.username)
  //               .then((r) => {
  //                 this.getUserChallenges(gamename, selectedGame);
  //               })
  //               .catch((errCreate) => {
  //                 console.log("errCreate");
  //                 console.log(errCreate)
  //               })
  //           }

  //         })
  //         .catch((e) => {
  //           console.log(e)
  //         })
  //     })
  //     .catch((err) => {
  //       console.log("Error");
  //       console.log(err);
  //     })
  //   this.gamesService.getgameratings(this.selectedGame)
  //     .then((r) => {
  //       console.log("rating result");
  //       console.log(r);
  //       this.updateGameRate(r);
  //     })
  //     .catch((err) => {
  //       console.log("Rating get Error");
  //     })
  //   this.detectGamesRatingChange(this.selectedGame);



  // }
  // updateGameRate(r: any) {
  //   this.games.forEach((element) => {
  //     if (element.name === this.selectedGame) {
  //       element.avrgRate = r.avrgRate;
  //       element.userRate = r.userRate;
  //     }
  //   })
  // }
  // destroyGame(gamename: string) {
  //   window['destroy_' + gamename]();
  // }
  // getUserChallenges(gamename: string, selectedGame: Game) {
  //   this.gamesService.getGameChallenges(gamename)
  //     .then((r) => {
  //       console.log("there is challenge");
  //       this.preloadInitGame(gamename, selectedGame, r);
  //     })
  //     .catch((e) => {
  //       console.log("no users were found");
  //       console.log(e);
  //       this.preloadInitGame(gamename, selectedGame, undefined);
  //     })
  // }
  // preloadInitGame(gamename: string, game: Game, challenges: any) {
  //   let friendList: any[];
  //   this.userService.getFriendsAcceptedNotPending()
  //     .then((r) => {
  //       friendList = r;
  //       console.log("userlist");
  //       console.log(JSON.stringify(friendList));

  //       this.checkifjscssfileisloaded(gamename + '.js', "js")
  //         .then((args) => {
  //           if (args === "exist") {
  //             console.log("script is removed");
  //             // this.addJSFile("assets/gamesTest/asteroids/src/game.js");
  //             this.startGame(gamename, 1, game, friendList, challenges);
  //           }
  //         })
  //         .catch((err) => {
  //           console.log("Error removejscssfile")
  //           console.log(err);
  //           this.addJSFile("assets/gamesJavaScript/" + gamename + "/src/" + gamename + ".js");
  //           this.startGame(gamename, 1000, game, friendList, challenges);
  //         })
  //     })
  //     .catch((err: any) => {
  //       console.log("No friends were found");
  //       console.log(err);
  //       this.startGame(gamename, 1000, game, undefined, challenges);
  //     })
  // }
  // startGame(gamename: string, delay: number, game: Game, friends: any[], challenge: any[]) {
  //   setTimeout(() => {
  //     try {
  //       let gameArgs: GameArgs = new GameArgs(challenge, friends, game.savedData);
  //       console.log("gameArgs");
  //       console.log(gameArgs);
  //       window['start_' + gamename](game.windowWidth, game.windowHeight, "container_" + gamename, "assets/gamesJavaScript/" + gamename + "/", JSON.stringify(gameArgs), "casualMode",
  //         (status: string, score: number, game_xp: number, game_id: number, gameArgs: any, unlocklevel: boolean) => {
  //           console.log('game start 1');
  //           console.log(score);
  //           if (status === "Close") {
  //             this.destroyGame(this.selectedGame);
  //             this.selectedGame = "";
  //             this.removeLiveScoreEventListener();
  //           } else if (status === "SaveGame") {
  //             this.cookieService.set("FlappyPlaneSaveGame", JSON.stringify(gameArgs));
  //             this.gamesService.setupusersaveddata(this.selectedGame, game.savedData, gameArgs)
  //               .then((r) => {
  //                 //Cookies.get("FlappyPlaneSaveGame")
  //                 // this.selectedGame;
  //                 console.log("game info is set")
  //               })
  //               .catch((e) => {
  //                 console.log("Error (setupusersaveddata)");
  //                 console.log(e);
  //               })
  //           } else if (status == "LiveScore") {
  //             console.log("LiveScore");
  //             console.log(score);
  //             this.gamesService.updateUserLiveScore(gamename, this.currentUsername, score);
  //           } else if (status == "ChallengeComplete") {
  //             this.gamesService.completeChallenge(this.currentUsername, score, gameArgs.oldScore, this.selectedGame, gameArgs.uid)
  //               .then((r) => {
  //                 console.log("new Challenge completed");
  //                 console.log(r)
  //               })
  //               .catch((e) => {
  //                 console.log("Error completing the challenge");
  //                 console.log(e);
  //               })
  //           } else if (status == "GameOver") {
  //             this.gamesService.saveCasualModeResult(this.selectedGame, score, "" + Date.now())
  //               .then(() => {
  //                 console.log("result saved")
  //               })
  //               .catch((e) => {
  //                 console.log("Error saving casula mode result");
  //                 console.log(e)
  //               })
  //           } else if(status == "ChallengeFriend"){
  //             this.gamesService.challengeFriend(this.userService.user.uid, gameArgs.useruid, this.selectedGame, score, this.currentUsername)
  //             .then(()=>{
  //               console.log("challenge added");

  //             })
  //             .catch((e)=>{
  //               console.log("Error challenging friend");
  //               console.log(e)
  //             })
  //           }
  //         });
  //       this.detectGamesLiveScore(gamename);
  //       this.showHover = false;
  //     } catch (error) {
  //       console.log("error");
  //       console.log(error);
  //     }
  //   }, delay);
  // }
  // prettifyHeader(name: string) {
  //   let newName = name.charAt(0).toUpperCase() + name.slice(1);
  //   return newName;
  // }
  // addJSFile(path: string) {

  //   const script = document.createElement('script');
  //   script.src = path;
  //   document.body.appendChild(script);
  // }
  // checkifjscssfileisloaded(filename: string, filetype: string) {
  //   return new Promise((resolve, reject) => {
  //     let error = true;
  //     var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
  //     var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
  //     var allsuspects = document.getElementsByTagName(targetelement)
  //     for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
  //       if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
  //         // allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
  //         error = false;
  //         resolve("exist");
  //       }
  //     }
  //     if (error) {
  //       reject("does not exist");
  //     }
  //   })

  // }
  // // TO DO update the array
  // detectGamesRatingChange(gamename: string) {
  //   this.gameRatingListener = firebase.database().ref(`games/${gamename}/usersRating`).on('value', (usersRating) => {
  //     if (usersRating.val()) {
  //       let userRate = 0;
  //       let ratesNumber = 0;
  //       let avrgRate = 0;
  //       let rates = usersRating.val();
  //       if (rates) {
  //         for (var ratekey in rates) {
  //           if (ratekey === this.gamesService.user.uid) {
  //             userRate = rates[ratekey].rate;
  //           }
  //           avrgRate += rates[ratekey].rate;
  //           ratesNumber += 1;
  //         }
  //         if (ratesNumber < 1) {
  //           ratesNumber = 1;
  //         }
  //       }
  //       else {
  //         ratesNumber = 1;
  //       }
  //       console.log("User rate data");
  //       console.log({ userRate: userRate, avrgRate: avrgRate });
  //       this.updateGameRate({ userRate: userRate, avrgRate: (avrgRate / ratesNumber) });
  //     }
  //   });
  // }
  // removeGameRatingListener() {
  //   // this.gameRatingListener.off();
  // }

  // detectGamesLiveScore(gamename: string) {

  //   jQuery("#livescore_" + this.selectedGame).kendoGrid({
  //     dataSource: {
  //       data: [],
  //       sort: {
  //         field: "score",
  //         dir: "desc"
  //       },
  //       pageSize: 20
  //     },
  //     scrollable: false,
  //     noRecords: true
  //   });
  //   let nothingToShow = true;
  //   this.listenerLiveScore = firebase.database().ref(`games/${gamename}/livescores`).on('value', (snapshot) => {
  //     // Do whatever
  //     // console.log("gsmes info chnaged");
  //     // console.log(snapshot.val());
  //     this.starttime = Date.now();
  //     var now = Date.now();
  //     var cutoff = now - (30 * 1000);
  //     let object = snapshot.val();
  //     let data = [];

  //     for (let key in object) {
  //       if ((object[key].timestamp > cutoff) && (key !== "admin")) {
  //         nothingToShow = false;
  //         if (this.settimeoutlistener) {

  //           clearTimeout(this.settimeoutlistener);
  //         }
  //         data.push({ name: key, score: object[key].score })
  //       }
  //     }
  //     this.showLiveRezultTable(data);
  //     this.settimeoutlistener = setTimeout(() => {
  //       this.showLiveRezultTable([]);
  //     }, 5000);
  //   });
  //   if (nothingToShow) {
  //     this.showLiveRezultTable([]);
  //   }
  // }
  // removeLiveScoreEventListener() {
  //   // this.listenerLiveScore.off();
  // }
  // showLiveRezultTable(result: any) {
  //   jQuery("#livescore_" + this.selectedGame).data("kendoGrid").dataSource.data(result);


  // }


}
