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
  marketPrice: 0;
  direction: 1;

  @Output() connected: EventEmitter<any> = new EventEmitter();
  @Output() botStarted: EventEmitter<any> = new EventEmitter();
  @Output() xbtusdInfo: EventEmitter<any> = new EventEmitter();
  @Output() orderBookL2_25: EventEmitter<any> = new EventEmitter();
  @Output() wallet: EventEmitter<any> = new EventEmitter();
  @Output() position: EventEmitter<any> = new EventEmitter();

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
      this.marketPrice = this.prices['XBTUSD']['markPrice'];
      this.direction = this.prices['XBTUSD']['direction'];
      this.xbtusdInfo.emit({
        price: this.price,
        marketPrice: this.marketPrice,
        direction: this.direction,
      });
    });

    this.ioClient.on(signals.orderBookL2_25, (data) => {
      this.orderBookL2_25.emit(JSON.parse(data));
    });

    this.ioClient.on(signals.wallet, (data) => {
      this.wallet.emit(JSON.parse(data));
    });

    this.ioClient.on(signals.position, (data) => {
      this.position.emit(JSON.parse(data));
    });

    this.ioClient.on(signals.answerIsConnected, (data) => {
      const params = JSON.parse(data);
      this.setConnected(params['connected']);
    });

    this.ioClient.on(signals.connectedToExchange, (data) => {
      this.checkIsConnected(JSON.parse(data));
    });

    this.ioClient.on(signals.answerIsBotStarted, (data) => {
      const params = JSON.parse(data);
      this.setBotStarted(params);
    });

    this.ioClient.on(signals.connect, (reason) => {
      // this.checkIsConnected()
    });

    this.ioClient.on(signals.disconnect, (reason) => {
      this.connected.emit(false);
    });
  }

  isConnected() {
    return this.connected;
  }

  isBotStarted() {
    return this.botStarted;
  }

  getXbtusdInfo() {
    return this.xbtusdInfo;
  }

  getOrderBookL2_25() {
    return this.orderBookL2_25;
  }

  getWallet() {
    return this.wallet;
  }

  getPosition() {
    return this.position;
  }

  connectToExchange(params) {
    this.ioClient.emit(signals.connectToExchange, JSON.stringify(params));
  }

  disconnectFromExchange(params) {
    this.ioClient.emit(signals.disconnectFromExchange, JSON.stringify(params));
    this.setConnected(false);
  }

  setConnected(connected) {
    this.connected.emit(connected);
  }

  checkIsConnected(params) {
    this.ioClient.emit(signals.checkIsConnected, JSON.stringify(params));
  }

  startBot(params) {
    this.ioClient.emit(signals.startBot, JSON.stringify(params));
  }

  stopBot(params) {
    this.ioClient.emit(signals.stopBot, JSON.stringify(params));
  }

  checkIsBotStarted(params) {
    this.ioClient.emit(signals.checkIsBotStarted, JSON.stringify(params));
  }

  setBotStarted(data) {
    this.botStarted.emit(data);
  }
}
