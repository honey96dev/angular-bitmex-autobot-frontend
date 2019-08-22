import {Component, OnInit} from '@angular/core';
import {MDBModalRef} from 'ng-uikit-pro-standard';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs';
import strings from '@core/strings';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {GlobalVariableService} from '@app/_services';

@Component({
  selector: 'home-register-bots-modal',
  templateUrl: './register-bots-modal.component.html',
  styleUrls: ['./register-bots-modal.component.scss']
})
export class RegisterBotsModalComponent implements OnInit {
  strings = strings;
  form: FormGroup;
  // headElements = ['Name', 'Exchange', 'Currency', 'Order Type', 'Strategy', 'Leverage', 'Quantity', 'Price', 'T/P %', 'S/L %'];
  public editableRow: { id:string, name: string, exchange: string, symbol: string, orderType: string, strategy: string, leverage: string, quantity: BigInteger, price: BigInteger, tpPercent: number, slPercent: number, tsPercent: number, numberOfSafeOrder: number, closeOrder1: boolean, newOrderOnSLPrice: boolean, valueOfLastCloseOrder: number, timesRepeatSameLogic1: number, closeOrder2: boolean, breakdownPriceForNewOrder: number, timeIntervalAfterClose: number, timesRepeatSameLogic2: boolean };
  public saveButtonClicked: Subject<any> = new Subject<any>();

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private globalVariableService: GlobalVariableService) {
    titleService.setTitle(`${strings.registerBots}-${strings.siteName}`);
    globalVariableService.setNavbarTitle(strings.registerBots);
  }

  ngOnInit() {
    const row = this.editableRow || {id:'', name: '', exchange: '', symbol: '', orderType: 'Limit', strategy: 'Long', leverage: 'Cross', quantity: 0, price: 0, tpPercent: 0, slPercent: 0, tsPercent: 0, numberOfSafeOrder: 0, closeOrder1: false, newOrderOnSLPrice: false, valueOfLastCloseOrder: 0, timesRepeatSameLogic1: 0, closeOrder2: false, breakdownPriceForNewOrder: 0, timeIntervalAfterClose: 0, timesRepeatSameLogic2: false};
    this.form = this.formBuilder.group({
      id: new FormControl({value: '', disabled: true}),
      name: new FormControl('', Validators.required),
      exchange: new FormControl('', Validators.required),
      symbol: new FormControl('', Validators.required),
      orderType: new FormControl('', Validators.required),
      strategy: new FormControl('', Validators.required),
      leverage: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      tpPercent: new FormControl('', Validators.required),
      slPercent: new FormControl('', Validators.required),
      trailingStop: new FormControl('', Validators.required),
      numberOfSafeOrder: new FormControl('', Validators.required),
      closeOrder1: new FormControl('', Validators.required),
      newOrderOnSLPrice: new FormControl('', Validators.required),
      valueOfLastCloseOrder: new FormControl('', Validators.required),
      timesRepeatSameLogic1: new FormControl('', Validators.required),
      closeOrder2: new FormControl('', Validators.required),
      breakdownPriceForNewOrder: new FormControl('', Validators.required),
      timeIntervalAfterClose: new FormControl('', Validators.required),
      timesRepeatSameLogic2: new FormControl('', Validators.required),
    });
    this.form.controls['id'].patchValue(row.id);
    this.form.controls['name'].patchValue(row.name);
    this.form.controls['exchange'].patchValue(row.exchange);
    this.form.controls['symbol'].patchValue(row.symbol);
    this.form.controls['orderType'].patchValue(!!row.orderType ? row.orderType : 'Limit');
    this.form.controls['strategy'].patchValue(!!row.strategy ? row.strategy : 'Long');
    this.form.controls['leverage'].patchValue(!!row.leverage ? row.leverage : 'Cross');
    this.form.controls['quantity'].patchValue(row.quantity);
    this.form.controls['price'].patchValue(row.price);
    this.form.controls['tpPercent'].patchValue(row.tpPercent);
    this.form.controls['slPercent'].patchValue(row.slPercent);
    this.form.controls['trailingStop'].patchValue(row.slPercent);
    this.form.controls['numberOfSafeOrder'].patchValue(row.numberOfSafeOrder);
    this.form.controls['closeOrder1'].patchValue(row.closeOrder1);
    this.form.controls['newOrderOnSLPrice'].patchValue(row.newOrderOnSLPrice);
    this.form.controls['valueOfLastCloseOrder'].patchValue(row.valueOfLastCloseOrder);
    this.form.controls['timesRepeatSameLogic1'].patchValue(row.timesRepeatSameLogic1);
    this.form.controls['closeOrder2'].patchValue(row.closeOrder2);
    this.form.controls['breakdownPriceForNewOrder'].patchValue(row.breakdownPriceForNewOrder);
    this.form.controls['timeIntervalAfterClose'].patchValue(row.timeIntervalAfterClose);
    this.form.controls['timesRepeatSameLogic2'].patchValue(row.timesRepeatSameLogic2);
  }

  editRow() {
    this.editableRow = this.form.getRawValue();
    this.saveButtonClicked.next(this.editableRow);
    // this.modalRef.hide();
  }

  get f() {
    return this.form.controls;
  }
}
