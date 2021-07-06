import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchInNavService {
  searchChange: EventEmitter<string> = new EventEmitter<string>();
  constructor() { }
  emitSearchChangeEvent(search) {
    this.searchChange.emit(search);
  }
  getSearchChangeEmitter() {
    return this.searchChange;
  }
}
