import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, SettingsService} from '@app/_services';
import {first} from 'rxjs/operators';

@Component({
  selector: 'home-personal-chart',
  templateUrl: './personal-chart.component.html',
  styleUrls: ['./personal-chart.component.scss']
})
export class PersonalChartComponent implements OnInit {
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
    titleService.setTitle(`${strings.settings} - ${strings.siteName}`);
  }

  ngOnInit() {
    this.globalVariableService.setNavbarTitle(`${strings.settings} - ${strings.resetPassword}`);

    this.form = this.formBuilder.group({
      chartId: new FormControl(''),
    });

    this.loadData();
  }

  get f() {
    return this.form.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  loadData() {
    const f = this.f;
    const userId = this.authService.currentUserValue.id;
    this.service.loadPersonalChart({userId}).pipe(first())
      .subscribe(res => {
        if (res.result == 'success') {
          f.chartId.patchValue(res.data);
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
    const f = this.f;
    // const name = f.name.value;
    const chartId = f.chartId.value;
    const userId = this.authService.currentUserValue.id;

    const data = {
      userId, chartId,
    };

    this.loading = true;
    this.alert.show = false;
    this.service.savePersonalChart(data).pipe(first())
      .subscribe(res => {
        // this.loading = false;
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
        // this.loading = false;
        this.alert = {
          show: true,
          type: 'alert-danger',
          message: strings.unknownServerError,
        };
      });
  }
}
