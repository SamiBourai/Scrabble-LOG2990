import { Injectable } from '@angular/core';
import { EaselObject } from '@app/classes/easel-object';
import { BOARD_WIDTH, EASEL_LENGTH, NB_LETTER_HAND, NB_TILES, NOT_A_LETTER } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ShowEaselEndGameService {
    easelOneCtx: CanvasRenderingContext2D;
    easelTwoCtx: CanvasRenderingContext2D;

    drawHand(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;
        for (let i = 0; i <= NB_LETTER_HAND; i++) {
            const pos = i;
            ctx.moveTo(pos * (BOARD_WIDTH / NB_TILES), 0);
            ctx.lineTo(pos * (BOARD_WIDTH / NB_TILES), BOARD_WIDTH / NB_TILES);
        }
        ctx.moveTo(0, 0);
        ctx.lineTo((EASEL_LENGTH + 1) * (BOARD_WIDTH / NB_TILES), 0);
        ctx.moveTo(0, BOARD_WIDTH / NB_TILES);
        ctx.lineTo((EASEL_LENGTH + 1) * (BOARD_WIDTH / NB_TILES), BOARD_WIDTH / NB_TILES);

        ctx.stroke();
    }
    drawEasel(easel: EaselObject, ctx: CanvasRenderingContext2D) {
        let counter = 0;
        for (const lett of easel.easelLetters) {
            const pos = counter;
            if (lett && lett.charac !== NOT_A_LETTER.charac) {
                const img = new Image();
                img.src = lett.img;
                img.onload = () => {
                    ctx.drawImage(img, pos * (BOARD_WIDTH / NB_TILES), 0, BOARD_WIDTH / NB_TILES, BOARD_WIDTH / NB_TILES);
                };
            }
            counter++;
        }
    }
}
