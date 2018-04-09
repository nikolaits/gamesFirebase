import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NavigationService} from "./navigation-service/navigation.service"
import { NameListService } from './name-list/name-list.service';
import {AuthService} from "./auth-service/auth.service";
import {UserService} from "./user-service/user.service"
import { CookieService } from 'ng2-cookies';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
@NgModule({
  imports: [CommonModule, NgbModule.forRoot()],
  exports: [CommonModule, FormsModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, AuthService, NavigationService, CookieService, UserService]
    };
  }
}
