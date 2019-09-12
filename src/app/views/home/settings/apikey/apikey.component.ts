import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, SettingsService, SocketIoService} from '@app/_services';
import {first} from 'rxjs/operators';
import {QuestionModalComponent} from '@app/views/partials/common-dialogs/question/question-modal.component';
import {MDBModalRef, MDBModalService} from 'ng-uikit-pro-standard';

@Component({
  selector: 'home-apikey',
  templateUrl: './apikey.component.html',
  styleUrls: ['./apikey.component.scss']
})
export class ApikeyComponent implements OnInit {
  strings = strings;
  routes = routes;

  form: FormGroup;
  loading = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };
  modalRef: MDBModalRef;
  apiKey: {};
  connected: boolean = false;

  nets = [
    {value: 0, label: 'BitMEX'},
    {value: 1, label: 'Testnet'},
  ];

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private globalVariableService: GlobalVariableService,
              private service: SettingsService,
              private authService: AuthenticationService,
              private socketIOService: SocketIoService,
              private settingsService: SettingsService,
              private modalService: MDBModalService) {
    titleService.setTitle(`${strings.settings} - ${strings.siteName}`);
  }

  ngOnInit() {
    this.globalVariableService.setNavbarTitle(`${strings.settings} - ${strings.connetAnExchange}`);

    this.form = this.formBuilder.group({
      // name: new FormControl('', Validators.required),
      testnet: new FormControl('', Validators.required),
      apiKey: new FormControl('', Validators.required),
      apiKeySecret: new FormControl('', Validators.required),
    });

    this.socketIOService.isConnected()
      .subscribe(data => {
        this.connected = data;
        console.log('connected', data);
      });
    this.loadApiKey();
  }

  get f() {
    return this.form.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  loadApiKey() {
    const f = this.f;
    const userId = this.authService.currentUserValue.id;
    this.service.loadApkKey({userId}).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          f.testnet.patchValue(res['data']['testnet']);
          f.apiKey.patchValue(res['data']['apiKey']);
          f.apiKeySecret.patchValue(res['data']['apiKeySecret']);
          this.apiKey = res['data'];
          this.socketIOService.checkIsConnected(this.apiKey);
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

  clearApiKey() {
    if (this.connected) {
      const modalOptions = {
        class: 'modal-dialog-centered',
      };

      this.modalRef = this.modalService.show(QuestionModalComponent, modalOptions);
      this.modalRef.content.title = strings.clear;
      this.modalRef.content.message = strings.doYouWantToDisconnect2;
      this.modalRef.content.yesButtonColor = 'danger';
      this.modalRef.content.yesButtonClicked.subscribe(() => {
        this.socketIOService.disconnectFromExchange(this.apiKey);
        this._clearApiKey();
      });
    } else {
      this._clearApiKey();
    }
  }

  _clearApiKey() {
    const f = this.f;
    f.testnet.patchValue('0');
    f.apiKey.patchValue('');
    f.apiKeySecret.patchValue('');
    const testnet = f.testnet.value;
    const apiKey = f.apiKey.value;
    const apiKeySecret = f.apiKeySecret.value;
    const userId = this.authService.currentUserValue.id;
    const data = {
      userId, testnet, apiKey, apiKeySecret
    };
    // this.loading = true;
    this.alert.show = false;
    this.service.saveApiKey(data).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.socketIOService.disconnectFromExchange({userId});
        } else {
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: res.message,
          };
        }
      }, error => {
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }

  submit() {
    // console.log('submit');
    const f = this.f;
    // const id = f.id.value;
    // const name = f.name.value;
    const testnet = f.testnet.value;
    const apiKey = f.apiKey.value;
    const apiKeySecret = f.apiKeySecret.value;
    const userId = this.authService.currentUserValue.id;

    const data = {
      userId, testnet, apiKey, apiKeySecret
    };

    // this.loading = true;
    this.alert.show = false;
    this.service.saveApiKey(data).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.alert = {
            show: true,
            type: 'alert-success',
            message: res.message,
          };
          this.apiKey = {
            testnet, apiKey, apiKeySecret
          };
          this.socketIOService.checkIsConnected(this.apiKey);
          this.socketIOService.checkIsBotStarted({
            userId: userId,
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
    // this.loading = false;
  }
}
