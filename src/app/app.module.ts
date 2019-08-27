import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MDBBootstrapModulesPro, MDBSpinningPreloader} from 'ng-uikit-pro-standard';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthLayoutComponent} from '@app/views/layouts/auth-layout/auth-layout.component';
import {SigninComponent} from '@app/views/auth/signin/signin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckForceValidator, ErrorInterceptor, JwtInterceptor, MatchValueValidator} from '@app/_helpers';
import {HomeLayoutComponent} from '@app/views/layouts/home-layout/home-layout.component';
import {DashboardComponent} from '@app/views/home/dashboard/dashboard.component';
import {RegisterBotsComponent} from '@app/views/home/register-bots/register-bots.component';
import {RegisterBotsModalComponent} from '@app/views/home/register-bots/register-bots-modal.component';
import {DeleteModalComponent} from '@app/views/partials/common-dialogs/delete-modal.component';
import {RegisterApikeysComponent} from '@app/views/home/register-apikeys/register-apikeys.component';
import {RegisterApikeysModalComponent} from '@app/views/home/register-apikeys/register-apikeys-modal.component';
import {ApikeyComponent} from '@app/views/home/settings/apikey/apikey.component';
import {PasswordComponent} from '@app/views/home/settings/password/password.component';
import {PriceChartComponent} from '@app/views/partials/price-chart/price-chart.component';
import {PlotlyModule} from 'angular-plotly.js';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    CheckForceValidator,
    MatchValueValidator,
    DeleteModalComponent,
    PriceChartComponent,
    AppComponent,
    AuthLayoutComponent,
    SigninComponent,
    HomeLayoutComponent,
    DashboardComponent,
    RegisterApikeysComponent,
    RegisterApikeysModalComponent,
    RegisterBotsComponent,
    RegisterBotsModalComponent,
    ApikeyComponent,
    PasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    MDBBootstrapModulesPro.forRoot(),
    FormsModule,
    PlotlyModule,
  ],
  providers: [
    Title,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MDBSpinningPreloader,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteModalComponent,
  ],
})
export class AppModule {
}
