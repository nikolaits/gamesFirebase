import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { NavigationService } from '../shared/navigation-service/navigation.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import {PasswordResetComponent} from "../core/password.reset.component/password.reset.component"

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  newName = '';
  errorMessage: string;
  names: any[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(public nameListService: NameListService,private modalService:NgbModal, private authService: AuthService, private navigation:NavigationService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
  //  let userPromise = 
   this.authService.isUserSignIn()
   .then((r)=>{
     console.log("authService");
     console.log(r.emailVerified);
    if(r.emailVerified){
     console.log("user exist");
      this.navigation.goToMainPage();
    }
   })
   .catch((e)=>{
     console.log("no user found");
     console.log(e);
   })
  //  if(userPromise !== null){
  //    userPromise
  //    .then((result)=>{
  //     console.log("user token login");
  //     console.log(result);
  //    })
  //    .catch((e)=>{
  //       console.log("Login Error");
  //       console.log(e);
  //       alert(`Login Error ${e}`);
  //     })
  //  }else{
  //    console.log("user token does not exists");
  //  }
  }

  onSubmit(email:string, password:string){
    this.authService.signin(email, password)
    .then((r)=>{
      console.log("Login result");
      console.log(r);
      console.log("emailVerified");
      console.log(r.emailVerified);
      if((r.code==="auth/user-not-found")||(r.code === "auth/invalid-email"))
        alert("Please check if you have entered correct email/password.");
       else if(!r.emailVerified){
          alert("Please, visit your mail box and verify your email!");
      }
      else{
        console.log("login");
        var token = r.refreshToken;
        this.authService.saveSignInToken(token);
        this.navigation.goToMainPage();
      }
    })
    .catch((e)=>{
      console.log("Login Error");
      console.log(e);
      
      // alert(`Login Error ${e}`);
    })
  }
  googleSignIn(){
    console.log("googleSignIn");
    this.authService.signInGoogle()
    .then((result)=>{
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log("Token");
      console.log(token);

      this.authService.saveSignInToken(token);
      console.log("User");
      console.log(user);
      console.log("uid "+user.uid);
      // user.
      this.navigation.goToMainPage();
    })
    .catch((e)=>{
      console.log("Login Error");
      console.trace(e);
      
      alert(`Login Error ${e}`);
    })
  }

  facebookSignIn(){
    this.authService.signInFacebook()
    .then((result)=>{
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      this.authService.saveSignInToken(token);
      // user.
      this.navigation.goToMainPage();
    })
    .catch((e)=>{
      console.log("Login Error");
      console.trace(e);
      
      alert(`Login Error ${e}`);
    })
  }
  onPasswordReset(){
    let options: NgbModalOptions = {
      beforeDismiss: () => {  return true },
      windowClass: "in"
    }
    
    const modalRef = this.modalService.open(PasswordResetComponent, options);
    modalRef.result.then((arg:string)=>{
      if(arg === "sent"){
        alert("Password reset email has been sent");
      }
    })
  }
}
