import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NameListService } from '../../shared/name-list/name-list.service';
import { AuthService } from '../../shared/auth-service/auth.service';
import { UserService } from '../../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../../types/user_init_info.type';
import * as firebase from "firebase";
import { GamesService } from '../../shared/games-service/games.service';
import { Game } from "../../types/game.type"
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewGame } from '../../types/new_game.type';

@Component({
  moduleId: module.id,
  selector: 'create-game',
  styles: [".modal-header{background-color: 000;}   "],
  templateUrl: './game-info.component.html',
})
export class NgbdModalCreateGame {
  @Input() notification: string;
  @Input() game: Game;
  @Input() updateMode: true;
  model: NewGame
  createGameForm: FormGroup;
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private gamesService: GamesService) { }
  public error = false;
  public isEmpty = false;
  public btnDisabled = true
  public buttonName: string = "Save";
  public taken = false;

  ngOnInit() {
    this.model = new NewGame("", 0, 0);
    if (this.updateMode) {
      this.buttonName = "Update"
      this.model.name = this.game.name;
      this.model.windowWidth = this.game.windowWidth;
      this.model.windowHeight = this.game.windowHeight;
      console.log(this.game.windowHeight);
      this.model = new NewGame(this.game.name, this.game.windowWidth, this.game.windowHeight);

    }
    

    this.createGameForm = new FormGroup({
      'name': new FormControl({ value: this.model.name, disabled: this.updateMode }, [
        Validators.nullValidator,
        Validators.required
      ]),
      'windowWidth': new FormControl({ value: this.model.windowWidth }, [
        Validators.nullValidator,
        Validators.required,
        Validators.pattern("^[1-9][0-9]*$")
      ]),
      'windowHeight': new FormControl({ value: this.model.windowHeight }, [
        Validators.nullValidator,
        Validators.required,
        Validators.pattern("^[1-9][0-9]*$")
      ])
    }, );
  }
  get name() { return this.createGameForm.get('name'); }
  get windowWidth() { return this.createGameForm.get('windowWidth'); }
  get windowHeight() { return this.createGameForm.get('windowHeight'); }

  public onSubmit() {
    let name = this.name.value;
    let windowWidth = this.windowWidth.value;
    let windowHeight = this.windowHeight.value;
    if (!this.updateMode) {
      this.gamesService.isGameNameTaken(name)
        .then((r) => {
          if (r === "free") {
            // this.saveUserData(result);
            this.gamesService.createNewGame(name, windowWidth, windowHeight)
              .then((r) => {
                this.activeModal.close({newname:name});
              })
              .catch((err) => {
                console.log("Error create game");
                console.log(err);
              })
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
    else{
      this.gamesService.updateGameInfo(name, windowWidth, windowHeight)
              .then((r) => {
                console.log("game info updated");
                this.activeModal.close();
              })
              .catch((err) => {
                console.log("Error create game");
                console.log(err);
              })
    }

  }
  close() {
    this.activeModal.close();
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
  selector: 'game-admin',
  templateUrl: 'games-admin.component.html',
  styleUrls: ['games-admin.component.css'],
})
export class GamesAdminComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  currentRate = 2;
  containerWidth = 0;
  containerHeight = 0;
  games: Game[] = [];
  private gameRatingListener: any;
  private newGame = "";
  private listenerLiveScore: any;
  private settimeoutlistener: any;
  private selectedGameName:string = ""
  public changeDisplayedData: boolean = false;
  @ViewChild('wrapper') wrapper: any;
  firstLoad = true;
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private navigationService: NavigationService) {

  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    console.log("main component ngOnInit2");
  }
  ngAfterViewInit() {
    //   jQuery("#test").kendoGrid({
    //     dataSource: {
    //         data: [
    //             {name: "Name1", score: 2},
    //             {name: "Name2", score: 22},
    //             {name: "Name3", score: 12}
    //         ],
    //         sort: {
    //             field: "score",
    //             dir: "desc"
    //         },
    //         pageSize: 20
    //     },        
    //     scrollable: false
    // });
    this.authService.isUserSignIn()
      .then((r: firebase.User) => {
        console.log("user exist");
        this.userService.user = r;
        this.userService.isUserAdmin()
          .then((r) => {
            if (!r) {
              this.navigationService.goToMainPage();
            }
            else{
              this.getAllGames();
              this.onNewGameAdded();
            }
          })
          .catch((err) => {
            console.log("Error");
            console.log(err);
            this.navigationService.goToMainPage();
          })
      })
      .catch((e) => {
        console.log("no user found");
        console.log(e);
      });

    // this.detectGamesContentChange();
  }
  // getButtonTitle(args:boolean){
  //   if(args){
  //     return 
  //   }
  //   return args == true ?  : 'Activate'
  // }
  getAllGames() {
    this.gamesService.getCurrentUser();
    this.gamesService.getAllGames()
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
  createNewGame() {
    console.log("firs tap");
    console.log(this.modalService);
    let options: NgbModalOptions = {
      beforeDismiss: () => { return true },
      windowClass: "in"
    }

    const modalRef = this.modalService.open(NgbdModalCreateGame, options);
    modalRef.componentInstance.notification = 'Please enter your username';
    modalRef.componentInstance.updateMode = false;
    modalRef.componentInstance.game = null;
    modalRef.result.then((arg: any) => {
      console.log(arg);
      if(arg){
        this.newGame = arg.newname;
      }
    })
  }
  updateGameInfo(name:string){
    this.games.forEach((element)=>{
      if(element.name === name){
        let options: NgbModalOptions = {
          beforeDismiss: () => { return true },
          windowClass: "in"
        }
    
        const modalRef = this.modalService.open(NgbdModalCreateGame, options);
        modalRef.componentInstance.notification = 'Please enter your username';
        modalRef.componentInstance.updateMode = true;
        modalRef.componentInstance.game = element;
        modalRef.result.then((arg: string) => {
          console.log(arg);
    
        })
      }

    })

  }
  onVisibilityChange(gamename: string) {

    if(this.gameRatingListener){
      this.removeGameRatingListener();
    }

    this.selectedGameName=gamename;
    let selectedGame = null;
    this.games.forEach((element) => {
      if (gamename === element.name) {
        element.isCollapsed = false;
        selectedGame = element;
      }
      else {
        element.isCollapsed = true;
      }

    })

    this.gamesService.getgameratings(this.selectedGameName)
      .then((r)=>{
        console.log("rating result");
        console.log(r);
        this.updateGameRate(r);
      })
      .catch((err)=>{
        console.log("Rating get Error");
      })
      this.detectGamesRatingChange(this.selectedGameName);
      if(this.listenerLiveScore)
        this.removeLiveScoreEventListener();
      this.detectGamesLiveScore(gamename);
  }

  updateGameRate(r:any){
    this.games.forEach((element)=>{
      if(element.name === this.selectedGameName){
        element.avrgRate = r.avrgRate;
        element.userRate = r.userRate;
      }
    })
  }
  detectGamesRatingChange(gamename: string) {
    this.gameRatingListener = firebase.database().ref(`games/${gamename}/usersRating`).on('value', (usersRating) => {
      if (usersRating.val()) {
        let userRate = 0;
        let ratesNumber = 0;
        let avrgRate = 0;
        let rates = usersRating.val();
        if(rates){
          for (var ratekey in rates) {
            if (ratekey === this.gamesService.user.uid) {
              userRate = rates[ratekey].rate;
            }
            avrgRate += rates[ratekey].rate;
            ratesNumber += 1;
          }
          if(ratesNumber <1){
            ratesNumber = 1;
          }
        }
        else{
          ratesNumber = 1;
        }
        console.log("User rate data");
        console.log({userRate:userRate, avrgRate:avrgRate});
        this.updateGameRate({userRate:userRate, avrgRate:(avrgRate/ratesNumber)});
    }
    });
  }
  removeGameRatingListener() {
    // this.gameRatingListener.off();
  }
  prettifyHeader(name: string) {
    let newName = name.charAt(0).toUpperCase() + name.slice(1);
    return newName;
  }
  onNewGameAdded(){
    firebase.database().ref("games").on('child_added', (game) => {
      console.log("on child added");
      console.log(game.val());
      this.games.push(new Game(this.newGame, 0, 0, true, game.val().windowWidth, game.val().windowHeight, undefined, false));
    });
  }
  updateGameSattus(name:string){
    this.games.forEach((element)=>{
      if(element.name === name){
        element.active = !element.active;
        this.gamesService.updateGameStatus(name, element.active)
        .then((r)=>{
          let text = "Deactivated";
          if(element.active){
            text = "Activated"
          }
          alert(`${name} is ${text}`)
        })
      }
    })
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
    let nothingToShow = true;
    this.listenerLiveScore = firebase.database().ref(`games/${gamename}/livescores`).on('value', (snapshot) => {
      // Do whatever
      // console.log("gsmes info chnaged");
      // console.log(snapshot.val());
      var now = Date.now();
      var cutoff = now - (30 * 1000);
      let object = snapshot.val();
      let data = [];
      let activeUsers = 0;
      for (let key in object) {
        if ((object[key].timestamp > cutoff)&&(key !=="admin")) {
          nothingToShow = false;
          activeUsers += 1;
          if (this.settimeoutlistener) {

            clearTimeout(this.settimeoutlistener);
          }
          
        }
      }
      data.push({ name: "active users", number: activeUsers })
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
    if (result.length < 1) {
      jQuery("#livedata_" + this.selectedGameName).kendoGrid({
        dataSource: {
          data: [{
            name:"",
            number:"no active users"
          }],
          sort: {
            field: "number",
            dir: "desc"
          },
          pageSize: 20
        },
        scrollable: false
      });
    }
    else {
      jQuery("#livedata_" + this.selectedGameName).kendoGrid({
        dataSource: {
          data: result,
          sort: {
            field: "score",
            dir: "desc"
          },
          pageSize: 20
        },
        scrollable: false
      });
    }
  }
  

  // detectGamesContentChange() {
  //   firebase.database().ref("games/").on('value', (games) => {
  //     // Do whatever
  //     // console.log("gsmes info chnaged");
  //     // console.log(snapshot.val());
  //     if (games.val()) {
  //       let gamesArray = [];
  //       let object = games.val();
  //       for (var key in object) {
  //         let userRate = 0;
  //         let ratesNumber = 0;
  //         let avrgRate = 0;
  //         console.log(key);
  //         console.log(object[key].active);
  //         let rates = object[key].usersRating;
  //         if (rates) {
  //           for (var ratekey in rates) {
  //             avrgRate += rates[ratekey].rate;
  //             ratesNumber += 1;
  //           }
  //         }
  //         else {
  //           ratesNumber = 1;
  //         }
  //         gamesArray.push(new Game(key, userRate, avrgRate / ratesNumber, true, object[key].windowWidth, object[key].windowHeight, undefined));
  //       }
  //       this.games = gamesArray;
  //     }
  //   });
  // }

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
