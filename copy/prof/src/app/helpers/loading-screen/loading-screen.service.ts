import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    event: EventEmitter<() => Promise<void>> = new EventEmitter();

    constructor() {
    }

    public load(func: () => Promise<void>) {
        this.emitEvent(func);
    }

    emitEvent(search) {
        this.event.emit(search);
    }
    getEventEmitter() {
        return this.event;
    }
}