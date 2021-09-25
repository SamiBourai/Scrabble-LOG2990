
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ChatCommand } from '@app/classes/chat-command';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';

// import { Parameter } from '@app/classes/parameter';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    arrayOfMessages: string[] = [];
    typeArea: string = '';
    isValid: boolean = true;
    isCommand: boolean = false;
    inEasel: boolean = true;
    parameters: ChatCommand[] = [];
    containsAllChars: boolean = true;
    firstTurn: boolean = true;
    skipTurn: boolean = false;
    // chatWord: string = '' ;

    form = new FormGroup({
        message: new FormControl(''),
    });
    // window: any;
    // parameter:Parameter;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,

        private lettersService: LettersService,
    ) {}

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    logMessage() {
        if (
            (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) ||
            !this.messageService.isCommand(this.typeArea)
        ) {
            if (this.messageService.containsSwapCommand(this.typeArea)) {
                this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea));
            }
            if (this.messageService.containsPlaceCommand(this.typeArea)) {
                this.getLettersFromChat();
            }
            this.arrayOfMessages.push(this.typeArea);
        }

        this.isCommand = this.messageService.isCommand(this.typeArea);
        this.isValid = this.messageService.isValid(this.typeArea);

        console.log(this.arrayOfMessages);
        this.typeArea = '';
    }

    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.arrayOfMessages.push('!passer');
            return true;
        }
        return false;
    }

    logDebug() {
        return this.messageService.debugCommand(this.typeArea);
    }

    getLettersFromChat(): void {
        if (this.firstTurn && this.messageService.command.position.x === 8 && this.messageService.command.position.y === 8) {
            this.firstTurn = false;
            console.log('1er tour');
            if (this.lettersService.wordInEasel(this.messageService.command.word)) {
                this.lettersService.placeLettersInScrable(this.messageService.command);
            }
        } else if (this.lettersService.wordIsPlacable(this.messageService.command)) {
            this.lettersService.placeLettersInScrable(this.messageService.command);
        } else this.inEasel = false;
    }
}
