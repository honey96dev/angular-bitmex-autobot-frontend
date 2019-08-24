import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {apis} from '@core/apis';

@Injectable({providedIn: 'root'})
export class RegisterApikeysService {
  defaultRow = {id: null, name: '', testnet: false, apiKey: '', apiKeySecret: ''};

  editableRow: { id:string, name: string, testnet: boolean, apiKey: string, apiKeySecret: string };

  constructor(private http: HttpClient) {
  }

  list(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerApikeys.list}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  add(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerApikeys.add}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  edit(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerApikeys.edit}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  delete(params) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerApikeys.delete}`, params)
      .pipe(map(res => {
        return res;
      }));
  }

  setEditableRow(data) {
    this.editableRow = data;
  }

  editableRowValue() {
    if (this.editableRow && this.editableRow['id']) {
      return this.editableRow;
    } else {
      return this.defaultRow;
    }
  }
}
