import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { SignupRoutingModule } from './signup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {NgbModule,NgbPopover} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [SignupRoutingModule, SharedModule,
    NgbModule,NgbPopover
  ],
  declarations: [SignupComponent],
  exports: [SignupComponent],
  providers: [NameListService]
})
export class SignupModule {
}
