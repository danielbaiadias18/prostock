import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-flag',
  templateUrl: './custom-flag.component.html',
  styleUrls: ['./custom-flag.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomFlagComponent),
      multi: true
    }]
})
export class CustomFlagComponent implements ControlValueAccessor {

  onChange: any = () => { }
  onTouch: any = () => { }
  val: boolean;
  isDisabled: boolean = false;

  constructor() { }

  change(val: boolean) {
    if (!this.isDisabled) this.value = val;
  }

  set value(val) {  // this value is updated by programmatic changes
    if (val !== undefined && this.val !== val) {
      this.val = val
      this.onChange(val)
      this.onTouch(val)
    }
  }
  writeValue(val: boolean): void {
    this.val = val;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
