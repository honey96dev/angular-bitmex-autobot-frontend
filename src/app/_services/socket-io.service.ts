import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '@environments/environment';
import SocketIOClient from 'socket.io-client';
import signals from '@core/signals';
import numeral from 'numeral';

@Injectable({providedIn: 'root'})
export class SocketIoService {
  ioClient: SocketIOClient;
  prices: {};
  price: 0;
  direction: 1;

  @Output() xbtusdInfo: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.ioClient = SocketIOClient(environment.socketIOUrl, {
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 4000,
      reconnectionAttempts: Infinity
    });

    this.ioClient.on(signals.price, (data) => {
      this.prices = JSON.parse(data);
      this.price = numeral(this.prices['XBTUSD']['price']).format('0,0.0');
      this.direction = this.prices['XBTUSD']['direction'];
      this.xbtusdInfo.emit({
        price: this.price,
        direction: this.direction,
      });
    });

  }

  getXbtusdInfo() {
    return this.xbtusdInfo;
  }


}
