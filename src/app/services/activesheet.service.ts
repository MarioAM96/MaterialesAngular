import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActiveSheetService {
  private activeSheetIdSubject = new BehaviorSubject<string | null>(null);
  activeSheetId$ = this.activeSheetIdSubject.asObservable();

  setActiveSheetId(sheetId: string | null) {
    this.activeSheetIdSubject.next(sheetId);
    if (sheetId) {
      sessionStorage.setItem('activeSheetId', sheetId);
    } else {
      sessionStorage.removeItem('activeSheetId');
    }
  }
}