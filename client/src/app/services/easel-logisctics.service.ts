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
    firstMessage: boolean = true;
    constructor(private reserveService: ReserveService) {}

    placeEaselLetters(easel: EaselObject): void {
        let counter = 0;
        for (const lett of easel.easelLetters) {
            const img = new Image();
            const pos = counter;
            img.src = lett.img;
            if (lett !== NOT_A_LETTER) {
                img.onload = () => {
                    this.gridContext.drawImage(
                        img,
                        LEFTSPACE + ((HAND_POSITION_START + pos) * BOARD_WIDTH) / NB_TILES,
                        TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2,
                        BOARD_WIDTH / NB_TILES,
                        BOARD_HEIGHT / NB_TILES,
                    );
                };
            }
            counter++;
        }
    }

    getLetterFromEasel(easel: EaselObject, index: number): Letter {
        const temp: Letter = easel.easelLetters[index];
        if (easel.easelLetters[index] !== NOT_A_LETTER) {
            easel.easelLetters[index] = NOT_A_LETTER;
            return temp;
        }
        return NOT_A_LETTER;
    }

    refillEasel(easel: EaselObject, user: boolean): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            if (easel.easelLetters[i] === NOT_A_LETTER) {
                if (this.reserveService.reserveSize > 0) {
                    const temp: Letter = this.reserveService.getRandomLetter();
                    easel.add(temp, i);
                } else {
                    if (user) {
                        this.gridContext.clearRect(
                            LEFTSPACE + ((HAND_POSITION_START + i) * BOARD_WIDTH) / NB_TILES + 2,
                            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + 2,
                            BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                            BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
                        );
                    }
                    easel.easelSize--;
                    easel.add(NOT_A_LETTER, i);
                }
            }
        }
        if (this.reserveService.isReserveEmpty() && this.firstMessage) {
            window.alert('*LA RESERVE EST MAINTENANT VIDE*');
            this.firstMessage = false;
        }
        if (user) {
            this.placeEaselLetters(easel);
        }
    }
}
