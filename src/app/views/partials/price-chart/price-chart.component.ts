import {Component, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";
import strings from "@core/strings";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Title} from "@angular/platform-browser";
import {AuthenticationService, ChartDataService, GlobalVariableService, SettingsService} from '@app/_services';
import {first} from "rxjs/operators";

let self;
declare const TradingView: any;

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
  //
  // chartTimeoutId = null;
  // openData = {
  //   name: 'Open',
  //   x: [],
  //   y: [],
  //   type: 'scatter',
  //   // opacity: 0.2,
  // };
  // ohlcData = {
  //   name: 'Candlestick',
  //   x: [],
  //   open: [],
  //   high: [],
  //   low: [],
  //   close: [],
  //   type: 'candlestick',
  //   mode: 'lines+points',
  //   marker: {
  //     line: {
  //       width: 2,
  //     }
  //   },
  // };
  // graph = {
  //   data: [
  //     this.openData,
  //     // this.ohlcData,
  //   ],
  //   // data: [
  //   //   { x: this.ohlcData.x, y: this.ohlcData.y, type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
  //   // ],
  //   layout: {
  //     height: 600,
  //     autosize: true,
  //     xaxis: {
  //       autorange: true,
  //       rangeslider: {},
  //       title: 'Date',
  //       type: 'date',
  //     },
  //     yaxis: {
  //       title: 'Price',
  //       autorange: true,
  //       rangeslider: {},
  //       type: 'linear',
  //     },
  //   },
  // };

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private globalsService: GlobalVariableService,
                     private authService: AuthenticationService,
                     private settingsService: SettingsService,
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
    // this.onSubmit();
    this.initTradingView();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }

  initTradingView() {
    // new TradingView.widget(
    //   {
    //     // autosize: true,
    //     width: '100%',
    //     height: 500,
    //     "symbol": "BITMEX:XBTUSD",
    //     "interval": "D",
    //     "timezone": "Etc/UTC",
    //     "theme": "Light",
    //     "style": "1",
    //     "locale": "en",
    //     "toolbar_bg": "#f1f3f6",
    //     "enable_publishing": false,
    //     "withdateranges": true,
    //     "hide_side_toolbar": false,
    //     "allow_symbol_change": true,
    //     container_id: "tradingview_f211b"
    //   }
    // );
    const userId = this.authService.currentUserValue.id;
    this.settingsService.loadPersonalChart({userId}).pipe(first())
      .subscribe(res => {
        if (res.result === 'success' && res.data.length > 0) {
          // console.log(res);
          new TradingView.chart(
            {
              // autosize: true,
              width: '100%',
              height: 500,
              chart: res.data,
              // chart: 'GDxo0kR7',
              container_id: "tradingview_f211b"
            }
          );
        }
      }, error => {

      });
  }

  onSubmit() {
    // if (self.chartTimeoutId) {
    //   clearTimeout(self.chartTimeoutId);
    // }
    //
    // self.submitted = true;
    // self.loading = true;
    // self.arrow.show = false;
    //
    // // const symbol = self.f.symbol.value;
    // // const symbol = self.symbol;
    // const binSize = '5m';
    // const datePipe = new DatePipe('en');
    // // const startTime = datePipe.transform(self.f.startTime.value, 'yyyy-MM-dd');
    // // const endTime = datePipe.transform(self.f.endTime.value, 'yyyy-MM-dd');
    // // const timezone = self.f.timezone.value;
    //
    // self.service.price({
    //   symbol: 'XBTUSD',
    //   binSize,
    //   startTime: null,
    //   endTime: null,
    //   timezone: 0,
    // })
    //   .pipe(first())
    //   .subscribe(res => {
    //     self.loading = false;
    //     self.arrow.show = false;
    //
    //     self.openData.x = [];
    //     self.openData.y = [];
    //     self.ohlcData.x = [];
    //     self.ohlcData.open = [];
    //     self.ohlcData.high = [];
    //     self.ohlcData.low = [];
    //     self.ohlcData.close = [];
    //     if (res.result == 'success') {
    //       const data = res.data;
    //
    //       if (data.length === 0) {
    //         self.arrow = {
    //           show: true,
    //           type: 'warning',
    //           message: strings.noData,
    //         };
    //       } else {
    //         for (let item of data) {
    //           self.openData.x.push(item['timestamp']);
    //           self.openData.y.push(item['open']);
    //           self.ohlcData.x.push(item['timestamp']);
    //           self.ohlcData.open.push(item['open']);
    //           self.ohlcData.high.push(item['high']);
    //           self.ohlcData.low.push(item['low']);
    //           self.ohlcData.close.push(item['close']);
    //         }
    //       }
    //     } else {
    //       self.arrow = {
    //         show: true,
    //         type: 'danger',
    //         message: res.message,
    //       };
    //     }
    //   }, error => {
    //     self.loading = false;
    //     self.error = error;
    //     self.arrow = {
    //       show: true,
    //       type: 'danger',
    //       message: strings.unknownServerError,
    //     };
    //     self.openData.x = [];
    //     self.openData.y = [];
    //     self.ohlcData.x = [];
    //     self.ohlcData.open = [];
    //     self.ohlcData.high = [];
    //     self.ohlcData.low = [];
    //     self.ohlcData.close = [];
    //   });
    //
    // let timeoutDelay = 2 * 60 * 1000;
    // self.globalsService.chartTimeoutId = setTimeout(self.onSubmit, timeoutDelay);
  }
}
