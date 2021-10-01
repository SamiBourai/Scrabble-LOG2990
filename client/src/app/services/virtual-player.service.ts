import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    EASEL_LENGTH,
    EIGHTEEN_POINTS,
    MAX_INDEX_NUMBER_EASEL,
    MAX_INDEX_NUMBER_PROBABILITY_ARRAY,
    NB_TILES,
    NOT_A_LETTER,
    SEVEN_POINTS,
    SIX_POINTS,
    THIRTEEN_POINTS,
    TWELVE_POINTS,
    ZERO_POINTS,
} from '@app/constants/constants';
import { ReserveService } from '@app/services/reserve.service';
import { BehaviorSubject } from 'rxjs';
import { LettersService } from './letters.service';
import { ValidWordService } from './valid-world.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    vrPlayerEaselLetters: Letter[] = [];
    vrEaselSize: number = EASEL_LENGTH;
    private firstTurnLetters: Letter[] = [];
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string;
    first: boolean = true;
    private letterFromEasel: string = '';
    private wordPlacedInScrable: boolean = false;
    commandToSend: string = '';
    commandObs = new BehaviorSubject<string>(this.commandToSend);
    playObs = new BehaviorSubject(false);
    vrPoints: number = 0;
    isDicFille: boolean = false;
    vrScoreObs = new BehaviorSubject(this.vrPoints);
    played: boolean = false;

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
    ) {}

    manageVrPlayerActions(): void {
        const probability: string[] = [
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'passTurn',
            'exchangeLetters',
        ];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        switch (probability[randomIndex]) {
            case 'placeWord':
                setTimeout(() => {
                    if (!this.isDicFille) {
                        this.generateVrPlayerEasel();
                        this.isDicFille = true;
                    }
                    if (this.first) {
                        this.first = false;

                        let words = this.validWordService.generateAllWordsPossible(this.vrPlayerEaselLetters);

                        for (let word of words) {
                            if (this.wordInEasel(word)) {
                                let tempCommand: ChatCommand = { word: word, position: { x: 8, y: 8 }, direction: 'h' };
                                this.commandToSend =
                                    '!placer ' + String.fromCharCode(97 + (tempCommand.position.y - 1)) + tempCommand.position.x + 'h ' + word;
                                this.commandObs.next(this.commandToSend);
                                this.commandToSend = '';

                                this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand);
                                this.vrScoreObs.next(this.vrPoints);
                                for (let i = 0; i < word.length; i++) {
                                    this.lettersService.placeLetter(this.lettersService.getTheLetter(word.charAt(i)), { x: 8 + i, y: 8 });
                                }
                                this.updateVrEasel();
                                this.played = true;
                                break;
                            }

                            this.foundLetter.fill(false);
                        }
                    } else {
                        this.getLetterForEachLine('h');
                        if (!this.wordPlacedInScrable) this.getLetterForEachLine('v');
                    }
                    this.wordPlacedInScrable = false;
                }, 3000);
                break;

            case 'passTurn':
                setTimeout(() => {}, 20000);
                break;
            case 'exchangeLetters':
                this.exchangeLettersInEasel();
                this.played = true;
                break;
        }
    }
    private updateVrEasel(): void {
        for (let i = 0; i < this.vrPlayerEaselLetters.length; i++) {
            if (this.foundLetter[i] == true) {
                if (this.reserveService.reserveSize != 0) this.vrPlayerEaselLetters[i] = this.reserveService.getRandomLetter();
                else this.vrEaselSize--;
            }
        }
    }
    private generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            this.vrPlayerEaselLetters.push(this.reserveService.getRandomLetter());
            this.firstTurnLetters.push(this.vrPlayerEaselLetters[i]);
        }
    }

    private caclculateGeneratedWordPoints(word: string): number {
        let points = 0;
        for (const point of this.lettersService.fromWordToLetters(word)) points += point.score;
        return points;
    }

    private fitsTheProb(word: string): boolean {
        const points = this.caclculateGeneratedWordPoints(word);
        switch (this.probWordScore) {
            case '{0,6}':
                if (points > ZERO_POINTS && points <= SIX_POINTS) {
                    return true;
                }
                return false;

            case '{7,12}':
                if (points >= SEVEN_POINTS && points <= TWELVE_POINTS) return true;
                return false;

            case '{13,18}':
                if (points >= THIRTEEN_POINTS && points <= EIGHTEEN_POINTS) return true;
                return false;
        }
        return false;
    }

    private isWordPlacable(word: string, alreadyInBoard: Letter[]): boolean {
        let pos = new Array<boolean>(word.length);
        pos.fill(false);
        let validWord = false;
        alreadyInBoard.splice(1, 7);
        for (let j = 0; j < alreadyInBoard.length; j++) {
            for (let i = 0; i < word.length; i++) {
                if (word.charAt(i) === alreadyInBoard[j].charac && !pos[i]) {
                    pos[i] = true;
                    break;
                }
            }
        }
        for (let i = 0; i < word.length; i++) {
            if (!pos[i]) {
                this.letterFromEasel += word.charAt(i);
            }
        }
        validWord = this.wordInEasel(this.letterFromEasel);
        return validWord;
    }
    private wordInEasel(word: string): boolean {
        let found = false;
        let first = true;

        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;
                for (let j = 0; j < EASEL_LENGTH; j++) {
                    if (word.charAt(i) === this.vrPlayerEaselLetters[j].charac && this.foundLetter[j] === false) {
                        this.foundLetter[j] = true;
                        found = true;
                        break;
                    }
                }
            } else {
                break;
            }
        }
        return found;
    }

    private exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL) + 1;
        for (let i = 0; i <= numberOfLettersToExchange; i++) {
            let randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL);
            this.commandToSend += this.vrPlayerEaselLetters[randomIndex].charac;
            this.vrPlayerEaselLetters[randomIndex] = this.reserveService.getRandomLetter();
        }
        this.commandToSend = '!echanger ' + this.commandToSend;
        this.commandObs.next(this.commandToSend);
        this.commandToSend = '';
    }

    private generateProb(): void {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.probWordScore = probability[randomIndex];
    }

    private getLetterForEachLine(direction: string): void {
        const lett: Letter[] = [];
        const letterIngrid: Letter[] = [];
        let regEx;
        let words: string[] = [];
        let notEmpty = false;
        let found = false;
        this.generateProb();
        let x: number = 0;
        let y: number = 0;
        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (direction === 'v') {
                    y = j;
                    x = i;
                } else {
                    y = i;
                    x = j;
                }
                if (this.lettersService.tiles[y][x]?.charac !== NOT_A_LETTER.charac) {
                    notEmpty = true;
                    letterIngrid.push(this.lettersService.tiles[y][x]);
                }
                lett.push(this.lettersService.tiles[y][x]);
            }
            if (notEmpty) {
                regEx = new RegExp(this.validWordService.generateRegEx(lett), 'g');
                words = this.generateWords(letterIngrid);
                for (let k = 0; k < words.length; k++) {
                    if (this.fitsTheProb(words[k]) && this.isWordPlacable(words[k], letterIngrid) && regEx.test(words[k])) {
                        let position: Vec2 = { x: 0, y: 0 };
                        let pos = this.placeVrLettersInScrable(words[k], lett);

                        if (pos != -1) {
                            let tempCommand: ChatCommand;
                            if (direction === 'v') {
                                tempCommand = { word: words[k], position: { x: x + 1, y: pos + 1 }, direction: direction };
                            } else {
                                tempCommand = { word: words[k], position: { x: pos + 1, y: y + 1 }, direction: direction };
                            }
                            this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand);
                            this.vrScoreObs.next(this.vrPoints);
                            if (this.vrPoints != 0) {
                                this.commandToSend =
                                    '!placer ' +
                                    String.fromCharCode(97 + (tempCommand.position.y - 1)) +
                                    tempCommand.position.x +
                                    tempCommand.direction +
                                    ' ' +
                                    words[k];
                                this.commandObs.next(this.commandToSend);
                                this.commandToSend = '';
                                for (let j = 0; j < words[k].length; j++) {
                                    if (direction === 'v') {
                                        position.x = x + 1;
                                        position.y = pos + j + 1;
                                    } else {
                                        position.x = pos + j + 1;
                                        position.y = y + 1;
                                        this.wordPlacedInScrable = true;
                                    }
                                    this.lettersService.placeLetter(this.lettersService.getTheLetter(words[k].charAt(j)), {
                                        x: position.x,
                                        y: position.y,
                                    });
                                }
                                this.updateVrEasel();
                                found = true;
                                break;
                            }
                        }
                    }
                    this.letterFromEasel = '';
                    this.foundLetter.fill(false);
                }
            }
            notEmpty = false;
            letterIngrid.splice(0, letterIngrid.length);
            lett.splice(0, lett.length);
            if (found) {
                break;
            }
        }
    }
    get commandToSendVr(): BehaviorSubject<string> {
        return this.commandObs;
    }

    generateWords(letter: Letter[]): string[] {
        for (const lett of this.vrPlayerEaselLetters) {
            letter.push(lett);
        }
        return this.validWordService.generateAllWordsPossible(letter);
    }
    get scoreVr(): BehaviorSubject<number> {
        return this.vrScoreObs;
    }
    private placeVrLettersInScrable(word: string, boarLetters: Letter[]): number {
        let posInit = -1;
        let equal = false;
        let reRightCounter = 0;
        for (let i = 0; i < NB_TILES - word.length; i++) {
            for (let j = 0; j < word.length; j++) {
                if (word.charAt(j) == boarLetters[i + j].charac) {
                    reRightCounter++;
                    equal = true;
                }
                if (word.charAt(j) != boarLetters[i + j].charac && boarLetters[i + j].charac != NOT_A_LETTER.charac) {
                    equal = false;
                    break;
                }
                if (j == word.length - 1 && equal) {
                    if (
                        i + j != 14 &&
                        boarLetters[i + j + 1].charac === NOT_A_LETTER.charac &&
                        i != 0 &&
                        boarLetters[i - 1].charac === NOT_A_LETTER.charac
                    )
                        posInit = i;
                }
            }
            if (posInit != -1 && reRightCounter != word.length) {
                break;
            }
            reRightCounter = 0;
        }
        return posInit;
    }
}
