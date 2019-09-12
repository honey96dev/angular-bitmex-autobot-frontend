import {Component} from '@angular/core';
import {MDBModalRef} from 'ng-uikit-pro-standard';
import {Subject} from 'rxjs';
import strings from '@core/strings';

@Component({
  selector: 'home-question-modal',
  templateUrl: './question-modal.component.html',
  styleUrls: ['./question-modal.component.scss']
})
export class QuestionModalComponent {
  strings = strings;
  title: string = strings.delete;
  message: string = strings.doYouWantToDelete;
  yesButtonColor: string = 'btn-primary';
  noButtonColor: string = 'secondary';
  public yesButtonClicked: Subject<any> = new Subject<any>();

  constructor(public modalRef: MDBModalRef) { }

  ngOnInit() {
  }

  doYes() {
    this.yesButtonClicked.next();
    this.modalRef.hide();
  }
}
