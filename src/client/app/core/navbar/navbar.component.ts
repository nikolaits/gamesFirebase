import { Component } from '@angular/core';
import {AuthService} from "../../shared/auth-service/auth.service";
import {NavigationService} from "../../shared/navigation-service/navigation.service"
import { UserService } from '../../shared/user-service/user.service';
import * as  firebase from 'firebase';
/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class NavbarComponent {
  public isAdmin:boolean = false;
  constructor(private userService:UserService){
    
  }
  ngAfterViewInit(){
    setTimeout(() => {
      this.userService.getCurrentUser()
      this.userService.isUserAdmin()
      .then((r:boolean)=>{
        this.isAdmin=r;
        console.log("isUseradmin");
        console.log(r);
      })
      .catch((e)=>{
        console.log("Error isUserAdmin");
        console.log(e);
      })
  }, 500);
    
  }
}
