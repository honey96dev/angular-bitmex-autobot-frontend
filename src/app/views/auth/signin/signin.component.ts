import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthenticationService} from "@app/_services/";
import {first} from "rxjs/operators";
import strings from '@core/strings';
import routes from '@core/routes';
import {environment} from "@environments/environment";
import SocketIOClient from 'socket.io-client';

@Component({
  selector: 'auth-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  strings = strings;
  routes = routes;
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  alert = {
    show: false,
    type: '',
    message: '',
  };
  passwordDisplayType: string = 'password';

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private route: ActivatedRoute,
                     private router: Router,
                     private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
    titleService.setTitle(`${strings.signIn} - ${strings.siteName}`);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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

    console.log(this.f.password)

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
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }
}
