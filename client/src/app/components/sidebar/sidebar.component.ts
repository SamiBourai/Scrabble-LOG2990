import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { SocketMessage } from '@app/classes/socketMessage';
import { Letter } from '@app/classes/letter';
import { BONUS_POINTS_50, EASEL_LENGTH } from '@app/constants/constants';
import { ChatService } from '@app/services/chat.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewChecked {
    arrayOfMessages: string[] = [];
    arrayOfVrCommands: string[] = [];
    arrayOfReserveLetters: string[] = [];
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
    errorMessage: string = '';

    score: number = 0;

    form = new FormGroup({
        message: new FormControl(''),
    });
    isDebug: boolean = false;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private readonly valideWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
        private reserveService: ReserveService,
        private virtualPlayerService: VirtualPlayerService,
        private chatService: ChatService,
    ) {}
    ngOnInit(): void {
        this.virtualPlayerService.commandToSendVr.subscribe((res) => {
            setTimeout(() => {
                this.arrayOfVrCommands.push(res);
            }, 0);
        });

        this.chatService.emit('identify', this.userService.getUserName);

        // Selon typescript, value est un string, mais lors de l'execution le navigateur indique Object??
        this.chatService.listen('chat').subscribe((value: any) => {
            const socketMessage = value as SocketMessage;
            if (socketMessage.name === this.userService.getUserName) {
                socketMessage.name = '(moi) ' + socketMessage.name;
            }
            socketMessage.message = this.messageService.replaceSpecialChar(socketMessage.message);

            const msg = `${socketMessage.name}: ${socketMessage.message}`;

            if (this.messageService.isCommand(socketMessage.message) && !this.messageService.isValid(socketMessage.message))
                this.errorMessage = 'erreur';
            else this.arrayOfMessages.push(msg);
        });

        this.chatService.connect();
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    isYourTurn() {
        return this.userService.isUserTurn();
    }

    getNameCurrentPlayer() {
        return this.userService.getUserName;
    }

    getNameVrPlayer() {
        return this.userService.getVrUserName();
    }

    logMessage() {
        if (
            this.isYourTurn() &&
            this.messageService.isCommand(this.typeArea) &&
            this.messageService.isValid(this.typeArea) &&
            !this.isTheGameDone()
        ) {
            this.switchCaseCommands();
        } else if (
            this.messageService.isCommand(this.typeArea) &&
            this.messageService.isValid(this.typeArea) &&
            !this.isTheGameDone() &&
            this.isDebug
        ) {
            if (this.typeArea === '!reserve') {
                this.isImpossible = false;
                this.errorMessage = '';
                this.reserveLettersQuantity();
            }
        } else {
            this.skipTurnCommand();
            if (!this.messageService.isCommand(this.typeArea)) {
                this.messageService.removeDuplicate(this.arrayOfMessages, this.typeArea);
            }
        }

        this.name = this.getNameCurrentPlayer();
        this.nameVr = this.getNameVrPlayer();
        this.impossibleAndValid();
        this.typeArea = '';
    }

    skipTurnCommand() {
        if (this.messageService.isSubstring(this.typeArea, ['!passer', '!placer', '!echanger'])) {
            this.skipTurn = true;
            this.isImpossible = true;
            this.errorMessage = 'ce n est pas votre tour';
        } else if (this.typeArea === '!debug') {
            this.isDebug = !this.isDebug;
        } else if (this.messageService.isCommand(this.typeArea) && !this.messageService.isValid(this.typeArea)) {
            this.errorMessage = 'commande invalide';
        } else this.arrayOfMessages.push(this.typeArea);
    }

    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.active = true;
            this.errorMessage = '';
            this.arrayOfMessages.push('!passer');
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
                if (this.firstTurn && this.lettersService.tileIsEmpty({ x: EASEL_LENGTH + 1, y: EASEL_LENGTH + 1 })) {
                    if (this.messageService.command.position.x === EASEL_LENGTH + 1 && this.messageService.command.position.y === EASEL_LENGTH + 1) {
                        this.firstTurn = false;
                        if (this.userService.realUser.easel.contains(this.messageService.command.word)) {
                            this.lettersService.placeLettersInScrable(this.messageService.command, this.userService.realUser.easel, true);
                            this.isImpossible = false;
                            this.virtualPlayerService.first = false;
                            this.userService.realUser.score += points;

                            if (this.lettersService.usedAllEaselLetters) this.userService.realUser.score += BONUS_POINTS_50;
                        } else {
                            this.isImpossible = true;
                            return;
                        }
                    } else {
                        this.isImpossible = true;
                        this.errorMessage = 'votre mot dois etre placer à la position central(h8)!';
                        return;
                    }
                } else if (this.lettersService.wordIsAttached(this.messageService.command) && points !== 0) {
                    if (this.lettersService.wordIsPlacable(this.messageService.command, this.userService.realUser.easel)) {
                        this.lettersService.placeLettersInScrable(this.messageService.command, this.userService.realUser.easel, true);
                        this.isImpossible = false;
                        this.virtualPlayerService.first = false;
                        this.userService.realUser.score += points;

                        if (this.lettersService.usedAllEaselLetters) this.userService.realUser.score += BONUS_POINTS_50;
                    } else {
                        this.errorMessage = 'votre mot dois contenir les lettres dans le chevalet et sur la grille! ';
                        this.isImpossible = true;
                        return;
                    }
                } else {
                    this.isImpossible = true;
                    this.errorMessage = 'votre mot dois etre attaché à ceux déjà présent dans la grille ';
                    return;
                }
            } else {
                this.isImpossible = true;
                this.errorMessage = 'les lettres a placer ne constituent pas un mot';
                return;
            }
        } else {
            this.isImpossible = true;
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

    isTheGameDone(): boolean {
        return this.userService.endOfGame;
    }

    sendMessage(): void {
        this.chatService.emit('chat', this.typeArea);
    }
    reserveLettersQuantity() {
        let s: string;
        this.reserveService.lettersReserveQty.forEach((value: number, key: Letter) => {
            s = JSON.stringify(key.charac.toUpperCase())[1] + ': ' + JSON.stringify(value);
            this.arrayOfReserveLetters.push(s);
        });
    }

    private switchCaseCommands() {
        switch (this.typeArea.split(' ', 1)[0]) {
            case '!placer':
                this.getLettersFromChat();
                this.messageService.skipTurnIsPressed = false;

                if (!this.isImpossible) {
                    this.userService.userPlayed();
                    this.errorMessage = '';
                    this.userService.endOfGameCounter = 0;
                    this.arrayOfMessages.push(this.typeArea);
                } else this.errorMessage = 'les lettres a placer ne sont pas dans le chevalet';
                break;
            case '!echanger':
                if (this.reserveService.reserveSize < EASEL_LENGTH) {
                    this.isImpossible = true;
                    this.errorMessage = 'la reserve contient moins de 7 lettres';
                } else if (
                    this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea), this.userService.realUser.easel)
                ) {
                    this.isImpossible = false;
                    this.errorMessage = '';
                    this.arrayOfMessages.push(this.typeArea);
                    this.userService.endOfGameCounter = 0;
                } else {
                    this.isImpossible = true;
                    this.errorMessage = 'les lettres a echanger ne sont pas dans le chevalet';
                }
                if (!this.isImpossible) this.userService.userPlayed();
                break;
            case '!debug':
                this.isImpossible = false;
                this.isDebug = !this.isDebug;
                break;
            case '!passer':
                this.isImpossible = false;
                this.errorMessage = '';
                this.userService.detectSkipTurnBtn();
                break;
            // CODE SPRINT 2 ABDEL POUR !RESERVE
            case '!reserve':
                this.isImpossible = false;
                this.errorMessage = '';
                if (this.isDebug) {
                    this.reserveLettersQuantity();
                } else {
                    this.isImpossible = true;
                    this.errorMessage = 'vous n etes pas en mode debogage';
                }
            // FIN CODE SPRINT 2 ABDEL POUR !RESERVE
        }
    }
}
