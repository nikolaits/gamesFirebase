import { NgModule } from '@angular/core';
import { MainPageComponent } from './main-page.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";

@NgModule({
  imports: [MainPageRoutingModule, SharedModule],
  declarations: [MainPageComponent],
  exports: [MainPageComponent],
  providers: [NameListService, AuthService]
})
export class MainPageModule { }
