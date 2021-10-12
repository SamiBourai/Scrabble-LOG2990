import { Injectable } from '@angular/core';
import { EaselObject } from '@app/classes/EaselObject';
import { Letter } from '@app/classes/letter';
import {
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

    constructor(private reserveService: ReserveService) {}

    placeEaselLetters(easel: EaselObject): void {
        for (const lett of easel.easelLetters) {
            const img = new Image();
            img.src = lett.letters.img;
            if (easel.occupiedPos[lett.index] === false) {
                img.onload = () => {
                    easel.occupiedPos[lett.index] = true;
                    easel.easelSize++;
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
    }

    getLetterFromEasel(easel: EaselObject, index: number): Letter {
        if (easel.occupiedPos[index] === true) {
            easel.easelSize--;
            this.gridContext.clearRect(
                LEFTSPACE + ((HAND_POSITION_START + index) * BOARD_WIDTH) / NB_TILES + 2,
                TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + 2,
                BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
            );
            easel.occupiedPos[index] = false;
            return easel.easelLetters[index].letters;
        }
        return NOT_A_LETTER;
    }

    refillEasel(easel: EaselObject): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            if (easel.occupiedPos[i] === false) {
                if (this.reserveService.reserveSize > 0) {
                    const temp: Letter = this.reserveService.getRandomLetter();
                    easel.add(temp, i);
                } else {
                    window.alert('*LA RESERVE EST MAINTENANT VIDE*');
                    this.placeEaselLetters(easel);
                    return;
                }
            }
        }
        this.placeEaselLetters(easel);
    }
}
