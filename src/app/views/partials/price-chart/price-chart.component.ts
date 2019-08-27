import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import strings from "@core/strings";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {ChartDataService} from "@app/_services";
import {first} from "rxjs/operators";
import {GlobalVariableService} from "@app/_services/global-variable.service";

let self;

@Component({
  selector: 'price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss']
})
export class PriceChartComponent implements OnInit {
  strings = strings;
  form: FormGroup;
  arrow = {
    show: false,
    type: '',
    message: '',
  };
  loading = false;
  submitted = false;
  error = '';

  chartTimeoutId = null;
  priceData = {
    x: [],
    y: [],
    type: 'scatter',
    // mode: 'lines+points',
    // marker: {color: 'red'}
  };
  graph = {
    data: [this.priceData],
    // data: [
    //   { x: this.priceData.x, y: this.priceData.y, type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
    // ],
    layout: {
      height: 600,
      autosize: true,
      // margin: {
      //   l: 40,
      //   r: 40,
      //   t: 30,
      //   b: 30,
      // },
      xaxis: {
        autorange: true,
        rangeslider: {},
        title: 'Date',
        type: 'date',
      },
      yaxis: {
        title: 'Price',
        autorange: true,
        type: 'linear',
      },
    },
  };

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private globalsService: GlobalVariableService,
                     private service: ChartDataService) {
    self = this;
  }

  ngOnInit() {
    // this.form = this.formBuilder.group({
    //   symbol: [''],
    //   startTime: [''],
    //   endTime: [''],
    //   timezone: ['', Validators.required],
    // });
    // this.f.symbol.setValue(this.symbol);
    // this.f.timezone.setValue(0);
    this.onSubmit();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    if (self.chartTimeoutId) {
      clearTimeout(self.chartTimeoutId);
    }

    self.submitted = true;
    self.loading = true;
    self.arrow.show = false;

    // const symbol = self.f.symbol.value;
    // const symbol = self.symbol;
    const binSize = '5m';
    const datePipe = new DatePipe('en');
    // const startTime = datePipe.transform(self.f.startTime.value, 'yyyy-MM-dd');
    // const endTime = datePipe.transform(self.f.endTime.value, 'yyyy-MM-dd');
    // const timezone = self.f.timezone.value;

    self.service.price({
      symbol: 'XBTUSD',
      binSize,
      startTime: null,
      endTime: null,
      timezone: 0,
    })
      .pipe(first())
      .subscribe(res => {
        self.loading = false;
        self.arrow.show = false;

        self.priceData.x = [];
        self.priceData.y = [];
        if (res.result == 'success') {
          const data = res.data;

          if (data.length === 0) {
            self.arrow = {
              show: true,
              type: 'warning',
              message: strings.noData,
            };
          } else {
            for (let item of data) {
              self.priceData.x.push(item['timestamp']);
              self.priceData.y.push(item['open']);
            }
          }
        } else {
          self.arrow = {
            show: true,
            type: 'danger',
            message: res.message,
          };
        }
      }, error => {
        self.loading = false;
        self.error = error;
        self.arrow = {
          show: true,
          type: 'danger',
          message: strings.unknownServerError,
        };
        self.priceData.x = [];
        self.priceData.y = [];
      });

    let timeoutDelay = 2 * 60 * 1000;
    self.globalsService.chartTimeoutId = setTimeout(self.onSubmit, timeoutDelay);
  }
}
