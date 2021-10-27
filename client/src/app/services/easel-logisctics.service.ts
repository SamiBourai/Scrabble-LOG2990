import { Injectable } from '@angular/core';
import { EaselObject } from '@app/classes/EaselObject';
import { Letter } from '@app/classes/letter';
import { Pair } from '@app/classes/pair';
import { Vec2 } from '@app/classes/vec2';
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

    showCoords(event: MouseEvent): Vec2 {
        const cX = event.offsetX;
        const cY = event.offsetY;
        const coords1 = { x: cX, y: cY };
        return coords1;
    }

    rightClick(e: MouseEvent) {
        switch (e.button) {
            case 1:
                alert('Left Mouse button pressed.');
                break;
            case 2:
                alert('ntm1');
                break;
        }
    }

    isBetween(pair: Pair, number: number) {
        if (number >= pair.min && number <= pair.max) return true;
        return false;
    }

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
            } else {
                this.gridContext.clearRect(
                    LEFTSPACE + ((HAND_POSITION_START + pos) * BOARD_WIDTH) / NB_TILES + 2,
                    TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + 2,
                    BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                    BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
                );
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
        for (const nb of easel.indexOfEaselLetters) {
            if (!this.reserveService.isReserveEmpty()) easel.add(this.reserveService.getRandomLetter(), nb);
            else {
                easel.add(NOT_A_LETTER, nb);
                easel.easelSize--;
            }
        }

        if (user) this.placeEaselLetters(easel);
    }
    fillEasel(easel: EaselObject, user: boolean): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            if (!this.reserveService.isReserveEmpty()) easel.add(this.reserveService.getRandomLetter(), i);
        }
        if (user) this.placeEaselLetters(easel);
    }
}
