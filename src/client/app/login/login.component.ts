import { Component, OnInit } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { CookieService } from 'ng2-cookies';
 

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
  constructor(public nameListService: NameListService, private authService: AuthService, private CookiesService:CookieService) {
    // // this.CookiesService.set("test", "textValue");
    // let test = this.CookiesService.get("test");
    // console.log("CookiesService "+test);
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    
  }

  onSubmit(email:string, password:string){
    this.authService.signin(email, password)
    .then((r)=>{
      console.log("Login result");
      console.log(r);
      console.log("emailVerified"+r.emailVerified);
      if(!r.emailVerified){
        alert("Please, visit your mail box and verify your email!");
      }
      else{
        console.log("login");
      }
    })
    .catch((e)=>{
      console.log("Login Error");
      console.log(e);
      alert(`Login Error ${e}`);
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
      console.log("User");
      console.log(user);
      console.log("uid "+user.uid)
    })
    .catch((e)=>{
      console.log("Login Error");
      console.trace(e);
      
      alert(`Login Error ${e}`);
    })
  }
}
