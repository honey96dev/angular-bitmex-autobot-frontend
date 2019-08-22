import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import strings from '@core/strings';
import {GlobalVariableService} from '@app/_services';
import {MDBModalRef, MDBModalService, MdbTableDirective, MdbTablePaginationComponent} from 'ng-uikit-pro-standard';
import {RegisterBotsModalComponent} from '@app/views/home/register-bots/register-bots-modal.component';

@Component({
  selector: 'home-register-bots',
  templateUrl: './register-bots.component.html',
  styleUrls: ['./register-bots.component.scss']
})
export class RegisterBotsComponent implements OnInit {
  strings = strings;
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
                     private modalService: MDBModalService,
                     private cdRef: ChangeDetectorRef
  ) {
    titleService.setTitle(`${strings.registerBots}-${strings.siteName}`);
    globalVariableService.setNavbarTitle(strings.registerBots);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.mdbTable.setDataSource(this.elements);
    this.elements = this.mdbTable.getDataSource();
    this.previous = this.mdbTable.getDataSource();
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

  editItem(el: any) {
    let elementIndex = -1;
    if (el) {
      elementIndex = this.elements.findIndex((elem: any) => el === elem);
    }
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
    this.router.navigate(['/app/register-bots-modal']);
  }

  removeItem(el: any) {
    const elementIndex = this.elements.findIndex((elem: any) => el === elem);
    this.mdbTable.removeRow(elementIndex);
    this.mdbTable.getDataSource().forEach((el: any, index: any) => {
      el.id = (index + 1).toString();
    });
    this.mdbTable.setDataSource(this.elements);
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