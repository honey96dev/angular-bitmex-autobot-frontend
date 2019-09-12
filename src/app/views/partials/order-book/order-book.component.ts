import {Component, OnInit} from '@angular/core';
import strings from '@core/strings';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Title} from '@angular/platform-browser';
import {GlobalVariableService, SocketIoService} from '@app/_services';
import _ from 'lodash';
import numeral from 'numeral';

let self;

@Component({
  selector: 'order-book',
  templateUrl: './order-book.component.html',
  styleUrls: ['./order-book.component.scss']
})
export class OrderBookComponent implements OnInit {
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

  orderBook: {} = {};

  public constructor(private titleService: Title,
                     private formBuilder: FormBuilder,
                     private globalsService: GlobalVariableService,
                     private socketIOService: SocketIoService) {
    self = this;
  }

  ngOnInit() {
    const count = 13;
    this.socketIOService.getOrderBookL2_25()
      .subscribe(book => {
        book['Buy'] = _.orderBy(book['Buy'], ['price'], ['desc']);
        book['Sell'] = _.orderBy(book['Sell'], ['price'], ['asc']);
        book['Buy'] = _.take(book['Buy'], count);
        book['Sell'] = _.take(book['Sell'], count);
        let total1 = 0;
        let total2 = 0;
        for (let item of book['Buy']) {
          total1 += item['size'];
          item['total'] = total1;
          item['price1'] = numeral(item['price']).format('0,0.0');
          item['size1'] = numeral(item['size']).format('0,0');
          item['total1'] = numeral(item['total']).format('0,0');
        }
        for (let item of book['Sell']) {
          total2 += item['size'];
          item['total'] = total2;
          item['price1'] = numeral(item['price']).format('0,0.0');
          item['size1'] = numeral(item['size']).format('0,0');
          item['total1'] = numeral(item['total']).format('0,0');
        }
        // book['Buy'] = _.last(_.orderBy(book['Buy'], ['price'], ['desc']), 10);
        // book['Sell'] = _.first(_.orderBy(book['Buy'], ['price'], ['asc']), 10);
        this.orderBook = book;
        // console.log(this.orderBook);
    });
  }

}
