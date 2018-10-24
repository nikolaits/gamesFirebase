import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {PrivacypolicyModule} from "./privacypolicy/privacypolicy.module"
import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from "./signup/signup.module";
import { MainPageModule } from "./main-page/main-page.module";
import {SeasonPageModule} from "./season-page/season-page.module";
import {CasualModeResultModule} from "./casual-mode-results/casual-mode-result.module"
import {SeasonResultModule} from "./season-results/season-result.module";
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import {GamesAdminModule} from "./admin/games-admin/games-admin.module";
import {UsersAdminModule} from "./admin/users-admin/users-admin.module"
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {EqualValidatorDirective} from "./signup/equal-validator.directive";

@NgModule({
  imports: [BrowserModule, CoreModule,NgbModule.forRoot(),
    HttpClientModule, AppRoutingModule,
    AboutModule, LoginModule,
    PrivacypolicyModule,
    SignupModule,
    MainPageModule,
    MainPageModule,
    SeasonPageModule,
    GamesAdminModule,
    UsersAdminModule,
    CasualModeResultModule,
    SeasonResultModule,   
    SharedModule.forRoot(),
  
],
  declarations: [AppComponent, EqualValidatorDirective],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent],
  exports:[EqualValidatorDirective]

})
export class AppModule { }
