import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    isCommand(input: string) {
        if (input[0] === '!') {
            return true;
        }
        return false;
    }
}
