import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeasonPageComponent } from './season-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'season-page', component: SeasonPageComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SeasonPageRoutingModule { }
