import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    setUnit: EventEmitter<LayoutUnitValue> = new EventEmitter<LayoutUnitValue>();
    constructor() { }
    emitUnitEvent(layoutUnit: LayoutUnitValue) {
        this.setUnit.emit(layoutUnit);
    }
    getUnitEmitter() {
        return this.setUnit;
    }
}

export interface LayoutUnitValue {
    unit: LayoutUnit;
    height: number;
}

export enum LayoutUnit {
    SideBar,
    Footer,
    Header
}