import { AbstractControl, ValidationErrors } from '@angular/forms';
export class MessageValidators {
    static isValid(control: AbstractControl): ValidationErrors | null {
        const x = control.value as string;

        if (x.length > 0 && (x === '!debug' || x === '!aide')) {
            // eslint-disable-next-line no-console
        
            return { isValid: true };
        }
        return null;
    }

    static commandOrChat(control: AbstractControl): ValidationErrors | null {
        const input = control.value as string;

        if (input[0] === '!' && input.length > 2) {
            
            return { commandOrChat: true };
        }
        return null;
    }
}
