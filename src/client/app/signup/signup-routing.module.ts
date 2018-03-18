import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'signup', component: SignupComponent }
    ]),
    NgbModule.forRoot()
  ],
  exports: [RouterModule]
})
export class SignupRoutingModule { }
