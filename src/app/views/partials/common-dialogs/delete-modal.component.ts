import {Component} from '@angular/core';
import {MDBModalRef} from 'ng-uikit-pro-standard';
import {Subject} from 'rxjs';
import strings from '@core/strings';

@Component({
  selector: 'home-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent {
  strings = strings;
  title: string = strings.delete;
  message: string = strings.doYouWantToDelete;
  public yesButtonClicked: Subject<any> = new Subject<any>();

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit() {
  }

  doYes() {
    this.yesButtonClicked.next();
    this.modalRef.hide();
  }
}
