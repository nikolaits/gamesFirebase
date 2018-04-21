import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { UserService } from '../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../types/user_init_info.type';
import * as firebase from "firebase";
import { GamesService } from '../shared/games-service/games.service';
import { Game } from "../types/game.type"

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

  ngOnInit() {

  }
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
  public changeDisplayedData: boolean = false;
  @ViewChild('wrapper') wrapper: any;
  firstLoad = true;
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService) {

  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    console.log("main component ngOnInit2");
  }
  ngAfterViewInit() {
    this.authService.isUserSignIn()
      .then((r: firebase.User) => {
        console.log("user exist");
        this.userService.user = r;
        this.userService.hasUsername()
          .then((r) => {
            console.log(r);
            this.activeGames();
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
  activeGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getGames()
      .then((result) => {
        console.log("activeGames");
        console.log(result);
        // result[0].isCollapsed=false;
        this.games = result;
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
    
      

    let selectedGame = null;
    this.games.forEach((element) => {
      if (gamename === element.name) {
        element.isCollapsed = false;
        selectedGame= element;
      }
      else {
        element.isCollapsed = true;
      }

    })
    this.containerWidth = 400;
    this.containerHeight = 600;
    console.log("Selectedgame "+gamename);
    if(gamename === "asteroids")
      this.preloadInitGame(gamename, selectedGame);
    else{
      this.destroyGame("asteroids");
    }
    

  }
  destroyGame(gamename:string){
    window['destroy_'+gamename]();
  }
  preloadInitGame(gamename:string, game:Game){
    this.checkifjscssfileisloaded(gamename+'.js', "js")
      .then((args) => {
        if (args === "exist") {
          console.log("script is removed");
          // this.addJSFile("assets/gamesTest/asteroids/src/game.js");
          this.startGame(gamename,1, game);
        }
      })
      .catch((err) => {
        console.log("Error removejscssfile")
        console.log(err);
        this.addJSFile("assets/gamesTest/"+gamename+"/src/"+gamename+".js");
        this.startGame(gamename,1000, game);
      })
  }
  startGame(gamename:string, delay:number, game:Game){
    setTimeout(() => {
      try {
        window['start_'+gamename](game.windowWidth, game.windowHeight, gamename, null, "assets/gamesTest/"+gamename+"/",
          (status: string, score: number, game_xp: number, game_id: number, new_game_id: number, unlocklevel: boolean) => {
            console.log('game start 1');
            console.log(score);
          });
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
  // onSubmit(email: string, password: string) {
  //   this.authService.signin(email, password)
  //     .then((r) => {
  //       console.log("Login result");
  //       console.log(r);
  //       console.log("emailVerified" + r.emailVerified);
  //       if (!r.emailVerified) {
  //         alert("Please, visit your mail box and verify your email!");
  //       }
  //       else {
  //         console.log("login");
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.log(e);
  //       alert(`Login Error ${e}`);
  //     })
  // }
  // googleSignIn() {
  //   console.log("googleSignIn");
  //   this.authService.signInGoogle()
  //     .then((result) => {
  //       var token = result.credential.accessToken;
  //       // The signed-in user info.
  //       var user = result.user;
  //       console.log("Token");
  //       console.log(token);
  //       console.log("User");
  //       console.log(user);
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.trace(e);

  //       alert(`Login Error ${e}`);
  //     })
  // }
}
