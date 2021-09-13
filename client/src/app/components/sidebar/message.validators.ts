import { AbstractControl, ValidationErrors } from '@angular/forms';
export class MessageValidators {
    static isValid(control: AbstractControl): ValidationErrors | null {
        if (control.value === '!debug') {
            // eslint-disable-next-line no-console
            console.log('d');
            return { isValid: true };
        }
        return null;
    }
}
