import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthLayoutComponent} from '@app/views/layouts/auth-layout/auth-layout.component';
import {SigninComponent} from '@app/views/auth/signin/signin.component';
import {HomeLayoutComponent} from '@app/views/layouts/home-layout/home-layout.component';
import {AuthGuard} from '@app/_helpers';
import {DashboardComponent} from '@app/views/home/dashboard/dashboard.component';
import {RegisterApikeysComponent} from '@app/views/home/register-apikeys/register-apikeys.component';
import {RegisterApikeysModalComponent} from '@app/views/home/register-apikeys/register-apikeys-modal.component';
import {RegisterBotsComponent} from '@app/views/home/register-bots/register-bots.component';
import {RegisterBotsModalComponent} from '@app/views/home/register-bots/register-bots-modal.component';
import {ApikeyComponent} from '@app/views/home/settings/apikey/apikey.component';
import {PasswordComponent} from '@app/views/home/settings/password/password.component';
// import {AuthGuard} from '@app/_helpers';
// import {HomeLayoutComponent} from '@app/views/layouts/home-layout/home-layout.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {path: '', component: SigninComponent, pathMatch: 'full'},
      // {path: 'sign-in', component: SigninComponent, pathMatch: 'full'},
    //   {path: 'sign-up', component: SignupComponent, pathMatch: 'full'},
    ],
  },
  {
    path: 'app',
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: DashboardComponent},
      // {path: 'dashboard', component: DashboardComponent, pathMatch: 'full'},
      // {path: 'register-apikeys', component: RegisterApikeysComponent},
      // {path: 'register-apikeys-modal', component: RegisterApikeysModalComponent},
      {path: 'register-bots', component: RegisterBotsComponent},
      {path: 'register-bots-modal', component: RegisterBotsModalComponent},
      {path: 'settings/apikey', component: ApikeyComponent},
      {path: 'settings/password', component: PasswordComponent},
    ],
  },
  {path: '**', redirectTo: 'app'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
