import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import strings from '@core/strings';
import routes from '@core/routes';
import {AuthenticationService, GlobalVariableService, RegisterBotsService} from '@app/_services';
import {MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent} from 'ng-uikit-pro-standard';
import {first} from 'rxjs/operators';
import {DeleteModalComponent} from '@app/views/partials/common-dialogs/delete-modal.component';

@Component({
  selector: 'home-register-bots',
  templateUrl: './register-bots.component.html',
  styleUrls: ['./register-bots.component.scss']
})
export class RegisterBotsComponent implements OnInit {
  strings = strings;
  routes = routes;
  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  alert = {
    show: false,
    type: '',
    message: '',
  };

  elements: any = [];
  headElements = ['Name', 'Exchange', 'Symbol', 'Order Type', 'Strategy', 'Leverage', 'Quantity', 'Price', 'T/P %', 'S/L %'];

  searchText: string = '';
  previous: string;

  maxVisibleItems: number = 8;
  modalRef: MDBModalRef;

  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild('row', { static: true }) row: ElementRef;

  @HostListener('input') oninput() {
    this.mdbTablePagination.searchText = this.searchText;
  }

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private route: ActivatedRoute,
                     private router: Router,
                     private globalVariableService: GlobalVariableService,
                     private service: RegisterBotsService,
                     private modalService: MDBModalService,
                     private authService: AuthenticationService,
                     private cdRef: ChangeDetectorRef
  ) {
    titleService.setTitle(`${strings.registerBots} - ${strings.siteName}`);
    globalVariableService.setNavbarTitle(strings.registerBots);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loadData();
  }

  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(this.maxVisibleItems);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  get f() {
    return this.form.controls;
  }

  closeAlert() {
    this.alert.show = false;
  }

  loadData() {
    const userId = this.authService.currentUserValue.id;
    this.service.list({userId}).pipe(first())
      .subscribe(res => {
        this.loading = false;
        if (res.result == 'success') {
          this.elements = res.data;
          this.mdbTable.setDataSource(this.elements);
          this.elements = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
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

  editItem(el: any) {
    let elementIndex = -1;
    if (el) {
      elementIndex = this.elements.findIndex((elem: any) => el === elem);
    }
    this.service.setEditableRow(el);
    // const modalOptions = {
    //   data: {
    //     editableRow: el
    //   },
    //   class: 'wide-modal',
    // };
    // this.modalRef = this.modalService.show(RegisterBotsModalComponent, modalOptions);
    // this.modalRef.content.saveButtonClicked.subscribe((newElement: any) => {
    //   this.elements[elementIndex] = newElement;
    // });
    // this.mdbTable.setDataSource(this.elements);
    this.router.navigate([routes.registerBotsModal]);
  }

  removeItem(el: any) {
    const modalOptions = {
      class: 'modal-dialog-centered',
    };

    this.modalRef = this.modalService.show(DeleteModalComponent, modalOptions);
    this.modalRef.content.message = `${strings.doYouWantToDelete2} \`${el.name}\`?`;
    this.modalRef.content.yesButtonClicked.subscribe(() => {
      this.service.delete(el).pipe(first())
        .subscribe(res => {
          this.loading = false;
          if (res.result == 'success') {
            this.elements = res.data;
            this.mdbTable.setDataSource(this.elements);
            this.elements = this.mdbTable.getDataSource();
            this.previous = this.mdbTable.getDataSource();
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
    });
  }

  emitDataSourceChange() {
    this.mdbTable.dataSourceChange().subscribe((data: any) => {
      console.log(data);
    });
  }

  searchItems() {
    const prev = this.mdbTable.getDataSource();

    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }

    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataBy(this.searchText);
      this.mdbTable.setDataSource(prev);
    }

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();

    this.mdbTable.searchDataObservable(this.searchText).subscribe(() => {
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
    });
  }

  onRowCreate($event) {

  }

  onRowRemove($event) {

  }
}
