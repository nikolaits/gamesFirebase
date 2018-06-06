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

declare let jQuery: any;

@Component({
  moduleId: module.id,
  selector: 'sd-result',
  templateUrl: 'season-result.component.html',
  styleUrls: ['season-result.component.css'],
})
export class SeasonResultComponent implements OnInit {
  public selectedGame = "";
  public changeDisplayedData: boolean = false;
  public showHover: boolean = false;
  public showFriendList: boolean = false;
  public isUnlockedSeason: boolean = true;
  private username:string = "";
 

  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService, private gamesService: GamesService, private cookieService: CookieService, private navigationService: NavigationService) {

  }

  ngOnInit() {
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
            console.log("username");
            console.log(r);
            this.username = r;
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

      
  }
  onChallengeSelected(gamename: string) {
    this.cookieService.set("challengeSelectedEvent", gamename);
    this.navigationService.goToMainPage();
  }
  openFriendList() {
    this.showFriendList = true;

  }
  closeFriendList() {
    this.showFriendList = false;
  }
  onSeasonModeResult() {
    // let username = this.cookieService.get("geitUsername");
    firebase.database().ref(`users/`).on('value', (snapshot) => {
      if (snapshot.val()) {
        let object = snapshot.val();
        let userResults:any[] =[];
        let otherUserResults:any[] =[];
        let result:any[] =[];
        for(let key in object){
          
          for(let innerKey in object[key].seasonmoderesults){
            if(object[key].username === this.username){
              userResults.push({username: object[key].username,score: Math.floor(object[key].seasonmoderesults[innerKey].score) + " points", duration:(object[key].seasonmoderesults[innerKey].duration/1000 + " seconds")});
          
            }
            else{
             otherUserResults.push({username: object[key].username,score: Math.floor(object[key].seasonmoderesults[innerKey].score) + " points", duration:(object[key].seasonmoderesults[innerKey].duration/1000 + " seconds")});
            }
          }
        }
        result = otherUserResults.concat(userResults);
        console.log("result");
        console.log(result)
        jQuery("#seasonmodeResult").data("kendoGrid").dataSource.data(result);
      }
    });
  }
  
}
