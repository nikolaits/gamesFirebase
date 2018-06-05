import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CasualModeResultComponent } from './casual-mode-result.component';
import { CasualModeResultRoutingModule } from './casual-mode-result-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NameListService } from '../shared/name-list/name-list.service';
import {AuthService} from "../shared/auth-service/auth.service";
import {GamesService} from "../shared/games-service/games.service"
import {CoreModule} from "../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CasualModeResultRoutingModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbRatingModule, NgbCollapseModule],
  declarations: [CasualModeResultComponent],
  exports: [CasualModeResultComponent],
  providers: [NameListService, AuthService, GamesService]
})
export class CasualModeResultModule { }
