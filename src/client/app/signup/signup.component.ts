import { Component, OnInit, ViewChild, ElementRef, Directive, forwardRef, Attribute } from '@angular/core';
import { Router } from '@angular/router';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import * as firebase from "firebase";
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { EqualValidatorDirective } from './equal-validator.directive';
import { NavigationService } from '../shared/navigation-service/navigation.service';
import { User } from "../types/user.type"
/**
 * This class represents the lazy loaded HomeComponent.
 */
// @Directive({
//   selector: '[validateEqual][formControlName],[validateEqual][formControl],[validateEqual][ngModel]',
//   providers: [
//       { provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidator), multi: true }
//   ]
// })
// export class EqualValidator implements Validator {
//   constructor( @Attribute('validateEqual') public validateEqual: string) {}

// export function equalValueValidator(targetKey: string, toMatchKey: string): ValidatorFn {
//   return (group: FormGroup): { [key: string]: any } => {
//     const target = group.controls[targetKey];
//     const toMatch = group.controls[toMatchKey];
//     if (target.touched && toMatch.touched) {
//       const isMatch = target.value === toMatch.value;
//       // set equal value error on dirty controls
//       if (!isMatch && target.valid && toMatch.valid) {
//         toMatch.setErrors({ equalValue: targetKey });
//         const message = targetKey + ' != ' + toMatchKey;
//         return { 'equalValue': message };
//       }
//       if (isMatch && toMatch.hasError('equalValue')) {
//         toMatch.setErrors(null);
//       }
//     }

//     return null;
//   };
// }
// }



@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
})
export class SignupComponent implements OnInit {

  name = '';

  model = new User("", "", "");
  signUpForm: FormGroup;
  errorMessage: string;
  names: any[] = [];
  
  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(public nameListService: NameListService, private config: NgbPopoverConfig, private authService: AuthService, private navigation: NavigationService) {
    config.triggers = "click";
    // firebase.auth().createUserWithEmailAndPassword("test@test.com", "testtest")
    // .then(r=>{
    //   console.log("REsult: ",r);

    // })
    // .catch(
    //   (e=>{
    //     console.log(e);
    //   })
    // )
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {

    this.signUpForm = new FormGroup({
      'email': new FormControl(this.model.email, [
        Validators.required,
        Validators.minLength(4),
        Validators.email
      ]),
      'password': new FormControl(this.model.password, [
        Validators.required,
        Validators.minLength(6)
      ]),
      'repassword': new FormControl(this.model.repassword, [
        Validators.required
      ]),
    }, );
  }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get repassword() { return this.signUpForm.get('repassword'); }
  onSubmit() {
    let emailValue = this.email.value;
    let passwordValue = this.password.value;
    alert(`Email: ${emailValue} Password: ${passwordValue}`);
    this.authService.signup(emailValue, passwordValue)
        .then((r) => {
          console.log("Result signup");
          console.dir(r);
          console.log(r.user);
          r.sendEmailVerification();
          alert(`Please chexk your email.`);
          this.navigation.goToSignIn();
        })
        .catch((e) => {
          console.log("Error signup");
          console.trace(e);
          // alert(`Error signup ${e}`);
        })
  }


  /**
   * Handle the nameListService observable
   */
  getNames() {
    this.nameListService.get()
      .subscribe(
        names => this.names = names,
        error => this.errorMessage = <any>error
      );
  }

  /**
   * Pushes a new name onto the names array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // addName(): boolean {
  //   // TODO: implement nameListService.post
  //   this.names.push(this.newName);
  //   this.newName = '';
  //   return false;
  // }

}
