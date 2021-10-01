import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { BONUS_POINTS_50, EASEL_LENGTH } from '@app/constants/constants';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    arrayOfMessages: string[] = [];
    arrayOfVrCommands: string[] = [];
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
    nameVr: string;
    word: string = 'mot';
    errorMessage: string;

    score: number = 0;
    scoreObs = new BehaviorSubject(this.score);

    form = new FormGroup({
        message: new FormControl(''),
    });
    isDebug: boolean = false;

    // window: any;
    // parameter:Parameter;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private readonly valideWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
        private reserveService: ReserveService,
        private virtualPlayerService: VirtualPlayerService,
    ) {
        //this.firstTurn = this.userService.realUser.firstToPlay;
    }
    ngOnInit(): void {
        this.virtualPlayerService.commandToSendVr.subscribe((res) => {
            setTimeout(() => {
                // this.vrScore += res;
                this.arrayOfVrCommands.push(res);
                console.log(this.arrayOfVrCommands);
            }, 0);
        });
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    isYourTurn() {
        return this.userService.skipTurnValidUser();
    }
    get scoreOfRealPlayer(): BehaviorSubject<number> {
        return this.scoreObs;
    }

    getNameCurrentPlayer() {
        return this.userService.getUserName();
    }

    getNameVrPlayer() {
        return this.userService.getVrUserName();
    }

    logMessage() {
        if (
            (this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea)) ||
            !this.messageService.isCommand(this.typeArea)
        ) {
            if (this.logDebug()) {
                this.isImpossible = false;
                this.isDebug = !this.isDebug;
            }

            if (this.messageService.containsSwapCommand(this.typeArea) && this.isYourTurn()) {
                if (
                    this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea)) &&
                    this.reserveService.reserveSize >= 7
                )
                    this.isImpossible = false;
                else if (this.reserveService.reserveSize < 7) {
                    this.isImpossible = true;
                    this.errorMessage = 'la reserve contient moins de 7 lettres';
                } else {
                    this.isImpossible = true;
                    this.errorMessage = 'les lettres a echanger ne sont pas dans le chevalet';
                }

                if (!this.isImpossible) this.userService.detectSkipTurnBtn();
            } else if (!this.messageService.containsSwapCommand(this.typeArea) && !this.isYourTurn()) {
                this.isImpossible = true;
            } else if (this.messageService.containsPlaceCommand(this.typeArea) && this.isYourTurn() && !this.userService.isGameOver()) {
                this.getLettersFromChat();
                this.messageService.skipTurnIsPressed = false;

                if (!this.isImpossible) this.userService.detectSkipTurnBtn();

                this.arrayOfMessages.pop();
            } else if (!this.messageService.containsPlaceCommand(this.typeArea) && !this.isYourTurn()) {
                //this.arrayOfMessages.push('*placement impossible:* LES LETTRE NE SONT PAS DANS LE CHEVALET');
                this.errorMessage = 'les lettres a placer ne sont pas dans le chevalet';
            }
            if (!this.isYourTurn() && this.messageService.isSubstring(this.typeArea, ['!passer', '!placer', '!echanger'])) {
                this.skipTurn = true;
                this.isImpossible = true;
                this.errorMessage = 'ce n est pas votre tour';
            } else {
                this.arrayOfMessages.push(this.typeArea);
            }
            if (this.typeArea === '!passer' && this.isYourTurn()) {
                this.userService.detectSkipTurnBtn();
                this.isImpossible = false;
                this.userService.skipTurn();
                const index = this.arrayOfMessages.indexOf('!passer', 0);
                if (index > -1) this.arrayOfMessages.splice(index, 1);
            }
        }
        console.log(this.arrayOfMessages);
        this.name = this.getNameCurrentPlayer();
        this.nameVr = this.getNameVrPlayer();
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
            this.userService.resetPassesCounter();

            if (this.valideWordService.verifyWord(this.lettersService.fromWordToLetters(this.messageService.command.word))) {
                if (this.firstTurn && this.lettersService.tileIsEmpty({ x: EASEL_LENGTH + 1, y: EASEL_LENGTH + 1 })) {
                    if (this.messageService.command.position.x === 8 && this.messageService.command.position.y === 8) {
                        this.firstTurn = false;
                        if (this.lettersService.wordInEasel(this.messageService.command.word)) {
                            this.lettersService.placeLettersInScrable(this.messageService.command);
                            this.isImpossible = false;
                            this.virtualPlayerService.first = false;
                            this.userService.realUser.score += points;
                            console.log('+50**********************************************');
                            if (this.lettersService.usedAllEaselLetters) this.userService.realUser.score += BONUS_POINTS_50;
                        } else {
                            this.isImpossible = true;
                            return;
                        }
                    } else {
                        this.isImpossible = true;
                        //window.alert('*PREMIER TOUR*: votre mot dois etre placer à la position central(h8)!');
                        this.errorMessage = 'votre mot dois etre placer à la position central(h8)!';
                        return;
                    }
                } else if (this.lettersService.wordIsAttached(this.messageService.command) && points != 0) {
                    if (this.lettersService.wordIsPlacable(this.messageService.command)) {
                        this.lettersService.placeLettersInScrable(this.messageService.command);
                        this.isImpossible = false;
                        this.virtualPlayerService.first = false;
                        this.userService.realUser.score += points;
                        console.log('+50');
                        if (this.lettersService.usedAllEaselLetters) this.userService.realUser.score += BONUS_POINTS_50;
                    } else {
                        //window.alert('*ERREUR*: votre mot dois contenir les lettres dans le chevalet et sur la grille!');
                        this.errorMessage = 'votre mot dois contenir les lettres dans le chevalet et sur la grille! ';
                        this.isImpossible = true;

                        return;
                    }
                } else {
                    this.isImpossible = true;
                    //window.alert('*MOT DETTACHÉ*: votre mot dois etre attaché à ceux déjà présent dans la grille!');
                    this.errorMessage = 'votre mot dois etre attaché à ceux déjà présent dans la grille ';
                    return;
                }
            } else {
                this.isImpossible = true;
                //window.alert('*LE MOT DOIT ETRE DANS LE DIC.*: votre mot dois etre contenue dans le dictionnaire!');
                this.errorMessage = 'les lettres a placer ne constituent pas un mot';
                return;
            }
        } else {
            this.isImpossible = true;
            //window.alert('*LE MOT DEPASSE LA GRILLE*: votre mot dois etre contenue dans la grille!');
            this.errorMessage = 'votre mot dois etre contenue dans la grille!';

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
