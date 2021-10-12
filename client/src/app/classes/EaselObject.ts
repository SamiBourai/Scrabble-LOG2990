/* eslint-disable prettier/prettier */
import { EASEL_LENGTH } from '@app/constants/constants';
import { Easel } from './easel';
import { Letter } from './letter';

export class EaselObject {
    occupiedPos = new Array<boolean>(EASEL_LENGTH);
    easelSize: number = 0;
    easelLetters: Easel[] = [];
    foundLetter = new Array<boolean>(EASEL_LENGTH);
    indexOfEaselLetters: number[] = [];

    constructor(initEasel: boolean) {
        this.occupiedPos.fill(initEasel);
        this.foundLetter.fill(initEasel);
    }

    contains(word: string): boolean {
        let found = false;
        let first = true;
        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;
                for (let j = 0; j < EASEL_LENGTH; j++) {
                    if (word.charAt(i) === this.easelLetters[j].letters.charac && this.foundLetter[j] === false) {
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
        this.easelLetters[index] = {
            index,
            letters: letter,
        };
    }

    resetVariables(): void {
        this.foundLetter.fill(false);
        this.indexOfEaselLetters.splice(0, this.indexOfEaselLetters.length);
    }
}
