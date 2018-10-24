import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrivacypolicyComponent } from './privacypolicy.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'privacypolicy', component: PrivacypolicyComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PrivacypolicyRoutingModule { }
