import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/easel-object';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    ASCI_CODE_A,
    DEFAULT_POS,
    EASEL_LENGTH,
    EIGHTEEN_POINTS,
    INITIAL_BOX_X,
    INITIAL_BOX_Y,
    NB_TILES,
    NOT_A_LETTER,
    SEVEN_POINTS,
    SIX_POINTS,
    THIRTEEN_POINTS,
    TWELVE_POINTS,
    UNDEFINED_INDEX,
    WAIT_TIME_3_SEC,
    ZERO_POINTS
} from '@app/constants/constants';
import { ReserveService } from '@app/services/reserve.service';
import { BehaviorSubject } from 'rxjs';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { LettersService } from './letters.service';
import { ObjectifManagerService } from './objectif-manager.service';
import { ValidWordService } from './valid-word.service';
import { WordPointsService } from './word-points.service';
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
    expert: boolean = false;
    private probWordScore: string = '';
    private wordPlacedInScrable: boolean = false;

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private easelLogic: EaselLogiscticsService,
        private objectifMangerService: ObjectifManagerService,
        private wordPoints: WordPointsService,
    ) {}

    manageVrPlayerActions(): void {
        this.skipTurn = false;
        this.played = false;
        switch (this.playProbabilty()) {
            case 'placeWord':
                setTimeout(() => {
                    if (this.lettersService.tileIsEmpty({ x: EASEL_LENGTH + 1, y: EASEL_LENGTH + 1 })) {
                        const words = this.validWordService.generateAllWordsPossible(this.easel.easelLetters);
                        for (const word of words) {
                            if (this.easel.contains(word)) {
                                const tempCommand: ChatCommand = { word, position: { x: INITIAL_BOX_X, y: INITIAL_BOX_Y }, direction: 'h' };
                                this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(
                                    this.lettersService.tiles,
                                    tempCommand,
                                    'soloGame',
                                    false,
                                );
                                this.placeWordSteps(tempCommand);
                                break;
                            }
                            this.easel.resetVariables();
                        }
                    } else {
                        this.getLetterForRange('h', this.lettersService.tiles);
                        if (!this.wordPlacedInScrable) this.getLetterForRange('v', this.lettersService.tiles);
                    }
                    switch (this.wordPlacedInScrable) {
                        case false:
                            if (this.expert && this.reserveService.reserveSize !== 0) {
                                this.tradeLetterSteps();
                            } else {
                                this.passTurnSteps();
                            }
                            break;
                        case true:
                            this.wordPlacedInScrable = false;
                            this.played = true;
                            this.skipTurn = false;
                            break;
                    }
                }, WAIT_TIME_3_SEC);
                break;
            case 'exchangeLetters':
                setTimeout(() => {
                    if (this.reserveService.reserveSize > EASEL_LENGTH) {
                        this.tradeLetterSteps();
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
    tradeLetterSteps() {
        this.commandToSend = '!echanger ';
        this.exchangeLettersInEasel();
        this.commandObs.next(this.commandToSend);
        this.commandToSend = '';
        this.played = true;
        this.skipTurn = false;
    }
    placeWordSteps(tempCommand: ChatCommand, alternatives?: ChatCommand[], maxPoint?: number[]) {
        this.commandToSend =
            '!placer ' +
            String.fromCharCode(ASCI_CODE_A + (tempCommand.position.y - 1)) +
            tempCommand.position.x +
            tempCommand.direction +
            ' ' +
            tempCommand.word +
            '  (' +
            this.vrPoints +
            ')<br/>';
        if (alternatives && maxPoint) {
            this.commandToSend += '**placement alternatifs:' + '<br/>';
            for (let i = 1; i < alternatives.length; i++) {
                if (alternatives[i].position.x === UNDEFINED_INDEX) break;
                this.commandToSend +=
                    '-----!placer ' +
                    String.fromCharCode(ASCI_CODE_A + (alternatives[i].position.y - 1)) +
                    alternatives[i].position.x +
                    alternatives[i].direction +
                    ' ' +
                    alternatives[i].word +
                    '  (' +
                    maxPoint[i] +
                    ')<br/>';
            }
        }
        this.commandObs.next(this.commandToSend);
        this.commandToSend = '';
        this.vrScoreObs.next(this.vrPoints);
        this.lettersService.placeLettersInScrable(tempCommand, this.easel, false);
        this.wordPlacedInScrable = true;
        this.easelLogic.refillEasel(this.easel, false);
        if (this.objectifMangerService.log2990Mode) {
            this.objectifMangerService.vrPassTurnCounter = 0;
            this.objectifMangerService.verifyObjectifs(false, tempCommand);
        }
    }
    private playProbabilty(): string {
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
        const randomIndex = Math.floor(Math.random() * probability.length);
        if (this.expert) {
            return probability[0];
        }
        return probability[randomIndex];
    }
    private passTurnSteps() {
        this.commandToSend = '!passer';
        this.commandObs.next(this.commandToSend);
        this.commandToSend = '';
        this.played = true;
        this.skipTurn = true;
        if (this.objectifMangerService.log2990Mode) {
            this.objectifMangerService.vrPassTurnCounter++;
            this.objectifMangerService.verifyObjectifs(false);
        }
    }

    private calculateGeneratedWordPoints(word: string): number {
        let points = 0;
        for (const point of this.lettersService.fromWordToLetters(word)) points += point.score;
        return points;
    }
    private fitsTheProb(word: string): boolean {
        const points = this.calculateGeneratedWordPoints(word);

        switch (this.probWordScore) {
            case '{0,6}':
                return points > ZERO_POINTS && points <= SIX_POINTS;
            case '{7,12}':
                return points >= SEVEN_POINTS && points <= TWELVE_POINTS;
            case '{13,18}':
                return points >= THIRTEEN_POINTS && points <= EIGHTEEN_POINTS;
        }
        return false;
    }

    private exchangeLettersInEasel(): void {
        let numberOfLettersToExchange = Math.floor(Math.random() * EASEL_LENGTH);
        if (this.expert) {
            if (this.reserveService.reserveSize >= EASEL_LENGTH) {
                numberOfLettersToExchange = EASEL_LENGTH;
            } else {
                numberOfLettersToExchange = this.reserveService.reserveSize;
            }
        }

        for (let i = 0; i < numberOfLettersToExchange; i++) {
            const letterTemp = this.easel.easelLetters[i];
            this.commandToSend += this.easel.easelLetters[i].charac;
            this.easel.add(this.reserveService.getRandomLetter(), i);
            this.reserveService.reFillReserve(letterTemp);
        }
        if (this.objectifMangerService.log2990Mode) {
            this.objectifMangerService.vrPassTurnCounter = 0;
            this.objectifMangerService.verifyObjectifs(false, undefined, numberOfLettersToExchange);
        }
    }
    private generateProb(): void {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * probability.length);
        this.probWordScore = probability[randomIndex];
    }
    private getLetterForRange(direction: string, tiles: Letter[][]): void {
        const lett: Letter[] = [];
        const letterIngrid: Letter[] = [];
        let notEmpty = false;
        let placed = false;
        this.generateProb();
        let pos: Vec2 = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (direction === 'v') pos = { x: i, y: j };
                else pos = { x: j, y: i };

                if (tiles[pos.y][pos.x]?.charac !== NOT_A_LETTER.charac) {
                    notEmpty = true;
                    letterIngrid.push(tiles[pos.y][pos.x]);
                }
                lett.push(tiles[pos.y][pos.x]);
            }
            if (notEmpty) placed = this.findValidWord(lett, letterIngrid, direction, pos.x, pos.y);
            notEmpty = false;
            letterIngrid.splice(0, letterIngrid.length);
            lett.splice(0, lett.length);
            if (placed) {
                this.wordPlacedInScrable = true;
                return;
            }
        }
    }

    private findValidWord(lett: Letter[], letterIngrid: Letter[], direction: string, x: number, y: number): boolean {
        let found = false;
        const regEx = new RegExp(this.validWordService.generateRegEx(lett));
        const words: string[] = this.generateWords(letterIngrid);
        const maxPoint: number[] = [0, 0, 0, 0];
        let tempCommand: ChatCommand;
        const saveTempCommand: ChatCommand[] = [
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction },
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction },
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction },
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction },
        ];
        for (const word of words) {
            this.easel.resetVariables();
            if ((!this.expert ? this.fitsTheProb(word) : true) && regEx.test(word)) {
                const pos = this.findPositionInRange(word, lett);
                if (pos !== UNDEFINED_INDEX) {
                    tempCommand = { word, position: direction === 'v' ? { x: x + 1, y: pos + 1 } : { x: pos + 1, y: y + 1 }, direction };
                    if (this.lettersService.wordIsPlacable(tempCommand, this.easel)) {
                        this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand, 'soloGame', true);
                        switch (this.expert) {
                            case true:
                                this.wordPoints.handleBestPointsVP(this.vrPoints, tempCommand, maxPoint, saveTempCommand);
                                break;
                            case false:
                                if (this.vrPoints !== 0) {
                                    this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, tempCommand, 'soloGame', false);
                                    this.placeWordSteps(tempCommand);
                                    return true;
                                }
                                break;
                        }
                    }
                }
            }
        }
        if (maxPoint[0] > 0) {
            this.easel.resetVariables();
            this.lettersService.wordIsPlacable(saveTempCommand[0], this.easel);
            this.vrPoints = this.validWordService.readWordsAndGivePointsIfValid(this.lettersService.tiles, saveTempCommand[0], 'soloGame', false);
            this.placeWordSteps(saveTempCommand[0], saveTempCommand, maxPoint);
            found = true;
        }
        return found;
    }
    private generateWords(letter: Letter[]): string[] {
        for (const lett of this.easel.easelLetters) {
            letter.push(lett);
        }
        return this.validWordService.generateAllWordsPossible(letter);
    }

    private findPositionInRange(word: string, boarLetters: Letter[]): number {
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
                        (i + j < NB_TILES - 1 ? boarLetters[i + j + 1].charac === NOT_A_LETTER.charac : true) &&
                        (i !== 0 ? boarLetters[i - 1].charac === NOT_A_LETTER.charac : true) &&
                        reRightCounter !== 0
                    )
                        posInit = i;
            }
            if (posInit !== DEFAULT_POS && reRightCounter < word.length) {
                break;
            } else {
                reRightCounter = 0;
                posInit = DEFAULT_POS;
            }
        }
        return posInit;
    }
}
