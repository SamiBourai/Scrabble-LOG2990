import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
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
        private easelLogisticsService: EaselLogiscticsService,
        private lettersService: LettersService,
        private reserveService: ReserveService,
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
            this.changeLetterFromReserve(this.m.commandEchanger(this.typeArea));
        }
        this.getLettersFromChat();

        this.typeArea = '';
    }

    logDebug() {
        return this.m.commandDebug(this.typeArea);
    }
    getLettersFromChat(): void {
        if (this.wordInEasel(this.m.command.word)) {
            this.placeLettersInScrable();
        }
        this.resetVariables();
    }
    wordInEasel(word: string): boolean {
        let found: boolean = false;
        let first: boolean = true;
        for (var i = 0; i < word.length; i++) {
            console.log(word.charAt(i));
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < 7; j++) {
                    console.log(this.easelLogisticsService.easelLetters[j]);
                    if (word.charAt(i) == this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j] == false) {
                        this.foundLetter[j] = true;
                        this.index.push(j);
                        found = true;
                        break;
                    }
                }
            } else {
                window.alert('votre mot ne contient pas les lettres dans le chavlet');
                break;
            }
        }
        console.log(this.foundLetter);

        return found;
    }
    placeLettersInScrable(): void {
        for (let i = 0; i < this.m.command.word.length; i++) {
            this.lettersService.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.index[i]), {
                x: this.m.command.column,
                y: this.getLineNumber(this.m.command.line) + i,
            });
        }

        this.resetVariables();
    }
    resetVariables(): void {
        for (let i = 0; i < this.foundLetter.length; i++) this.foundLetter[i] = false;
        this.index.splice(0, this.index.length);
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

    changeLetterFromReserve(letterToChange: string): void {
        if (this.wordInEasel(letterToChange)) {
            for (let i = 0; i < letterToChange.length; i++) {
                let temp: Letter = {
                    score: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.score,
                    charac: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.charac,
                    img: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.img,
                };

                this.easelLogisticsService.easelLetters[this.index[i]] = {
                    index: this.index[i],
                    letters: this.reserveService.getRandomLetter(),
                };

                this.reserveService.reFillReserve(temp);
            }
            this.easelLogisticsService.placeEaselLetters();
        }
        this.resetVariables();
    }
}
