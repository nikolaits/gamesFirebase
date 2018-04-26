import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UpdateComponent} from "./update/update.component";
import {PasswordResetComponent} from "./password.reset.component/password.reset.component"
import {NgbModule, NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import { EqualValidatorDirective } from '../signup/equal-validator.directive';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import {ImageCropperComponent} from "ngx-img-cropper";
import { FriendListComponent }from "./friend_list/friend_list.component";
import {AddFriendComponent} from "./addfriend/addfriend.component";

@NgModule({
  imports: [RouterModule, NgbModule.forRoot(), NgbPopoverModule, FormsModule, ReactiveFormsModule, BrowserModule],
  declarations: [NavbarComponent, ToolbarComponent, UpdateComponent, AddFriendComponent, FriendListComponent,PasswordResetComponent, ImageCropperComponent],
  exports: [RouterModule,
    NavbarComponent, ToolbarComponent, UpdateComponent, AddFriendComponent, FriendListComponent, PasswordResetComponent, ImageCropperComponent],
  entryComponents:[UpdateComponent, PasswordResetComponent, AddFriendComponent]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
