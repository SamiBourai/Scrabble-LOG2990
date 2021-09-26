import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { A, BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, HAND_POSITION_START, LEFTSPACE, TOPSPACE } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EaselLogiscticsService {
    gridContext: CanvasRenderingContext2D;
    foundLetter: Boolean[] = [false, false, false, false, false, false, false];
    index: number[] = [];

    easelLetters: Easel[] = [
        { index: 0, letters: A },
        { index: 0, letters: A },
        { index: 0, letters: A },
        { index: 0, letters: A },
        { index: 0, letters: A },
        { index: 0, letters: A },
        { index: 0, letters: A },
    ];
    size: number = 0;
    temp: Easel = { index: 0, letters: A };
    occupiedPos: Boolean[] = [false, false, false, false, false, false, false];
    first: boolean = true;

    placeEaselLetters(): void {
        for (const lett of this.easelLetters) {
            const img = new Image();
            img.src = lett.letters.img;

            img.onload = () => {
                this.occupiedPos[lett.index] = true;

                this.gridContext.drawImage(
                    img,
                    LEFTSPACE + ((HAND_POSITION_START + lett.index) * DEFAULT_WIDTH) / BOX,
                    TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
                    DEFAULT_WIDTH / BOX,
                    DEFAULT_HEIGHT / BOX,
                );
            };
        }
    }

    deleteletterFromEasel(easel: Easel): void {
        delete this.easelLetters[easel.index];
        this.occupiedPos[easel.index] = false;
    }

    getLetterFromEasel(index: number): Letter {
        if (this.occupiedPos[index] == true) {
            this.gridContext.clearRect(
                LEFTSPACE + ((HAND_POSITION_START + index) * DEFAULT_WIDTH) / BOX + 2,
                TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2 + 2,
                DEFAULT_WIDTH / BOX - 5,
                DEFAULT_HEIGHT / BOX - 5,
            );
            this.occupiedPos[index] = false;
            return this.easelLetters[index].letters;
        }
        return A;
    }

    isFull(): boolean {
        for (let i = 0; i <= 6; i++) {
            if (!this.occupiedPos[i]) return false;
        }
        return true;
    }

    wordInEasel(word: string): boolean {
        let found = false;
        let first = true;
        for (let i = 0; i < word.length; i++) {
            console.log(word.charAt(i));
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < 7; j++) {
                    console.log(this.easelLetters[j]);
                    if (word.charAt(i) == this.easelLetters[j].letters.charac && this.foundLetter[j] == false) {
                        this.foundLetter[j] = true;
                        this.index.push(j);
                        found = true;
                        break;
                    }
                }
            } else {
                window.alert('votre mot ne contient pas les lettres dans le chavlet');
                break;
            }
        }
        return found;
    }
}
