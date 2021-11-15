import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import {
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CANEVAS_WIDTH,
    HAND_POSITION_START,
    H_ARROW,
    LEFTSPACE,
    NB_TILES,
    SIX,
    TOPSPACE,
    UNDEFINED_INDEX,
    V_ARROW,
} from '@app/constants/constants';
import { LettersService } from './letters.service';

@Injectable({
    providedIn: 'root',
})
export class TemporaryCanvasService {
    tempContext: CanvasRenderingContext2D;
    focusContext: CanvasRenderingContext2D;
    easelContext: CanvasRenderingContext2D;
    tempWord: string = '';
    previousTile: Vec2 = { x: -1, y: -1 };
    private direction: string = H_ARROW;

    constructor(private letterService: LettersService) {}

    drawLetter(lett: Letter, pos: Vec2) {
        const imgLetter = new Image();
        imgLetter.src = lett.img;
        const x = pos.x;
        const y = pos.y;
        imgLetter.onload = () => {
            this.tempContext.drawImage(
                imgLetter,
                LEFTSPACE + ((x - 1) * BOARD_WIDTH) / NB_TILES,
                TOPSPACE + ((y - 1) * BOARD_WIDTH) / NB_TILES,
                BOARD_WIDTH / NB_TILES,
                BOARD_HEIGHT / NB_TILES,
            );
        };
    }

    placeTempLetter(lett: Letter): void {
        if (this.findNextEmptyTile()) {
            this.tempWord += lett.charac;
            this.drawLetter(lett, this.previousTile);
            this.drawRedFocus(this.previousTile, this.tempContext);
            this.incrementDirection();
            this.drawTileFocus(this.previousTile);
        }
    }
    addLetterFromGrid(letter: string) {
        this.tempWord += letter;
        this.drawRedFocus(this.previousTile, this.tempContext);
        this.incrementDirection();
    }
    removeLastLetter() {
        do {
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

            this.tempWord = this.tempWord.slice(0, UNDEFINED_INDEX);
        } while (!this.letterService.tileIsEmpty(this.previousTile) && this.tempWord !== '');
        this.drawTileFocus(this.previousTile);
    }
    decrementDirection() {
        if (this.direction === H_ARROW && this.previousTile.x <= NB_TILES) this.previousTile.x--;
        else if (this.direction === V_ARROW && this.previousTile.y <= NB_TILES) this.previousTile.y--;
    }
    incrementDirection() {
        if (this.direction === H_ARROW && this.previousTile.x < NB_TILES) this.previousTile.x++;
        else if (this.direction === V_ARROW && this.previousTile.y < NB_TILES) this.previousTile.y++;
    }
    drawTileFocus(pos: Vec2): void {
        this.previousTile = { x: pos.x, y: pos.y };
        this.focusContext.font = 'bold 40px system-ui';
        this.focusContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
        if (this.findNextEmptyTile()) {
            this.drawArrow(this.previousTile);
            this.drawRedFocus(this.previousTile, this.focusContext);
        }
    }
    findNextEmptyTile(): boolean {
        while (!this.letterService.tileIsEmpty(this.previousTile)) {
            this.addLetterFromGrid(this.letterService.tiles[this.previousTile.y - 1][this.previousTile.x - 1].charac);
            if (this.previousTile.x === NB_TILES || this.previousTile.y === NB_TILES) return false;
        }
        return true;
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
    setLetterClicked(index: number) {
        this.easelContext.beginPath();
        this.easelContext.strokeStyle = 'yellow';
        this.easelContext.lineWidth = 3;
        this.easelContext.shadowColor = 'red';
        this.easelContext.shadowBlur = 5;
        this.easelContext.rect(
            LEFTSPACE + ((HAND_POSITION_START + index) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2,
            BOARD_WIDTH / NB_TILES,
            BOARD_WIDTH / NB_TILES,
        );
        this.easelContext.stroke();
    }
    unclickLetter(index: number) {
        this.easelContext.clearRect(
            LEFTSPACE + ((HAND_POSITION_START + index) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2,
            BOARD_WIDTH / NB_TILES + 3,
            BOARD_WIDTH / NB_TILES + 3,
        );
    }
    letterEaselToMove(index: number) {
        this.easelContext.beginPath();
        this.easelContext.strokeStyle = 'green';
        this.easelContext.lineWidth = 3;
        this.easelContext.shadowColor = 'red';
        this.easelContext.shadowBlur = 5;
        this.easelContext.rect(
            LEFTSPACE + ((HAND_POSITION_START + index) * BOARD_WIDTH) / NB_TILES,
            TOPSPACE + BOARD_HEIGHT + TOPSPACE / 2,
            BOARD_WIDTH / NB_TILES,
            BOARD_WIDTH / NB_TILES,
        );
        this.easelContext.stroke();
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
}
