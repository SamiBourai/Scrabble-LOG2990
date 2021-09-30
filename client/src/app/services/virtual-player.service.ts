import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { ScrableLetters } from '@app/classes/scrable-letters';
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
    ZERO_POINTS
} from '@app/constants/constants';
import { ReserveService } from '@app/services/reserve.service';
import { LettersService } from './letters.service';
import { ValidWordService } from './valid-world.service';
// import { LettersService } from './letters.service';
// import { A } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    private vrPlayerEaselLetters: Letter[] = [];

    // private lowScore : boolean = false;
    // private averageScore : boolean= false ;
    // private highScore : boolean= false;
    private firstTurnLetters: Letter[] = [];
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string;
    private first: boolean = true;
    private letterFromEasel: string = '';
    //private letterInscrable: ScrableLetters[] = [];

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
    ) {}

    // private letters : Array<Letter> =[];
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
                    if (this.first) {
                        this.first = false;
                        this.generateVrPlayerEasel();
                        let words = this.validWordService.generateAllWordsPossible(this.vrPlayerEaselLetters);

                        for (let word of words) {
                            console.log(word);
                            if (this.wordInEasel(word)) {
                                for (let i = 0; i < word.length; i++) {
                                    this.lettersService.placeLetter(this.lettersService.getTheLetter(word.charAt(i)), { x: 8 + i, y: 8 });
                                }
                                this.updateVrEasel();
                                break;
                            }

                            this.foundLetter.fill(false);
                        }
                    } else {
                        
                        this.getLetterForEachLine();
                        
                    }
                }, 3000);
                break;

            case 'passTurn':
                setTimeout(() => {
                    // this.userService.vrSkipingTurn = true;
                }, 20000);
                break;

            case 'exchangeLetters':
                this.exchangeLettersInEasel();
                // this.validWordService.generateAllWordsPossible();
                break;
        }
    }
    updateVrEasel(): void {
        for (let i = 0; i < this.vrPlayerEaselLetters.length; i++) {
            if (this.foundLetter[i] == true) {
                this.vrPlayerEaselLetters[i] = this.reserveService.getRandomLetter();
            }
        }
        console.log(this.vrPlayerEaselLetters, 'updateEasel');
    }
    generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            this.vrPlayerEaselLetters.push(this.reserveService.getRandomLetter());
            this.firstTurnLetters.push(this.vrPlayerEaselLetters[i]);
        }
        console.log(this.vrPlayerEaselLetters.slice(), 'generated');
    }

    caclculateGeneratedWordPoints(word: string): number {
        let points = 0;
        for (const point of this.lettersService.fromWordToLetters(word)) points += point.score;
        return points;
    }
    fitsTheProb(word: string): boolean {
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
    generateRegEx(lett: Letter[]): string {
        let concat = '(^';

        let lastWasEmpty = true;
        let spotDefine = false;
        let metLetter = false;
        for (let i = 0; i < lett.length; i++) {
            if (spotDefine) {
                const save: string = concat.slice();
                concat += '$)|';
                concat += save;
                spotDefine = false;
            }
            if (i !== lett.length - 1)
                if (lastWasEmpty && metLetter && lett[i].charac === NOT_A_LETTER.charac && lett[i + 1].charac === NOT_A_LETTER.charac) {
                    const save: string = concat.slice();
                    concat += '?$)|';
                    concat += save;
                }
            if (lett[i].charac === NOT_A_LETTER.charac) {
                concat += '.';
                if (i !== lett.length - 1)
                    if (
                        (lastWasEmpty && lett[i + 1].charac === NOT_A_LETTER.charac) ||
                        (lett[i + 1].charac !== NOT_A_LETTER.charac && lastWasEmpty)
                    ) {
                        concat += '?';
                        if (metLetter) {
                            spotDefine = true;
                            metLetter = false;
                        }
                    }

                lastWasEmpty = true;
            } else {
                metLetter = true;
                concat += lett[i].charac;
                if (i !== lett.length - 1)
                    if (lett[i + 1].charac === NOT_A_LETTER.charac) {
                        concat += '{1}';
                        spotDefine = true;
                    }
                lastWasEmpty = false;
            }
        }
        if (lastWasEmpty) {
            concat += '?$)';
        } else {
            concat += '{1}$)';
        }
        console.log(concat);
        return concat;
    }
    private isWordPlacable(word: string, alreadyInBoard: Letter[]): boolean {
        console.log('le mot : ' + word);
        let pos = new Array<boolean>(word.length);
        pos.fill(false);
        let validWord = false;
        alreadyInBoard.splice(1, 7);
        console.log(alreadyInBoard);

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
        console.log('LETTRE EASEL: ' + this.letterFromEasel);
        validWord = this.wordInEasel(this.letterFromEasel);
        console.log(validWord, ' : VALIDWORD');
        return validWord;
    }
    wordInEasel(word: string): boolean {
        // console.log(word);
        let found = false;
        let first = true;

        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < EASEL_LENGTH; j++) {
                    //  console.log(word.charAt(i) + ' : ' + this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j]);
                    if (word.charAt(i) === this.vrPlayerEaselLetters[j].charac && this.foundLetter[j] === false) {
                        this.foundLetter[j] = true;
                        // console.log('indexFind ' + j);
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
            this.vrPlayerEaselLetters[Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL)];
        }
    }

    private generateProb(): void {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.probWordScore = probability[randomIndex];
    }
    getLetterForEachColumn(): void {}

    getLetterForEachLine(): void {
        const lett: Letter[] = [];
        const letterIngrid: Letter[] = [];
        const scrableLett: ScrableLetters[] = [];
        let regEx;
        let words: string[] = [];
        let notEmpty = false;
        let found = false;

        this.generateProb();
        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (this.lettersService.tiles[i][j]?.charac !== NOT_A_LETTER.charac) {
                    notEmpty = true;
                    letterIngrid.push(this.lettersService.tiles[i][j]);

                    scrableLett.push({
                        letter: {
                            score: this.lettersService.tiles[i][j]?.score,
                            charac: this.lettersService.tiles[i][j]?.charac,
                            img: this.lettersService.tiles[i][j]?.img,
                        },
                        position: { x: j, y: i },
                    });
                }

                lett.push({
                    score: this.lettersService.tiles[i][j]?.score,
                    charac: this.lettersService.tiles[i][j]?.charac,
                    img: this.lettersService.tiles[i][j]?.img,
                });
            }
            if (notEmpty) {
                console.log('ligne: ' + i);
                regEx = new RegExp(this.generateRegEx(lett), 'g');
                words = this.generateWords(letterIngrid);
                // console.log(words);
                for (let k = 0; k < words.length; k++) {
                    console.log('regexBOOL: ', regEx.test(words[k]));
                    if (this.fitsTheProb(words[k]) && this.isWordPlacable(words[k], letterIngrid) && regEx.test(words[k])) {
                        console.log(words[k] + ' *essais avec ce mot*');
                        let x = this.placeVrLettersInScrable(words[k], lett);
                        if (x != -1)
                            for (let j = 0; j < words[k].length; j++) {
                                this.lettersService.placeLetter(this.lettersService.getTheLetter(words[k].charAt(j)), {
                                    x: x + j + 1,
                                    y: i + 1,
                                });
                            }
                        this.updateVrEasel();
                        found = true;
                        break;
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

    generateWords(letter: Letter[]): string[] {
        // console.log('generate word: ' + this.vrPlayerEaselLetters);
        for (const lett of this.vrPlayerEaselLetters) {
            letter.push(lett);
        }
        console.log(letter);
        return this.validWordService.generateAllWordsPossible(letter);
    }

    private placeVrLettersInScrable(word: string, boarLetters: Letter[]): number {
        let posInit = -1;
        let equal = false;
        console.log(word + ' est le mot a plasser');
        for (let i = 0; i < NB_TILES - word.length; i++) {
            for (let j = 0; j < word.length; j++) {
                console.log(boarLetters[j + i], word.charAt(j));
                if (word.charAt(j) == boarLetters[i + j].charac) equal = true;

                if (word.charAt(j) != boarLetters[i + j].charac && boarLetters[i + j].charac != NOT_A_LETTER.charac) {
                    equal = false;
                    break;
                }

                if (j == word.length - 1 && equal) {
                    posInit = i;
                    console.log('POSITION MOT :' + posInit);
                }
            }
            if (posInit != -1) {
                break;
            }
        }

        return posInit;
    }
}
