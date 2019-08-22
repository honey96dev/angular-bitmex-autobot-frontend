import { Component, OnInit } from '@angular/core';
import strings from '@core/strings';
// import {environment} from "@environments/environment";
// import SocketIOClient from 'socket.io-client';

// let authLayout;

@Component({
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  strings = strings;

  constructor() {
    // authLayout = this;
  }

  ngOnInit() {
  }

  // sendSignoutSignal() {
  //   if (authLayout.pingTimoutId) {
  //     clearTimeout(authLayout.pingTimoutId);
  //   }
  //   authLayout.pingTimoutId = setTimeout(authLayout.sendSignoutSignal, environment.pingTimeoutDelay);
  //   authLayout.ioClient.emit('user-signout');
  // }

}
