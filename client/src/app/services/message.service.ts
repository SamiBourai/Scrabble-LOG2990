import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatCommand } from './../classes/chat-command';
import {
    COLUMN_RANGE,
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

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    chatCommandArray = new Array<ChatCommand>();
    arrayOfCommand: string[] = ['!aide', '!debug', '!passer', '!reserve'];
    command: ChatCommand = { word: '', position: { x: 0, y: 0 }, direction: 'h' };
    arrayOfSpecialChars: string[] = ['ç', 'é', 'è', 'ë'];
    skipTurnIsPressed: boolean = false;
    textMessage: string[] = [];
    textMessageObs: BehaviorSubject<string[]> = new BehaviorSubject<string[]>({} as string[]);
    observableTextMessage: Observable<string[]>;
    newTextMessage: boolean = false;
    newTextMessageObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    observableNewTextMessage: Observable<boolean>;
    private line: string;
    private column: number;
    private orientation: string;
    private word: string;
    private possibleLineValues: string = 'abcdefghijklmno';
    private possibleColumnValues: number[] = [];
    private possibleOrientationValues: string = 'hv';

    constructor() {
        this.fillColumnValues(this.possibleColumnValues);
        this.observableTextMessage = this.textMessageObs.asObservable();
        this.observableNewTextMessage = this.newTextMessageObs.asObservable();
    }

    isCommand(input: string): boolean {
        if (!input.includes('!') || input.indexOf('!') !== 0) return false;
        return true;
    }

    isValid(command: string): boolean {
        const containsPlace = this.containsPlaceCommand(command);
        const containsSwap = this.containsSwapCommand(command);
        if (!this.isCommand(command)) return false;
        if (containsPlace && command.length !== PLACE_LENGTH && this.placeCommand(command).length !== 0) {
            return true;
        } else if (containsSwap && command.length !== SWAP_LENGTH && this.swapCommand(command) !== '') {
            return true;
        } else if (this.isInside(command, this.arrayOfCommand)) {
            return true;
        }
        return false;
    }

    containsPlaceCommand(command: string): boolean {
        if (!command.includes('!placer')) return false;
        return true;
    }

    containsSwapCommand(command: string) {
        if (command.includes('!echanger')) return true;
        return false;
    }

    isInside(command: string, lookFor: string[]): boolean {
        for (const commandToFind of lookFor) {
            if (command === commandToFind) return true;
        }
        return false;
    }

    isSubstring(command: string, lookFor: string[]): boolean {
        for (const commandToFind of lookFor) {
            if (command.includes(commandToFind)) return true;
        }
        return false;
    }

    fillColumnValues(columnArray: number[]) {
        for (let i = 1; i < COLUMN_RANGE; i++) {
            columnArray.push(i);
        }
    }

    placeCommand(input: string): ChatCommand[] {
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

        const validPosition = this.possibleLineValues.includes(this.line) && this.possibleColumnValues.includes(this.column);
        const validOrientation = this.possibleOrientationValues.includes(this.orientation);

        if (validPosition && validOrientation && this.word !== '') {
            this.command = { word: this.word, position: { x: this.column, y: this.getLineNumber(this.line) }, direction: this.orientation };

            this.chatCommandArray.push(this.command);
        }
        return this.chatCommandArray;
    }

    swapCommand(input: string): string {
        if (input.length < MIN_SWAP_LENGTH) {
            return '';
        }
        return input.substring(PARAMETERS_OF_SWAP, input.length);
    }

    debugCommand(input: string): boolean {
        if (input !== '!debug') return false;
        return true;
    }

    containsSpecialChar(input: string) {
        for (const letter of input) {
            if (this.arrayOfSpecialChars.includes(letter)) return true;
        }
        return false;
    }

    replaceSpecialChar(input: string): string {
        for (const letter of input) {
            if (letter === 'ç') input = input.split(letter).join('c');
            else if (letter === 'é' || letter === 'è' || letter === 'ë') input = input.split(letter).join('e');
        }
        return input;
    }

    getLineNumber(letter: string): number {
        const asciiCode = letter.toLowerCase().charCodeAt(0);
        const CHAR_OFFSET = 96;
        const ligne = asciiCode - CHAR_OFFSET;
        return ligne;
    }

    removeDuplicate(array: string[], element: string) {
        const index = array.indexOf(element, 0);
        if (index > -1) array.splice(index, 1);
    }
}
