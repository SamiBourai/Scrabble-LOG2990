import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, LEFTSPACE, TOPSPACE } from '@app/constants/constants';
@Injectable({
    providedIn: 'root',
})
export class LettersService {
    gridContext: CanvasRenderingContext2D;
    usedPosition = new Set<Vec2>();

    placeLetter(lett: Letter, pos: Vec2): void {
        console.log(this.usedPosition);
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
}
