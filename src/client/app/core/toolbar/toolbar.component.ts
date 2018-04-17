import { Component, Input } from '@angular/core';
import { UserService } from '../../shared/user-service/user.service';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import { NavigationService } from '../../shared/navigation-service/navigation.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateComponent } from "../update/update.component"
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
  private _changeUserDisaplyedData = false;
  public isCollapsed = true;
  @Input() set changeUserDisaplyedData(value: boolean) {

    this._changeUserDisaplyedData = value;
    if(this._changeUserDisaplyedData){
      this.displayData();
    }

  }
  get changeUserDisaplyedData(): boolean {

    return this._changeUserDisaplyedData;

  }
  constructor(private modalService: NgbModal, private userService:UserService, private authService:AuthService, private navigationService:NavigationService){}
  ngAfterViewInit(){
    console.log("take user")
    this.authService.isUserSignIn()
    .then((r:firebase.User)=>{
      console.log("user exist");
      this.userService.user = r;
      this.displayData();
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
  unpdateInfo() {
    let options: NgbModalOptions = {
      beforeDismiss: () => {  return true },
      windowClass: "in"
    }
    
    const modalRef = this.modalService.open(UpdateComponent, options);
    modalRef.componentInstance.notification = 'Please enter your username';
    modalRef.result.then((arg:string)=>{
      if(arg === "usernameUpdated"){
        this.displayData();
      }
    })
  }
}

