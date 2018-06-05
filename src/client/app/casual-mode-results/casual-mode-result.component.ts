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
let callbackFuncton: any = null;
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
  public isFirstLoad: boolean = true;
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
      gameSeasonMode.time.events.loop(Phaser.Timer.SECOND / 100, () => {
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
        else if (this.isFirstLoad) {
          this.isFirstLoad = false;
          callbackFuncton("mazeLoaded");
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
    }
    this.mazeGraphics.endFill();
    this.mazeGraphics.beginFill(0xff0000);
    this.mazeGraphics.drawRect(posY * this.tileSize, posX * this.tileSize, this.tileSize, this.tileSize);
    this.mazeGraphics.endFill();
  }

}
class TargetPosition {
  constructor(public positionY: number, public positionX: number, public gamename: string) { }
}
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'casual-mode-result.component.html',
  styleUrls: ['casual-mode-result.component.css'],
})
export class CasualModeResultComponent implements OnInit {

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
  public isUnlockedSeason: boolean = true;
  private isDrawing = true;
  private startPosX: number = 1;
  private startPosY: number = 1;
  private targetPositions: TargetPosition[];
  private selectedTarget: TargetPosition;
  private selectedTargetIndex: number;
  private startPlayingTime: any;
  private ifFirstStart: boolean = true;
  private gamesResults: number[];
  // private currentUsername = "";
  // private listenerLiveScore: any;
  // private gameRatingListener: any;
  // private settimeoutlistener: any;
  // private firstLoad = true;
  // private starttime = Date.now();


  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private cookieService: CookieService, private navigationService: NavigationService) {

  }

  ngOnInit() {
    this.gamesResults = []
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
        this.userService.user = r;
        this.userService.hasUsername()
          .then((r) => {
            this.activeGames();
            this.gamesService.getCurrentUser();
            this.onSeasonModeUnlockListener();
            this.onSeasonModeResult();
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
    callbackFuncton = (result: any) => {
      if (result === "mazeLoaded") {
        this.generateRandPlaces();
        // this.drawTargets();
        this.isDrawing = false;
      }
      else if (result === "pathDraw") {
        jQuery("#seasonmodeContainer").fadeOut("slow", () => {
          // Animation complete.
          this.showHover = true;
          this.games.forEach((elem) => {
            if (elem.name === this.selectedTarget.gamename) {
              this.preloadInitGame(this.selectedTarget.gamename, elem, undefined);
            }
          })
        });

      }
      this.isDrawing = false;
    }
    // this.startPlayingTime = Date.now();
    // this.gamesResults.push(5);

    // this.gamesResults.push(4);
    // this.gamesResults.push(5);
    // setTimeout(() => {
    //   let result = 0
    //   this.gamesResults.forEach(element => {
    //     result = result + element;
    //   });
    //   let endTime = Date.now();
    //   let timestamptmp = "" + endTime;
    //   let duration = endTime - this.startPlayingTime;
    //   this.gamesService.saveSeasonModeResult(result, timestamptmp, duration)
    //     .then((r) => {
    //       console.log("Result:");
    //       alert("Season mode completed");
    //     })
    //     .catch((errsmode) => {
    //       console.log("Error");
    //       console.log(errsmode);
    //     })
    // }, 3000);
    jQuery("#seasonmodeResult").kendoGrid({
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
      
  }

  activeGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getGames()
      .then((result) => {
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
    this.cookieService.set("challengeSelectedEvent", gamename);
    this.navigationService.goToMainPage();
  }

  initSeasonMode() {
    //seasonmodeContainer
    gameSeasonMode = new Phaser.Game(810, 610, Phaser.CANVAS, "seasonmodeContainer");
    gameSeasonMode.state.add("PlayGame", playGame);
    gameSeasonMode.state.start("PlayGame");

    setTimeout(() => {
      gameSeasonMode.input.onTap.add((pointer: any, doubleTap: any) => {
        console.log("onTap");
        console.log(Math.floor(pointer.x / 20));
        console.log(Math.floor(pointer.y / 20));
        console.log(doubleTap);
        let pointerX = Math.floor(pointer.x / 20);
        let pointerY = Math.floor(pointer.y / 20)
        let maze = gameSeasonMode.state.states.PlayGame.maze;
        if ((doubleTap) && (maze[pointerY][pointerX] === 0) && (!this.isDrawing)) {
          let isPositionFromTargets = false;
          let targetIndex;
          for (let i = 0; i < this.targetPositions.length; i++) {
            if ((this.targetPositions[i].positionX === pointerX) && (this.targetPositions[i].positionY === pointerY)) {
              isPositionFromTargets = true;
              this.selectedTarget = this.targetPositions[i];
              targetIndex = i;
            }

          }
          if (isPositionFromTargets) {
            this.targetPositions.splice(targetIndex, 1);
            var easystar = new EasyStar.js();
            try {
              this.isDrawing = true;
              easystar.setGrid(maze);
              easystar.setAcceptableTiles([0]);
              easystar.findPath(this.startPosX, this.startPosY, pointerX, pointerY, this.drawPath);
              easystar.calculate();
              this.startPosX = pointerX;
              this.startPosY = pointerY;
            } catch (error) {
              console.log(error);
            }
          }


        }
      })
    }, 500);

  }
  drawPath(path: any) {
    var i = 0;
    let playGame = gameSeasonMode.state.states.PlayGame;
    let colorsPalette = [
      0x00ffff,
      0xf0ffff,
      // 0xf5f5dc,
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
    var color = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
    let finishDrawing = false;
    gameSeasonMode.time.events.loop(Phaser.Timer.SECOND / 25, () => {
      if (i < path.length) {
        playGame.mazeGraphics.beginFill(color);
        playGame.mazeGraphics.drawRect(path[i].x * playGame.tileSize + 3, path[i].y * playGame.tileSize + 3, playGame.tileSize - 6, playGame.tileSize - 6);
        i++;
        playGame.mazeGraphics.endFill();
      }
      else if (!finishDrawing) {
        finishDrawing = true;
        callbackFuncton("pathDraw");

      }
    })
  }
  generateRandPlaces() {
    let number = this.games.length;
    this.targetPositions = [];
    let tmpYPos = []
    let endposition = (gameSeasonMode.state.states.PlayGame.maze.length) - 2;
    let maze = gameSeasonMode.state.states.PlayGame.maze;
    console.log("maze");
    console.log(maze);
    console.log("generateRandPlaces")
    for (let index = 0; index < number; index++) {
      let psY = Math.floor(Math.random() * endposition) + 2;
      let tmpArrayXs = [];
      console.log("Result generate");
      console.log("Rand y:");
      console.log(psY);
      for (let j = 0; j < maze[psY].length; j++) {
        if (maze[psY][j] === 0) {
          tmpArrayXs.push(j);
        }
      }
      console.log("Rand x index");
      const psXindex = Math.floor(Math.random() * tmpArrayXs.length);
      let xNumber = tmpArrayXs[psXindex];
      this.targetPositions.push(new TargetPosition(psY, xNumber, this.games[index].name));
      console.log(psXindex);
      console.log("Array");
      console.log(tmpArrayXs);
      console.log("Position from array");
      console.log(tmpArrayXs[psXindex]);
      console.log("Maze position");
      console.log(maze[psY][xNumber]);
    }
    this.drawTargets();
    // console.log("Targen positions");
    // console.log(this.targetPositions[0])
    // console.log(this.targetPositions[1])
  }
  drawTargets() {
    //0xf5f5dc
    this.targetPositions.forEach((element: TargetPosition) => {
      let playGame = gameSeasonMode.state.states.PlayGame;
      playGame.mazeGraphics.endFill();
      playGame.mazeGraphics.beginFill(0xf5f5dc);
      playGame.mazeGraphics.drawRoundedRect(element.positionX * playGame.tileSize, element.positionY * playGame.tileSize, playGame.tileSize, playGame.tileSize);
      playGame.mazeGraphics.endFill();
    })

  }

  destroyGame(gamename: string) {
    window['destroy_' + gamename]();
  }

  preloadInitGame(gamename: string, game: Game, challenges: any) {

    this.checkifjscssfileisloaded(gamename + '.js', "js")
      .then((args) => {
        if (args === "exist") {
          this.startGame(gamename, 1, game, undefined, challenges);
        }
      })
      .catch((err) => {
        console.log("Error removejscssfile")
        console.log(err);
        this.addJSFile("assets/gamesJavaScript/" + gamename + "/src/" + gamename + ".js");
        this.startGame(gamename, 1000, game, undefined, challenges);
      })
  }
  startGame(gamename: string, delay: number, game: Game, friends: any[], challenge: any[]) {
    if (this.ifFirstStart) {
      this.startPlayingTime = Date.now();
      this.ifFirstStart = false;
      
    }
    let currentUsername = this.cookieService.get("geitUsername");
    setTimeout(() => {
      try {
        let gameArgs: GameArgs = new GameArgs(challenge, friends, game.savedData);
        window['start_' + gamename](game.windowWidth, game.windowHeight, "container_game", "assets/gamesJavaScript/" + gamename + "/", JSON.stringify(gameArgs), "seasonMode",
          (status: string, score: number, game_xp: number, game_id: number, gameArgs: any, unlocklevel: boolean) => {

            if (status == "GameOver") {
              this.gamesResults.push(score);
              this.destroyGame(this.selectedTarget.gamename);
              jQuery("#seasonmodeContainer").fadeIn("slow", () => {
                
              });
              if (this.targetPositions.length < 1) {
                let result = 0
                this.gamesResults.forEach(element => {
                  result = result + element;
                });
                let endTime = Date.now();
                let timestamptmp = "" + endTime;
                let duration = endTime - this.startPlayingTime;
                this.gamesService.saveSeasonModeResult(result, timestamptmp, duration)
                  .then((r) => {
                    console.log("Result:");
                    alert("Season mode completed");
                    this.navigationService.goToMainPage();
                  })
                  .catch((errsmode) => {
                    console.log("Error");
                    console.log(errsmode);
                  })
              }
            }

          });
        // this.detectGamesLiveScore(gamename);
        this.showHover = false;
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    }, delay);
  }
  // prettifyHeader(name: string) {
  //   let newName = name.charAt(0).toUpperCase() + name.slice(1);
  //   return newName;
  // }
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
  onSeasonModeUnlockListener() {
    // let username = this.cookieService.get("geitUsername");
    firebase.database().ref(`users/${this.userService.user.uid}/`).on('value', (snapshot) => {
      if ((snapshot.val()) && (snapshot.val().isSeasonModeUnlocked)) {
        if (snapshot.val().isSeasonModeUnlocked === true) {
          this.isUnlockedSeason = true;
        }
        else {
          this.navigationService.goToMainPage();
        }
      }
      else {
        this.navigationService.goToMainPage();
      }
    });
  }
  onSeasonModeResult() {
    // let username = this.cookieService.get("geitUsername");
    firebase.database().ref(`users/${this.userService.user.uid}/seasonmoderesults`).on('value', (snapshot) => {
      if (snapshot.val()) {
        let object = snapshot.val();
        let result:any[] =[];
        for(let key in object){
          result.push({score: Math.floor(object[key].score) + " points", duration:(object[key].duration/1000 + " seconds")});
        }
        jQuery("#seasonmodeResult").data("kendoGrid").dataSource.data(result);
      }
    });
  }
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
