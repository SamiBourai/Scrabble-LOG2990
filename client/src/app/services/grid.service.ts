import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import {
    AZUR_BOX,
    BLUE_BOX,
    BOX,
    CTX_PX,
    DEFAULT_HEIGHT,
    DEFAULT_WIDTH,
    HAND_POSITION_END,
    HAND_POSITION_START,
    HEIGHT,
    LEFTSPACE,
    NB_LETTER_HAND,
    PINK_BOX,
    RED_BOX,
    TOPSPACE,
    WIDTH,
} from '@app/constants/constants';
// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    playerImage: ImageData;
    private alpha: string = 'abcdefghijklmno';
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        for (let i = 0; i <= BOX; i++) {
            this.gridContext.moveTo(LEFTSPACE, TOPSPACE + (i * DEFAULT_HEIGHT) / BOX);
            this.gridContext.lineTo(LEFTSPACE + DEFAULT_WIDTH, TOPSPACE + (i * DEFAULT_HEIGHT) / BOX);

            this.gridContext.moveTo(LEFTSPACE + (i * DEFAULT_WIDTH) / BOX, TOPSPACE);
            this.gridContext.lineTo(LEFTSPACE + (i * DEFAULT_WIDTH) / BOX, TOPSPACE + DEFAULT_HEIGHT);
        }

        this.gridContext.stroke();
    }

    drawWord(word: string) {
        const step = 20;
        const startPosition: Vec2 = { x: DEFAULT_WIDTH / 2, y: TOPSPACE - step };
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    drawHand() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        for (let i = 0; i <= NB_LETTER_HAND; i++) {
            this.gridContext.moveTo(LEFTSPACE + ((HAND_POSITION_START + i) * DEFAULT_WIDTH) / BOX, TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2);
            this.gridContext.lineTo(
                LEFTSPACE + ((HAND_POSITION_START + i) * DEFAULT_WIDTH) / BOX,
                TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2 + DEFAULT_WIDTH / BOX,
            );
        }
        this.gridContext.moveTo(LEFTSPACE + (HAND_POSITION_START * DEFAULT_WIDTH) / BOX, TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2);
        this.gridContext.lineTo(LEFTSPACE + (HAND_POSITION_END * DEFAULT_WIDTH) / BOX, TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2);
        this.gridContext.moveTo(
            LEFTSPACE + (HAND_POSITION_START * DEFAULT_WIDTH) / BOX,
            TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2 + DEFAULT_WIDTH / BOX,
        );
        this.gridContext.lineTo(
            LEFTSPACE + (HAND_POSITION_END * DEFAULT_WIDTH) / BOX,
            TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2 + DEFAULT_WIDTH / BOX,
        );
        this.gridContext.stroke();
    }

    drawCoor() {
        this.gridContext.font = '15px system-ui';
        this.gridContext.strokeStyle = 'black';

        for (let i = 1; i <= BOX; i++) {
            this.gridContext.fillText(String(i), LEFTSPACE + (i * DEFAULT_WIDTH) / BOX - DEFAULT_WIDTH / (2 * BOX), TOPSPACE);
            this.gridContext.fillText(this.alpha[i - 1], LEFTSPACE - CTX_PX, TOPSPACE + (i * DEFAULT_WIDTH) / BOX - DEFAULT_WIDTH / (2 * BOX));
        }
    }

    drawBonusBox() {
        // triple letter score
        this.gridContext.fillStyle = 'red';

        for (const v of RED_BOX) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
        }
        // triple letter score
        this.gridContext.fillStyle = 'pink';
        for (const v of PINK_BOX) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
        }
        // triple letter score
        this.gridContext.fillStyle = 'blue';
        for (const v of BLUE_BOX) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
        }

        // triple letter score
        this.gridContext.fillStyle = 'cyan';

        for (const v of AZUR_BOX) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
        }
        this.gridContext.fillStyle = 'black';
    }

    drawPlayer(): void {
        const plyr1 = new Image();
        plyr1.src = '../../../assets/pngwing.com.png';
        plyr1.onload = () => {
            this.gridContext.drawImage(plyr1, WIDTH - LEFTSPACE * 2, HEIGHT - TOPSPACE * 2, 2 * LEFTSPACE, 2 * TOPSPACE);
            this.gridContext.drawImage(plyr1, 0, HEIGHT - TOPSPACE * 2, 2 * LEFTSPACE, 2 * TOPSPACE);
        };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
