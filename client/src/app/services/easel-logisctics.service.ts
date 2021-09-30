import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import {
    A,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CLEAR_RECT_FIX,
    EASEL_LENGTH,
    HAND_POSITION_START,
    LEFTSPACE,
    NB_TILES,
    NOT_A_LETTER,
    TOPSPACE,
} from '@app/constants/constants';
import { ReserveService } from './reserve.service';
@Injectable({
    providedIn: 'root',
})
export class EaselLogiscticsService {
    gridContext: CanvasRenderingContext2D;
    foundLetter: boolean[] = [false, false, false, false, false, false, false];
    index: number[] = [];
    easelLetters: Easel[] = [];
    size: number = 0;
    temp: Easel = { index: 0, letters: A };
    occupiedPos: boolean[] = [false, false, false, false, false, false, false];
    first: boolean = true;
    easelSize: number = EASEL_LENGTH;

    constructor(private reserveService: ReserveService) {}

    placeEaselLetters(): void {
        for (const lett of this.easelLetters) {
            const img = new Image();
            img.src = lett.letters.img;

            img.onload = () => {
                this.occupiedPos[lett.index] = true;

                this.gridContext.drawImage(
                    img,
                    LEFTSPACE + ((HAND_POSITION_START + lett.index) * BOARD_WIDTH) / NB_TILES,
                    TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2,
                    BOARD_WIDTH / NB_TILES,
                    BOARD_HEIGHT / NB_TILES,
                );
            };
        }
    }

    getLetterFromEasel(index: number): Letter {
        if (this.occupiedPos[index] === true) {
            this.gridContext.clearRect(
                LEFTSPACE + ((HAND_POSITION_START + index) * BOARD_WIDTH) / NB_TILES + 2,
                TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + 2,
                BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
            );
            this.occupiedPos[index] = false;
            return this.easelLetters[index].letters;
        }
        return NOT_A_LETTER;
    }

    wordInEasel(word: string): boolean {
        let found = false;
        let first = true;
        for (let i = 0; i < word.length; i++) {
            // console.log(word.charAt(i));
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < EASEL_LENGTH; j++) {
                    // console.log(this.easelLetters[j]);
                    if (word.charAt(i) === this.easelLetters[j].letters.charac && this.foundLetter[j] === false) {
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

    refillEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            if (this.occupiedPos[i] === false) {
                if (this.reserveService.reserveSize > 0) {
                    const temp: Letter = this.reserveService.getRandomLetter();
                    this.easelLetters[i] = {
                        index: i,
                        letters: temp,
                    };
                } else {
                    window.alert('*LA RESERVE DE LETTRE EST MAINTENANT VIDE*');
                    this.easelSize = i;
                    return;
                }
            }
        }
        this.placeEaselLetters();
    }

    isEmpty(): boolean {
        //check if this is the right condition
        for (let pos of this.occupiedPos) {
            if (pos === true) {
                return false;
            }
        }
        return true;
    }
}
