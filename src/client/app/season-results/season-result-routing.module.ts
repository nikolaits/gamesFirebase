import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeasonResultComponent } from './season-result.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'season-mode-result', component: SeasonResultComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SeasonResultRoutingModule { }
