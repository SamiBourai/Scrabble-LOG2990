import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import {
    FIRST_INDEX_2COLUMN,
    FIRST_INDEX_2ORIENTATION,
    FIRST_INDEX_COLUMN,
    FIRST_INDEX_ORIENTATION,
    INDEX_2WORD,
    INDEX_OF_PLACE_PARAMETERS,
    INDEX_PARAMETERS,
    INDEX_WORD,
    LAST_INDEX_2COLUMN,
    LAST_INDEX_2ORIENTATION,
    LAST_INDEX_COLUMN,
    LAST_INDEX_ORIENTATION,
    MIN_SWAP_LENGTH,
    PARAMETERS_OF_SWAP,
    PLACE_LENGTH,
    SWAP_LENGTH,
} from './../constants/constants';

// import { Parameter } from './classes/parameter';
// import { Parameter } from './classes/parameter';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    array = new Array<ChatCommand>();
    arrayOfCommand: string[] = ['!aide', '!debug', '!passer'];
    command: ChatCommand = { word: '', position: { x: 0, y: 0 }, direction: 'h' };
    arrayOfSpecialChars: string[] = ['ç', 'é', 'è', 'ë'];
    skipTurnIsPressed: boolean = false;
    private line: string;
    private column: number;
    private orientation: string;
    private word: string;

    private isDebug: boolean;
    private possibleLigne: string = 'abcdefghijklmno';
    private possibleColonne: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private possibleOrientation: string = 'hv';

    isCommand(input: string) {
        if (input.includes('!') && input.indexOf('!') === 0) return true;
        return false;
    }

    isValid(command: string) {
        if (this.isCommand(command)) {
            if (this.containsPlaceCommand(command) && command.length !== PLACE_LENGTH && this.placeCommand(command).length !== 0) {
                return true;
            } else if (this.containsSwapCommand(command) && command.length !== SWAP_LENGTH && this.swapCommand(command) !== '') {
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
        for (const commandToFind of lookFor) {
            if (command === commandToFind) return true;
        }
        return false;
    }

    placeCommand(input: string) {
        input = input.substring(INDEX_OF_PLACE_PARAMETERS, input.length);

        this.line = input.substring(0, 1);

        const parametersString = input.substring(0, INDEX_PARAMETERS);
        if (parametersString.length === INDEX_PARAMETERS && !parametersString.includes(' ')) {
            this.column = parseInt(parametersString.substring(FIRST_INDEX_2COLUMN, LAST_INDEX_2COLUMN), 10);
            this.orientation = parametersString.substring(FIRST_INDEX_2ORIENTATION, LAST_INDEX_2ORIENTATION);
            this.word = input.substring(INDEX_2WORD, input.length);
        } else if (parametersString.includes(' ')) {
            this.column = parseInt(parametersString.substring(FIRST_INDEX_COLUMN, LAST_INDEX_COLUMN), 10);
            this.orientation = parametersString.substring(FIRST_INDEX_ORIENTATION, LAST_INDEX_ORIENTATION);
            this.word = input.substring(INDEX_WORD, input.length);
        }

        // console.log(n.length)
        // console.log(this.word)
        if (
            this.possibleLigne.includes(this.line) &&
            this.possibleColonne.includes(this.column) &&
            this.possibleOrientation.includes(this.orientation) &&
            this.word !== ''
        ) {
            this.command = { word: this.word, position: { x: this.column, y: this.getLineNumber(this.line) }, direction: this.orientation };
            console.log(this.getLineNumber(this.line));
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
        for (const letter of input) {
            if (this.arrayOfSpecialChars.includes(letter)) return true;
        }
        return false;
    }

    remplaceSpecialChar(input: string) {
        for (const letter of input) {
            if (letter === 'ç') input = input.split(letter).join('c');
            else if (letter === 'é' || letter === 'è' || letter === 'ë') input = input.split(letter).join('e');
        }
        return input;
    }

    // getLineNumber(charac: string): number {
    //     switch (charac) {
    //         case 'a': {
    //             return 1;
    //         }
    //         case 'b': {
    //             return 2;
    //         }
    //         case 'c': {
    //             return 3;
    //         }
    //         case 'd': {
    //             return 4;
    //         }
    //         case 'e': {
    //             return 5;
    //         }
    //         case 'f': {
    //             return 6;
    //         }
    //         case 'g': {
    //             return 7;
    //         }
    //         case 'h': {
    //             return 8;
    //         }
    //         case 'i': {
    //             return 9;
    //         }
    //         case 'j': {
    //             return 10;
    //         }
    //         case 'k': {
    //             return 11;
    //         }
    //         case 'l': {
    //             return 12;
    //         }
    //         case 'm': {
    //             return 13;
    //         }
    //         case 'n': {
    //             return 14;
    //         }
    //         case 'o': {
    //             return 15;
    //         }
    //     }
    //     console.log('-1 swirtch');
    //     return -1;
    // }

    getLineNumber(letter: string): number {
        const asciiCode = letter.toLowerCase().charCodeAt(0);
        const CHAR_OFFSET = 96;
        const ligne = asciiCode - CHAR_OFFSET;
        return ligne;
    }
}
