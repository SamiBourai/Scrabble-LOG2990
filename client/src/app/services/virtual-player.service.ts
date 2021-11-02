import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/EaselObject';
import { Letter } from '@app/classes/letter';
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
import { EaselLogiscticsService } from './easel-logisctics.service';
import { LettersService } from './letters.service';
import { ValidWordService } from './valid-world.service';
@Injectable({ providedIn: 'root' })
export class VirtualPlayerService {
    first: boolean = true;
    commandToSend: string = '';
    commandObs = new BehaviorSubject<string>('');
    vrPoints: number = 0;
    isDicFille: boolean = false;
    vrScoreObs = new BehaviorSubject<number>(0);
    played: boolean = false;
    skipTurn: boolean = false;
    easel = new EaselObject(false);
    private probWordScore: string;
    private wordPlacedInScrable: boolean = false;

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private easelLogic: EaselLogiscticsService,
    ) {}
    manageVrPlayerActions(): void {
        this.skipTurn = false;
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
        if (!this.isDicFille) {
            this.isDicFille = true;
            // this.easelLogic.fillEasel(this.easel, false);
        }
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.played = false;
        switch (probability[randomIndex]) {
            case 'placeWord':
                setTimeout(() => {
                    if (this.first) {
                        this.first = false;
                        const words = this.validWordService.generateAllWordsPossible(this.easel.easelLetters);
                        for (const word of words) {
                            if (this.easel.contains(word)) {
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
                                this.vrScoreObs.next(this.vrPoints);
                                this.lettersService.placeLettersInScrable(tempCommand, this.easel, false);
                                this.wordPlacedInScrable = true;
                                this.easelLogic.refillEasel(this.easel, false);
                                break;
                            }
                            this.easel.resetVariables();
                        }
                    } else {
                        this.getLetterForRange('h', this.lettersService.tiles);
                        if (!this.wordPlacedInScrable) this.getLetterForRange('v', this.lettersService.tiles);
                    }
                    if (!this.wordPlacedInScrable) {
                        this.passTurnSteps();
                    } else {
                        this.wordPlacedInScrable = false;
                        this.played = true;
                        this.skipTurn = false;
                    }
                }, WAIT_TIME_3_SEC);
                break;
            case 'exchangeLetters':
                setTimeout(() => {
                    if (this.reserveService.reserveSize > EASEL_LENGTH) {
                        this.commandToSend = '!echanger';
                        this.exchangeLettersInEasel();
                        this.commandObs.next(this.commandToSend);
                        this.commandToSend = '';
                        this.played = true;
                        this.skipTurn = false;
                    } else this.passTurnSteps();
                }, WAIT_TIME_3_SEC);
                break;
            case 'passTurn':
                setTimeout(() => {
                    this.passTurnSteps();
                }, WAIT_TIME_3_SEC);
                break;
        }
    }
    private passTurnSteps() {
        this.commandToSend = '!passer';
        this.commandObs.next(this.commandToSend);
        this.commandToSend = '';
        this.played = true;
        this.skipTurn = true;
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

    private exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL) + 1;

        for (let i = 0; i < numberOfLettersToExchange; i++) {
            const letterTemp = this.easel.easelLetters[i];
            this.commandToSend += this.easel.easelLetters[i].charac;
            this.easel.add(this.reserveService.getRandomLetter(), i);
            this.reserveService.reFillReserve(letterTemp);
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
        let placed = false;
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
            if (notEmpty) placed = this.findPlacement(lett, letterIngrid, direction, x, y);
            notEmpty = false;
            letterIngrid.splice(0, letterIngrid.length);
            lett.splice(0, lett.length);
            if (placed) {
                this.wordPlacedInScrable = true;
                return;
            }
        }
    }

    private findPlacement(lett: Letter[], letterIngrid: Letter[], direction: string, x: number, y: number): boolean {
        let found = false;
        const regEx = new RegExp(this.validWordService.generateRegEx(lett), 'g');
        const words: string[] = this.generateWords(letterIngrid);

        for (const word of words) {
            if (this.fitsTheProb(word) && regEx.test(word)) {
                const pos = this.placeVrLettersInScrable(word, lett);
                if (pos !== UNDEFINED_INDEX) {
                    let tempCommand: ChatCommand;
                    if (direction === 'v') tempCommand = { word, position: { x: x + 1, y: pos + 1 }, direction };
                    else tempCommand = { word, position: { x: pos + 1, y: y + 1 }, direction };

                    if (this.lettersService.wordIsPlacable(tempCommand, this.easel)) {
                        this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand);
                        if (this.vrPoints !== 0) {
                            this.commandToSend =
                                '!placer ' +
                                String.fromCharCode(ASCI_CODE_A + (tempCommand.position.y - 1)) +
                                tempCommand.position.x +
                                tempCommand.direction +
                                ' ' +
                                word;

                            this.vrScoreObs.next(this.vrPoints);
                            this.lettersService.placeLettersInScrable(tempCommand, this.easel, false);
                            this.commandObs.next(this.commandToSend);
                            this.commandToSend = '';
                            found = true;
                            return found;
                        }
                    }
                }
            }
        }
        return found;
    }
    private generateWords(letter: Letter[]): string[] {
        for (const lett of this.easel.easelLetters) {
            letter.push(lett);
        }
        return this.validWordService.generateAllWordsPossible(letter);
    }

    private placeVrLettersInScrable(word: string, boarLetters: Letter[]): number {
        let posInit = DEFAULT_POS;
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
                    if (
                        boarLetters[i + j + 1].charac === NOT_A_LETTER.charac &&
                        i !== 0 &&
                        boarLetters[i - 1].charac === NOT_A_LETTER.charac &&
                        reRightCounter !== 0
                    )
                        posInit = i;
            }
            if (posInit !== DEFAULT_POS && reRightCounter !== word.length) {
                break;
            } else {
                reRightCounter = 0;
                posInit = DEFAULT_POS;
            }
        }
        return posInit;
    }
    get commandToSendVr(): BehaviorSubject<string> {
        return this.commandObs;
    }
    get scoreVr(): BehaviorSubject<number> {
        return this.vrScoreObs;
    }
}
