import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../shared/user-service/user.service';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from "../update/update.component"
import  * as firebase from "firebase";
import { CookieService } from 'ng2-cookies';
import {AddFriendComponent} from "../addfriend/addfriend.component";
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
  public friendList:Friend[];
  closeNav(){
    this.cookiesService.set("isFriendListOpened", "no");
    this.close.emit();

  }
  constructor(private modalService: NgbModal, private userService:UserService, private authService:AuthService, private navigationService:NavigationService, private cookiesService:CookieService){}
  ngAfterViewInit(){
    this.userService.getFriends()
    .then((r)=>{
      this.friendList = r;
      console.log("userlist");
      console.log(this.friendList);
    })
    .catch((e)=>{
      console.log("No friends were found");
      console.log(e);
    })
  }

  addFriend() {
    let options: NgbModalOptions = {
      beforeDismiss: () => {  return true },
      windowClass: "in"
    }
    
    const modalRef = this.modalService.open(AddFriendComponent, options);
    
    modalRef.result.then((arg:any)=>{
      console.log(arg);
    })
  }
}

