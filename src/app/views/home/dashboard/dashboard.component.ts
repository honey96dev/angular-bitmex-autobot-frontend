import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService, GlobalVariableService, SettingsService, SocketIoService} from '@app/_services/';
import {first} from "rxjs/operators";
import strings from '@core/strings';
import {environment} from "@environments/environment";
import SocketIOClient from 'socket.io-client';

@Component({
  selector: 'home-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  strings = strings;
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  alert = {
    show: false,
    type: '',
    message: '',
  };
  apiKey: {};

  connected: boolean = false;

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private route: ActivatedRoute,
                     private router: Router,
                     private authenticationService: AuthenticationService,
                     private globalVariableService: GlobalVariableService,
                     private socketIOService: SocketIoService,
                     private settingsService: SettingsService
  ) {
    titleService.setTitle(`${strings.dashboard} - ${strings.siteName}`);
    globalVariableService.setNavbarTitle(strings.dashboard);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.socketIOService.isConnected()
      .subscribe(data => {
        this.connected = data;
      });
    this.loadApiKey();
  }
  loadApiKey() {
    const userId = this.authenticationService.currentUserValue.id;
    this.settingsService.loadApkKey({userId}).pipe(first())
      .subscribe(res => {
        // this.loading = false;
        if (res.result == 'success') {
          this.apiKey = res['data'];
          // console.log(this.apiKey);
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
  }

  closeAlert() {
    this.alert.show = false;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    const email = this.f.email.value;
    const password = this.f.password.value;

    this.loading = true;
    this.authenticationService.signIn(email, password)
      .pipe(first())
      .subscribe(res => {
        this.loading = false;
        this.alert.show = false;

        if (res.result == 'success') {
          this.router.navigate([this.returnUrl]);
        } else {
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: res.message,
          };
        }
      }, error => {
        this.loading = false;
        this.error = error;
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }
}
