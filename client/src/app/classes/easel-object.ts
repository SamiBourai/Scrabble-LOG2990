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
        return EASEL_LENGTH - this.easelLetters.filter((easelLetters) => easelLetters === NOT_A_LETTER).length ?? 0;
    }

    contains(word: string): boolean {
        let found = false;
        let first = true;
        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;
                for (let j = 0; j < EASEL_LENGTH; j++) {
                    if (word.charAt(i) === this.easelLetters[j].charac && !this.foundLetter[j]) {
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
}
