import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    arrayOfMessages: string[] = [];
    typeArea: string = '';
    isValid: boolean = true;
    isImpossible: boolean = false;
    isCommand: boolean = false;
    inEasel: boolean = true;
    command: ChatCommand[] = [];
    containsAllChars: boolean = true;
    firstTurn: boolean = true;
    skipTurn: boolean = false;
    active: boolean = false;
    name: string;
    word: string = 'mot';

    form = new FormGroup({
        message: new FormControl(''),
    });
    // window: any;
    // parameter:Parameter;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private readonly valideWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
    ) {
        //this.firstTurn = this.userService.realUser.firstToPlay;
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    isYourTurn() {
        return this.userService.skipTurnValidUser();
    }

    getNameCurrentPlayer() {
        return this.userService.getUserName();
    }

    logMessage() {
        if (
            (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) ||
            !this.messageService.isCommand(this.typeArea)
        ) {
            if (this.messageService.containsSwapCommand(this.typeArea) && this.isYourTurn()) {
                this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea));
                this.userService.detectSkipTurnBtn();
            } else {
                this.arrayOfMessages.push('LES LETTRE NE SONT PAS DANS LE CHEVALET');
                this.isImpossible = true;
            }

            if (this.messageService.containsPlaceCommand(this.typeArea) && this.isYourTurn()) {
                this.getLettersFromChat();
                this.messageService.skipTurnIsPressed = false;

                this.userService.detectSkipTurnBtn();
                this.arrayOfMessages.pop();
            } else {
                this.arrayOfMessages.push('*placement impossible:* LES LETTRE NE SONT PAS DANS LE CHEVALET');
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

        this.name = this.getNameCurrentPlayer();
        this.impossibleAndValid();
        this.typeArea = '';
    }

    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.arrayOfMessages.push('!passer');
            this.active = true;

            return true;
        }
        return false;
    }

    logDebug() {
        return this.messageService.debugCommand(this.typeArea);
    }

    getLettersFromChat(): void {
        const points: number = this.valideWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, this.messageService.command);

        if (this.lettersService.wordInBoardLimits(this.messageService.command)) {
            if (this.valideWordService.verifyWord(this.lettersService.fromWordToLetters(this.messageService.command.word))) {
                if (this.firstTurn || !this.userService.realUser.firstToPlay) {
                    if (this.messageService.command.position.x === 8 && this.messageService.command.position.y === 8) {
                        this.firstTurn = false;
                        if (this.lettersService.wordInEasel(this.messageService.command.word)) {
                            this.lettersService.placeLettersInScrable(this.messageService.command);
                            this.userService.realUser.score += points;
                        } else {
                            this.isImpossible = true;
                            return;
                        }
                    } else {
                        this.isImpossible = true;
                        window.alert('*PREMIER TOUR*: votre mot dois etre placer à la position central(h8)!');
                        return;
                    }
                } else if (this.lettersService.wordIsAttached(this.messageService.command) || points != 0) {
                    if (this.lettersService.wordIsPlacable(this.messageService.command)) {
                        this.lettersService.placeLettersInScrable(this.messageService.command);
                    } else {
                        window.alert('*ERREUR*: votre mot dois contenir les lettres dans le chevalet et sur la grille!');
                        this.isImpossible = true;
                        return;
                    }
                } else {
                    this.isImpossible = true;
                    window.alert('*MOT DETTACHÉ*: votre mot dois etre attaché à ceux déjà présent dans la grille!');
                    return;
                }
            } else {
                this.isImpossible = true;
                window.alert('*LE MOT DOIT ETRE DANS LE DIC.*: votre mot dois etre contenue dans le dictionnaire!');
                return;
            }
        } else {
            this.isImpossible = true;
            window.alert('*LE MOT DEPASSE LA GRILLE*: votre mot dois etre contenue dans la grille!');
            return;
        }
    }

    impossibleAndValid() {
        this.isCommand = this.messageService.isCommand(this.typeArea);

        if (!this.isYourTurn() && this.messageService.isCommand(this.typeArea)) {
            this.isImpossible = true;
        }
        this.isValid = this.messageService.isValid(this.typeArea);
    }
}
