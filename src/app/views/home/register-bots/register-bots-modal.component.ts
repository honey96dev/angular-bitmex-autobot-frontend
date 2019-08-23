import {Component, OnInit} from '@angular/core';
import {MDBModalRef} from 'ng-uikit-pro-standard';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalVariableService} from '@app/_services';
import {RegisterBotsService} from '@app/_services/register-bots.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'home-register-bots-modal',
  templateUrl: './register-bots-modal.component.html',
  styleUrls: ['./register-bots-modal.component.scss']
})
export class RegisterBotsModalComponent implements OnInit {
  strings = strings;
  routes = routes;
  form: FormGroup;

  public editableRow: { id:string, name: string, exchange: string, symbol: string, apiKey: string, apiKeySecret: string, orderType: string, postOnly: boolean, strategy: string, leverage: string, leverageValue: number, quantity: BigInteger, price: BigInteger, tpPercent: number, slPercent: number, tsPercent: number, numberOfSafeOrder: number, closeOrder1: boolean, newOrderOnSLPrice: boolean, valueOfLastCloseOrder: number, timesRepeatSameLogic1: number, closeOrder2: boolean, breakdownPriceForNewOrder: number, timeIntervalAfterClose: number, timesRepeatSameLogic2: boolean };
  exchanges = [
    { value: 'bitmex', label: 'BitMEX' },
    // { value: '2', label: 'Option 2' },
    // { value: '3', label: 'Option 3' },
  ];
  symbols = [
    {label: 'Bitcoin', value: 'XBTUSD'},
    {label: 'Ethereum', value: 'ETHUSD'},
    // {label: 'Bitcoin Cash', value: 'tBABUSD'},
    // {label: 'EOS', value: 'tEOSUSD'},
    // {label: 'Litecoin', value: 'tLTCUSD'},
    // {label: 'Bitcoin SV', value: 'tBSVUSD'},
  ];

