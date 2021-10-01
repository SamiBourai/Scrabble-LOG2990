import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    ADJUSTEMENT_TOPSPACE,
    AZUR_BOX,
    BLUE_BOX,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CTX_PX,
    HAND_POSITION_END,
    HAND_POSITION_START,
    LEFTSPACE,
    NB_LETTER_HAND,
    NB_TILES,
    PINK_BOX,
    RED_BOX,
    TOPSPACE,
} from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    playerImage: ImageData;
    private alpha: string = 'abcdefghijklmno';
    private canvasSize: Vec2 = { x: BOARD_WIDTH, y: BOARD_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
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
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
            this.gridContext.fillStyle = 'black';
            const str = 'MOT  X3';
            const array = str.split(' ');
            for (let i = 0; i < array.length; i++) {
                this.gridContext.fillText(
                    array[i],
                    LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / 4,
                    TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES + BOARD_HEIGHT / 40 + i * 10,
                    BOARD_WIDTH / NB_TILES,
                );
            }
        }

        // triple letter score
        for (const v of PINK_BOX) {
            this.gridContext.fillStyle = 'pink';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
            this.gridContext.fillStyle = 'black';
            const str = 'MOT  X2';
            const array = str.split(' ');
            for (let i = 0; i < array.length; i++) {
                this.gridContext.fillText(
                    array[i],
                    LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / 4,
                    TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES + BOARD_HEIGHT / 40 + i * 10,
                    BOARD_WIDTH / NB_TILES,
                );
            }
        }

        // triple letter score
        for (const v of BLUE_BOX) {
            this.gridContext.fillStyle = 'blue';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
            this.gridContext.fillStyle = 'white';
            const str = 'L.  X3';
            const array = str.split(' ');
            for (let i = 0; i < array.length; i++) {
                this.gridContext.fillText(
                    array[i],
                    LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / 4,
                    TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES + this.height / 40 + i * 10,
                    BOARD_WIDTH / NB_TILES,
                );
            }
        }

        // triple letter score
        for (const v of AZUR_BOX) {
            this.gridContext.fillStyle = 'cyan';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
            this.gridContext.fillStyle = 'black';
            const str = 'L.  X2';
            const array = str.split(' ');
            for (let i = 0; i < array.length; i++) {
                this.gridContext.fillText(
                    array[i],
                    LEFTSPACE + (v.x * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / 4,
                    TOPSPACE + (v.y * BOARD_HEIGHT) / NB_TILES + this.height / 40 + i * 10,
                    BOARD_WIDTH / NB_TILES,
                );
            }
        }
        this.gridContext.fillStyle = 'black';
    }
    drawCentralTile() {
        const img = new Image();
        img.src = '../../../assets/black-star.png';

        img.onload = () => {
            this.gridContext.drawImage(
                img,
                LEFTSPACE + (7 * BOARD_WIDTH) / NB_TILES + 2,
                TOPSPACE + (7 * BOARD_WIDTH) / NB_TILES + 2,
                BOARD_WIDTH / NB_TILES - 5,
                BOARD_HEIGHT / NB_TILES - 5,
            );
        };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
