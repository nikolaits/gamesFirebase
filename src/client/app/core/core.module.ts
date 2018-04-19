import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UpdateComponent} from "./update/update.component";
import {PasswordResetComponent} from "./password.reset.component/password.reset.component"
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { EqualValidatorDirective } from '../signup/equal-validator.directive';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import {ImageCropperComponent} from "ngx-img-cropper"

@NgModule({
  imports: [RouterModule, NgbModule.forRoot(), FormsModule, ReactiveFormsModule, BrowserModule],
  declarations: [NavbarComponent, ToolbarComponent, UpdateComponent,PasswordResetComponent, ImageCropperComponent],
  exports: [RouterModule,
    NavbarComponent, ToolbarComponent, UpdateComponent, PasswordResetComponent, ImageCropperComponent],
  entryComponents:[UpdateComponent, PasswordResetComponent]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
