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
        this.gridContext.font = 'bold 9px system-ui';

        for (const v of RED_BOX) {
            this.gridContext.fillStyle = 'red';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
            this.gridContext.fillStyle = 'black';
            const str = "TRIPLE WORD SCORE";
            const array = str.split(" ");
            for (let i = 0; i < array.length; i++)
            {
                this.gridContext.fillText(array[i], LEFTSPACE + (v.x * this.width) / BOX + 5, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + i*10 , this.width/BOX);

            }
            // this.gridContext.fillText('TRIPLE', LEFTSPACE + (v.x * this.width) / BOX, TOPSPACE + (v.y * this.height) / BOX + this.height/40 , this.width/BOX);
            // this.gridContext.fillText('WORD', LEFTSPACE + (v.x * this.width) / BOX, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + 10, this.width/BOX);
            // this.gridContext.fillText('SCORE', LEFTSPACE + (v.x * this.width) / BOX, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + 20 , this.width/BOX);

        }
        // triple letter score
        
        for (const v of PINK_BOX) {
            this.gridContext.fillStyle = 'pink';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
            this.gridContext.fillStyle = 'black';
            const str = "DOUBLE WORD SCORE";
            const array = str.split(" ");
            for (let i = 0; i < array.length; i++)
            {
                this.gridContext.fillText(array[i], LEFTSPACE + (v.x * this.width) / BOX + 5, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + i*10 , this.width/BOX);

            }
        }
        // triple letter score
        
        for (const v of BLUE_BOX) {
            this.gridContext.fillStyle = 'blue';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
            this.gridContext.fillStyle = 'black';
            const str = "TRIPLE LETTER SCORE";
            const array = str.split(" ");
            for (let i = 0; i < array.length; i++)
            {
                this.gridContext.fillText(array[i], LEFTSPACE + (v.x * this.width) / BOX + 5, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + i*10 , this.width/BOX);

            }
        }

        // triple letter score
        

        for (const v of AZUR_BOX) {
            this.gridContext.fillStyle = 'cyan';
            this.gridContext.fillRect(
                LEFTSPACE + (v.x * DEFAULT_WIDTH) / BOX,
                TOPSPACE + (v.y * DEFAULT_HEIGHT) / BOX,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
            this.gridContext.fillStyle = 'black';
            const str = "DOUBLE LETTER SCORE";
            const array = str.split(" ");
            for (let i = 0; i < array.length; i++)
            {
                this.gridContext.fillText(array[i], LEFTSPACE + (v.x * this.width) / BOX + 5, TOPSPACE + (v.y * this.height) / BOX + this.height/40 + i*10 , this.width/BOX);

            }
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

    drawPlayerName(s : string) {
        this.gridContext.font = 'bold 30px system-ui';
        this.gridContext.textAlign = "center";
        this.gridContext.fillText(s, LEFTSPACE, (HEIGHT - TOPSPACE * 2) - HAND_POSITION_START, 2 * LEFTSPACE);
        
    }

    drawOpponentName(s : string) {
        this.gridContext.font = 'bold 30px system-ui';
        this.gridContext.textAlign = "center";
        this.gridContext.fillText(s, WIDTH - LEFTSPACE, (HEIGHT - TOPSPACE * 2) - HAND_POSITION_START, 2 * LEFTSPACE);
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
