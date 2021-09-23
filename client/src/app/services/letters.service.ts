import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, LEFTSPACE, TOPSPACE } from '@app/constants/constants';
@Injectable({
    providedIn: 'root',
})
export class LettersService {
    gridContext: CanvasRenderingContext2D;

    placeLetter(lett: Letter, pos: Vec2): void {
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

    placeWord(placecommand: ChatCommand): void {

    }
}
