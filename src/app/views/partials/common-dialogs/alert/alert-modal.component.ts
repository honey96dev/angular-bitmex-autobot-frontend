import {Component} from '@angular/core';
import {MDBModalRef} from 'ng-uikit-pro-standard';
import {Subject} from 'rxjs';
import strings from '@core/strings';

@Component({
  selector: 'home-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {
  strings = strings;
  title: string = strings.delete;
  message: string = strings.doYouWantToDelete;
  yesButtonColor: string = 'primary';
  public yesButtonClicked: Subject<any> = new Subject<any>();

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit() {
  }

  doYes() {
    this.yesButtonClicked.next();
    this.modalRef.hide();
  }
}
