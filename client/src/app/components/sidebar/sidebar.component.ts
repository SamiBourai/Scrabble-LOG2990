import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { ONE_SECOND_MS, UNDEFINED_INDEX, WAIT_TIME_3_SEC } from '@app/constants/constants';
import { CommandManagerService } from '@app/services/command-manager.service';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TemporaryCanvasService } from '@app/services/temporary-canvas.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, AfterViewChecked, OnDestroy {
    arrayOfMessages: string[] = [];
    arrayOfVrCommands: string[] = [];
    arrayOfReserveLetters: string[] = [];
    typeArea: string = '';
    name: string = '';
    nameVr: string = '';
    errorMessage: string = '';
    isHelpActivated: boolean;
    form = new FormGroup({
        message: new FormControl(''),
    });
    message: string = '';
    isDebug: boolean = false;
    toggleReserve: boolean = false;

    constructor(
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private lettersService: LettersService,
        public userService: UserService,
        private reserveService: ReserveService,
        private virtualPlayerService: VirtualPlayerService,
        private mouseHandelingService: MouseHandelingService,
        private commandManagerService: CommandManagerService,
        private tempCanvasService: TemporaryCanvasService,
        private validWordService: ValidWordService,
        private timeService: TimeService,
        private socketManagementService: SocketManagementService,
        private easelLogicService: EaselLogiscticsService,
        private objectifMangerService: ObjectifManagerService,
    ) {}

    ngOnInit(): void {
        if (this.reserveService.sizeObs) {
            this.reserveService.sizeObs.subscribe(() => {
                setTimeout(() => {
                    if (this.toggleReserve) this.reserveLettersQuantity();
                }, 0);
            });
        }
        if (this.virtualPlayerService.commandObs) {
            this.virtualPlayerService.commandObs.subscribe((res) => {
                setTimeout(() => {
                    res = ('[' + this.nameVr + ']' + ' ').concat(res);
                    this.arrayOfVrCommands.push(res);
                }, 0);
            });
        }
        if (this.timeService.commandObs) {
            this.timeService.commandObs.subscribe((res) => {
                setTimeout(() => {
                    if (res === '!passer') {
                        if (this.userService.isPlayerTurn()) {
                            this.typeArea = res;
                            this.manageCommands();
                        }
                    }
                }, 0);
            });
        }
        this.mouseHandelingService.commandObs.subscribe((res) => {
            setTimeout(() => {
                this.typeArea = res;
                this.logMessage();
            }, 0);
        });
        if (this.userService.playMode !== 'soloGame') {
            if (this.messageService.newTextMessageObs !== undefined) {
                this.messageService.newTextMessageObs.subscribe(() => {
                    this.arrayOfMessages = this.messageService.textMessage;
                    this.messageService.newTextMessage = false;
                });
            }
            if (this.userService.commandtoSendObs) this.userService.commandtoSendObs.next(this.userService.chatCommandToSend);
            if (this.socketManagementService.listen('verifyWord')) {
                this.socketManagementService.listen('verifyWord').subscribe((data) => {
                    this.validWordService.isWordValid = data.isValid ?? false;
                });
            }
        }
    }
    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }
    ngOnDestroy() {
        this.reserveService.sizeObs.unsubscribe();
        this.messageService.newTextMessageObs.unsubscribe();
        this.mouseHandelingService.commandObs.unsubscribe();
        this.virtualPlayerService.commandObs.unsubscribe();
    }
    logMessage() {
        this.userService.getPlayerEasel().resetVariables();
        this.errorMessage = '';
        this.typeArea = this.messageService.replaceSpecialChar(this.typeArea);
        const validPlay = this.messageService.isCommand(this.typeArea) && this.messageService.isValid(this.typeArea) && !this.userService.endOfGame;
        if (validPlay) {
            switch (this.userService.isPlayerTurn()) {
                case true:
                    this.manageCommands();
                    break;
                case false:
                    if (this.messageService.isSubstring(this.typeArea, ['!passer', '!placer', '!echanger'])) {
                        this.errorMessage = "ce n'est pas votre tour";
                        this.typeArea = '';
                    }
                    break;
            }
        }
        this.name = this.userService.realUser.name;
        this.nameVr = this.userService.vrUser.name;
        this.verifyInput();
        this.typeArea = '';
    }
    isSkipButtonClicked() {
        if (this.messageService.skipTurnIsPressed) {
            this.messageService.skipTurnIsPressed = !this.messageService.skipTurnIsPressed;
            this.updateMessageArray('!passer');
            this.verifyObjectifs('pass');
            return true;
        }
        return false;
    }
    private manageCommands() {
        if (this.typeArea) {
            switch (this.typeArea.split(' ', 1)[0]) {
                case '!placer':
                    if (this.commandManagerService.verifyCommand(this.messageService.command, this.userService.getPlayerEasel())) {
                        this.placeWord();
                    } else this.errorMessage = this.commandManagerService.errorMessage;
                    break;
                case '!echanger':
                    this.exchangeCommand();
                    break;
                case '!passer':
                    this.userService.detectSkipTurnBtn();
                    this.objectifMangerService.passTurnCounter++;
                    this.verifyObjectifs('pass');
                    break;
            }
        }
    }
    private placeWord() {
        this.commandManagerService.validateWord(this.messageService.command, this.userService.playMode, this.userService.gameName);
        switch (this.userService.playMode) {
            case 'soloGame':
                this.placeWordIfValid();
                break;
            default:
                this.placeInTempCanvas(this.messageService.command);
                this.commandManagerService.inputCommand = this.typeArea;
                setTimeout(() => {
                    this.commandManagerService.verifyWordsInDictionnary(this.messageService.command, this.userService.playMode);
                    this.placeWordIfValid();
                    this.mouseHandelingService.clearAll();
                }, WAIT_TIME_3_SEC);
        }
    }
    private placeInTempCanvas(command: ChatCommand) {
        const pos: Vec2 = { x: command.position.x, y: command.position.y };
        if (command.direction === 'h') {
            for (const letter of command.word) {
                this.tempCanvasService.drawRedFocus(pos, this.tempCanvasService.focusContext);

                if (this.lettersService.tileIsEmpty(pos))
                    this.tempCanvasService.drawLetter(this.easelLogicService.tempGetLetter(letter, this.userService.getPlayerEasel()), {
                        x: pos.x,
                        y: pos.y,
                    });
                pos.x++;
            }
        } else
            for (const letter of command.word) {
                this.tempCanvasService.drawRedFocus(pos, this.tempCanvasService.focusContext);

                if (this.lettersService.tileIsEmpty(pos))
                    this.tempCanvasService.drawLetter(this.easelLogicService.tempGetLetter(letter, this.userService.getPlayerEasel()), {
                        x: pos.x,
                        y: pos.y,
                    });
                pos.y++;
            }
    }
    private placeWordIfValid() {
        let messageUpdate = this.commandManagerService.inputCommand;
        if (this.commandManagerService.playerScore !== 0) {
            this.lettersService.placeLettersInScrable(this.messageService.command, this.userService.getPlayerEasel(), true);
            this.userService.updateScore(this.commandManagerService.playerScore, this.lettersService.usedAllEaselLetters);
            this.verifyObjectifs('play');
            this.userService.chatCommandToSend = this.messageService.command;
        } else {
            this.errorMessage = this.commandManagerService.errorMessage;
            messageUpdate += ' (la validation du mot a échoué)';
            this.userService.chatCommandToSend = { word: 'invalid', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
        }
        this.endTurn('placer', messageUpdate);
    }
    private exchangeCommand() {
        if (
            this.commandManagerService.verifyExchageCommand(
                this.reserveService.reserveSize,
                this.userService.getPlayerEasel(),
                this.messageService.swapCommand(this.typeArea),
            )
        ) {
            this.endTurn('exchange', this.typeArea);
        } else {
            this.errorMessage = this.commandManagerService.errorMessage;
        }
    }

    private endTurn(commandType: string, messageUpdate: string) {
        switch (commandType) {
            case 'exchange':
                this.verifyObjectifs('exchange');
                if (this.userService.playMode !== 'soloGame') {
                    setTimeout(() => {
                        this.userService.exchangeLetters = true;
                        this.userService.playedObs.next(this.userService.exchangeLetters);
                    }, ONE_SECOND_MS);
                } else this.userService.userPlayed();
                break;
            case 'placer':
                if (this.userService.playMode !== 'soloGame') {
                    this.userService.commandtoSendObs.next(this.userService.chatCommandToSend);
                } else {
                    messageUpdate = this.typeArea;
                    this.userService.userPlayed();
                }
                break;
        }
        this.userService.endOfGameCounter = 0;
        this.updateMessageArray(messageUpdate);
    }
    private updateMessageArray(command: string): void {
        if (command !== '') {
            if (this.userService.playMode === 'soloGame') this.arrayOfMessages.push(command);
            else {
                if (this.userService.playMode === 'joinMultiplayerGame') command = this.userService.joinedUser.name + ' : ' + command;
                if (this.userService.playMode === 'createMultiplayerGame') command = ' ' + this.userService.realUser.name + ' : ' + command;
                this.arrayOfMessages.push(command);
                this.messageService.textMessage = this.arrayOfMessages;
                if (this.messageService.textMessageObs) this.messageService.textMessageObs.next(this.messageService.textMessage);
            }
            this.typeArea = '';
        }
    }
    private verifyInput() {
        if (this.messageService.isCommand(this.typeArea) && !this.messageService.isValid(this.typeArea) && this.userService.isPlayerTurn())
            this.errorMessage = 'commande invalide';
        else {
            switch (this.typeArea) {
                case '!debug':
                    this.isDebug = !this.isDebug;
                    break;
                case '!reserve':
                    this.showReserve();
                    break;
                case '!aide':
                    this.isHelpActivated = !this.isHelpActivated;
                    break;
                default:
                    if (!this.messageService.isCommand(this.typeArea)) this.updateMessageArray(this.typeArea);
                    break;
            }
        }
    }

    private showReserve() {
        if (this.isDebug) {
            this.toggleReserve = !this.toggleReserve;
            this.reserveLettersQuantity();
        } else {
            this.errorMessage = "vous n'êtes pas en mode debogage";
        }
    }

    private reserveLettersQuantity() {
        let s: string;
        this.arrayOfReserveLetters.splice(0, this.arrayOfReserveLetters.length);
        this.reserveService.letters.forEach((value: number, key: Letter) => {
            s = JSON.stringify(key.charac.toUpperCase())[1] + ':   ' + JSON.stringify(value);
            this.arrayOfReserveLetters.push(s);
        });
    }
    private verifyObjectifs(command: string) {
        if (this.objectifMangerService.log2990Mode) {
            switch (command) {
                case 'pass':
                    this.objectifMangerService.passTurnCounter++;
                    this.objectifMangerService.verifyObjectifs(true);
                    break;
                case 'play':
                    this.objectifMangerService.passTurnCounter = 0;
                    this.objectifMangerService.verifyObjectifs(true, this.messageService.command);
                    break;
                case 'exchange':
                    this.objectifMangerService.passTurnCounter = 0;
                    this.objectifMangerService.verifyObjectifs(true, undefined, this.commandManagerService.numberOfLettersToExchange);
                    break;
            }
        }
    }
}
