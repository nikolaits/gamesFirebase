import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacypolicyComponent } from './privacypolicy.component';
import { PrivacypolicyRoutingModule } from './privacypolicy-routing.module';
import {CoreModule} from "../core/core.module"

@NgModule({
  imports: [CommonModule, PrivacypolicyRoutingModule, CoreModule],
  declarations: [PrivacypolicyComponent],
  exports: [PrivacypolicyComponent]
})
export class PrivacypolicyModule { }
