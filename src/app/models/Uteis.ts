import { FormGroup } from '@angular/forms';

export class Uteis {
    
    public static markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: FormGroup) => {
            control.markAsTouched();
            control.markAsDirty();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }
}