import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    ADJUSTEMENT_TOPSPACE,
    ALL_BONUS_BOX,
    AZUR_BOX,
    BLUE_BOX,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CLEAR_RECT_FIX,
    CTX_PX,
    EASEL_LENGTH,
    FOURTY,
    HAND_POSITION_END,
    HAND_POSITION_START,
    INDEX_WORD,
    LEFTSPACE,
    NB_LETTER_HAND,
    NB_TILES,
    PARAMETERS_OF_SWAP,
    PINK_BOX,
    RED_BOX,
    TOPSPACE,
} from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    allBonusQuantity: number = ALL_BONUS_BOX.length;
    private alpha: string = 'abcdefghijklmno';
    private canvasSize: Vec2 = { x: BOARD_WIDTH, y: BOARD_HEIGHT };

    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        for (let i = 0; i <= NB_TILES; i++) {
            this.gridContext.moveTo(LEFTSPACE, TOPSPACE + (i * BOARD_HEIGHT) / NB_TILES);
            this.gridContext.lineTo(LEFTSPACE + BOARD_WIDTH, TOPSPACE + (i * BOARD_HEIGHT) / NB_TILES);

            this.gridContext.moveTo(LEFTSPACE + (i * BOARD_WIDTH) / NB_TILES, TOPSPACE);
            this.gridContext.lineTo(LEFTSPACE + (i * BOARD_WIDTH) / NB_TILES, TOPSPACE + BOARD_HEIGHT);
        }

        this.gridContext.stroke();
    }
    drawHand() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        for (let i = 0; i <= NB_LETTER_HAND; i++) {
            this.gridContext.moveTo(LEFTSPACE + ((HAND_POSITION_START + i) * BOARD_WIDTH) / NB_TILES, TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2);
            this.gridContext.lineTo(
                LEFTSPACE + ((HAND_POSITION_START + i) * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + BOARD_WIDTH / NB_TILES,
            );
        }
        this.gridContext.moveTo(LEFTSPACE + (HAND_POSITION_START * BOARD_WIDTH) / NB_TILES, TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2);
        this.gridContext.lineTo(LEFTSPACE + (HAND_POSITION_END * BOARD_WIDTH) / NB_TILES, TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2);
        this.gridContext.moveTo(
            LEFTSPACE + (HAND_POSITION_START * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + BOARD_WIDTH / NB_TILES,
        );
        this.gridContext.lineTo(
            LEFTSPACE + (HAND_POSITION_END * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2 + BOARD_WIDTH / NB_TILES,
        );

        this.gridContext.stroke();
    }

    drawCoor() {
        this.gridContext.font = 'bold 15px system-ui';
        this.gridContext.strokeStyle = 'black';

        for (let i = 1; i <= NB_TILES; i++) {
            this.gridContext.fillText(
                String(i),
                LEFTSPACE + (i * BOARD_WIDTH) / NB_TILES - BOARD_WIDTH / (2 * NB_TILES),
                TOPSPACE - ADJUSTEMENT_TOPSPACE,
            );
            this.gridContext.fillText(this.alpha[i - 1], LEFTSPACE - CTX_PX, TOPSPACE + (i * BOARD_WIDTH) / NB_TILES - BOARD_WIDTH / (2 * NB_TILES));
        }
    }

    drawBonusBox() {
        // triple letter score
        this.gridContext.font = 'bold 15px system-ui';
        for (const v of RED_BOX) {
            this.gridContext.fillStyle = 'red';
            this.drawBonus(v, 'MOT  X3');
        }
        // triple letter score
        for (const v of PINK_BOX) {
            this.gridContext.fillStyle = 'pink';
            this.drawBonus(v, 'MOT  X2');
        }
        // triple letter score
        for (const v of BLUE_BOX) {
            this.gridContext.fillStyle = 'blue';
            this.drawBonus(v, 'L.  X3');
        }
        // triple letter score
        for (const v of AZUR_BOX) {
            this.gridContext.fillStyle = 'cyan';
            this.drawBonus(v, 'L.  X2');
        }
        this.gridContext.fillStyle = 'black';
    }

    drawCentralTile() {
        const img = new Image();
        img.src = '../../../assets/black-star.png';

        img.onload = () => {
            this.gridContext.drawImage(
                img,
                LEFTSPACE + (EASEL_LENGTH * BOARD_WIDTH) / NB_TILES + 2,
                TOPSPACE + (EASEL_LENGTH * BOARD_WIDTH) / NB_TILES + 2,
                BOARD_WIDTH / NB_TILES - CLEAR_RECT_FIX,
                BOARD_HEIGHT / NB_TILES - CLEAR_RECT_FIX,
            );
        };
        return img;
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    randomizeBonuses(): void {
        for (let i = 0; i < RED_BOX.length; i++) {
            const randomBonusIndex = Math.floor(Math.random() * this.allBonusQuantity + 0);
            RED_BOX[i] = ALL_BONUS_BOX[randomBonusIndex];
            ALL_BONUS_BOX.splice(randomBonusIndex, 1);
            this.allBonusQuantity--;
        }
        for (let i = 0; i < AZUR_BOX.length; i++) {
            const randomBonusIndex = Math.floor(Math.random() * this.allBonusQuantity + 0);
            AZUR_BOX[i] = ALL_BONUS_BOX[randomBonusIndex];
            ALL_BONUS_BOX.splice(randomBonusIndex, 1);
            this.allBonusQuantity--;
        }
        for (let i = 0; i < BLUE_BOX.length; i++) {
            const randomBonusIndex = Math.floor(Math.random() * this.allBonusQuantity + 0);
            BLUE_BOX[i] = ALL_BONUS_BOX[randomBonusIndex];
            ALL_BONUS_BOX.splice(randomBonusIndex, 1);
            this.allBonusQuantity--;
        }
        for (let i = 0; i < PINK_BOX.length; i++) {
            const randomBonusIndex = Math.floor(Math.random() * this.allBonusQuantity + 0);
            PINK_BOX[i] = ALL_BONUS_BOX[randomBonusIndex];
            ALL_BONUS_BOX.splice(randomBonusIndex, 1);
            this.allBonusQuantity--;
        }
    }

    private drawBonus(v: Vec2, str: string) {
        this.gridContext.fillRect(
            LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES,
            BOARD_WIDTH / NB_TILES,
            BOARD_HEIGHT / NB_TILES,
        );
        this.gridContext.fillStyle = 'black';
        const array = str.split(' ');
        for (let i = 0; i < array.length; i++) {
            this.gridContext.fillText(
                array[i],
                LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / INDEX_WORD,
                TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES + this.height / FOURTY + i * PARAMETERS_OF_SWAP,
                BOARD_WIDTH / NB_TILES,
            );
        }
    }
}
