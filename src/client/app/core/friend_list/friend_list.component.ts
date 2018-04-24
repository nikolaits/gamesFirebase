import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../shared/user-service/user.service';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from "../update/update.component"
import * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import { AddFriendComponent } from "../addfriend/addfriend.component";
import { Friend } from '../../types/friend.type';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'friend-list',
  templateUrl: 'friend_list.component.html',
  styleUrls: ['friend_list.component.css']
})
export class FriendListComponent {

  @Output() close: EventEmitter<any> = new EventEmitter();
  public friendList: Friend[] = [];
  public users: Friend[] = [];
  closeNav() {
    this.cookiesService.set("isFriendListOpened", "no");
    this.close.emit();

  }
  constructor(private modalService: NgbModal, private userService: UserService, private authService: AuthService, private navigationService: NavigationService, private cookiesService: CookieService) { }
  ngAfterViewInit() {
    // this.userService.getFriends()
    // .then((r)=>{
    //   // this.friendList = r;
    //   console.log("userlist");
    //   // console.log(this.friendList);
    //   r.forEach((element:Friend) => {
    //     if((element.accepted === true)&&(element.pending ===true)){
    //       this.users.push(element);
    //     }
    //     else if((element.accepted === true)&&(element.pending ===false)){
    //       this.friendList.push(element);
    //     }
    //   });
    // })
    // .catch((e)=>{
    //   console.log("No friends were found");
    //   console.log(e);
    // })
    this.detectListChange();
  }

  addFriend() {
    let options: NgbModalOptions = {
      beforeDismiss: () => { return true },
      windowClass: "in"
    }

    const modalRef = this.modalService.open(AddFriendComponent, options);

    modalRef.result.then((arg: any) => {
      console.log(arg);
    })
  }
  removeFriend(uid: string) {
    let crntuid = this.userService.user.uid;
    this.userService.deleteFriendInTheList(uid, crntuid)
      .then((r) => {
        this.userService.deleteFriendInTheList(crntuid, uid)
      })
      .catch((e) => {
        console.log("err");
        console.log(e)
      });
  }
  approvalFriend(uid: string) {
    console.log(uid)
    let crntuid = this.userService.user.uid;
    this.userService.updateFriendInTheList(uid, true, false, crntuid)
      .then((r) => {
        this.userService.updateFriendInTheList(crntuid, true, false, uid)
      })
      .catch((e) => {
        console.log("err");
        console.log(e)
      });
  }
  declineFriend(uid: string) {
    let crntuid = this.userService.user.uid;
    this.userService.deleteFriendInTheList(uid, crntuid)
      .then((r) => {
        this.userService.deleteFriendInTheList(crntuid, uid)
      })
      .catch((e) => {
        console.log("err");
        console.log(e)
      });
  }
  detectListChange() {
    firebase.database().ref(`users/${this.userService.user.uid}/friends`).on('value', (snapshot) => {
      if (this.users !== undefined) {
        while (this.users.length) {
          this.users.pop();
        }
      }
      else {
        this.users = [];
      }
      if (this.friendList !== undefined) {
        while (this.friendList.length) {
          this.friendList.pop();
        }
      }
      else {
        this.friendList = [];
      }
      console.log("friend get");
      console.log(snapshot.val());
      if (snapshot.val()) {
        let object = snapshot.val();
        for (let key in object) {
          const element = object[key];
          if ((element.accepted === true) && (element.pending === true)) {
            this.users.push(new Friend(key, element.username, element.accepted, element.pending));
          }
          else if ((element.accepted === true) && (element.pending === false)) {
            this.friendList.push(new Friend(key, element.username, element.accepted, element.pending));
          }
        }
      }
    });
  }
}

