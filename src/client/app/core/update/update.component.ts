import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/user-service/user.service';
import { UserUpdate } from "../../types/user_update.type"
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EqualValidatorDirective } from '../../signup/equal-validator.directive';
import { UserInitInfo } from '../../types/user_init_info.type';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'update-module',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.css']
})
export class UpdateComponent { 

  model:UserUpdate;
  updateForm:FormGroup;
  oldUsername:string;
  oldPassword:string
  taken:boolean=false;
  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }
  ngOnInit() {
    this.userService.getCurrentUser();
    let email = this.userService.user.email;
    
    this.userService.getUserUsernameAndProfilePicture()
    .then((info:UserInitInfo)=>{
      console.log("userinfo")
      console.log(info);
      this.oldUsername = info.username;
      this.model= new UserUpdate(this.oldUsername, email, "XXXXxxxx", "XXXXxxxx");
      this.updateForm = new FormGroup({
        'username': new FormControl(this.model.username, [
          Validators.nullValidator
        ]),
        'email': new FormControl(this.model.email, [
        ]),
        'password': new FormControl(this.model.password, [
          Validators.nullValidator,
          Validators.minLength(6)
        ]),
        'repassword': new FormControl(this.model.repassword, [
          Validators.nullValidator
        ]),
      }, );
    })
    .catch((err)=>{
      console.log("Error");
      console.log(err);
    })
    
  }
  get username() { return this.updateForm.get('username'); }
  get email() { return this.updateForm.get('email'); }
  get password() { return this.updateForm.get('password'); }
  get repassword() { return this.updateForm.get('repassword'); }
  onSubmit() {
    this.taken=true;
    let usernameValue = this.username.value;
    let passwordValue = this.password.value;
    this.userService.user.updatePassword(passwordValue)
    .then((r)=>{
      console.log("password updated")
    })
    .catch((e)=>{
      alert("Error, while updating the password");
      console.log("Error");
      console.log(e);
    })
    if(usernameValue !== this.oldUsername){
      this.userService.isUsernameTaken(usernameValue)
      .then((r)=>{
        if(r === "free"){
          this.userService.updateUsername(usernameValue)
          .then(()=>{
            console.log("username created");
            this.activeModal.close('Close username modal')
          })
          .catch((err)=>{
            console.log("Error");
            console.log(err);
          })
        }
      })
      .catch((e)=>{
        if(e === "taken"){
          this.taken = true;
        }else{
          console.log(e);
        }
        
      });
    }
  }
  
  onModalClose(){
    this.activeModal.close();
  }
  
}

