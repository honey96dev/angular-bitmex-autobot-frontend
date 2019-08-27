import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, SettingsService} from '@app/_services';
import {first} from 'rxjs/operators';

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

  nets = [
    {value: '0', label: 'Realnet'},
    {value: '1', label: 'Testnet'},
  ];

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private globalVariableService: GlobalVariableService,
              private service: SettingsService,
              private authService: AuthenticationService) {
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
    const res = this.service.loadApkKey({userId});
    f.testnet.patchValue(res['testnet']);
    f.apiKey.patchValue(res['apiKey']);
    f.apiKeySecret.patchValue(res['apiKeySecret']);
  }

  clearApiKey() {
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
    this.service.saveApiKey(data);
    this.alert = {
      show: true,
      type: 'alert-success',
      message: strings.successfullyCleared,
    };
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
    this.service.saveApiKey(data);
    this.alert = {
      show: true,
      type: 'alert-success',
      message: strings.successfullySaved,
    };
    // this.loading = false;
  }
}
