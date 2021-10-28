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
    tempGetLetter(letter: string, easel: EaselObject): Letter {
        let counter = 0;
        for (const lett of easel.easelLetters) {
            const pos = counter;
            if (lett.charac === letter && !easel.posTempLetters[pos]) {
                this.gridContext.clearRect(
                    LEFTSPACE + ((HAND_POSITION_START + pos) * BOARD_WIDTH) / NB_TILES + 2,
                    TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + 2,
                    BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                    BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
                );
                easel.posTempLetters[pos] = true;
                easel.indexTempLetters.push(pos);
                return lett;
            }
            counter++;
        }
        return NOT_A_LETTER;
    }
    replaceTempInEasel(easel: EaselObject) {
        const img = new Image();
        if (easel.indexTempLetters.length !== 0) {
            const pos = easel.indexTempLetters.pop() || 0;
            img.src = easel.easelLetters[pos].img;
            easel.posTempLetters[pos] = false;
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
    }
}
