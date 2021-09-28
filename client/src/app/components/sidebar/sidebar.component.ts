

import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ChatCommand } from '@app/classes/chat-command';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { UserService } from '@app/services/user.service';


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
    isImpossible: boolean;
    isCommand: boolean = false;
    inEasel: boolean = true;
    parameters: ChatCommand[] = [];
    containsAllChars: boolean = true;
    firstTurn: boolean = true;
    skipTurn: boolean = false;
    active:boolean = false;
    name:string
    // chatWord: string = '' ;

    form = new FormGroup({
        message: new FormControl(''),
    });
    // window: any;
    // parameter:Parameter;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private userService: UserService,
        private lettersService: LettersService,
    ) {}

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    isYourTurn() {
        return this.userService.skipTurnValidUser();
    }

    getNameCurrentPlayer(){
        return this.userService.getUserName();
    }

    logMessage() {
        this.isCommand = this.messageService.isCommand(this.typeArea);
        if (!this.isYourTurn() && this.messageService.isCommand(this.typeArea)) this.isImpossible = true;
        this.isValid = this.messageService.isValid(this.typeArea);

        if (
            (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) ||
            !this.messageService.isCommand(this.typeArea)
        ) {
            if (this.messageService.containsSwapCommand(this.typeArea) && this.isYourTurn()) {
                this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea));
            }
            if (this.messageService.containsPlaceCommand(this.typeArea) && this.isYourTurn()) {
                this.getLettersFromChat();
                this.messageService.skipTurnIsPressed = false;
                this.userService.detectSkipTurnBtn();
                this.arrayOfMessages.pop();
                //disable the btn 
                
            }
            if (!this.isYourTurn() && this.messageService.isSubstring(this.typeArea, ['!passer', '!placer', '!echanger'])) {
                this.skipTurn = true;
                this.isImpossible = true;
            } else {
                this.arrayOfMessages.push(this.typeArea);
            }
            if (this.typeArea === '!passer' && this.isYourTurn()) {
                this.userService.detectSkipTurnBtn();
                const index = this.arrayOfMessages.indexOf('!passer', 0);
                if (index > -1) this.arrayOfMessages.splice(index, 1);
            }
        }

        console.log(this.arrayOfMessages);
        this.name = this.getNameCurrentPlayer();
        
        this.typeArea = '';
    }

    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.arrayOfMessages.push('!passer');
            this.active = true;
            // let elem = document.getElementById('passer');
            // console.log(elem)
            // elem?.setAttribute("style", "color:red")
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
