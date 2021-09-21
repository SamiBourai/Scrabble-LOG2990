

import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';

import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { MessageValidators } from './message.validators';

// import { Parameter } from '@app/classes/parameter';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    messageY: string[] = [];
    typeArea: string = '';
    isValid: boolean = true;
    isCommand: boolean = false;
    parameters: ChatCommand[] = [];
    containsAllChars: boolean = true;
    //chatWord: string = '' ;
    foundLetter: Array<Boolean> = [false, false, false, false, false, false, false];
    index: Array<number> = [];
    form = new FormGroup({
        message: new FormControl('', [MessageValidators.isValid, MessageValidators.commandOrChat]),
    });
    //window: any;
    // parameter:Parameter;

    constructor(
        private m: MessageService,
        private cd: ChangeDetectorRef,
        private easelLogiscticsService: EaselLogiscticsService,
        private lettersService: LettersService,
    ) {}

    ngAfterViewChecked(): void {
        this.cd.detectChanges();
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    get Message() {
        return this.form.get('message') as AbstractControl;
    }
    logMessage() {
        this.isCommand = this.m.comOrChat(this.typeArea);
        this.isValid = this.m.isValid(this.typeArea);
        if (!this.m.comOrChat(this.typeArea) || this.m.isValid(this.typeArea)) {
            this.messageY.push(this.typeArea);
            this.parameters = this.m.commandPlacer(this.typeArea);
            
        }
        this.getLettersFromChat();

        console.log(this.messageY);
        console.log(this.parameters);

        this.typeArea = '';
    }

    logDebug() {
        return this.m.commandDebug(this.typeArea);
    }
    getLettersFromChat(): void {
        //this.chatWord = this.m.array.pop()!.word;
        //console.log(this.chatWord);
        let found: boolean = false;
        let first: boolean = true;
        for (var i = 1; i < this.m.command.word.length; i++) {
            if (found || first) {
                first = false;
                found = false;
                console.log(this.m.command.word.charAt(i));
                for (let j = 0; j < 7; j++) {
                    console.log(this.easelLogiscticsService.easelLetters[j].letters.charac);
                    if (this.m.command.word.charAt(i) == this.easelLogiscticsService.easelLetters[j].letters.charac && this.foundLetter[j] == false) {
                        this.foundLetter[j] = true;
                        this.index.push(j);
                        found = true;
                        break;
                        //  window.alert('Le chevalet ne contient pas toutes les lettres de votre mot');
                        //  this.containsAllChars = false;
                    }
                }
            } else {
                window.alert('votre mot ne contient pas les lettres dans le chavlet');
                break;
            }
        }
        console.log(this.foundLetter);

        this.resetVariables();
        if (found) {
            console.log(this.index);
            this.placeLettersInScrable();
        }
    }

    placeLettersInScrable(): void {
        for (let i = this.m.command.word.length - 2; i >= 0; i--) {
            this.lettersService.placeLetter(this.easelLogiscticsService.getLetterFromEasel(this.index.pop()!), {
                x: this.m.command.column,
                y: this.getLineNumber(this.m.command.line) + i,
            });
        }
    }
    resetVariables(): void {
        for (let i = 0; i < this.foundLetter.length; i++) this.foundLetter[i] = false;
    }
    getLineNumber(charac: string): number {
        switch (charac) {
            case 'a': {
                return 1;
            }
            case 'b': {
                return 2;
            }
            case 'c': {
                return 3;
            }
            case 'd': {
                return 4;
            }
            case 'e': {
                return 5;
            }
            case 'f': {
                return 6;
            }
            case 'g': {
                return 7;
            }
            case 'h': {
                return 8;
            }
            case 'i': {
                return 9;
            }
            case 'j': {
                return 10;
            }
            case 'k': {
                return 11;
            }
            case 'l': {
                return 12;
            }
            case 'm': {
                return 13;
            }
            case 'n': {
                return 14;
            }
            case 'o': {
                return 15;
            }
        }
        return -1;
    }
}
