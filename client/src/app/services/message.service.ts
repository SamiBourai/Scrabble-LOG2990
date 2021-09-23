import {
    PLACE_LENGTH,
    SWAP_LENGTH,
    INDEX_OF_PLACE_PARAMETERS,
    INDEX_PARAMETERS,
    FIRST_INDEX_ORIENTATION,
    LAST_INDEX_ORIENTATION,
    FIRST_INDEX_2COLUMN,
    LAST_INDEX_2COLUMN,
    FIRST_INDEX_COLUMN,
    LAST_INDEX_COLUMN,
    FIRST_INDEX_2ORIENTATION,
    LAST_INDEX_2ORIENTATION,
    INDEX_WORD,
    MIN_SWAP_LENGTH,
    PARAMETERS_OF_SWAP,
    INDEX_2WORD,
} from './../constants/constants';

import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';

// import { Parameter } from './classes/parameter';
// import { Parameter } from './classes/parameter';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private line: string;
    private column: number;
    private orientation: string;
    private word: string;
    array = new Array<ChatCommand>();
    arrayOfCommand: string[] = ['!aide', '!debug', '!passer'];

    private isDebug: boolean;
    private possibleLigne: string = 'abcdefghijklmno';
    private possibleColonne: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private possibleOrientation: string = 'hv';
    command: ChatCommand = { word: '', line: '', column: 10, direction: 'h' };
    arrayOfSpecialChars: string[] = ['ç', 'é', 'è', 'ë'];

    isCommand(input: string) {
        if (input.includes('!') && input.indexOf('!') == 0) return true;
        return false;
    }

    isValid(command: string) {
        if (this.isCommand(command)) {
            if (this.containsPlaceCommand(command) && command.length != PLACE_LENGTH && this.placeCommand(command).length != 0) {
                return true;
            } else if (this.containsSwapCommand(command) && command.length != SWAP_LENGTH) {
                return true;
            } else if (this.isInside(command, this.arrayOfCommand)) {
                return true;
            }
        } else return true;
        return false;
    }

    containsPlaceCommand(command: string) {
        if (command.includes('!placer')) return true;
        return false;
    }

    containsSwapCommand(command: string) {
        if (command.includes('!echanger')) return true;
        return false;
    }

    isInside(command: string, lookFor: string[]) {
        for (let i = 0; i < lookFor.length; i++) {
            if (command == lookFor[i]) return true;
        }
        return false;
    }

    placeCommand(input: string) {
        input = input.substring(INDEX_OF_PLACE_PARAMETERS, input.length);

        this.line = input.substring(0, 1);

        const parametersString = input.substring(0, INDEX_PARAMETERS);
        if (parametersString.length == INDEX_PARAMETERS && !parametersString.includes(' ')) {
            this.column = parseInt(parametersString.substring(FIRST_INDEX_2COLUMN, LAST_INDEX_2COLUMN));
            this.orientation = parametersString.substring(FIRST_INDEX_2ORIENTATION, LAST_INDEX_2ORIENTATION);
            this.word = input.substring(INDEX_2WORD, input.length);
        } else if (parametersString.includes(' ')) {
            this.column = parseInt(parametersString.substring(FIRST_INDEX_COLUMN, LAST_INDEX_COLUMN));
            this.orientation = parametersString.substring(FIRST_INDEX_ORIENTATION, LAST_INDEX_ORIENTATION);
            this.word = input.substring(INDEX_WORD, input.length);
        }

        // console.log(n.length)
        // console.log(this.word)
        if (
            this.possibleLigne.includes(this.line) &&
            this.possibleColonne.includes(this.column) &&
            this.possibleOrientation.includes(this.orientation) &&
            this.word != ''
        ) {
            this.command = { word: this.word, line: this.line, column: this.column, direction: this.orientation };
            this.array.push(this.command);
        }
        return this.array;
    }

    swapCommand(input: string) {
        if (input.length > MIN_SWAP_LENGTH) {
            return input.substring(PARAMETERS_OF_SWAP, input.length);
        }
        return '';
        // recuperer les lettres a echanger
    }

    // !echanger
    debugCommand(input: string) {
        if (input === '!debug') this.isDebug = true;
        return this.isDebug;
    }

    containsSpecialChar(input: string) {
        for (let i = 0; i < input.length; i++) {
            if (this.arrayOfSpecialChars.includes(input[i])) return true;
        }
        return false;
    }

    remplaceSpecialChar(input: string) {
        for (let i = 0; i < input.length; i++) {
            if (input[i] === 'ç') input = input.split(input[i]).join('c');
            else if (input[i] === 'é' || input[i] === 'è' || input[i] === 'ë') input = input.split(input[i]).join('e');
        }
        return input;
    }
}
