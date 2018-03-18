import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';

@NgModule({
  imports: [SignupRoutingModule, SharedModule],
  declarations: [SignupComponent],
  exports: [SignupComponent],
  providers: [NameListService]
})
export class SignupModule { }
