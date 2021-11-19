import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { EASEL_POSITIONS } from '@app/constants/array-constant';
import {
    ASCI_CODE_A,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CANEVAS_HEIGHT,
    CANEVAS_WIDTH,
    LEFTSPACE,
    NB_TILES,
    NOT_A_LETTER,
    RANGE_Y,
    SWAP_BUTTON_RANGE_X,
    SWAP_BUTTON_RANGE_Y,
    TOPSPACE,
    UNDEFINED_INDEX
} from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { TemporaryCanvasService } from './temporary-canvas.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class MouseHandelingService {
    mousePosition: Vec2 = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
    previousClick: Vec2 = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
    firstBorderLetter: boolean = true;
    placeTempCommand: string = '';
    lastWasRightClick: boolean = false;
    first = true;
    buttonPressed = '';
    containsAllChars: boolean = true;
    chatWord: string;
    remainingLetters: number = 0;
    dialogRef: unknown;
    isClicked: boolean = false;
    isGood: boolean = false;
    inEasel: boolean = false;
    lettersToSwapByClick: Letter[] = [];
    sideBarInputEnable: boolean = true;
    commandObs = new BehaviorSubject<string>('');
    constructor(
        private readonly tempCanvasService: TemporaryCanvasService,
        private easelLogic: EaselLogiscticsService,
        private userService: UserService,
    ) {}
    placeTempWord() {
        if (this.tempCanvasService.tempWord !== '') {
            this.placeTempCommand =
                '!placer ' +
                String.fromCharCode(ASCI_CODE_A + (this.previousClick.y + UNDEFINED_INDEX)) +
                this.previousClick.x +
                this.tempCanvasService.getCommandDirection() +
                ' ' +
                this.tempCanvasService.tempWord;
            this.commandObs.next(this.placeTempCommand);
            this.resetSteps(false);
            this.tempCanvasService.resetArrow();
        }
    }
    deletPreviousLetter() {
        if (this.tempCanvasService.tempWord !== '' && this.sideBarInputEnable) {
            this.tempCanvasService.removeLastLetter();
            this.easelLogic.replaceTempInEasel(this.userService.getPlayerEasel());
        }
    }
    keyBoardEntryManage(key: string) {
        let letter: Letter = NOT_A_LETTER;

        if ((this.tempCanvasService.previousTile.x !== NB_TILES && this.tempCanvasService.previousTile.y !== NB_TILES) || this.firstBorderLetter) {
            letter = this.easelLogic.tempGetLetter(key, this.userService.getPlayerEasel());
            if (this.tempCanvasService.previousTile.x === NB_TILES || this.tempCanvasService.previousTile.y === NB_TILES)
                this.firstBorderLetter = false;
        }
        if (letter !== NOT_A_LETTER) {
            this.inEasel = true;
            this.tempCanvasService.placeTempLetter(letter);
        } else this.inEasel = false;
    }
    mouseHitDetect(event: MouseEvent) {
        if (
            this.userService.isPlayerTurn() &&
            event.button === MouseButton.Left &&
            event.offsetX > LEFTSPACE &&
            event.offsetX < BOARD_WIDTH + LEFTSPACE &&
            event.offsetY > TOPSPACE &&
            event.offsetY < BOARD_HEIGHT + TOPSPACE
        ) {
            this.mousePosition = {
                x: Math.ceil((event.offsetX - LEFTSPACE) / (BOARD_WIDTH / NB_TILES)),
                y: Math.ceil((event.offsetY - TOPSPACE) / (BOARD_HEIGHT / NB_TILES)),
            };

            if (this.mousePosition.x === this.previousClick.x && this.mousePosition.y === this.previousClick.y) {
                this.resetSteps(false);
                this.tempCanvasService.switchArrow();
            } else {
                this.resetSteps(false);
                this.tempCanvasService.resetArrow();
            }
            this.tempCanvasService.drawTileFocus(this.mousePosition);
            this.previousClick = { x: this.mousePosition.x, y: this.mousePosition.y };
        } else {
            this.resetSteps(false);
            this.tempCanvasService.resetArrow();
            this.previousClick = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
        }
    }
    resetSteps(played: boolean) {
        this.firstBorderLetter = true;
        this.userService.getPlayerEasel().resetTempIndex();
        this.tempCanvasService.clearLayers();
        if (!played) this.easelLogic.placeEaselLetters(this.userService.getPlayerEasel());
        this.tempCanvasService.tempWord = '';
    }
    easelClicked(event: MouseEvent) {
        const vec = this.easelLogic.showCoords(event);
        const rangeEasleValid = this.easelLogic.isBetween(RANGE_Y, vec.y) && this.easelLogic.isBetween({ min: 264, max: 637 }, vec.x);
        const rangeSwapButtonValid = this.easelLogic.isBetween(SWAP_BUTTON_RANGE_X, vec.x) && this.easelLogic.isBetween(SWAP_BUTTON_RANGE_Y, vec.y);
        let easelIndex = 0;
        if (rangeEasleValid || rangeSwapButtonValid) {
            this.isGood = true;

            for (const easelPosition of EASEL_POSITIONS) {
                const indexCounter = easelIndex;
                if (this.easelLogic.isBetween(easelPosition.letterRange, vec.x)) {
                    this.resetSteps(false);
                    if (event.button === 0) {
                        this.lastWasRightClick = false;
                        if (!easelPosition.isClicked) {
                            this.cancelByClick();
                            this.tempCanvasService.letterEaselToMove(indexCounter);
                            this.userService.getPlayerEasel().indexToMove = indexCounter;
                            easelPosition.isClicked = true;
                        } else {
                            this.cancelByClick();
                            this.userService.getPlayerEasel().indexToMove = UNDEFINED_INDEX;
                        }
                    } else if (event.button === 2 && this.userService.isPlayerTurn()) {
                        if (!this.lastWasRightClick) {
                            this.userService.getPlayerEasel().indexToMove = UNDEFINED_INDEX;
                            this.cancelByClick();
                            this.lastWasRightClick = true;
                        }
                        if (!easelPosition.isClicked) {
                            this.tempCanvasService.setLetterClicked(indexCounter);
                            this.lettersToSwapByClick.push(this.userService.getPlayerEasel().easelLetters[easelPosition.index]);
                            easelPosition.isClicked = true;
                        } else {
                            const index = this.lettersToSwapByClick.indexOf(this.userService.getPlayerEasel().easelLetters[easelPosition.index]);
                            this.lettersToSwapByClick.splice(index, 1);
                            this.tempCanvasService.unclickLetter(indexCounter);
                            easelPosition.isClicked = false;
                        }
                    }
                }
                easelIndex++;
            }
        } else {
            this.cancelByClick();
        }
    }
    swapByClick() {
        const letters = this.lettersToSwapByClick;
        this.placeTempCommand = '!echanger ';
        for (const lett of letters) {
            this.placeTempCommand += lett.charac;
        }
        this.cancelByClick();
        this.userService.exchangeLetters = true;
        this.commandObs.next(this.placeTempCommand);
    }

    cancelByClick() {
        this.lettersToSwapByClick = [];
        this.allIsClickedToFalse();
        this.tempCanvasService.easelContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_HEIGHT);
    }
    isLettersArrayEmpty() {
        return this.lettersToSwapByClick.length === 0;
    }
    moveLeft() {
        if (!this.lastWasRightClick) {
            this.easelLogic.moveLeft(this.userService.getPlayerEasel());
            this.cancelByClick();
            this.lastWasRightClick = false;
            this.tempCanvasService.letterEaselToMove(this.userService.getPlayerEasel().indexToMove);
        }
    }
    moveRight() {
        if (!this.lastWasRightClick) {
            this.easelLogic.moveRight(this.userService.getPlayerEasel());
            this.cancelByClick();
            this.lastWasRightClick = false;
            this.tempCanvasService.letterEaselToMove(this.userService.getPlayerEasel().indexToMove);
        }
    }

    clearAll(played: boolean) {
        this.previousClick = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
        this.resetSteps(played);
        this.cancelByClick();
        this.tempCanvasService.easelContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
    }
    private allIsClickedToFalse() {
        for (const easelPosition of EASEL_POSITIONS) {
            easelPosition.isClicked = false;
        }
    }
}
