import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {apis} from '@core/apis';
import {AuthenticationService} from '@app/_services/authentication.service';
import strings from '@core/strings';

@Injectable({providedIn: 'root'})
export class SettingsService {
  defaultApiKey = {userId: null, testnet: null, apiKey: '', apiKeySecret: ''};

  editableRow: { userId: string, testnet: number, apiKey: string, apiKeySecret: string };

  constructor(private http: HttpClient,
              private authService: AuthenticationService) {
  }

  loadApkKey(params) {
    // let currentUser = this.authService.currentUserValue;
    // return currentUser.apiKey ? currentUser.apiKey : this.defaultApiKey;
    // console.log('loadApikey', params);
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.loadApikey}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  saveApiKey(params) {
    // let currentUser = this.authService.currentUserValue;
    // currentUser.apiKey = params;
    // localStorage.setItem(strings.siteName, JSON.stringify(currentUser));
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.saveApikey}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  password(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.password}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  connectToExchange(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.connectToExchange}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  loadPersonalChart(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.loadPersonalChart}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  savePersonalChart(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.savePersonalChart}`, params)
      .pipe(map(res => {
        return res;
      }));
  }
}
