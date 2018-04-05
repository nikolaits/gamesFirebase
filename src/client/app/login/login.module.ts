import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";
import { CookieService } from 'ng2-cookies';

@NgModule({
  imports: [LoginRoutingModule, SharedModule],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [NameListService, AuthService, CookieService]
})
export class LoginModule { }
