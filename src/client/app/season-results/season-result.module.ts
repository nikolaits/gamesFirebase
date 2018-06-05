import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SeasonResultComponent } from './season-result.component';
import { SeasonResultRoutingModule } from './season-result-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";
import {GamesService} from "../shared/games-service/games.service"
import {CoreModule} from "../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [SeasonResultRoutingModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbRatingModule, NgbCollapseModule],
  declarations: [SeasonResultComponent],
  exports: [SeasonResultComponent],
  providers: [NameListService, AuthService, GamesService]
})
export class SeasonResultModule { }
