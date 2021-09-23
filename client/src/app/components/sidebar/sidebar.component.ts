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

    constructor(private messageService: MessageService, private cd: ChangeDetectorRef, private lettersService: LettersService) {}

    ngAfterViewChecked(): void {
        this.cd.detectChanges();
    }

    get Message() {
        return this.form.get('message') as AbstractControl;
    }
    logMessage() {
        if (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) {
            if (this.messageService.isEchanger(this.typeArea)) {
                this.lettersService.changeLetterFromReserve(this.messageService.commandEchanger(this.typeArea));
            }
            if (this.messageService.isPlacer(this.typeArea)) {
                this.getLettersFromChat();
            }
            this.messageY.push(this.typeArea);
        }
        this.isCommand = this.messageService.isCommand(this.typeArea);
        this.isValid = this.messageService.isValid(this.typeArea);

        this.typeArea = '';
    }

    logDebug() {
        return this.messageService.commandDebug(this.typeArea);
    }

    getLettersFromChat(): void {
        if (this.firstTurn && this.messageService.command.position.x == 8 && this.messageService.command.position.y == 8) {
            this.firstTurn = false;
            console.log('1er tour');
            if (this.lettersService.wordInEasel(this.messageService.command.word)) {
                this.lettersService.placeLettersInScrable(this.messageService.command);
            }
        } else if (this.lettersService.wordIsPlacable(this.messageService.command)) {
            this.lettersService.placeLettersInScrable(this.messageService.command);
        }
    }
}
