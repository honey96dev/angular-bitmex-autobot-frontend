import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, SettingsService} from '@app/_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'home-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  strings = strings;
  routes = routes;

  form: FormGroup;
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
              private service: SettingsService,
              private authService: AuthenticationService) {
    titleService.setTitle(`${strings.settings}-${strings.siteName}`);
  }

  ngOnInit() {
    this.globalVariableService.setNavbarTitle(strings.settings);

    this.form = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password2: new FormControl('', [Validators.required, Validators.minLength(4)]),
    });
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
    const f = this.f;
    // const name = f.name.value;
    const oldPassword = f.oldPassword.value;
    const password = f.password.value;
    const userId = this.authService.currentUserValue.id;

    const data = {
      userId, oldPassword, password
    };

    this.loading = true;
    this.alert.show = false;
    this.service.password(data).pipe(first())
      .subscribe(res => {
        this.loading = false;
        if (res.result == 'success') {
          this.alert = {
            show: true,
            type: 'alert-success',
            message: res.message,
          };
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
          message: 'Unknown server error',
        };
      });
  }
}
