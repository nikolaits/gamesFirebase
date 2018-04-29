import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { GamesAdminComponent, NgbdModalCreateGame } from './games-admin.component';
import { GameAdminRoutingModule } from './games-admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NameListService } from '../../shared/name-list/name-list.service';
import {AuthService} from "../../shared/auth-service/auth.service";
import {GamesService} from "../../shared/games-service/games.service"
import {CoreModule} from "../../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
  imports: [GameAdminRoutingModule, FormsModule,NgbProgressbarModule, ReactiveFormsModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbRatingModule, NgbCollapseModule],
  declarations: [GamesAdminComponent, NgbdModalCreateGame],
  exports: [GamesAdminComponent],
  providers: [NameListService, AuthService, GamesService], 
  entryComponents:[NgbdModalCreateGame]
})
export class GamesAdminModule { }
