import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-custom-radio-btn',
  templateUrl: './custom-radio-btn.component.html',
  styleUrls: ['./custom-radio-btn.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomRadioBtnComponent),
      multi: true
    }]
})
export class CustomRadioBtnComponent implements ControlValueAccessor {

  @Input() txt1: string = "";
  @Input() txt2: string = "";
  
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
