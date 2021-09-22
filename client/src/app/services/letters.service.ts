import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, LEFTSPACE, TOPSPACE } from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';
@Injectable({
    providedIn: 'root',
})
export class LettersService {
    gridContext: CanvasRenderingContext2D;
    usedPosition = new Set<Vec2>();
    foundLetter: Array<Boolean> = [false, false, false, false, false, false, false];
    index: Array<number> = [];

    constructor(private easelLogisticsService: EaselLogiscticsService, private reserveService: ReserveService) {}

    placeLetter(lett: Letter, pos: Vec2): void {
        if (this.boxIsEmpty(pos)) {
            this.usedPosition.add(pos);
            const imgLetter = new Image();
            imgLetter.src = lett.img;
            imgLetter.onload = () => {
                this.gridContext.drawImage(
                    imgLetter,
                    LEFTSPACE + ((pos.x - 1) * DEFAULT_WIDTH) / BOX,
                    TOPSPACE + ((pos.y - 1) * DEFAULT_WIDTH) / BOX,
                    DEFAULT_WIDTH / BOX,
                    DEFAULT_HEIGHT / BOX,
                );
            };
        }
    }

    boxIsEmpty(pos: Vec2): boolean {
        for (let position of this.usedPosition) {
            if (pos.x == position.x && pos.y == position.y) {
                return false;
            }
        }
        return true;
    }

    wordInEasel(word: string): boolean {
        let found: boolean = false;
        let first: boolean = true;
        for (var i = 0; i < word.length; i++) {
            console.log(word.charAt(i));
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < 7; j++) {
                    console.log(this.easelLogisticsService.easelLetters[j]);
                    if (word.charAt(i) == this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j] == false) {
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
        console.log(this.foundLetter);

        return found;
    }
    changeLetterFromReserve(letterToChange: string): void {
        if (this.wordInEasel(letterToChange)) {
            for (let i = 0; i < letterToChange.length; i++) {
                let temp: Letter = {
                    score: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.score,
                    charac: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.charac,
                    img: this.easelLogisticsService.easelLetters[this.index[i]]?.letters?.img,
                };

                this.easelLogisticsService.easelLetters[this.index[i]] = {
                    index: this.index[i],
                    letters: this.reserveService.getRandomLetter(),
                };

                this.reserveService.reFillReserve(temp);
            }
            this.easelLogisticsService.placeEaselLetters();
        }
        this.resetVariables();
        this.refillEasel();
    }
    resetVariables(): void {
        for (let i = 0; i < this.foundLetter.length; i++) this.foundLetter[i] = false;
        this.index.splice(0, this.index.length);
    }
    placeLettersInScrable(command: ChatCommand): void {
        for (let i = 0; i < command.word.length; i++) {
            this.placeLetter(this.easelLogisticsService.getLetterFromEasel(this.index[i]), {
                x: command.column,
                y: command.line + i,
            });
        }
        this.resetVariables();
        this.refillEasel();
    }

    refillEasel(): void {
        for (let i = 0; i < 7; i++) {
            if (this.easelLogisticsService.occupiedPos[i] == false) {
                let temp: Letter = this.reserveService.getRandomLetter();
                this.easelLogisticsService.easelLetters[i] = {
                    index: i,
                    letters: temp,
                };
            }
        }
        this.easelLogisticsService.placeEaselLetters();
    }
}
