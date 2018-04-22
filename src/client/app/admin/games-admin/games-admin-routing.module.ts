import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GamesAdminComponent } from './games-admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'game-admin', component: GamesAdminComponent }
    ])
  ],
  exports: [RouterModule]
})
export class GameAdminRoutingModule { }
