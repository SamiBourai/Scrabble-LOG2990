import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { EASEL_LENGTH } from '@app/constants/constants';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
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
    invalidCommand: boolean = false;
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
        private mouseHandelingService: MouseHandelingService,
        private socketManagementService: SocketManagementService,
    ) {}
    ngOnInit(): void {
        this.virtualPlayerService.commandToSendVr.subscribe((res) => {
            setTimeout(() => {
                this.arrayOfVrCommands.push(res);
            }, 0);
        });

        this.mouseHandelingService.commandObs.subscribe((res) => {
            setTimeout(() => {
                this.typeArea = res;
                this.logMessage();
            }, 0);
        });
        if (this.userService.playMode !== 'soloGame') {
            this.messageService.newTextMessageObs.subscribe(() => {
                this.arrayOfMessages = this.messageService.textMessage;
                this.messageService.newTextMessage = false;
            });
        }
    }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }
    getNameCurrentPlayer() {
        return this.userService.getUserName();
    }

    getNameVrPlayer() {
        return this.userService.getVrUserName();
    }
    checkIfFirstPlay() {
        if (this.userService.playMode !== 'soloGame') this.firstTurn = this.userService.firstTurn;
    }

    logMessage() {
        this.typeArea = this.messageService.replaceSpecialChar(this.typeArea);
        const validPlayAndYourTurn =
            this.userService.isPlayerTurn() && this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea);
        const validPlay = this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea);
        if (validPlayAndYourTurn && !this.isTheGameDone()) {
            this.switchCaseCommands();
        } else if (validPlay && !this.isTheGameDone() && this.isDebug) {
            if (this.typeArea === '!reserve') {
                this.invalidCommand = false;
                this.errorMessage = '';
                this.reserveLettersQuantity();
            }
        } else {
            this.skipTurnCommand();
        }

        this.name = this.getNameCurrentPlayer();
        this.nameVr = this.getNameVrPlayer();
        this.impossibleAndValid();
        this.typeArea = '';
    }

    skipTurnCommand() {
        if (this.messageService.isSubstring(this.typeArea, ['!passer', '!placer', '!echanger'])) {
            this.skipTurn = true;
            this.invalidCommand = true;
            this.errorMessage = 'ce n est pas votre tour';
        } else if (this.typeArea === '!debug') {
            this.isDebug = !this.isDebug;
        } else if (this.messageService.isCommand(this.typeArea) && !this.messageService.isValid(this.typeArea)) {
            this.errorMessage = 'commande invalide';
        } else this.updateMessageArray(this.typeArea);
    }

    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.active = true;
            this.errorMessage = '';
            this.updateMessageArray('!passer');
            return true;
        }
        return false;
    }

    logDebug() {
        return this.messageService.debugCommand(this.typeArea);
    }

    getLettersFromChat(): void {
        const points: number = this.valideWordService.readWordsAndGivePointsIfValid(
            this.lettersService.tiles,
            this.messageService.command,
            this.userService.playMode,
        );
        if (this.lettersService.wordInBoardLimits(this.messageService.command)) {
            if (points !== 0) {
                if (this.firstTurn && this.lettersService.tileIsEmpty({ x: EASEL_LENGTH + 1, y: EASEL_LENGTH + 1 })) {
                    if (this.messageService.command.position.x === EASEL_LENGTH + 1 && this.messageService.command.position.y === EASEL_LENGTH + 1) {
                        if (!this.playFirstTurn(points)) {
                            this.invalidCommand = true;
                            return;
                        }
                    } else {
                        this.invalidCommand = true;
                        this.errorMessage = 'votre mot dois etre placer à la position central(h8)!';
                        return;
                    }
                } else if (this.lettersService.wordIsAttached(this.messageService.command) && points !== 0) {
                    if (!this.placeOtherTurns(points)) {
                        this.invalidCommand = true;
                        this.errorMessage = 'votre mot dois etre attaché à ceux déjà présent dans la grille ';
                        return;
                    }
                } else {
                    this.invalidCommand = true;
                    this.errorMessage = 'les lettres a placer ne constituent pas un mot';
                    return;
                }
            }
        } else {
            this.invalidCommand = true;
            this.errorMessage = 'votre mot dois etre contenue dans la grille!';
            return;
        }
    }

    impossibleAndValid() {
        this.isCommand = this.messageService.isCommand(this.typeArea);

        if (!this.userService.isPlayerTurn() && this.messageService.isCommand(this.typeArea)) {
            this.invalidCommand = true;
        }
        this.isValid = this.messageService.isValid(this.typeArea);
    }
    playFirstTurn(points: number): boolean {
        let lettersplaced = false;

        if (this.userService.getPlayerEasel().contains(this.messageService.command.word)) {
            this.lettersService.placeLettersInScrable(this.messageService.command, this.userService.getPlayerEasel(), true);
            this.updatePlayerVariables(points);
            lettersplaced = true;
            this.firstTurn = false;
        }
        return lettersplaced;
    }
    placeOtherTurns(points: number): boolean {
        if (this.lettersService.wordIsPlacable(this.messageService.command, this.userService.getPlayerEasel())) {
            this.lettersService.placeLettersInScrable(this.messageService.command, this.userService.getPlayerEasel(), true);
            this.updatePlayerVariables(points);
            console.log('faux place othernr tu');
            return true;
        }
        console.log('faux place other tunr');
        return false;
    }
    updatePlayerVariables(points: number) {
        this.userService.chatCommandToSend = this.messageService.command;
        this.userService.updateScore(points, this.lettersService.usedAllEaselLetters);
        this.userService.commandtoSendObs.next(this.userService.chatCommandToSend);
        this.invalidCommand = false;
    }
    isTheGameDone(): boolean {
        return this.userService.endOfGame;
    }
    reserveLettersQuantity() {
        let s: string;
        this.reserveService.letters.forEach((value: number, key: Letter) => {
            s = JSON.stringify(key.charac.toUpperCase())[1] + ':   ' + JSON.stringify(value);
            this.arrayOfReserveLetters.push(s);
        });
    }

    private verifyWord() {
        if (this.userService.playMode === 'soloGame') {
            this.getLettersFromChat();
        } else {
            if (this.userService.isPlayerTurn()) {
                this.socketManagementService.emit('verifyWord', {
                    gameName: this.userService.gameName,
                    word: this.lettersService.fromWordToLetters(this.messageService.command.word),
                });

                this.socketManagementService.listen('verifyWord').subscribe((data) => {
                    this.valideWordService.isWordValid = data.isValid ?? false;
                    console.log('shui laaaaaaa dans dans verify word');

                    this.getLettersFromChat();
                });
            }
        }
        this.endTurnValidCommand();
    }

    private endTurnValidCommand() {
        this.messageService.skipTurnIsPressed = false;
        if (!this.invalidCommand) {
            this.userService.userPlayed();
            this.errorMessage = '';
            this.userService.endOfGameCounter = 0;
            this.updateMessageArray(this.typeArea);
        }
    }
    private updateMessageArray(command: string): void {
        if (command !== '') {
            if (this.userService.playMode === 'soloGame') this.arrayOfMessages.push(command);
            else {
                if (this.userService.playMode === 'joinMultiplayerGame') command = this.userService.joinedUser.name + ' : ' + command;
                if (this.userService.playMode === 'createMultiplayerGame') command = ' ' + this.userService.realUser.name + ' : ' + command;
                this.arrayOfMessages.push(command);
                console.log('shuilaaaa');
                this.messageService.textMessage = this.arrayOfMessages;
                this.messageService.textMessageObs.next(this.messageService.textMessage);
            }
        }
    }
    private switchCaseCommands() {
        switch (this.typeArea.split(' ', 1)[0]) {
            case '!placer':
                this.checkIfFirstPlay();
                this.verifyWord();
                break;
            case '!echanger':
                if (this.reserveService.reserveSize < EASEL_LENGTH) {
                    this.invalidCommand = true;
                    this.errorMessage = 'la reserve contient moins de 7 lettres';
                } else if (
                    this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(this.typeArea), this.userService.getPlayerEasel())
                ) {
                    this.invalidCommand = false;
                    this.errorMessage = '';
                    this.updateMessageArray(this.typeArea);
                    this.userService.endOfGameCounter = 0;
                } else {
                    this.invalidCommand = true;
                    this.errorMessage = 'les lettres a echanger ne sont pas dans le chevalet';
                }
                if (!this.invalidCommand) {
                    this.userService.userPlayed();
                    this.userService.exchangeLetters = true;
                    this.userService.playedObs.next(this.userService.exchangeLetters);
                }
                break;
            case '!debug':
                this.invalidCommand = false;
                this.isDebug = !this.isDebug;
                break;
            case '!passer':
                this.invalidCommand = false;
                this.errorMessage = '';
                this.userService.detectSkipTurnBtn();
                break;
            // CODE SPRINT 2 ABDEL POUR !RESERVE
            case '!reserve':
                this.invalidCommand = false;
                this.errorMessage = '';
                if (this.isDebug || this.userService.playMode !== 'soloGame') {
                    this.reserveLettersQuantity();
                } else {
                    this.invalidCommand = true;
                    this.errorMessage = 'vous n etes pas en mode debogage';
                }
                break;
            // FIN CODE SPRINT 2 ABDEL POUR !RESERVE
        }
    }
}
