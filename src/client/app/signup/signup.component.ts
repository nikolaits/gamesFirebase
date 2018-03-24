import { Component, OnInit, ViewChild, ElementRef, Directive, forwardRef, Attribute } from '@angular/core';
import { NameListService } from '../shared/name-list/name-list.service';
import { AuthService } from '../shared/auth-service/auth.service';
import * as firebase from "firebase";
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl,NG_VALIDATORS, Validator }   from '@angular/forms';
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

//   validate(c: AbstractControl): { [key: string]: any } {
//       // self value (e.g. retype password)
//       let v = c.value;

//       // control value (e.g. password)
//       let e = c.root.get(this.validateEqual);

//       // value not equal
//       if (e && v !== e.value) return {
//           validateEqual: false
//       }
//       return null;
//   }
// }
 class User{
   constructor(
     public email:string,
     public password:string,
     public repassword:string
   ){}
 }


@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
})
export class SignupComponent implements OnInit {

  name = '';

  model = new User("", "", "");
  signUpForm:FormGroup;
  errorMessage: string;
  names: any[] = [];
  popoverClass="";
  popoverData="";
  @ViewChild('inputPassword') passwordLabel: ElementRef;
  //minimum 8 characters
  public bad = /(?=.{8,}).*/;
  //Alpha Numeric plus minimum 8
  public good = /^(?=\S*?[a-z])(?=\S*?[0-9])\S{8,}$/;
  //Must contain at least one upper case letter, one lower case letter and (one number OR one special char).
  public better = /^(?=\S*?[A-Z])(?=\S*?[a-z])((?=\S*?[0-9])|(?=\S*?[^\w\*]))\S{8,}$/;
  //Must contain at least one upper case letter, one lower case letter and (one number AND one special char).
  public best = /^(?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9])(?=\S*?[^\w\*])\S{8,}$/;

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(public nameListService: NameListService, private config:NgbPopoverConfig, private authService:AuthService) {
    config.triggers="click";
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
    this.signUpForm.errors.minLength
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
        Validators.required,
        // validatorEqul("password")
      ]),
    });
  }
  get email() { return this.signUpForm.get('email'); }
  get password() { return this.signUpForm.get('password'); }
  get repassword() { return this.signUpForm.get('repassword'); }
  onSubmit() { alert("button submit tap"); }
  onKey(args:any){
    console.log("on keyup")
    var password = args.target;
    var pass = password.value;
    var stength = 'Weak';
    var pclass = 'danger';
    if (this.best.test(pass) == true) {
        this.popoverData = 'Very Strong';
        this.popoverClass = 'success';
    } else if (this.better.test(pass) == true) {
      this.popoverData = 'Strong';
      this.popoverClass = 'warning';
    } else if (this.good.test(pass) == true) {
      this.popoverData = 'Almost Strong';
      this.popoverClass = 'warning';
    } else if (this.bad.test(pass) == true) {
      this.popoverData = 'Weak';
    } else {
      this.popoverData = 'Very Weak';
    }
    // var popover = password.attr('data-content', stength).data('bs.popover');
    // popover.setContent();
    // popover.$tip.addClass(popover.options.placement).removeClass('danger success info warning primary').addClass(pclass);
  }

  onClick(args:any){
    this.config
  }
  signup(email:string, password:string, repassword:string){
    if(password !== repassword){
      alert("Password does not match");
    }
    else{
      this.authService.signup(email, password)
      .then((r)=>{
        console.log("Result signup");
        console.dir(r);
        alert(`Result signup ${r}`);
      })
      .catch((e)=>{
        console.log("Error signup");
        console.trace(e);
        alert(`Error signup ${e}`);
      })
    }
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
