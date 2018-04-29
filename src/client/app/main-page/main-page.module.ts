import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MainPageComponent, NgbdModalContent } from './main-page.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";
import {GamesService} from "../shared/games-service/games.service"
import {CoreModule} from "../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [MainPageRoutingModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbCarouselModule, NgbRatingModule, NgbCollapseModule],
  declarations: [MainPageComponent, NgbdModalContent],
  exports: [MainPageComponent],
  providers: [NameListService, AuthService, GamesService], 
  entryComponents:[NgbdModalContent]
})
export class MainPageModule { }
