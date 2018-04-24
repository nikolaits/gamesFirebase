import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { UsersAdminComponent } from './users-admin.component';
import { UsersAdminRoutingModule } from './users-admin-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NameListService } from '../../shared/name-list/name-list.service';
import {AuthService} from "../../shared/auth-service/auth.service";
import {GamesService} from "../../shared/games-service/games.service"
import {CoreModule} from "../../core/core.module"
import { NgbModal, NgbRatingModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

@NgModule({
  imports: [UsersAdminRoutingModule, FormsModule, ReactiveFormsModule, SharedModule, CoreModule, BrowserAnimationsModule, NgbRatingModule, NgbCollapseModule],
  declarations: [UsersAdminComponent],
  exports: [UsersAdminComponent],
  providers: [NameListService, AuthService, GamesService]
})
export class UsersAdminModule { }
