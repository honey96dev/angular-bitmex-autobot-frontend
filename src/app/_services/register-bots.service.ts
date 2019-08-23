import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {apis} from '@core/apis';

@Injectable({providedIn: 'root'})
export class RegisterBotsService {
  defaultRow = {id: null, name: '', exchange: 'bitmex', symbol: 'XBTUSD', apiKey: '', apiKeySecret: '', orderType: 'Limit', postOnly: true, strategy: 'Long', leverage: 'Cross', leverageValue: 0, quantity: 0, price: 0, tpPercent: 0, slPercent: 0, tsPercent: 0, numberOfSafeOrder: 0, closeOrder1: false, newOrderOnSLPrice: false, valueOfLastCloseOrder: 0, timesRepeatSameLogic1: 1, closeOrder2: false, breakdownPriceForNewOrder: 0, timeIntervalAfterClose: 0, timesRepeatSameLogic2: 1};

  editableRow: { id:string, name: string, exchange: string, symbol: string, apiKey: string, apiKeySecret: string, orderType: string, postOnly: boolean, strategy: string, leverage: string, leverageValue: number, quantity: number, price: number, tpPercent: number, slPercent: number, tsPercent: number, numberOfSafeOrder: number, closeOrder1: boolean, newOrderOnSLPrice: boolean, valueOfLastCloseOrder: number, timesRepeatSameLogic1: number, closeOrder2: boolean, breakdownPriceForNewOrder: number, timeIntervalAfterClose: number, timesRepeatSameLogic2: number };

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

  delete(data) {
    return this.http.post<any>(`${environment.apiUrl}${apis.registerBots.delete}`, data)
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
