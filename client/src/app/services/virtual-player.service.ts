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
    private verticalLetters: Map<number, ScrableLetters[]> = new Map<number, ScrableLetters[]>();

    // private lowScore : boolean = false;
    // private averageScore : boolean= false ;
    // private highScore : boolean= false;
    private firstTurnLetters: Letter[] = [];
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string;
    private first: boolean = true;
    //private letterInscrable: ScrableLetters[] = [];

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
    ) {}

    // private letters : Array<Letter> =[];
    manageVrPlayerActions(firstToplay: boolean): void {
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
                    console.log()
                    this.generateVrPlayerEasel();
                    this.first = false;
                    if (firstToplay) {
                        this.generateProb();
                        const words = this.validWordService.generateAllWordsPossible(this.firstTurnLetters);
                        let matchwordLetters: Letter[] = [];
                        for (const word of words) {
                            if (this.fitsTheProb(word) ) {
                                console.log('wordddddddddddddd', word)
                                matchwordLetters = this.lettersService.fromWordToLetters(word);
                                break;
                            }
                        }
                        const j = 8;
                        let i = 8;
                        for (const lett of matchwordLetters) {
                            this.lettersService.placeLetter(lett, { x: i++, y: j });
                            //this.updateVrEasel(lett);
                        }
                    }else this.getLetterForEachLine();

                    // this.generateWords()
                } else this.getLetterForEachLine();
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
    updateVrEasel(letter: Letter): void {
        for (let i = 0; i < this.vrPlayerEaselLetters.length; i++) {
            if (this.vrPlayerEaselLetters[i].charac === letter.charac) {
                this.vrPlayerEaselLetters[i] = this.reserveService.getRandomLetter();
            }
        }
        console.log(this.vrPlayerEaselLetters,'updateEasel');
    }
    generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            this.vrPlayerEaselLetters.push(this.reserveService.getRandomLetter());
            this.firstTurnLetters.push(this.vrPlayerEaselLetters[i]);
        }
        console.log(this.vrPlayerEaselLetters,'generated');
    }

    // private easelToLetters(): Letter[] {
    //     const letters: Letter[] = [];
    //     for (const playerLetters of this.vrPlayerEaselLetters) {
    //         letters.push(playerLetters.letters);
    //     }
    //     return letters;
    // }

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

        let lastWasEmpty = false;
        let spotDefine = false;
        let metLetter = false;
        for (let i = 0; i < lett.length - 1; i++) {
            if (spotDefine) {
                const save: string = concat.slice();
                concat += '$)|';
                concat += save;
                spotDefine = false;
            }
            if (lastWasEmpty && metLetter && lett[i].charac === NOT_A_LETTER.charac && lett[i + 1].charac === NOT_A_LETTER.charac) {
                const save: string = concat.slice();
                concat += '?$)|';
                concat += save;
            }
            if (lett[i].charac === NOT_A_LETTER.charac) {
                concat += '.';
                if (i !== lett.length - 1)
                    if ((lett[i + 1].charac === NOT_A_LETTER.charac && !metLetter) || (lett[i + 1].charac !== NOT_A_LETTER.charac && !metLetter)) {
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

        return concat;
    }
    private isWordPlacable(word: string, alreadyInBoard: Letter[]): boolean {
        let letterFromEasel = '';

        const copy: Letter[] = alreadyInBoard.slice();

        let validWord = false;
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < copy.length; j++) {
                if (word.charAt(i) !== copy[j].charac) {
                    letterFromEasel = letterFromEasel + word.charAt(i);
                    copy.splice(j, 1);
                    break;
                }
            }
        }

        validWord = this.wordInEasel(letterFromEasel);
        this.foundLetter.fill(false);
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
        // console.log(this.foundLetter);

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
    getLetterForEachColumn(): void {
        const letter: ScrableLetters[] = [];
        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (this.lettersService.tiles[j][i]?.charac !== NOT_A_LETTER.charac) {
                    console.log('madafak', this.lettersService.tiles[j][i]);
                    letter.push({
                        letter: {
                            score: this.lettersService.tiles[j][i]?.score,
                            charac: this.lettersService.tiles[j][i]?.charac,
                            img: this.lettersService.tiles[j][i]?.img,
                        },
                        position: { x: i, y: j },
                    });
                    console.log(letter, 'luwqhe');
                }
            }
            this.verticalLetters.set(i, letter.slice());
            letter.splice(0, letter.length);
        }
    }

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
                regEx = new RegExp(this.generateRegEx(lett));
                words = this.generateWords(lett);
                for (let k = 0; k < words.length; k++) {
                    if (this.fitsTheProb(words[k]) && this.isWordPlacable(words[k], letterIngrid) && regEx.test(words[k])) {
                        console.log(words[k]);
                        this.placeVrLettersInScrable(words[k], scrableLett);
                        found = true;
                        break;
                    }
                }
            }
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
        return this.validWordService.generateAllWordsPossible(letter);
    }

    private placeVrLettersInScrable(word: string, boarLetters: ScrableLetters[]): void {
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < boarLetters.length; j++) {
                console.log(boarLetters[j], word.charAt(i));
                if (word.charAt(i) == boarLetters[j].letter.charac) {
                    console.log('shuilaaaa');
                    this.lettersService.placeLetter(boarLetters[j].letter, { x: boarLetters[j].position.x, y: boarLetters[j].position.y });
                }
            }
        }
    }
}
