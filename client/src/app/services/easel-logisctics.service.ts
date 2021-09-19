import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
//import { Vec2 } from '@app/classes/vec2';
import { A, BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, HAND_POSITION_START, LEFTSPACE, TOPSPACE } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EaselLogiscticsService {
    gridContext: CanvasRenderingContext2D;
    easelLetters = new Set<Easel>();
    temp: Easel = { index: 0, letters: A };
    pos = new Array<number>();
    occupiedPos: Array<Boolean> = [false, false, false, false, false, false, false];
    first: boolean = true;

    positions(): void {
        //let easel : Easel = {occupied : false ,letters : lett , pos: pos} ;
        for (let i = 0; i <= 6; i++) {
            let position = LEFTSPACE + ((HAND_POSITION_START + i) * DEFAULT_WIDTH) / BOX;
            this.pos.push(position);
        }
    }

    placeEaselLetters(lett: Letter): void {
        const img = new Image();
        img.src = lett.img;
        if (this.first) {
            this.positions();
            this.first = false;
        }

        this.temp.index = this.pos.length - 1;
        this.temp.letters = lett;

        this.easelLetters.add(this.temp);
        img.onload = () => {
            this.occupiedPos[this.pos.length - 1] = true;
            this.gridContext.drawImage(
                img,
                this.pos.pop() as number,
                TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
        };
    }

    deleteletterFromEasel(easel: Easel): void {
        this.easelLetters.delete(easel);
        this.occupiedPos[easel.index] = false;
    }

    getLetterFromEasel(index: number): Letter {
        console.log(this.easelLetters);
        for (let lett of this.easelLetters) {
            if (lett.index == index) {
                this.easelLetters.delete(lett);
                this.gridContext.clearRect(
                    LEFTSPACE + ((HAND_POSITION_START + lett.index) * DEFAULT_WIDTH) / BOX,
                    TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
                    DEFAULT_WIDTH / BOX,
                    DEFAULT_HEIGHT / BOX,
                );
                this.occupiedPos[lett.index] = false;
                return lett.letters;
            }
        }
        return A;
    }

    isFull(): boolean {
        for (let i = 0; i <= 6; i++) {
            if (!this.occupiedPos[i]) return false;
        }
        return true;
    }
}
