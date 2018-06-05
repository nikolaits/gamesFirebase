import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CasualModeResultComponent } from './casual-mode-result.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'casual-mode-result', component: CasualModeResultComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CasualModeResultRoutingModule { }
