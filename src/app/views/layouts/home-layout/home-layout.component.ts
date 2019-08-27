import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, GlobalVariableService, SocketIoService} from '@app/_services';
import {Router} from '@angular/router';
import strings from '@core/strings';
import routes from '@core/routes';
import signals from '@core/signals';
import {environment} from "@environments/environment";
import SocketIOClient from 'socket.io-client';
import numeral from 'numeral';
import {DeleteModalComponent} from '@app/views/partials/common-dialogs/delete-modal.component';
import {first} from 'rxjs/operators';
import {MDBModalRef, MDBModalService} from 'ng-uikit-pro-standard';

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
  // prices: {};
  price: 0;
  direction: 1;
  modalRef: MDBModalRef;

  // ioClient = SocketIOClient(environment.socketIOUrl, {
  //   reconnection: true,
  //   reconnectionDelay: 2000,
  //   reconnectionDelayMax: 4000,
  //   reconnectionAttempts: Infinity
  // });
  @ViewChild('sidenav', { static: true }) public sidenav: any;

  constructor(private authService: AuthenticationService,
              private globalVariableService: GlobalVariableService,
              private socketIoService: SocketIoService,
              private modalService: MDBModalService,
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
    this.socketIoService.getXbtusdInfo()
      .subscribe(info => {
        this.price = info['price'];
        this.direction = info['direction'];
      });

    // this.ioClient.on(signals.price, (data) => {
    //   this.prices = JSON.parse(data);
    //   this.price = numeral(this.prices['XBTUSD']['price']).format('0,0.0');
    //   this.direction = this.prices['XBTUSD']['direction'];
    // });
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
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(DeleteModalComponent, modalOptions);
    this.modalRef.content.title = strings.exitConfirmation;
    this.modalRef.content.message = strings.doYouWantToQuit;
    this.modalRef.content.yesButtonClicked.subscribe(() => {
      this.authService.signOut();
      this.router.navigate([routes.auth]);
    });
  }
}
