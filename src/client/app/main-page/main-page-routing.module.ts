import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'main-page', component: MainPageComponent }
    ])
  ],
  exports: [RouterModule]
})
export class MainPageRoutingModule { }
