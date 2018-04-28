import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SeasonPageComponent } from './season-page.component';
import { SeasonPageRoutingModule } from './season-page-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";
import {GamesService} from "../shared/games-service/games.service"
import {CoreModule} from "../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [SeasonPageRoutingModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbRatingModule, NgbCollapseModule],
  declarations: [SeasonPageComponent],
  exports: [SeasonPageComponent],
  providers: [NameListService, AuthService, GamesService]
})
export class SeasonPageModule { }
