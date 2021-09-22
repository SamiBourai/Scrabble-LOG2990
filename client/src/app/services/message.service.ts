import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';

// import { Parameter } from './classes/parameter';
// import { Parameter } from './classes/parameter';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    private ligne: string;
    private colonne: number;
    private orientation: string;
    private mot: string;
    array = new Array<ChatCommand>();

    private isDebug: boolean;
    private possibleLigne: string = 'abcdefghijklmno';
    private possibleColonne: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    private possibleOrientation: string = 'hv';
    command: ChatCommand = { word: '', line: '', column: 10, direction: 'h' };

    comOrChat(input: string) {
        if (input.includes('!') && input.indexOf('!') == 0) return true;
        return false;
    }

    isValid(command: string) {
        if (this.comOrChat(command)) {
            if (this.isPlacer(command) && command.length != 7 && this.commandPlacer(command).length != 0) {
                return true;
            } else if (this.isEchanger(command) && command.length != 9) {
                return true;
            } else if (this.isInside(command, ['!aide', '!debug', '!passer'])) {
                return true;
            }
        } else return true;
        return false;
    }

    isPlacer(command: string) {
        if (command.includes('!placer')) return true;
        return false;
    }

    isEchanger(command: string) {
        if (command.includes('!echanger')) return true;
        return false;
    }

    isInside(command: string, lookFor: string[]) {
        for (let i = 0; i < lookFor.length; i++) {
            if (command == lookFor[i]) return true;
        }
        return false;
    }

    commandPlacer(input: string) {
        input = input.substring(8, input.length);

        this.ligne = input.substring(0, 1);

        let letterPositionOrientation = input.substring(0, 4);
        if (letterPositionOrientation.length == 4 && !letterPositionOrientation.includes(' ')) {
            this.colonne = parseInt(letterPositionOrientation.substring(1, 3));
            this.orientation = letterPositionOrientation.substring(3, 4);
            this.mot = input.substring(4, input.length);
        } else if (letterPositionOrientation.includes(' ')) {
            this.colonne = parseInt(letterPositionOrientation.substring(1, 2));
            this.orientation = letterPositionOrientation.substring(2, 3);

            this.mot = input.substring(4, input.length);
        }
        if (
            this.possibleLigne.includes(this.ligne) &&
            this.possibleColonne.includes(this.colonne) &&
            this.possibleOrientation.includes(this.orientation)
        ) {
            this.command = { word: this.mot, line: this.ligne, column: this.colonne, direction: this.orientation };
            this.array.push(this.command);
        }
        return this.array;
    }

    commandEchanger(input: string) {
        if (input.length > 8) {
            return input.substring(10, input.length);
        }
        return '';
        // recuperer les lettres a echanger
    }

    //!echanger
    commandDebug(input: string) {
        if (input === '!debug') this.isDebug = true;
        return this.isDebug;
    }
}
