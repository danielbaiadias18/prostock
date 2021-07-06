import { Pipe, PipeTransform } from '@angular/core';
import { FormArray, AbstractControl } from '@angular/forms';

@Pipe({
  name: 'sortForm',
  pure: false
})
export class SortFormPipe implements PipeTransform {

  transform(array: AbstractControl[], args: string): AbstractControl[] {
    if (array !== undefined) {
      return array.sort((a: any, b: any) => {

        const aValue = a.controls[args].value;
        const bValue = b.controls[args].value;

        if (aValue < bValue) {
          return -1;
        } else if (aValue > bValue) {
          return 1;
        } else {
          return 0;
        }
      });
    }
    return array;
  }

}
