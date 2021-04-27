import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BarsService {
  canSeeBars: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }
  emitCanSeeBarsEvent(search: boolean) {
    this.canSeeBars.emit(search);
  }
  getCanSeeBarsEmitter() {
    return this.canSeeBars;
  }
}
