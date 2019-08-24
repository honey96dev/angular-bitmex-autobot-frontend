import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {apis} from '@core/apis';
import {AuthenticationService} from '@app/_services/authentication.service';
import strings from '@core/strings';

@Injectable({providedIn: 'root'})
export class SettingsService {
  defaultApiKey = {userId: null, testnet: false, apiKey: '', apiKeySecret: ''};

  editableRow: { userId: string, testnet: boolean, apiKey: string, apiKeySecret: string };

  constructor(private http: HttpClient,
              private authService: AuthenticationService) {
  }

  loadApkKey(params) {
    let currentUser = this.authService.currentUserValue;
    return currentUser.apiKey ? currentUser.apiKey : this.defaultApiKey;
    // return this.http.post<any>(`${environment.apiUrl}${apis.settings.loadApikey}`, params)
    //   .pipe(map(res => {
    //     return res;
    //   }));
  }

  saveApiKey(params) {
    let currentUser = this.authService.currentUserValue;
    currentUser.apiKey = params;
    localStorage.setItem(strings.siteName, JSON.stringify(currentUser));
  }

  password(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.settings.password}`, params)
      .pipe(map(res => {
        return res;
      }));
  }
}
