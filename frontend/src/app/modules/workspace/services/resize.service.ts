import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {
  private leftWidthSource = new BehaviorSubject<number>(Math.ceil(window.innerWidth * 0.2));
  currentLeftWidth = this.leftWidthSource.asObservable();

  constructor() { }

  updateLeftWidth(value: number) {
    this.leftWidthSource.next(value);
  }
}
