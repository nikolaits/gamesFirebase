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
  selector: 'sd-home',
  templateUrl: 'casual-mode-result.component.html',
  styleUrls: ['casual-mode-result.component.css'],
})
export class CasualModeResultComponent implements OnInit {

  public selectedGame = "";
  public changeDisplayedData: boolean = false;
  public showHover: boolean = false;
  public showFriendList: boolean = false;
  public isUnlockedSeason: boolean = true;
  private username: string = "";


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
            jQuery("#btnSearch").kendoButton({
              click:this.onSearch
            })
            jQuery("#casualmodeResult").kendoGrid({
              dataSource: {
                data: [],
                sort: {
                  field: "score",
                  dir: "desc"
                },
                pageSize: 100
              },
              sortable: {
                mode: "multiple",
                allowUnsort: true,
                showIndexes: true
              },
              pageable: {
                buttonCount: 5
              },
              scrollable: false,
              noRecords: true,
              columns: [
                {
                    field: "username",
                    title: "Username",
                    width: 300
                },
                {
                    field: "gamename",
                    title: "Gamename",
                    width: 300
                },
                {
                  field: "score",
                  title: "Score (points)",
                  width: 300
                },
                {
                    field: "date",
                    title: "Date",
                    format: "{0:d}"
                }
            ]
            });
            this.onCasualModeResult();
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
  onSearch()
  {
    var q = jQuery("#txtSearchString").val();
        var grid = jQuery("#casualmodeResult").data("kendoGrid");
        grid.dataSource.query({
          page:1,
          pageSize:20,
          filter:{
            logic:"or",
            filters:[
              {field:"username", operator:"contains",value:q},
              {field:"gamename", operator:"contains",value:q},
              // {field:"score", operator:"contains",value:q},
              // {field:"date", operator:"contains",value:q}
              ]
          }
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
  onCasualModeResult() {
    // let username = this.cookieService.get("geitUsername");
    firebase.database().ref(`users/`).on('value', (snapshot) => {
      if (snapshot.val()) {
        let object = snapshot.val();
        let userResults: any[] = [];
        let otherUserResults: any[] = [];
        let result: any[] = [];
        for (let key in object) {

          for (let innerKey in object[key].casualmoderesults) {
            for (let gameKey in object[key].casualmoderesults[innerKey]) {
              if (object[key].username === this.username) {
                userResults.push({ username: object[key].username, gamename: innerKey, score: Math.floor(object[key].casualmoderesults[innerKey][gameKey].score), date: this.formatDate(new Date(Number(gameKey))) });

              }
              else {
                userResults.push({ username: object[key].username, gamename: innerKey, score: Math.floor(object[key].casualmoderesults[innerKey][gameKey].score), date: this.formatDate(new Date(Number(gameKey))) });
              }
            }
          }
        }
        result = otherUserResults.concat(userResults);
        console.log("result");
        console.log(result)
        jQuery("#casualmodeResult").data("kendoGrid").dataSource.data(result);
      }
    });
  }
  formatDate(date: Date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];


    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' '
      + hour + ':' + minutes + ':' + seconds;
  }
}
