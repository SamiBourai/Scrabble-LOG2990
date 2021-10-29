/* eslint-disable prettier/prettier */
import { EASEL_LENGTH, NOT_A_LETTER, UNDEFINED_INDEX } from '@app/constants/constants';
import { Letter } from './letter';

export class EaselObject {
    easelSize: number = EASEL_LENGTH;
    easelLetters = new Array<Letter>(EASEL_LENGTH);
    foundLetter = new Array<boolean>(EASEL_LENGTH);
    indexOfEaselLetters: number[] = [];
    posTempLetters = new Array<boolean>(EASEL_LENGTH);
    indexTempLetters = new Array<number>();
    indexToMove: number = UNDEFINED_INDEX;
    constructor(initEasel: boolean) {
        this.foundLetter.fill(initEasel);
        this.easelLetters.fill(NOT_A_LETTER);
        this.posTempLetters.fill(initEasel);
    }

    getEaselSize(): number {
        return EASEL_LENGTH - this.easelLetters.filter((easelLetters) => easelLetters === NOT_A_LETTER).length;
    }

    contains(word: string): boolean {
        let found = false;
        let first = true;
        let majuscule = false;
        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;
                if (word.charAt(i) === word.charAt(i).toUpperCase()) {
                    console.log(word.charAt(i) + ' est majuscues');
                    majuscule = true;
                }
                for (let j = 0; j < EASEL_LENGTH; j++) {
                    if (majuscule && this.easelLetters[j].charac === '*' && this.foundLetter[j] === false) {
                        // const letter = STRING_LETTER_OBJECTS.get(word.charAt(i).toLowerCase()) as Letter;
                        // const temp = JSON.parse(JSON.stringify(this.easelLetters[j]));
                        // temp.img = letter.img;
                        // temp.score = letter.score;
                        this.foundLetter[j] = true;
                        this.indexOfEaselLetters.push(j);
                        found = true;
                        break;
                    } else if (this.easelLetters[j].charac === word.charAt(i) && this.foundLetter[j] === false) {
                        this.foundLetter[j] = true;
                        this.indexOfEaselLetters.push(j);
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

    add(letter: Letter, index: number): void {
        this.easelLetters[index] = letter;
    }

    resetVariables(): void {
        this.foundLetter.fill(false);

        this.indexOfEaselLetters.splice(0, this.indexOfEaselLetters.length);
    }
    resetTempIndex() {
        this.posTempLetters.fill(false);
        this.indexTempLetters.splice(0, this.indexTempLetters.length);
    }

    toString(): string {
        let easelToString = '';
        for (const letter of this.easelLetters) {
            if (letter === NOT_A_LETTER) easelToString += '- | ';
            else easelToString = easelToString + letter.charac + ' | ';
        }
        return easelToString;
    }
    pointInEasel(): number {
        let points = 0;
        for (const letter of this.easelLetters) {
            points += letter.score;
        }
        return points;
    }
    // moveLeft() {
    //     let save: Letter;
    //     if (this.indexToMove !== 0) {
    //         save = this.easelLetters[this.indexToMove - 1];
    //         this.easelLetters[this.indexToMove - 1] = this.easelLetters[this.indexToMove];
    //         this.easelLetters[this.indexToMove] = save;
    //     }
    // }
    // moveRight() {
    //     let save: Letter;
    //     if (this.indexToMove !== EASEL_LENGTH - 1) {
    //         save = this.easelLetters[this.indexToMove + 1];
    //         this.easelLetters[this.indexToMove + 1] = this.easelLetters[this.indexToMove];
    //         this.easelLetters[this.indexToMove] = save;
    //     }
    // }
}
