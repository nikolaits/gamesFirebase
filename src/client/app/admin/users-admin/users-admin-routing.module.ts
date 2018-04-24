import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersAdminComponent } from './users-admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'users-admin', component: UsersAdminComponent }
    ])
  ],
  exports: [RouterModule]
})
export class UsersAdminRoutingModule { }
