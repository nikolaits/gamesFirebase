import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from "./signup/signup.module"
import { MainPageModule } from "./main-page/main-page.module"
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import {GamesAdminModule} from "./admin/games-admin/games-admin.module"
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {EqualValidatorDirective} from "./signup/equal-validator.directive";

@NgModule({
  imports: [BrowserModule, CoreModule,NgbModule.forRoot(),
    HttpClientModule, AppRoutingModule,
    AboutModule, LoginModule,
    SignupModule,
    MainPageModule,
    MainPageModule,
    GamesAdminModule,    
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
