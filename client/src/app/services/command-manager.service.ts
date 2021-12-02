import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/easel-object';
import { EASEL_LENGTH, FIRST_POSITION_BOARD } from '@app/constants/constants';
import { LettersService } from './letters.service';
import { SocketManagementService } from './socket-management.service';
import { ValidWordService } from './valid-word.service';
@Injectable({
    providedIn: 'root',
})
export class CommandManagerService {
    errorMessage: string = '';
    playerScore: number = 0;
    numberOfLettersToExchange: number = 0;
    inputCommand: string = '';
    constructor(
        private socketManagementService: SocketManagementService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
    ) {}
    verifyExchageCommand(reserveSize: number, playerEasel: EaselObject, lettersToExchange: string): boolean {
        if (reserveSize < EASEL_LENGTH) {
            this.errorMessage = 'la reserve contient moins de 7 lettres';
            return false;
        } else {
            if (this.lettersService.changeLetterFromReserve(lettersToExchange, playerEasel)) {
                this.numberOfLettersToExchange = lettersToExchange.length;
                return true;
            } else {
                this.errorMessage = 'les lettres à echanger ne sont pas dans le chevalet';
                return false;
            }
        }
    }

    validateWord(command: ChatCommand, playMode: string, gameName: string) {
        if (playMode === 'soloGame') this.verifyWordsInDictionnary(command, playMode);
        else
            this.socketManagementService.emit('verifyWord', {
                gameName,
                word: this.lettersService.fromWordToLetters(command.word),
            });
    }
    verifyCommand(command: ChatCommand, playerEasel: EaselObject): boolean {
        this.errorMessage = '';
        if (this.isWordInBoardLimits(command)) {
            if (this.lettersService.tileIsEmpty(FIRST_POSITION_BOARD)) {
                if (this.validFirstPosition(command) && this.isInEasel(command, playerEasel)) {
                    return true;
                }
            } else if (this.isPlacableWord(command, playerEasel) && this.isWordAttachedToTheBoard(command)) return true;
        }
        return false;
    }
    verifyWordsInDictionnary(command: ChatCommand, playMode: string) {
        const points: number = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, command, playMode);
        const wordInDictionnay = this.validWordService.verifyWord(this.lettersService.fromWordToLetters(command.word), playMode);
        switch (true) {
            case !wordInDictionnay:
                this.errorMessage = "votre mot n'est pas contenue dans le dictionnaire";
                break;
            case wordInDictionnay && points === 0:
                this.errorMessage = 'les mots engendrés par votre placement ne sont pas dans le dictionnaire';
                break;
        }
        this.playerScore = points;
    }
    private isWordInBoardLimits(command: ChatCommand): boolean {
        if (this.lettersService.wordInBoardLimits(command)) {
            return true;
        }
        this.errorMessage = 'le mot saisi doit ne doit pas dépasser la grille du scrable';
        return false;
    }
    private validFirstPosition(command: ChatCommand): boolean {
        if (command.position.x === FIRST_POSITION_BOARD.x && command.position.y === FIRST_POSITION_BOARD.y) {
            return true;
        }
        this.errorMessage = 'votre mot doit être placer à la position central(h8)!';
        return false;
    }
    private isInEasel(command: ChatCommand, playerEasel: EaselObject): boolean {
        if (playerEasel.contains(command.word)) {
            return true;
        }
        this.errorMessage = 'Les lettres de votre mot ne sont pas dans le chevalet';
        return false;
    }
    private isWordAttachedToTheBoard(command: ChatCommand): boolean {
        if (this.lettersService.wordIsAttached(command)) return true;
        this.errorMessage = 'votre mot doit être attaché à ceux déjà présent dans la grille ';
        return false;
    }
    private isPlacableWord(command: ChatCommand, playerEasel: EaselObject): boolean {
        if (this.lettersService.wordIsPlacable(command, playerEasel)) return true;
        this.errorMessage = 'les lettres de votre mots ne sont pas contenue dans le chevalet ou dans la grille';
        return false;
    }
}
