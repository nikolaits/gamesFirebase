import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/user-service/user.service';
import { UserUpdate } from "../../types/user_update.type"
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EqualValidatorDirective } from '../../signup/equal-validator.directive';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import * as firebase from "firebase";
import { ImageCropperComponent, CropperSettings } from "ngx-img-cropper";
import { AddFriend } from '../../types/add_friend.type';
import { UserAdmin } from '../../types/user-admin.type';
import { CookieService } from 'ng2-cookies';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'add-friend-module',
  templateUrl: 'addfriend.component.html',
  styleUrls: ['addfriend.component.css']
})
export class AddFriendComponent {
  public saveUsername = false;
  private username:string = "";
  public userslist: AddFriend[] = [];
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private authService: AuthService, private cookiesService:CookieService) {

  }
  ngOnInit() { }
  ngAfterViewInit() {
    this.userService.getCurrentUser();
    let friendList: any[];
    let userlist:any[];
    this.username = this.cookiesService.get("geitusername")
    
    this.userService.getUsersListData()
      .then((r) => {
        userlist=r;
        console.log(r)
        this.userService.getFriends()
          .then((rs) => {
            console.log(rs);
            friendList = rs;
            console.log("userlist");

            userlist.forEach((element: any) => {
              console.log("-----"+element.username);
              let isUserFound = false;
              friendList.forEach(element2 => {
                console.log("-"+element2.username);
                if (element.uid === element2.uid){
                  isUserFound=true;
                }
              });
              if(!isUserFound){
                this.userslist.push(element);
              }
            });



          })
          .catch((err) => {
            console.log("Error no friends")
            console.log(err);
            this.userslist=userlist;
          })
      })
      .catch((e) => {
        console.log("Error loading users");
        console.log(e)
      })

  }
  addFriendsButton() {
    let uid = this.userService.user.uid;
    this.userslist.forEach((element) => {
      if (element.addFriend === true) {
        console.log(element.username);
        this.userService.addFriendInTheList(element.uid, element.username,false, true, uid)
        .then((r)=>{
          this.userService.addFriendInTheList(uid, this.username, true, true, element.uid)
        })
        .catch((e)=>{
          console.log("err");
          console.log(e)
        });
      }
    })
    this.activeModal.close();
  }
  selectionChange(name: string) {
    this.userslist.forEach(element => {
      if (element.username === name) {
        element.addFriend = !element.addFriend;
      }
    });

  }
  onModalClose() {
    this.activeModal.close();
  }

}

