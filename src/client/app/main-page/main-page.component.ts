import { Component, OnInit, Input } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { UserService } from '../shared/user-service/user.service';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { UserInitInfo } from '../types/user_init_info.type';
import * as firebase from "firebase";

@Component({
  selector: 'ngbd-modal-content',
  styles: [".modal-header{background-color: 000;}   "],
  template: `
    <div  class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
    </div>
    <div class="modal-body">
      <p>{{notification}}!</p>
      <input type="text" class="form-control" id="username" (input)="onTextChange($event.target.value)" #username name="username" >
      <div *ngIf="error" class="alert alert-danger">
        <div *ngIf="isEmpty">
                Username is required.
        </div>
        <div *ngIf="taken">
          Username is already taken.
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" [ngClass]="{disabled : btnDisabled}" (click)="SubmitUsername(username.value)">Save</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() notification: string;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }
  public error = false;
  public isEmpty = false;
  public btnDisabled = true;
  public taken = false;
  ngOnInit(){

  }

  public onTextChange(args:string){
    this.error = false;
    this.isEmpty = false; 
    this.taken = false;
    if(args.replace(/\s/g,'').length<1){
      this.error = true;
      this.isEmpty = true;
    }
    this.btnDisabled = this.error;
  }
  public SubmitUsername(result:string) {
    
    if(!this.error && !this.btnDisabled){
      this.userService.getCurrentUser();
      this.userService.isUsernameTaken(result)
      .then((r)=>{
        if(r === "free"){
          this.saveUserData(result);
        }
      })
      .catch((e)=>{
        if(e === "taken"){
          this.error = true;
          this.taken = true;
        }else{
          console.log(e);
        }
        
      });
      
      
      
    }
  }
  private saveUserData(result:string){
    let imageUrl = "https://firebasestorage.googleapis.com/v0/b/gamesfirebase.appspot.com/o/def_profile_picture.png?alt=media&token=fb6c2ff5-8efc-4ae9-a477-85393611338b";
      this.userService.writeUserName(result, imageUrl)
      .then(()=>{
        console.log("username created");
        this.activeModal.close('Close username modal')
      })
      .catch((e)=>{
        console.log("Error");
        console.log(e);
      })
  }
}

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'main-page.component.html',
  styleUrls: ['main-page.component.css'],
})
export class MainPageComponent implements OnInit {

  errorMessage: string;
  names: any[] = [];
  public changeDisplayedData:boolean = false;
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService: UserService) {

  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {

  }
  ngAfterViewInit(){
    this.authService.isUserSignIn()
    .then((r:firebase.User)=>{
      console.log("user exist");
      this.userService.user = r;
      this.userService.hasUsername()
      .then((r)=>{
        console.log(r);
      })
      .catch((e)=>{
        console.log("Error:");
        console.log(e);
        if(e === "no username"){
          this.openModal();
        }
      })
    })
    .catch((e)=>{
      console.log("no user found");
      console.log(e);
    })
  }

  openModal() {
    console.log("firs tap");
    console.log(this.modalService);
    let options: NgbModalOptions = {
      beforeDismiss: () => {  return false },
      windowClass: "in"
    }
    
    const modalRef = this.modalService.open(NgbdModalContent, options);
    modalRef.componentInstance.notification = 'Please enter your username';
    modalRef.result.then((arg:string)=>{
      console.log(arg);

      this.changeDisplayedData=true;
    })
  }
readfilestorage(){
  
}
  // onSubmit(email: string, password: string) {
  //   this.authService.signin(email, password)
  //     .then((r) => {
  //       console.log("Login result");
  //       console.log(r);
  //       console.log("emailVerified" + r.emailVerified);
  //       if (!r.emailVerified) {
  //         alert("Please, visit your mail box and verify your email!");
  //       }
  //       else {
  //         console.log("login");
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.log(e);
  //       alert(`Login Error ${e}`);
  //     })
  // }
  // googleSignIn() {
  //   console.log("googleSignIn");
  //   this.authService.signInGoogle()
  //     .then((result) => {
  //       var token = result.credential.accessToken;
  //       // The signed-in user info.
  //       var user = result.user;
  //       console.log("Token");
  //       console.log(token);
  //       console.log("User");
  //       console.log(user);
  //     })
  //     .catch((e) => {
  //       console.log("Login Error");
  //       console.trace(e);

  //       alert(`Login Error ${e}`);
  //     })
  // }
}
