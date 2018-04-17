import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EqualValidatorDirective } from '../../signup/equal-validator.directive';
import { UserPassReset } from '../../types/user_pass_reset.type';
import { AuthService } from '../../shared/auth-service/auth.service';
import { NavigationService } from '../../shared/navigation-service/navigation.service';
/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'password-reset-module',
  templateUrl: 'password.reset.component.html',
  styleUrls: ['password.reset.component.css']
})
export class PasswordResetComponent { 

  model:UserPassReset;
  passResetForm:FormGroup;
  constructor(private activeModal:NgbActiveModal, private authService:AuthService, private navigationService:NavigationService) { }
  ngOnInit() {

    this.model= new UserPassReset("");
    this.passResetForm = new FormGroup({
        'email': new FormControl(this.model.email, [
          Validators.required,
          Validators.email
        ])
      } );
    }
  get email() { return this.passResetForm.get('email'); }
  onSubmit() {
    let emailValue = this.email.value;
    this.authService.passwordResetRequest(emailValue)
    .then((args)=>{
      this.activeModal.close("sent")
    })
    .catch((e)=>{
      console.log("Error");
      console.log(e);
      alert("Error: password reset email(Try again later)");
    })
  }

  onModalClose(){
    this.activeModal.close();
  }
  
}