  postOnlyDisabled: boolean;
  leverageValueDisabled: boolean;

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
              private registerBotsService: RegisterBotsService) {
    titleService.setTitle(`${strings.registerBots}-${strings.siteName}`);
  }

  ngOnInit() {
    const row = this.registerBotsService.editableRowValue();
    this.globalVariableService.setNavbarTitle(`${strings.registerBots} - ${row.id ? strings.edit : strings.add}`);
    this.form = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      exchange: new FormControl('', Validators.required),
      symbol: new FormControl('', Validators.required),
      apiKey: new FormControl('', Validators.required),
      apiKeySecret: new FormControl('', Validators.required),
      orderType: new FormControl('', Validators.required),
      postOnly: new FormControl('', Validators.required),
      strategy: new FormControl('', Validators.required),
      leverage: new FormControl('', Validators.required),
      leverageValue: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      tpPercent: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      slPercent: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      trailingStop: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      numberOfSafeOrder: new FormControl('', [Validators.required, Validators.min(0)]),
      closeOrder1: new FormControl('', Validators.required),
      newOrderOnSLPrice: new FormControl('', Validators.required),
      valueOfLastCloseOrder: new FormControl('', [Validators.required, Validators.min(0)]),
      timesRepeatSameLogic1: new FormControl('', [Validators.required, Validators.min(0)]),
      closeOrder2: new FormControl('', Validators.required),
      breakdownPriceForNewOrder: new FormControl('', [Validators.required, Validators.min(0)]),
      timeIntervalAfterClose: new FormControl('', [Validators.required, Validators.min(0)]),
      timesRepeatSameLogic2: new FormControl('', [Validators.required, Validators.min(0)]),
    });
    console.log(row);
    this.f['id'].patchValue(row.id);
    this.f['name'].patchValue(row.name);
    this.f['exchange'].patchValue(row.exchange);
    this.f['symbol'].patchValue(row.symbol);
    this.f['apiKey'].patchValue(row.apiKey);
    this.f['apiKeySecret'].patchValue(row.apiKeySecret);
    this.f['orderType'].patchValue(!!row.orderType ? row.orderType : 'Limit');
    this.f['postOnly'].patchValue(!!row.postOnly ? row.postOnly : false);
    this.f['strategy'].patchValue(!!row.strategy ? row.strategy : 'Long');
    this.f['leverage'].patchValue(!!row.leverage ? row.leverage : 'Cross');
    this.f['leverageValue'].patchValue(!!row.leverageValue ? row.leverageValue : 100);
    this.f['quantity'].patchValue(row.quantity);
    this.f['price'].patchValue(row.price);
    this.f['tpPercent'].patchValue(row.tpPercent);
    this.f['slPercent'].patchValue(row.slPercent);
    this.f['trailingStop'].patchValue(row.slPercent);
    this.f['numberOfSafeOrder'].patchValue(row.numberOfSafeOrder);
    this.f['closeOrder1'].patchValue(row.closeOrder1);
    this.f['newOrderOnSLPrice'].patchValue(row.newOrderOnSLPrice);
    this.f['valueOfLastCloseOrder'].patchValue(row.valueOfLastCloseOrder);
    this.f['timesRepeatSameLogic1'].patchValue(row.timesRepeatSameLogic1);
    this.f['closeOrder2'].patchValue(row.closeOrder2);
    this.f['breakdownPriceForNewOrder'].patchValue(row.breakdownPriceForNewOrder);
    this.f['timeIntervalAfterClose'].patchValue(row.timeIntervalAfterClose);
    this.f['timesRepeatSameLogic2'].patchValue(row.timesRepeatSameLogic2);
    this.onOrderTypeChanged();
    this.onLeverageChanged();
  }

  get f() {
    return this.form.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  goBack() {
    this.router.navigate([routes.registerBots]);
  }

  submit() {
    // console.log('submit');
    const f = this.f;
    const id = f.id.value;
    const name = f.name.value;
    const exchange = f.exchange.value;
    const symbol = f.symbol.value;
    const apiKey = f.apiKey.value;
    const apiKeySecret = f.apiKeySecret.value;
    const orderType = f.orderType.value;
    const postOnly = f.postOnly.value;
    const strategy = f.strategy.value;
    const leverage = f.leverage.value;
    const leverageValue = f.leverageValue.value;
    const quantity = f.quantity.value;
    const price = f.price.value;
    const tpPercent = f.tpPercent.value;
    const slPercent = f.slPercent.value;
    const trailingStop = f.trailingStop.value;
    const numberOfSafeOrder = f.numberOfSafeOrder.value;
    const closeOrder1 = f.closeOrder1.value;
    const newOrderOnSLPrice = f.newOrderOnSLPrice.value;
    const valueOfLastCloseOrder = f.valueOfLastCloseOrder.value;
    const timesRepeatSameLogic1 = f.timesRepeatSameLogic1.value;
    const closeOrder2 = f.closeOrder2.value;
    const breakdownPriceForNewOrder = f.breakdownPriceForNewOrder.value;
    const timeIntervalAfterClose = f.timeIntervalAfterClose.value;
    const timesRepeatSameLogic2 = f.timesRepeatSameLogic2.value;

    const data = {
      id, name, exchange, symbol, apiKey, apiKeySecret, orderType, postOnly: postOnly ? 1 : 0, strategy, leverage, leverageValue, quantity, price, tpPercent, slPercent, trailingStop, numberOfSafeOrder, closeOrder1: closeOrder1 ? 1 : 0, newOrderOnSLPrice: newOrderOnSLPrice ? 1 : 0, valueOfLastCloseOrder, timesRepeatSameLogic1, closeOrder2: closeOrder2 ? 1 : 0, breakdownPriceForNewOrder, timeIntervalAfterClose, timesRepeatSameLogic2
    };

    this.loading = true;
    this.alert.show = false;
    let backend;
    if (id) {
      backend = this.registerBotsService.edit(data);
    } else {
      backend = this.registerBotsService.add(data);
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
          this.globalVariableService.setNavbarTitle(`${strings.registerBots} - ${strings.edit}`);
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
          message: 'Unknown server error',
        };
      });
  }

  onOrderTypeChanged() {
    const orderType = this.f.orderType.value;
    const postOnlyDisabled = orderType === strings.limit;
    this.postOnlyDisabled = postOnlyDisabled;
    if (postOnlyDisabled) {
      this.f.postOnly.patchValue(true);
    }
  }

  onLeverageChanged() {
    const leverage = this.f.leverage.value;
    const leverageValueDisabled = leverage === strings.cross;
    this.leverageValueDisabled = leverageValueDisabled;
    if (leverageValueDisabled) {
      this.f.leverageValue.patchValue(0);
    }
  }
}
