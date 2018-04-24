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
import { UserAdmin } from '../../types/user-admin.type';


declare let window: any;
declare let jQuery: any;
// declare let game: any;
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'users-admin',
  templateUrl: 'users-admin.component.html',
  styleUrls: ['users-admin.component.css'],
})
export class UsersAdminComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  // currentRate = 2;
  // containerWidth = 0;
  // containerHeight = 0;
  users: UserAdmin[] = [];
  // private gameRatingListener: any;
  // private newGame = "";
  // private listenerLiveScore: any;
  // private settimeoutlistener: any;
  // private selectedGameName:string = ""
  // public changeDisplayedData: boolean = false;
  // @ViewChild('wrapper') wrapper: any;
  // firstLoad = true;
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
              // this.getAllGames();
              // this.onNewGameAdded();
              this.userService.getCurrentUser();
              this.getAllUsers();
              this.onUsersChange();
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
  getAllUsers(){
    this.userService.getUsersData()
    .then((r)=>{
      this.users = r;


    })
    .catch((e)=>{
      console.log("Err (getAllUsers)");
      console.log(e);
    })
  }
  updateUserRT(username:string){
    this.users.forEach((element)=>{
      if(element.username === username){
        this.userService.updateUserRights(element.uid, !element.isAdmin)
        .then((r)=>{
          element.isAdmin = !element.isAdmin;
        })
        .catch((e)=>{
          alert("Could not update user data");
        })
      }
    })
  }
  onUsersChange(){
    firebase.database().ref("users").on('value', (users) => {
      if (users.val()){
        let object = users.val();
        let data:UserAdmin[] = [];
        for(var key in object){
          if(key !== this.userService.user.uid)
              data.push(new UserAdmin(key, object[key].profile_picture, object[key].username, object[key].isAdmin));
        }
        this.users = data;
      }
    })
  }
  // getButtonTitle(args:boolean){
  //   if(args){
  //     return 
  //   }
  //   return args == true ?  : 'Activate'
  // }
  // getAllGames() {
  //   this.gamesService.getCurrentUser();
  //   this.gamesService.getAllGames()
  //     .then((result) => {
  //       console.log("activeGames");
  //       console.log(result);
  //       // result[0].isCollapsed=false;
  //       this.games = result;
  //     })
  //     .catch((err) => {
  //       console.log("Error(activeGames)");
  //       console.log(err)
  //     })
  // }
  // createNewGame() {
  //   console.log("firs tap");
  //   console.log(this.modalService);
  //   let options: NgbModalOptions = {
  //     beforeDismiss: () => { return true },
  //     windowClass: "in"
  //   }

  //   const modalRef = this.modalService.open(NgbdModalCreateGame, options);
  //   modalRef.componentInstance.notification = 'Please enter your username';
  //   modalRef.componentInstance.updateMode = false;
  //   modalRef.componentInstance.game = null;
  //   modalRef.result.then((arg: any) => {
  //     console.log(arg);
  //     if(arg){
  //       this.newGame = arg.newname;
  //     }
  //   })
  // }
  // updateGameInfo(name:string){
  //   this.games.forEach((element)=>{
  //     if(element.name === name){
  //       let options: NgbModalOptions = {
  //         beforeDismiss: () => { return true },
  //         windowClass: "in"
  //       }
    
  //       // const modalRef = this.modalService.open(NgbdModalCreateGame, options);
  //       // modalRef.componentInstance.notification = 'Please enter your username';
  //       // modalRef.componentInstance.updateMode = true;
  //       // modalRef.componentInstance.game = element;
  //       // modalRef.result.then((arg: string) => {
  //       //   console.log(arg);
    
  //       // })
  //     }

  //   })

  // }?

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
