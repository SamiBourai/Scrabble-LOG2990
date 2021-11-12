import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { BOARD_HEIGHT, BOARD_WIDTH, LEFTSPACE, NB_TILES, TOPSPACE, UNDEFINED_INDEX } from '@app/constants/constants';
import { LettersService } from './letters.service';
import { MessageService } from './message.service';
import { MouseHandelingService } from './mouse-handeling.service';
import { ReserveService } from './reserve.service';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';
import { ValidWordService } from './valid-word.service';
@Injectable({
    providedIn: 'root',
})
export class CommandManagerService {
    errorMessage: string = '';
    private firstTurn: boolean = false;
    word: boolean = false;

    private inputIndex: number = 0;
    private firstNumber: string = '';
    command: ChatCommand = { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: 'h' };
    // private validPlacement: boolean = false;
    constructor(
        private userService: UserService,
        private socketManagementService: SocketManagementService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private reserveService: ReserveService,
        private messageService: MessageService,
        private mouseHandle: MouseHandelingService,
    ) {}
    verifyExchageCommand(command: string): boolean {
        if (this.reserveService.reserveSize < 7) {
            this.errorMessage = 'la reserve contient moins de 7 lettres';
            return false;
        } else {
            if (this.lettersService.changeLetterFromReserve(this.messageService.swapCommand(command), this.userService.getPlayerEasel())) return true;
            else {
                this.errorMessage = 'les lettres à echanger ne sont pas dans le chevalet';
                return false;
            }
        }
    }

    isWordValid(command: ChatCommand): boolean {
        switch (this.userService.playMode) {
            case 'soloGame':
                return this.verifyWordSoloGame(command);
            case 'joinMultiplayerGame':
                this.verifyWord('verifyWordGuest', command);
                return this.verifyCommand(command);
            case 'createMultiplayerGame':
                this.verifyWord('verifyWordCreator', command);
                return this.verifyCommand(command);
            default:
                return false;
        }
    }
    verifyCommand(command: ChatCommand): boolean {
        // const points: number = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, command, this.userService.playMode);
        if (this.isWordInBoardLimits(command)) {
            if (this.firstPlay(command) && this.playFirstTurn(command)) return true;
            else if (this.isWordAttached(command) && !this.firstTurn) return true;
        }
        return false;
    }
    verifyInput(input: string) {
        const charac: string = input.charAt(input.length - 1);
        console.log(charac, ': lastLt');
        if (!this.word) {
            this.validPostion(charac);
        } else {
            this.command.word = this.mouseHandle.chatWord;
        }
    }

    private validPostion(key: string) {
        switch (this.inputIndex) {
            case 0:
                console.log(this.messageService.getLineNumber(key), ': X');
                if (1 <= this.messageService.getLineNumber(key) && this.messageService.getLineNumber(key) <= NB_TILES) {
                    this.command.position.x = this.messageService.getLineNumber(key);

                    this.inputIndex++;
                }
                break;
            case 1:
                console.log(key, ': first');
                if (key.charCodeAt(0) >= 49 && key.charCodeAt(0) <= 57 && this.firstNumber === '') {
                    this.firstNumber = key;
                    this.inputIndex++;
                }
                break;
            case 2:
                console.log(this.messageService.getLineNumber(key), ': y');
                this.setY(key);
                break;
            case 3:
                if (key === 'h' || key === 'v') {
                    this.command.direction = key;
                    this.word = true;
                    this.clickSimul();
                }
                break;
        }
    }
    private clickSimul() {
        if (this.command.direction === 'h') this.callMouse();
        else {
            this.callMouse();
            this.callMouse();
        }
    }
    private callMouse() {
        console.log({
            offsetX: LEFTSPACE + (this.command.position.x * BOARD_WIDTH) / NB_TILES,
            offsetY: TOPSPACE + (this.command.position.y * BOARD_HEIGHT) / NB_TILES,
        } as MouseEvent);
        this.mouseHandle.mouseHitDetect({
            offsetX: LEFTSPACE + (this.command.position.x * BOARD_WIDTH) / NB_TILES,
            offsetY: TOPSPACE + (this.command.position.y * BOARD_HEIGHT) / NB_TILES,
            button: 0,
        } as MouseEvent);
    }

    private setY(key: string) {
        if (key.charCodeAt(0) >= 49 && key.charCodeAt(0) <= 53 && this.firstNumber.charCodeAt(0) === 49) {
            this.command.position.y = parseInt(this.firstNumber + key, 10);
            this.inputIndex++;
        } else if (key === 'h' || key === 'v') {
            this.command.position.y = parseInt(this.firstNumber, 10);
            this.command.direction = key;
            this.command.direction = key;

            this.word = true;
            this.clickSimul();
        }
    }

    private verifyWord(method: string, command: ChatCommand) {
        this.socketManagementService.emit(method, {
            gameName: this.userService.gameName,
            word: this.lettersService.fromWordToLetters(command.word),
        });
        this.socketManagementService.listen(method).subscribe((data) => {
            this.validWordService.isWordValid = data.isValid ?? false;
            if (!this.validWordService.isWordValid) this.errorMessage = "votre mot n'est pas contenue dans le dictionnaire";
        });
    }
    private verifyWordSoloGame(command: ChatCommand): boolean {
        if (this.validWordService.verifyWord(this.lettersService.fromWordToLetters(command.word), 'soloGame')) return this.verifyCommand(command);
        else {
            this.errorMessage = "votre mot n'est pas contenue dans le dictionnaire";
            return false;
        }
    }
    private isWordInBoardLimits(command: ChatCommand): boolean {
        if (this.lettersService.wordInBoardLimits(command)) {
            return true;
        }
        this.errorMessage = 'le mot saisi doit ne doit pas dépasser la grille du scrable';
        return false;
    }
    private firstPlay(command: ChatCommand): boolean {
        if (this.firstTurn && command.position.x === 8 && command.position.y === 8) return true;
        this.errorMessage = 'votre mot dois etre placer à la position central(h8)!';
        return false;
    }
    private playFirstTurn(command: ChatCommand): boolean {
        if (this.userService.getPlayerEasel().contains(command.word)) {
            this.firstTurn = false;
            return true;
        }
        this.errorMessage = 'Les lettres de votre mot ne sont pas dans le chevalet';
        return false;
    }
    private isWordAttached(command: ChatCommand): boolean {
        console.log(this.lettersService.wordIsAttached(command), 'isWordAttached');
        if (this.lettersService.wordIsAttached(command)) return true;
        this.errorMessage = 'votre mot doit être attaché à ceux déjà présent dans la grille ';
        return false;
    }
}
