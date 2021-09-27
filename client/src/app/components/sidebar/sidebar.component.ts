import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';

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
    // chatWord: string = '' ;

    form = new FormGroup({
        message: new FormControl(''),
    });
    // window: any;
    // parameter:Parameter;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private valideWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
    ) {}

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    get Message() {
        return this.form.get('message') as AbstractControl;
    }
    logMessage() {
        if (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) {
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

        this.typeArea = '';
    }

    logDebug() {
        return this.messageService.debugCommand(this.typeArea);
    }

    getLettersFromChat(): void {
        const points: number = this.valideWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, this.messageService.command);
        if (this.lettersService.wordInBoardLimits(this.messageService.command)) {
            if (points !== 0) {
                if (this.firstTurn) {
                    if (this.messageService.command.position.x === 8 && this.messageService.command.position.y === 8) {
                        this.firstTurn = false;
                        if (this.lettersService.wordInEasel(this.messageService.command.word)) {
                            this.lettersService.placeLettersInScrable(this.messageService.command);
                            this.userService.realUser.score += points;
                            console.log(this.userService.realUser.score);
                        }
                    } else {
                        window.alert('*PREMIER TOUR*: votre mot dois etre placer à la position central(h8)!');
                        return;
                    }
                } else if (this.lettersService.wordIsAttached(this.messageService.command)) {
                    if (this.lettersService.wordIsPlacable(this.messageService.command)) {
                        this.lettersService.placeLettersInScrable(this.messageService.command);
                        this.userService.realUser.score += points;
                        console.log(this.userService.realUser.score);
                    } else window.alert('*ERREUR*: votre mot dois contenir les lettres dans le chevalet et sur la grille!');
                } else {
                    window.alert('*MOT DETTACHÉ*: votre mot dois etre attaché à ceux déjà présent dans la grille!');
                    return;
                }
            } else {
                window.alert('*LE MOT DOIT ETRE DANS LE DIC.*: votre mot dois etre contenue dans le dictionnaire!');
                return;
            }
        } else {
            window.alert('*LE MOT DEPASSE LA GRILLE*: votre mot dois etre contenue dans la grille!');
            return;
        }
    }
}
