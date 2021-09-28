import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
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
    ZERO_POINTS,
} from '@app/constants/constants';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { LettersService } from './letters.service';
import { ValidWordService } from './valid-world.service';
// import { LettersService } from './letters.service';
// import { A } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    private vrPlayerEaselLetters: Easel[] = [];
    private verticalLetters: Map<number, ScrableLetters[]> = new Map<number, ScrableLetters[]>();

    // private lowScore : boolean = false;
    // private averageScore : boolean= false ;
    // private highScore : boolean= false;
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string;
    //private letterInscrable: ScrableLetters[] = [];

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
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
            case 'placeWord': {
                setTimeout(() => {
                    this.generateVrPlayerEasel();

                    this.getLetterForEachLine();
                }, 3000);

                break;
            }
            case 'passTurn': {
                setTimeout(() => {
                    this.userService.vrSkipingTurn = true;
                }, 20000);
                break;
            }
            case 'exchangeLetters': {
                this.exchangeLettersInEasel();
                // this.validWordService.generateAllWordsPossible();
                break;
            }
        }
    }

    generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            console.log(i);
            this.vrPlayerEaselLetters.push({ index: i, letters: this.reserveService.getRandomLetter() });
        }
        console.log(this.vrPlayerEaselLetters);
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

        let lastWasEmpty: boolean = false;
        let spotDefine: boolean = false;
        let metLetter: boolean = false;
        for (let i = 0; i < lett.length; i++) {
            if (spotDefine) {
                let save: string = concat.slice();
                concat += '$)|';
                concat += save;
                spotDefine = false;
            }
            if (lastWasEmpty && metLetter && lett[i].charac === NOT_A_LETTER.charac && lett[i + 1].charac === NOT_A_LETTER.charac) {
                let save: string = concat.slice();
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

        return concat;
    }
    private isWordPlacable(word: string, alreadyInBoard: Letter[]): boolean {
        let letterFromEasel: string = '';

        let copy: Letter[] = alreadyInBoard.slice();

        let validWord: boolean = false;
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
                    if (word.charAt(i) === this.vrPlayerEaselLetters[j].letters.charac && this.foundLetter[j] === false) {
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
        let letter: ScrableLetters[] = [];
        console.log(this.lettersService.tiles);
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
        console.log(this.verticalLetters, 'vertical');
    }

    getLetterForEachLine(): void {
        let lett: Letter[] = [];
        let letterIngrid: Letter[] = [];
        let regEx;
        let words: string[] = [];
        let notEmpty: boolean = false;

        this.generateProb();

        for (let i = 0; i < NB_TILES; i++) {
            for (let j = 0; j < NB_TILES; j++) {
                if (this.lettersService.tiles[i][j]?.charac !== NOT_A_LETTER.charac) {
                    notEmpty = true;
                    letterIngrid.push(this.lettersService.tiles[i][j]);
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
                    if (this.fitsTheProb(words[k]) && this.isWordPlacable(words[k], letterIngrid) && regEx.test(words[k]))
                        this.placeVrLettersInScrable(words[k], lett, i);
                }
            }
            lett.splice(0, lett.length);
        }
    }

    generateWords(letter: Letter[]): string[] {
        // console.log('generate word: ' + this.vrPlayerEaselLetters);

        for (let lett of this.vrPlayerEaselLetters) {
            letter.push(lett.letters);
        }
        return this.validWordService.generateAllWordsPossible(letter);
    }

    private placeVrLettersInScrable(word: string, boarLetters: Letter[], y: number): void {
        console.log('yoooo', this.userService.realUser.firstToPlay);

        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < boarLetters.length; j++) {
                if (word.charAt(i) == boarLetters[j].charac) {
                }
            }
        }
    }
}
