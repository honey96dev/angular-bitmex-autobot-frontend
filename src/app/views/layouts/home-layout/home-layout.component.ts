import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService, GlobalVariableService, SocketIoService, SettingsService} from '@app/_services';
import {Router} from '@angular/router';
import strings from '@core/strings';
import routes from '@core/routes';
import signals from '@core/signals';
import {environment} from "@environments/environment";
import SocketIOClient from 'socket.io-client';
import numeral from 'numeral';
import {AlertModalComponent} from '@app/views/partials/common-dialogs/alert/alert-modal.component';
import {QuestionModalComponent} from '@app/views/partials/common-dialogs/question/question-modal.component';
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
  navbarTitle: string = '';
  // prices: {};
  price: 0;
  direction: 1;
  modalRef: MDBModalRef;
  userId;
  apiKey: any = {};
  apiKeyValid = false;
  connected: boolean = false;
  botStarted: boolean = false;
  username: string = '';
  firstName: string = '';
  lastName: string = '';

  connecting = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

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
              private settingsService: SettingsService,
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
    this.socketIoService.isConnected()
      .subscribe(connected => {
        this.connected = connected;
        if (connected) {
          // this.settingsService.connectToExchange(this.apiKey).pipe(first())
          //   .subscribe(res => {
          //     this.connecting = false;
          //     if (res.result == 'success') {
          //       this.username = res.data.username;
          //       this.firstName = res.data.firstname;
          //       this.lastName = res.data.lastname;
          //     } else {
          //     }
          //   }, error => {
          //   });
        }
      });
    this.socketIoService.userValue()
      .subscribe(data => {
        this.username = data.username;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
      });
    this.socketIoService.isBotStarted()
      .subscribe(data => {
        this.botStarted = data['started'];
        if (data['message'] != strings.generalReply) {
          const modalOptions = {
            class: 'modal-dialog-centered',
          };
          this.modalRef = this.modalService.show(AlertModalComponent, modalOptions);
          this.modalRef.content.title = strings.botStatus;
          this.modalRef.content.message = data['message'];
          this.modalRef.content.yesButtonColor = 'primary';
        }
      });
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
    this.userId = this.authService.currentUserValue.id;
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
    this.settingsService.loadApkKey({userId: this.userId}).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.apiKey = res['data'];
          // console.log(this.apiKey);
          this.socketIoService.checkIsConnected(this.apiKey);
          this.socketIoService.checkIsBotStarted({
            userId: this.userId,
            apiKey: this.apiKey,
          })
        } else {
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: res.message,
          };
        }
      }, error => {
        // this.loading = false;
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }

  onClickNav(route) {
    this.route = route;
    // this.router.navigate(route);
  }

  onConnectToExchange() {
    this.connecting = true;
    const userId = this.authService.currentUserValue.id;
    this.settingsService.loadApkKey({userId}).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.apiKey = res['data'];

          this.settingsService.connectToExchange(this.apiKey).pipe(first())
            .subscribe(res => {
              this.connecting = false;
              if (res.result == 'success') {
                this.apiKey['connected'] = 1;
                // this.settingsService.saveApiKey(this.apiKey);
                this.alert = {
                  show: true,
                  type: 'alert-success',
                  message: res.message,
                };

                const modalOptions = {
                  class: 'modal-dialog-centered',
                };
                this.modalRef = this.modalService.show(AlertModalComponent, modalOptions);
                this.modalRef.content.title = strings.connetAnExchange;
                this.modalRef.content.message = res.message;
                this.modalRef.content.yesButtonColor = 'primary';

                this.username = res.data.username;
                this.firstName = res.data.firstname;
                this.lastName = res.data.lastname;

                // console.log('connectToExchange', this.username, this.firstName, this.lastName);
                this.socketIoService.setConnected(true, res.data);
                this.socketIoService.connectToExchange(this.apiKey, {username: this.username, firstName: this.firstName, lastName: this.lastName});
              } else {
                this.alert = {
                  show: true,
                  type: 'alert-danger',
                  message: res.message,
                };

                const modalOptions = {
                  class: 'modal-dialog-centered',
                };
                this.modalRef = this.modalService.show(AlertModalComponent, modalOptions);
                this.modalRef.content.title = strings.connetAnExchange;
                this.modalRef.content.message = res.message;
                this.modalRef.content.yesButtonColor = 'danger';
              }
            }, error => {
              this.connecting = false;
              this.alert = {
                show: true,
                type: 'alert-danger',
                message: strings.unknownServerError,
              };

              const modalOptions = {
                class: 'modal-dialog-centered',
              };
              this.modalRef = this.modalService.show(AlertModalComponent, modalOptions);
              this.modalRef.content.title = strings.connetAnExchange;
              this.modalRef.content.message = strings.unknownServerError;
              this.modalRef.content.yesButtonColor = 'danger';
            });
        } else {
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: res.message,
          };
        }
      }, error => {
        // this.loading = false;
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });

  }

  onDisconnect() {
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(QuestionModalComponent, modalOptions);
    this.modalRef.content.title = strings.disconnect;
    this.modalRef.content.message = strings.doYouWantToDisconnect;
    this.modalRef.content.yesButtonColor = 'danger';
    this.modalRef.content.yesButtonClicked.subscribe(() => {
      this.settingsService.loadApkKey({userId: this.userId}).pipe(first())
        .subscribe(res => {
          // this.loading = false;
          if (res.result == 'success') {
            this.apiKey = res['data'];
            this.socketIoService.disconnectFromExchange(this.apiKey);
          } else {
            this.alert = {
              show: true,
              type: 'alert-danger',
              message: res.message,
            };
          }
        }, error => {
          // this.loading = false;
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: strings.unknownServerError,
          };
        });
    });
  }

  onStartBot() {
    const {testnet, apiKey, apiKeySecret} = this.apiKey;
    this.socketIoService.startBot({
      userId: this.userId,
      testnet,
      apiKey,
      apiKeySecret,
    });
  }

  onStopBot() {
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(QuestionModalComponent, modalOptions);
    this.modalRef.content.title = strings.stopBot;
    this.modalRef.content.message = strings.doYouWantToStop;
    this.modalRef.content.yesButtonColor = 'danger';
    this.modalRef.content.yesButtonClicked.subscribe(() => {
      const {testnet, apiKey, apiKeySecret} = this.apiKey;
      this.socketIoService.stopBot({
        userId: this.userId,
        testnet,
        apiKey,
        apiKeySecret,
      });
    });

  }

  onSignOut() {
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(QuestionModalComponent, modalOptions);
    this.modalRef.content.title = strings.exitConfirmation;
    this.modalRef.content.message = strings.doYouWantToQuit;
    this.modalRef.content.yesButtonColor = 'danger';
    this.modalRef.content.yesButtonClicked.subscribe(() => {
      this.authService.signOut();
      this.router.navigate([routes.auth]);
    });
  }
}
