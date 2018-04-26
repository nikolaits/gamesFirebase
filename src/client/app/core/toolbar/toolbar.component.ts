import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../shared/user-service/user.service';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { NgbModalOptions, NgbModal, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from "../update/update.component"
import  * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import { Challenge } from '../../types/challenge.type';
import { GamesService } from '../../shared/games-service/games.service';
import { ChallengeComplete } from '../../types/challenge_complete.type';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ToolbarComponent {
  public imageUrl: string = "https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/def_profile_picture.png?alt=media&token=fb6c2ff5-8efc-4ae9-a477-85393611338b";
  public username: string = '';
  public challengesList:Challenge[]=[];
  public hiddenInfo:boolean= false;
  public info:any[] = [];
  private _changeUserDisaplyedData = false;
  public isCollapsed = true;
  @Output() open: EventEmitter<any> = new EventEmitter();
  @Output() challengeSelect: EventEmitter<any> = new EventEmitter();
  @Input() set changeUserDisaplyedData(value: boolean) {

    this._changeUserDisaplyedData = value;
    if(this._changeUserDisaplyedData){
      this.displayData();
    }

  }
  get changeUserDisaplyedData(): boolean {

    return this._changeUserDisaplyedData;

  }
  constructor(private modalService: NgbModal, private userService:UserService, private authService:AuthService, private navigationService:NavigationService, private cookiesService:CookieService,config: NgbPopoverConfig, private gamesService:GamesService){
    config.placement = 'bottom-right';
    config.container
    
  }
  ngAfterViewInit(){
    console.log("take user")
    this.authService.isUserSignIn()
    .then((r:firebase.User)=>{
      console.log("user exist");
      this.userService.user = r;
      this.displayData();
      this.challengesListener();
      this.gamesService.getCurrentUser();
      this.checkForCompleteChallenges();
    })
    .catch((e)=>{
      console.log("no user found");
      console.log(e);
    })
  }
  private displayData(){
    this.userService.hasUsername()
      .then((r)=>{
        console.log(r);
        this.userService.getUserUsernameAndProfilePicture()
        .then((info:UserInitInfo)=>{
          console.log("userinfo")
          console.log(info);
          this.imageUrl = info.profile_picture;
          this.username = info.username;
        })
        .catch((err)=>{
          console.log("Error");
          console.log(err);
        })
      })
      .catch((e)=>{
        console.log("Error:");
        console.log(e);
      })
  }
  public onLogOut(){
    this.authService.logOut()
    .then(()=>{
      this.navigationService.goToSignIn();
    })
    .catch((e)=>{
      console.log("Can not logout");
      console.log(e);
    })
  }
  updateInfo() {
    this.isCollapsed = true;
    let options: NgbModalOptions = {
      beforeDismiss: () => {  return true },
      windowClass: "in"
    }
    
    const modalRef = this.modalService.open(UpdateComponent, options);
    modalRef.componentInstance.notification = 'Please enter your username';
    modalRef.componentInstance.change.subscribe((arg:any)=>{
      switch (arg.message) {
        case "usernameUpdated":
            this.username = arg.result;
          break;
        case "profilePictureUpdated":
            this.imageUrl = arg.result;
          break;
      
      
        default:
          break;
      }

    })
    modalRef.result.then((arg:string)=>{
      console.log(arg);
    })
  }
  openFriendLis(){
    this.cookiesService.set("isFriendListOpened", "yes");
    this.open.emit();
  }
  gameSelected(gamename:string){
    this.challengeSelect.emit(gamename);
  }
  challengesListener(){
    console.log("challengesListener")
    let useruid = this.userService.user.uid;
    firebase.database().ref(`users/${useruid}/challenges/`).on('value', (snapshot) => {
      let array:Challenge[] = [];
      if(snapshot.val()){
        let object = snapshot.val();
        for(let key in object){
          let frienduid = "";
          for(let friendkey in object[key]){
            frienduid = friendkey;
          }
          array.push(new Challenge(key,object[key][frienduid].username, object[key][frienduid].score, frienduid))
        }
      }
      console.log(array);
      this.challengesList = array;
    })
    
  }
  hideInfo(){
    this.hiddenInfo = false;
  }
  checkForCompleteChallenges(){
    this.gamesService.getGameCompletedChallenges()
      .then((r) => {
        console.log("new completed challenges");
        console.log(r)
        r.forEach((element:ChallengeComplete) => {
          
          if(element.friendscore>element.challengescore){
            this.info.push(`${element.friendusername} win the ${element.gamename} challenge with ${element.friendscore} points`);
          }
          else{
            this.info.push( `${element.friendusername} lose the ${element.gamename} challenge with ${element.friendscore} points`);
          }
          console.log("Infoooooooooooo");
          console.log(this.info);
          this.hiddenInfo = true;
          this.gamesService.removeCompleteChallenge(element.timestamp);
        });
      })
      .catch((e) => {
        console.log("no new completed challenges");
        console.log(e);
      })
  }
}

