import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../shared/user-service/user.service';
import { UserUpdate } from "../../types/user_update.type"
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EqualValidatorDirective } from '../../signup/equal-validator.directive';
import { UserInitInfo } from '../../types/user_init_info.type';
import { AuthService } from '../../shared/auth-service/auth.service';
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
  disabledPasswordField:boolean = false;
  constructor(public activeModal: NgbActiveModal, private userService: UserService, private authService:AuthService) { }
  ngOnInit() {
    this.userService.getCurrentUser();
    let email = this.userService.user.email;
    let providerId = (<any>this.userService.user.providerData)[0]["providerId"];
    if((providerId === "google.com")||(providerId === "facebook.com")){
        console.log("here in the if")
        this.disabledPasswordField = true;
    }
    this.model= new UserUpdate("", email, "xxxxxx", "xxxxxx");
    this.updateForm = new FormGroup({
        'username': new FormControl(this.model.username, [
          Validators.nullValidator
        ]),
        'email': new FormControl({value:this.model.email, disabled:true}, [
        ]),
        'password': new FormControl({value:this.model.password, disabled:this.disabledPasswordField}, [
          Validators.nullValidator,
          Validators.minLength(6)
        ]),
        'repassword': new FormControl({value:this.model.repassword, disabled:this.disabledPasswordField}, [
          Validators.nullValidator
        ]),
      }, );
    

    
    // if()
    this.userService.getUserUsernameAndProfilePicture()
    .then((info:UserInitInfo)=>{
      
      this.oldUsername = info.username;
      this.updateForm.controls.username.setValue(info.username);
      // this.model= new UserUpdate(this.oldUsername, email, "XXXXxxxx", "XXXXxxxx");
      // this.updateForm.get("username").value = email;
      // this.model.username = this.oldUsername;
      // this.updateForm = new FormGroup({
      //   'username': new FormControl(this.model.username, [
      //     Validators.nullValidator
      //   ]),
      //   'email': new FormControl({value:this.model.email, disabled:true}, [
      //   ]),
      //   'password': new FormControl({value:this.model.password, disabled:this.disabledPasswordField}, [
      //     Validators.nullValidator,
      //     Validators.minLength(6)
      //   ]),
      //   'repassword': new FormControl({value:this.model.repassword, disabled:this.disabledPasswordField}, [
      //     Validators.nullValidator
      //   ]),
      // }, );
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
    this.taken=false;
    let usernameValue = this.username.value;
    let passwordValue = this.password.value;
    
    if(usernameValue !== this.oldUsername){
      this.userService.isUsernameTaken(usernameValue)
      .then((r)=>{
        if(r === "free"){
          this.userService.updateUsername(usernameValue)
          .then(()=>{
            console.log("username updated");
            this.updatePassword(passwordValue, true);
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
          this.updateForm.controls.username.setValue(this.oldUsername);
        }else{
          console.log(e);
        }
        
      });
    }else{
      this.updatePassword(passwordValue, false);
    }
  }
  updatePassword(passwordValue:string, usernameUpdateFlag:boolean){
    if((!this.disabledPasswordField)&&(passwordValue === "xxxxxx")){
      this.userService.user.updatePassword(passwordValue)
      .then((r)=>{
        console.log("password updated");
        if(usernameUpdateFlag){
          this.activeModal.close("usernameUpdated");
        }
        else{
          this.activeModal.close("close modal");
        }
      })
      .catch((e)=>{
        alert("Error, while updating the password");
        console.log("Error");
        console.log(e);
      })
    }
    else{
      if(usernameUpdateFlag){
        this.activeModal.close("usernameUpdated");
      }
      else{
        this.activeModal.close("close modal");
      }
    }
  }
  onModalClose(){
    this.activeModal.close();
  }
  
}

