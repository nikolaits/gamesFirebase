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
  public userslist: AddFriend[] = [];
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private authService: AuthService) {

  }
  ngOnInit() { }
  ngAfterViewInit() {
    this.userService.getCurrentUser();
    let friendList: any[];
    let userlist:any[];
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
              friendList.forEach(element2 => {
                if (element.uid !== element2.uid)
                  this.userslist.push(r);
              });
            });



          })
          .catch((err) => {
            console.log("Error removejscssfile")
            console.log(err);
          })
      })
      .catch((e) => {
        console.log("Error loading users");
        console.log(e)
      })

  }
  addFriendsButton() {
    this.userslist.forEach((element) => {
      if (element.addFriend === true) {
        console.log(element.username);
        this.userService.addFriendInTheList(element.uid, element.username);
      }
    })
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

