import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, RegisterApikeysService} from '@app/_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'home-register-apikeys-modal',
  templateUrl: './register-apikeys-modal.component.html',
  styleUrls: ['./register-apikeys-modal.component.scss']
})
export class RegisterApikeysModalComponent implements OnInit {
  strings = strings;
  routes = routes;
  form: FormGroup;

  public editableRow: { id:string, name: string, apiKey: string, apiKeySecret: string };

  loading = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private globalVariableService: GlobalVariableService,
              private service: RegisterApikeysService,
              private authService: AuthenticationService) {
    titleService.setTitle(`${strings.registerApikeys} - ${strings.siteName}`);
  }

  ngOnInit() {
    const row = this.service.editableRowValue();
    this.globalVariableService.setNavbarTitle(`${strings.registerApikeys} - ${row.id ? strings.edit : strings.add}`);
    this.form = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      testnet: new FormControl('', Validators.required),
      apiKey: new FormControl('', Validators.required),
      apiKeySecret: new FormControl('', Validators.required),
    });
    console.log(row);
    this.f['id'].patchValue(row.id);
    this.f['name'].patchValue(row.name);
    this.f['testnet'].patchValue(row.testnet);
    this.f['apiKey'].patchValue(row.apiKey);
    this.f['apiKeySecret'].patchValue(row.apiKeySecret);
  }

  get f() {
    return this.form.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  goBack() {
    this.router.navigate([routes.registerApikeys]);
  }

  submit() {
    // console.log('submit');
    const f = this.f;
    const id = f.id.value;
    const name = f.name.value;
    const testnet = f.testnet.value;
    const apiKey = f.apiKey.value;
    const apiKeySecret = f.apiKeySecret.value;
    const userId = this.authService.currentUserValue.id;

    const data = {
      id, userId, name, testnet: testnet ? 1 : 0, apiKey, apiKeySecret
    };

    this.loading = true;
    this.alert.show = false;
    let backend;
    if (id) {
      backend = this.service.edit(data);
    } else {
      backend = this.service.add(data);
    }
    backend.pipe(first())
      .subscribe(res => {
        this.loading = false;
        if (res.result == 'success') {
          this.alert = {
            show: true,
            type: 'alert-success',
            message: res.message,
          };
          f.id.patchValue(res.data.insertId);
          this.globalVariableService.setNavbarTitle(`${strings.registerApikeys} - ${strings.edit}`);
          // this.router.navigate([this.returnUrl]);
        } else {
          this.alert = {
            show: true,
            type: 'alert-danger',
            message: res.message,
          };
        }
      }, error => {
        this.loading = false;
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }
}
