import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
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
    firstTurn: boolean = true;
    //chatWord: string = '' ;

    form = new FormGroup({
        message: new FormControl('', [MessageValidators.isValid, MessageValidators.commandOrChat]),
    });
    //window: any;
    // parameter:Parameter;

    constructor(private m: MessageService, private cd: ChangeDetectorRef, private lettersService: LettersService) {}

    ngAfterViewChecked(): void {
        this.cd.detectChanges();
    }

    get Message() {
        return this.form.get('message') as AbstractControl;
    }
    logMessage() {
        if (this.m.isCommand(this.typeArea) && this.m.isValid(this.typeArea)) {
            if (this.m.isEchanger(this.typeArea)) {
                this.lettersService.changeLetterFromReserve(this.m.commandEchanger(this.typeArea));
            }
            if (this.m.isPlacer(this.typeArea)) {
                this.getLettersFromChat();
            }
            this.messageY.push(this.typeArea);
        }
        this.isCommand = this.m.isCommand(this.typeArea);
        this.isValid = this.m.isValid(this.typeArea);

        this.typeArea = '';
    }

    logDebug() {
        return this.m.commandDebug(this.typeArea);
    }

    getLettersFromChat(): void {
        if (this.lettersService.wordInEasel(this.m.command.word) && this.firstTurn && this.m.command.line == 8 && this.m.command.column == 8) {
            this.firstTurn = false;
            console.log('1er tour');
            this.lettersService.placeLettersInScrable(this.m.command);
        } else if (this.lettersService.wordIsPlacable(this.m.command)) {
            console.log('2eme tour');
            this.lettersService.placeLettersInScrable(this.m.command);
        }
    }
}
