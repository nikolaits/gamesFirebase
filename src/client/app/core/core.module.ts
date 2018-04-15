import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ToolbarComponent } from './toolbar/toolbar.component';
import {UpdateComponent} from "./update/update.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [RouterModule, NgbModule.forRoot()],
  declarations: [NavbarComponent, ToolbarComponent, UpdateComponent],
  exports: [RouterModule,
    NavbarComponent, ToolbarComponent, UpdateComponent]
})
export class CoreModule {

  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
