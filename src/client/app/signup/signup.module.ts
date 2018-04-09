import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {NgbModule,NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../shared/auth-service/auth.service";
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import {EqualValidatorDirective} from "./equal-validator.directive";
import {NavigationService} from "../shared/navigation-service/navigation.service";
import { CookieService } from 'ng2-cookies';

@NgModule({
  imports: [SignupRoutingModule, SharedModule, NgbModule, FormsModule, ReactiveFormsModule],
  declarations: [SignupComponent, EqualValidatorDirective],
  exports: [SignupComponent, NgbModule,EqualValidatorDirective],
  providers: []
})
export class SignupModule {
}
