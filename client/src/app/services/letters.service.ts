import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/constants';
@Injectable({
    providedIn: 'root',
})
export class LettersService {
    gridContext: CanvasRenderingContext2D;

    placeLetter(lett: Letter, pos: Vec2): void {
        const img = new Image();
        img.src = '../../../assets/letter-A.png';
        img.onload = () => {
            this.gridContext.drawImage(img, pos.x, pos.y, DEFAULT_WIDTH / BOX, DEFAULT_HEIGHT / BOX);
        };
    }
}
