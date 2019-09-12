import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import strings from '@core/strings';
import routes from '@core/routes';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService, GlobalVariableService, RegisterBotsService} from '@app/_services';
import {first} from 'rxjs/operators';
import {MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent} from 'ng-uikit-pro-standard';
import {QuestionModalComponent} from '@app/views/partials/common-dialogs/question/question-modal.component';

@Component({
  selector: 'home-register-bots-modal',
  templateUrl: './register-bots-modal.component.html',
  styleUrls: ['./register-bots-modal.component.scss']
})
export class RegisterBotsModalComponent implements OnInit {
  strings = strings;
  routes = routes;
  mainForm: FormGroup;
  orderForm: FormGroup;
  stopForm: FormGroup;

  public editableRow: { id:string, name: string, botLogic: string, leverage: number, closeOnTrigger: boolean, orderType: string, side: string, quantity: number, limitPrice: number };
  exchanges = [
    { value: 'bitmex', label: 'BitMEX' },
    // { value: '2', label: 'Option 2' },
    // { value: '3', label: 'Option 3' },
  ];
  // symbols = [
  //   {label: 'Bitcoin', value: 'XBTUSD'},
  //   {label: 'Ethereum', value: 'ETHUSD'},
  //   // {label: 'Bitcoin Cash', value: 'tBABUSD'},
  //   // {label: 'EOS', value: 'tEOSUSD'},
  //   // {label: 'Litecoin', value: 'tLTCUSD'},
  //   // {label: 'Bitcoin SV', value: 'tBSVUSD'},
  // ];

  // postOnlyDisabled: boolean;
  // leverageValueDisabled: boolean;

  orderHeads = ['Size', 'Value', 'Entry Price', 'Mark Price', 'Liq.Price', 'Margin'];
  orders: any[] = [
    {size: 60000, value: 56.78, entryPrice: 10597.76, markPrice: 10565.81, liqPrice: 9145.0, margin: 0.6099}
  ];

  @ViewChild(MdbTableDirective, { static: true }) ordersTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) ordersPagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) orderRow: ElementRef;

  stopHeads = ['Qty', 'Order Price', 'Filled', 'Stop Price', 'Triggering Price'];
  stops: any[] = [
    {qty: -60000, orderPrice: 'Market', filled: '-', stopPrice: 10655.0, triggeringPrice: 10572.5},
  ];

  @ViewChild(MdbTableDirective, { static: true }) stopsTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) stopsPagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) stopRow: ElementRef;

  loading = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };
  modalRef: MDBModalRef;

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private globalVariableService: GlobalVariableService,
              private service: RegisterBotsService,
              private authService: AuthenticationService,
              private modalService: MDBModalService) {
    titleService.setTitle(`${strings.registerBots} - ${strings.siteName}`);
  }

  ngOnInit() {
    const row = this.service.editableRowValue();
    this.globalVariableService.setNavbarTitle(`${strings.registerBots} - ${row.id ? strings.edit : strings.add}`);
    this.mainForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      botLogic: new FormControl('', Validators.required),
      leverage: new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]),
      closeOnTrigger: new FormControl(''),
    });
    this.orderForm = this.formBuilder.group({
      orderType: new FormControl('', Validators.required),
      side: new FormControl('', Validators.required),
      quantity: new FormControl('', [Validators.required, Validators.min(0)]),
      limitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
    });
    this.stopForm = this.formBuilder.group({
      quantity2: new FormControl('', [Validators.required, Validators.min(0)]),
      triggerPrice: new FormControl('', [Validators.required, Validators.min(0)]),
    });
    // console.log(row);
    this.mF['id'].patchValue(row.id);
    this.mF['name'].patchValue(row.name);
    this.mF['botLogic'].patchValue(row.botLogic);
    this.mF['leverage'].patchValue(row.leverage);
    this.mF['closeOnTrigger'].patchValue(row.closeOnTrigger);

    this.oF['orderType'].patchValue(row.orderType);
    this.oF['side'].patchValue(row.side);
    this.oF['quantity'].patchValue(row.quantity);
    this.oF['limitPrice'].patchValue(row.limitPrice);

    this.sF['quantity2'].patchValue(0);
    this.sF['triggerPrice'].patchValue(0);
  }

  get mF() {
    return this.mainForm.controls;
  }

  get oF() {
    return this.orderForm.controls;
  }

  get sF() {
    return this.stopForm.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  goBack() {
    this.router.navigate([routes.registerBots]);
  }

  submit() {
    // console.log('submit');
    let f = this.mF;
    const id = f.id.value;
    const name = f.name.value;
    const botLogic = f.botLogic.value;
    const leverage = f.leverage.value;
    const closeOnTrigger = f.closeOnTrigger.value;
    f = this.oF;
    let orderType = f.orderType.value;
    const side = f.side.value;
    const quantity = f.quantity.value;
    const limitPrice = f.limitPrice.value;
    const userId = this.authService.currentUserValue.id;

    orderType = botLogic === 'signal' ? 'Market' : botLogic;
    const data = {
      id, userId, name, botLogic, leverage, closeOnTrigger, orderType, side, quantity, limitPrice
    };

    this.loading = true;
    this.alert.show = false;
    this.service.edit(data).pipe(first())
      .subscribe(res => {
        this.loading = false;
        if (res.result == 'success') {
          this.alert = {
            show: true,
            type: 'alert-success',
            message: res.message,
          };
          this.mF.id.patchValue(res.data.insertId);
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
          message: strings.unknownServerError,
        };
      });
  }

  removeStopItem(el: any) {
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(QuestionModalComponent, modalOptions);
    this.modalRef.content.title = strings.delete;
    this.modalRef.content.message = `${strings.doYouWantToDelete2}?`;
    this.modalRef.content.yesButtonColor = 'danger';
    this.modalRef.content.yesButtonClicked.subscribe(() => {

    });
  }
}
