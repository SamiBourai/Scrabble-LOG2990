import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    ASCI_CODE_A,
    DEFAULT_POS,
    EASEL_LENGTH,
    EIGHTEEN_POINTS,
    INITIAL_BOX_X,
    INITIAL_BOX_Y,
    MAX_INDEX_NUMBER_EASEL,
    MAX_INDEX_NUMBER_PROBABILITY_ARRAY,
    NB_TILES,
    NOT_A_LETTER,
    SEVEN_POINTS,
    SIX_POINTS,
    THIRTEEN_POINTS,
    TWELVE_POINTS,
    UNDEFINED_INDEX,
    WAIT_TIME_3_SEC,
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
    first: boolean = true;
    commandToSend: string = '';
    // eslint-disable-next-line no-invalid-this
    commandObs = new BehaviorSubject<string>(this.commandToSend);
    playObs = new BehaviorSubject(false);
    vrPoints: number = 0;
    isDicFille: boolean = false;
    // eslint-disable-next-line no-invalid-this
    vrScoreObs = new BehaviorSubject(this.vrPoints);
    played: boolean = false;
    vrEaselSize: number = EASEL_LENGTH;
    private firstTurnLetters: Letter[] = [];
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string;
    private letterFromEasel: string = '';
    private wordPlacedInScrable: boolean = false;

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
                        const words = this.validWordService.generateAllWordsPossible(this.vrPlayerEaselLetters);
                        for (const word of words) {
                            if (this.wordInEasel(word)) {
                                const tempCommand: ChatCommand = { word, position: { x: INITIAL_BOX_X, y: INITIAL_BOX_Y }, direction: 'h' };
                                this.commandToSend =
                                    '!placer ' +
                                    String.fromCharCode(ASCI_CODE_A + (tempCommand.position.y - 1)) +
                                    tempCommand.position.x +
                                    'h ' +
                                    word;
                                this.commandObs.next(this.commandToSend);
                                this.commandToSend = '';

                                this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand);

                                for (let i = 0; i < word.length; i++) {
                                    this.lettersService.placeLetter(this.lettersService.getTheLetter(word.charAt(i)), {
                                        x: INITIAL_BOX_X + i,
                                        y: INITIAL_BOX_Y,
                                    });
                                }
                                this.updateVrEasel();
                                break;
                            }
                            this.foundLetter.fill(false);
                        }
                    } else {
                        this.getLetterForRange('h', this.lettersService.tiles);
                        if (!this.wordPlacedInScrable) this.getLetterForRange('v', this.lettersService.tiles);
                    }
                    this.vrScoreObs.next(this.vrPoints);
                    this.wordPlacedInScrable = false;
                    this.played = true;
                }, WAIT_TIME_3_SEC);
                break;

            case 'passTurn':
                setTimeout(() => {
                    this.commandToSend = '!passer ';
                    this.commandObs.next(this.commandToSend);
                    this.commandToSend = '';
                }, WAIT_TIME_3_SEC);
                this.played = true;
                break;
            case 'exchangeLetters':
                setTimeout(() => {
                    this.exchangeLettersInEasel();
                    this.played = true;
                }, WAIT_TIME_3_SEC);
                this.commandToSend = '!echanger ' + this.commandToSend;
                this.commandObs.next(this.commandToSend);
                this.commandToSend = '';
                break;
        }
    }
    private updateVrEasel(): void {
        for (let i = 0; i < this.vrPlayerEaselLetters.length; i++) {
            if (this.foundLetter[i] === true) {
                if (this.reserveService.reserveSize !== 0) this.vrPlayerEaselLetters[i] = this.reserveService.getRandomLetter();
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
        const pos = new Array<boolean>(word.length);
        pos.fill(false);
        let validWord = false;
        alreadyInBoard.splice(1, EASEL_LENGTH);
        // need index for pos i
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
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
            } else break;
        }
        return found;
    }
    private exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL) + 1;
        for (let i = 0; i <= numberOfLettersToExchange; i++) {
            const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL);
            this.commandToSend += this.vrPlayerEaselLetters[randomIndex].charac;
            this.vrPlayerEaselLetters[randomIndex] = this.reserveService.getRandomLetter();
        }
    }
    private generateProb(): void {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.probWordScore = probability[randomIndex];
    }
    private getLetterForRange(direction: string, tiles: Letter[][]): void {
        const lett: Letter[] = [];
        const letterIngrid: Letter[] = [];
        let notEmpty = false;
        let found = false;
        this.generateProb();
        let x = 0;
        let y = 0;
        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (direction === 'v') {
                    y = j;
                    x = i;
                } else {
                    y = i;
                    x = j;
                }
                if (tiles[y][x]?.charac !== NOT_A_LETTER.charac) {
                    notEmpty = true;
                    letterIngrid.push(tiles[y][x]);
                }
                lett.push(tiles[y][x]);
            }
            if (notEmpty) found = this.findPlacement(lett, letterIngrid, direction, x, y);

            notEmpty = false;
            letterIngrid.splice(0, letterIngrid.length);
            lett.splice(0, lett.length);
            if (found) break;
        }
    }
    get commandToSendVr(): BehaviorSubject<string> {
        return this.commandObs;
    }
    private findPlacement(lett: Letter[], letterIngrid: Letter[], direction: string, x: number, y: number): boolean {
        let found = false;
        const regEx = new RegExp(this.validWordService.generateRegEx(lett), 'g');
        const words: string[] = this.generateWords(letterIngrid);
        // we need index
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let k = 0; k < words.length; k++) {
            if (this.fitsTheProb(words[k]) && this.isWordPlacable(words[k], letterIngrid) && regEx.test(words[k])) {
                const position: Vec2 = { x: 0, y: 0 };
                const pos = this.placeVrLettersInScrable(words[k], lett);

                if (pos !== UNDEFINED_INDEX) {
                    let tempCommand: ChatCommand;
                    if (direction === 'v') tempCommand = { word: words[k], position: { x: x + 1, y: pos + 1 }, direction };
                    else tempCommand = { word: words[k], position: { x: pos + 1, y: y + 1 }, direction };

                    this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand);
                    if (this.vrPoints !== 0) {
                        this.commandToSend =
                            '!placer ' +
                            String.fromCharCode(ASCI_CODE_A + (tempCommand.position.y - 1)) +
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
        return found;
    }
    private generateWords(letter: Letter[]): string[] {
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
                if (word.charAt(j) === boarLetters[i + j].charac) {
                    reRightCounter++;
                    equal = true;
                }
                if (word.charAt(j) !== boarLetters[i + j].charac && boarLetters[i + j].charac !== NOT_A_LETTER.charac) {
                    equal = false;
                    break;
                }
                if (j === word.length - 1 && equal)
                    if (boarLetters[i + j + 1].charac === NOT_A_LETTER.charac && i !== 0 && boarLetters[i - 1].charac === NOT_A_LETTER.charac)
                        posInit = i;
            }
            if (posInit !== DEFAULT_POS && reRightCounter !== word.length) {
                break;
            } else {
                reRightCounter = 0;
                posInit = -1;
            }
        }
        return posInit;
    }
}
