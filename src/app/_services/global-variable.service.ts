import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({providedIn: 'root'})
export class GlobalVariableService {
  @Output() navbarTitle: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  setNavbarTitle(title) {
    this.navbarTitle.emit(title);
  }

  getNavbarTitle() {
    return this.navbarTitle;
  }
}
