import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {apis} from '@core/apis';

@Injectable({providedIn: 'root'})
export class RegisterBotsService {

  constructor(private http: HttpClient) {
  }

  list() {

    return this.http.get<any>(`${environment.apiUrl}${apis.registerBots.list}`, {})
      .pipe(map(res => {
        return res;
      }));
  }

  add(data) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerBots.add}`, data)
      .pipe(map(res => {
        return res;
      }));
  }

  edit(data) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerBots.edit}`, data)
      .pipe(map(res => {
        return res;
      }));
  }
}
