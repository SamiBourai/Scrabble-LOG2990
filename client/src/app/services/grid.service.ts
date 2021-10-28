import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    ADJUSTEMENT_TOPSPACE,
    AZUR_BOX,
    BLUE_BOX,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CANEVAS_WIDTH,
    CLEAR_RECT_FIX,
    CTX_PX,
    EASEL_LENGTH,
    FOURTY,
    HAND_POSITION_END,
    HAND_POSITION_START,
    H_ARROW,
    INDEX_WORD,
    LEFTSPACE,
    NB_LETTER_HAND,
    NB_TILES,
    NOT_A_LETTER,
    PARAMETERS_OF_SWAP,
    PINK_BOX,
    RED_BOX,
    SIX,
    TOPSPACE,
    UNDEFINED_INDEX,
    V_ARROW,
} from '@app/constants/constants';
import { LettersService } from './letters.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;
    tempContext: CanvasRenderingContext2D;
    focusContext: CanvasRenderingContext2D;
    playerImage: ImageData;
    tempWord: string = '';
    previousTile: Vec2 = { x: -1, y: -1 };
    private direction: string = H_ARROW;
    private alpha: string = 'abcdefghijklmno';
    private canvasSize: Vec2 = { x: BOARD_WIDTH, y: BOARD_HEIGHT };
    constructor(private letterService: LettersService) {}
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
        this.gridContext.shadowColor = 'red';
        this.gridContext.shadowBlur = 5;

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
    placeTempLetter(lett: Letter): void {
        const imgLetter = new Image();

        imgLetter.src = lett.img;
        const x = this.previousTile.x;
        const y = this.previousTile.y;
        imgLetter.onload = () => {
            this.tempContext.drawImage(
                imgLetter,
                LEFTSPACE + ((x - 1) * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + ((y - 1) * BOARD_WIDTH) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
        };
        this.drawRedFocus(this.previousTile, this.tempContext);
        this.incrementDirection();
        if (this.letterService.tiles[this.previousTile.y - 1][this.previousTile.x - 1] === NOT_A_LETTER) this.drawTileFocus(this.previousTile);
        this.tempWord += lett.charac;
    }

    addLetterFromGrid(letter: string) {
        this.tempWord += letter;
        this.drawRedFocus(this.previousTile, this.tempContext);
        this.incrementDirection();
        if (this.letterService.tiles[this.previousTile.y - 1][this.previousTile.x - 1] === NOT_A_LETTER) this.drawTileFocus(this.previousTile);
    }
    removeLastLetter() {
        this.tempContext.clearRect(
            LEFTSPACE + ((this.previousTile.x + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + ((this.previousTile.y + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
            BOARD_WIDTH / NB_TILES + 1,
            BOARD_HEIGHT / NB_TILES + 1,
        );
        this.decrementDirection();
        this.tempContext.clearRect(
            LEFTSPACE + ((this.previousTile.x + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + ((this.previousTile.y + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
            BOARD_WIDTH / NB_TILES + 1,
            BOARD_HEIGHT / NB_TILES + 1,
        );
        this.drawTileFocus(this.previousTile);
        this.tempWord = this.tempWord.slice(0, UNDEFINED_INDEX);
        console.log(this.tempWord);
    }
    decrementDirection() {
        if (this.direction === H_ARROW && this.previousTile.x < NB_TILES) this.previousTile.x--;
        else if (this.direction === V_ARROW && this.previousTile.y < NB_TILES) this.previousTile.y--;
    }
    incrementDirection() {
        if (this.direction === H_ARROW && this.previousTile.x < NB_TILES) this.previousTile.x++;
        else if (this.direction === V_ARROW && this.previousTile.y < NB_TILES) this.previousTile.y++;
    }
    drawTileFocus(pos: Vec2): void {
        this.focusContext.font = 'bold 40px system-ui';
        this.focusContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
        this.drawArrow(pos);
        this.drawRedFocus(pos, this.focusContext);
        this.previousTile = pos;
    }

    clearLayers(): void {
        this.focusContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
        this.tempContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
    }
    resetArrow() {
        this.direction = H_ARROW;
    }
    switchArrow() {
        if (this.direction === H_ARROW) {
            this.direction = V_ARROW;
        } else {
            this.direction = H_ARROW;
        }
    }
    getCommandDirection(): string {
        if (this.direction === H_ARROW) {
            return 'h';
        } else {
            return 'v';
        }
    }
    private drawArrow(pos: Vec2) {
        if (this.direction === H_ARROW) {
            this.focusContext.fillText(
                this.direction,
                LEFTSPACE + ((pos.x + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + ((pos.y + UNDEFINED_INDEX) * BOARD_HEIGHT) / NB_TILES + BOARD_WIDTH / NB_TILES / 2,
                BOARD_WIDTH / NB_TILES,
            );
        } else {
            this.focusContext.fillText(
                this.direction,
                LEFTSPACE + ((pos.x + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES + BOARD_WIDTH / NB_TILES / 2,
                TOPSPACE + (pos.y * BOARD_HEIGHT) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
            );
        }
    }
    private drawRedFocus(pos: Vec2, ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.lineWidth = SIX;
        ctx.strokeStyle = 'red';
        ctx.rect(
            LEFTSPACE + ((pos.x + UNDEFINED_INDEX) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + ((pos.y + UNDEFINED_INDEX) * BOARD_HEIGHT) / NB_TILES,
            BOARD_WIDTH / NB_TILES,
            BOARD_WIDTH / NB_TILES,
        );
        ctx.stroke();
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
