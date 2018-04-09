import { Component, OnInit, Input } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import { UserService } from '../shared/user-service/user.service';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngbd-modal-content',
  styles:[".modal-header{background-color: 000;}"],
  template: `
    <div  class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
  @Input() name:string;

  constructor(public activeModal: NgbActiveModal) {}
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

  newName = '';
  errorMessage: string;
  names: any[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private modalService: NgbModal, private authService: AuthService, private userService:UserService) {
    
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    
  }
  // ngAfterViewInit(){
  //   setTimeout(()=>{
  //     this.open();
  //   }, 2000)
  // }
  open() {
    console.log("firs tap");
    console.log(this.modalService)
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = 'World';
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
    })
    .catch((e)=>{
      console.log("Login Error");
      console.trace(e);
      
      alert(`Login Error ${e}`);
    })
  }
}
