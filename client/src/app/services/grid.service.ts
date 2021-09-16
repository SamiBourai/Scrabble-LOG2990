import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { BOX, HEIGHT, LEFTSPACE, TOPSPACE, WIDTH } from '@app/components/play-area/play-area.component';
// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 600;
export const DEFAULT_HEIGHT = 600;
const NB_LETTER_HAND = 7;
const HAND_POSITION_START = 4;
const HAND_POSITION_END = 11;
const CTX_PX = 15;
@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    playerImage: ImageData;

    redBox: Vec2[] = [
        { x: 0, y: 0 },
        { x: 7, y: 0 },
        { x: 14, y: 0 },
        { x: 0, y: 7 },
        { x: 14, y: 7 },
        { x: 0, y: 14 },
        { x: 7, y: 14 },
        { x: 14, y: 14 },
    ];
    azurBox: Vec2[] = [
        { x: 3, y: 0 },
        { x: 11, y: 0 },
        { x: 6, y: 2 },
        { x: 8, y: 2 },
        { x: 0, y: 3 },
        { x: 7, y: 3 },
        { x: 14, y: 3 },
        { x: 2, y: 6 },
        { x: 6, y: 6 },
        { x: 8, y: 6 },
        { x: 12, y: 6 },
        { x: 3, y: 7 },
        { x: 11, y: 7 },
        { x: 2, y: 8 },
        { x: 6, y: 8 },
        { x: 8, y: 8 },
        { x: 12, y: 8 },
        { x: 0, y: 11 },
        { x: 7, y: 11 },
        { x: 14, y: 11 },
        { x: 6, y: 12 },
        { x: 8, y: 12 },
        { x: 3, y: 14 },
        { x: 11, y: 14 },
    ];
    blueBox: Vec2[] = [
        { x: 5, y: 1 },
        { x: 9, y: 1 },
        { x: 1, y: 5 },
        { x: 5, y: 5 },
        { x: 9, y: 5 },
        { x: 13, y: 5 },
        { x: 1, y: 9 },
        { x: 5, y: 9 },
        { x: 9, y: 9 },
        { x: 13, y: 9 },
        { x: 5, y: 13 },
        { x: 9, y: 13 },
    ];
    pinkBox: Vec2[] = [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
        { x: 4, y: 4 },
        { x: 13, y: 1 },
        { x: 12, y: 2 },
        { x: 11, y: 3 },
        { x: 10, y: 4 },
        { x: 1, y: 13 },
        { x: 2, y: 12 },
        { x: 3, y: 11 },
        { x: 4, y: 10 },
        { x: 13, y: 13 },
        { x: 12, y: 12 },
        { x: 11, y: 11 },
        { x: 10, y: 10 },
        { x: 7, y: 7 },
    ];

    private alpha: string = 'abcdefghijklmno';
    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 3;
        for (let i = 0; i <= BOX; i++) {
            this.gridContext.moveTo(LEFTSPACE, TOPSPACE + (i * this.height) / BOX);
            this.gridContext.lineTo(LEFTSPACE + this.width, TOPSPACE + (i * this.height) / BOX);

            this.gridContext.moveTo(LEFTSPACE + (i * this.width) / BOX, TOPSPACE);
            this.gridContext.lineTo(LEFTSPACE + (i * this.width) / BOX, TOPSPACE + this.height);
        }

        this.gridContext.stroke();
    }

    drawWord(word: string) {
        const step = 20;
        const startPosition: Vec2 = { x: this.width / 2, y: TOPSPACE - step };
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
            this.gridContext.moveTo(LEFTSPACE + ((HAND_POSITION_START + i) * this.width) / BOX, TOPSPACE + this.height + TOPSPACE / 2);
            this.gridContext.lineTo(
                LEFTSPACE + ((HAND_POSITION_START + i) * this.width) / BOX,
                TOPSPACE + this.height + TOPSPACE / 2 + this.width / BOX,
            );
        }
        this.gridContext.moveTo(LEFTSPACE + (HAND_POSITION_START * this.width) / BOX, TOPSPACE + this.height + TOPSPACE / 2);
        this.gridContext.lineTo(LEFTSPACE + (HAND_POSITION_END * this.width) / BOX, TOPSPACE + this.height + TOPSPACE / 2);
        this.gridContext.moveTo(LEFTSPACE + (HAND_POSITION_START * this.width) / BOX, TOPSPACE + this.height + TOPSPACE / 2 + this.width / BOX);
        this.gridContext.lineTo(LEFTSPACE + (HAND_POSITION_END * this.width) / BOX, TOPSPACE + this.height + TOPSPACE / 2 + this.width / BOX);
        this.gridContext.stroke();
    }

    drawCoor() {
        this.gridContext.font = '15px system-ui';
        this.gridContext.strokeStyle = 'black';

        for (let i = 1; i <= BOX; i++) {
            this.gridContext.fillText(String(i), LEFTSPACE + (i * this.width) / BOX - this.width / (2 * BOX), TOPSPACE);
            this.gridContext.fillText(this.alpha[i - 1], LEFTSPACE - CTX_PX, TOPSPACE + (i * this.width) / BOX - this.width / (2 * BOX));
        }
    }

    drawBonusBox() {
        // triple letter score
        this.gridContext.fillStyle = 'red';

        for (const v of this.redBox) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * this.width) / BOX,
                TOPSPACE + (v.y * this.height) / BOX,
                this.width / BOX,
                this.height / BOX,
            );
        }
        // triple letter score
        this.gridContext.fillStyle = 'pink';
        for (const v of this.pinkBox) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * this.width) / BOX,
                TOPSPACE + (v.y * this.height) / BOX,
                this.width / BOX,
                this.height / BOX,
            );
        }
        // triple letter score
        this.gridContext.fillStyle = 'blue';
        for (const v of this.blueBox) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * this.width) / BOX,
                TOPSPACE + (v.y * this.height) / BOX,
                this.width / BOX,
                this.height / BOX,
            );
        }

        // triple letter score
        this.gridContext.fillStyle = 'cyan';

        for (const v of this.azurBox) {
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * this.width) / BOX,
                TOPSPACE + (v.y * this.height) / BOX,
                this.width / BOX,
                this.height / BOX,
            );
        }
        this.gridContext.fillStyle = 'black';
    }

    drawPlayer(): void {
        const plyr1 = new Image();
        const plyr2 = new Image();
        plyr1.src = '/assets/pngwing.png';
        plyr2.src = '/assets/pngwing2.png';
        plyr1.onload = () => {
            this.gridContext.drawImage(plyr1, WIDTH - LEFTSPACE * 2, HEIGHT - TOPSPACE * 2.5, 2 * LEFTSPACE, 2 * TOPSPACE);
        };
        plyr2.onload = () => {
            this.gridContext.drawImage(plyr2, 0, HEIGHT - TOPSPACE * 2.8, 2 * LEFTSPACE, 2.5 * TOPSPACE);
        };
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
