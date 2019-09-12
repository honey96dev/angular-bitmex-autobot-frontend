import {Component, OnInit} from '@angular/core';
import strings from '@core/strings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {AuthenticationService, GlobalVariableService, SettingsService, SocketIoService} from '@app/_services';
import _ from 'lodash';
import numeral from 'numeral';
import {first} from 'rxjs/operators';

let self;

@Component({
  selector: 'wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  strings = strings;
  form: FormGroup;
  arrow = {
    show: false,
    type: '',
    message: '',
  };
  apiKey: {};
  loading = false;
  submitted = false;
  error = '';

  wallets: [];
  positions: [];

  wallet: object;
  position: object;

  walletBalance: number = 0;
  unrealizedPNL: number = 0;
  marginBalance: number = 0;
  positionMargin: number = 0;
  orderMargin: number = 0;
  availableBalance: number = 0;

  walletBalance2: string;
  unrealizedPNL2: string;
  marginBalance2: string;
  positionMargin2: string;
  orderMargin2: string;
  availableBalance2: string;

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private authService: AuthenticationService,
                     private settingsService: SettingsService,
                     private globalsService: GlobalVariableService,
                     private socketIOService: SocketIoService) {
    self = this;
  }

  ngOnInit() {
    this.socketIOService.getWallet()
      .subscribe(data => {
        this.wallets = data;
        // console.log('wallet', data);
        this.wallet = data[0];
        this.walletBalance = data[0]['amount'];
        this.calculateWallet();
    });
    this.socketIOService.getPosition()
      .subscribe(data => {
        this.positions = data;
        // console.log('position', data);
        if (data.length > 0) {
          this.position = data[0];
          this.unrealizedPNL = data[0]['unrealisedPnl'];
          this.positionMargin = data[0]['posMargin'];
        } else {
          this.unrealizedPNL = 0;
          this.positionMargin = 0;
        }
        this.calculateWallet();
    });
    this.calculateWallet();
    this.loadApiKey();
  }

  // sendSignoutSignal() {
  //   if (authLayout.pingTimoutId) {
  //     clearTimeout(authLayout.pingTimoutId);
  //   }
  //   authLayout.pingTimoutId = setTimeout(authLayout.sendSignoutSignal, environment.pingTimeoutDelay);
  //   authLayout.ioClient.emit('user-signout');
  // }

  loadApiKey() {
    const userId = this.authService.currentUserValue.id;
    this.apiKey = this.settingsService.loadApkKey({userId}).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.apiKey = res['data'];
          console.log(this.apiKey);
          this.socketIOService.checkIsConnected(this.apiKey);
          this.socketIOService.checkIsBotStarted({
            userId: userId,
            apiKey: this.apiKey,
          })
        }
      });
  }

  calculateWallet() {
    this.marginBalance = this.walletBalance + this.unrealizedPNL;
    this.availableBalance = this.marginBalance - this.positionMargin - this.orderMargin;

    const divider = 100000000;
    this.walletBalance2 = numeral(this.walletBalance / divider).format('0,0.0000');
    this.unrealizedPNL2 = numeral(this.unrealizedPNL / divider).format('0,0.0000');
    this.marginBalance2 = numeral(this.marginBalance / divider).format('0,0.0000');
    this.positionMargin2 = numeral(this.positionMargin / divider).format('0,0.0000');
    this.orderMargin2 = numeral(this.orderMargin / divider).format('0,0.0000');
    this.availableBalance2 = numeral(this.availableBalance / divider).format('0,0.0000');
  }

}
