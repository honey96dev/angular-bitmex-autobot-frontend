import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, GlobalVariableService} from '@app/_services';
import {Router} from '@angular/router';
import strings from '@core/strings';
import routes from '@core/routes';
import signals from '@core/signals';
import {environment} from "@environments/environment";
import SocketIOClient from 'socket.io-client';
import numeral from 'numeral';

// let authLayout;

@Component({
  selector: 'home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  strings = strings;
  routes = routes;
  route: string;
  navbarTitle: string;
  prices: {};
  price: 0;
  direction: 1;

  ioClient = SocketIOClient(environment.socketIOUrl, {
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 4000,
    reconnectionAttempts: Infinity
  });
  @ViewChild('sidenav', { static: true }) public sidenav: any;

  constructor(private authService: AuthenticationService,
              private globalVariableService: GlobalVariableService,
              private router: Router) {
    // authLayout = this;
  }

  ngOnInit() {
    this.route = this.router.url;
    if (this.route === routes.app) {
      this.navbarTitle = strings.dashboard;
    } else if (this.route === routes.registerBots) {
      this.navbarTitle = strings.registerBots;
    } else if (this.route === routes.registerBotsModal) {
      this.navbarTitle = strings.registerBots;
    }
    this.globalVariableService.getNavbarTitle()
      .subscribe(title => this.navbarTitle=title);

    this.ioClient.on(signals.price, (data) => {
      this.prices = JSON.parse(data);
      this.price = numeral(this.prices['XBTUSD']['price']).format('0,0.0');
      this.direction = this.prices['XBTUSD']['direction'];
    });
  }

  // sendSignoutSignal() {
  //   if (authLayout.pingTimoutId) {
  //     clearTimeout(authLayout.pingTimoutId);
  //   }
  //   authLayout.pingTimoutId = setTimeout(authLayout.sendSignoutSignal, environment.pingTimeoutDelay);
  //   authLayout.ioClient.emit('user-signout');
  // }

  onClickNav(route) {
    this.route = route;
  }

  onSignOut() {
    this.authService.signOut();
    this.router.navigate([routes.auth]);
  }
}
