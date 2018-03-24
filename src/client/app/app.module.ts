import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AboutModule } from './about/about.module';
import { LoginModule } from './login/login.module';
import { SignupModule } from "./signup/signup.module"
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [BrowserModule, CoreModule,NgbModule.forRoot(),
    HttpClientModule, AppRoutingModule,
    AboutModule, LoginModule,
    SignupModule,
    SharedModule.forRoot(),
  
],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
