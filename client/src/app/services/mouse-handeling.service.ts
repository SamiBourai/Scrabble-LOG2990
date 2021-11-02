import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/components/play-area/play-area.component';
import {
    ASCI_CODE_A,
    BOARD_HEIGHT,
    BOARD_WIDTH,
    CANEVAS_HEIGHT,
    CANEVAS_WIDTH,
    EASEL_POSITIONS,
    LEFTSPACE,
    NB_TILES,
    NOT_A_LETTER,
    RANGE_Y,
    SWAP_BUTTON_RANGE_X,
    SWAP_BUTTON_RANGE_Y,
    TOPSPACE,
    UNDEFINED_INDEX,
} from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { GridService } from './grid.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class MouseHandelingService {
    mousePosition: Vec2 = { x: -1, y: -1 };
    previousClick: Vec2 = { x: -1, y: -1 };
    firstBorderLetter: boolean = true;
    placeTempCommand: string;
    lastWasLeftClick: boolean = false;
    first = true;
    buttonPressed = '';
    containsAllChars: boolean = true;
    chatWord: string;
    remainingLetters: number = 0;
    dialogRef: unknown;
    isClicked: boolean = false;
    isGood: boolean = false;

    lettersToSwapByClick: Letter[] = [];
    commandObs = new BehaviorSubject<string>('');
    constructor(private readonly gridService: GridService, private easelLogic: EaselLogiscticsService, private userService: UserService) {}
    placeTempWord() {
        if (this.gridService.tempWord !== '') {
            this.placeTempCommand =
                '!placer ' +
                String.fromCharCode(ASCI_CODE_A + (this.previousClick.y - 1)) +
                this.previousClick.x +
                this.gridService.getCommandDirection() +
                ' ' +
                this.gridService.tempWord;
            this.commandObs.next(this.placeTempCommand);
            this.resetSteps();
            this.gridService.resetArrow();
        }
    }
    deletPreviousLetter() {
        if (this.gridService.tempWord !== '') {
            this.gridService.removeLastLetter();
            this.easelLogic.replaceTempInEasel(this.userService.getPlayerEasel());
        }
    }
    keyBoardEntryManage(key: string) {
        let letter: Letter = NOT_A_LETTER;

        if ((this.gridService.previousTile.x !== NB_TILES && this.gridService.previousTile.y !== NB_TILES) || this.firstBorderLetter) {
            letter = this.easelLogic.tempGetLetter(key, this.userService.getPlayerEasel());
            if (this.gridService.previousTile.x === NB_TILES || this.gridService.previousTile.y === NB_TILES) this.firstBorderLetter = false;
        }
        if (letter !== NOT_A_LETTER) {
            this.gridService.placeTempLetter(letter);
        }
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
            if (this.mousePosition.x !== this.previousClick.x || this.mousePosition.y !== this.previousClick.y) {
                this.resetSteps();
                this.gridService.resetArrow();
            }
            if (this.mousePosition.x === this.previousClick.x && this.mousePosition.y === this.previousClick.y) {
                this.resetSteps();
                this.gridService.switchArrow();
            }
            this.gridService.drawTileFocus(this.mousePosition);
            this.previousClick = { x: this.mousePosition.x, y: this.mousePosition.y };
        } else {
            this.resetSteps();
            this.gridService.resetArrow();
            this.previousClick = { x: -1, y: -1 };
        }
    }
    resetSteps() {
        this.firstBorderLetter = true;
        this.userService.getPlayerEasel().resetTempIndex();
        this.gridService.clearLayers();
        this.easelLogic.placeEaselLetters(this.userService.getPlayerEasel());
        this.gridService.tempWord = '';
    }
    easelClicked(event: MouseEvent) {
        const vec = this.easelLogic.showCoords(event);
        const rangeEasleValid = this.easelLogic.isBetween(RANGE_Y, vec.y) && this.easelLogic.isBetween({ min: 264, max: 637 }, vec.x);
        const rangeSwapButtonValid = this.easelLogic.isBetween(SWAP_BUTTON_RANGE_X, vec.x) && this.easelLogic.isBetween(SWAP_BUTTON_RANGE_Y, vec.y);
        if (this.userService.isPlayerTurn())
            if (rangeEasleValid || rangeSwapButtonValid) {
                this.isGood = true;
                let easelIndex = 0;
                for (const easelPosition of EASEL_POSITIONS) {
                    // For each intervalle de lettre du chevalet
                    const indexCounter = easelIndex;
                    if (this.easelLogic.isBetween(easelPosition.letterRange, vec.x)) {
                        if (!easelPosition.isClicked) {
                            if (event.button === 0) {
                                this.userService.getPlayerEasel().indexToMove = UNDEFINED_INDEX;
                                if (!this.lastWasLeftClick) {
                                    this.cancelByClick();
                                    this.lastWasLeftClick = true;
                                }
                                this.gridService.setLetterClicked(indexCounter);
                                this.lettersToSwapByClick.push(this.userService.getPlayerEasel().easelLetters[easelPosition.index]);
                                easelPosition.isClicked = true;
                            } else {
                                this.cancelByClick();
                                this.lastWasLeftClick = false;
                                this.gridService.letterEaselToMove(indexCounter);
                                this.userService.getPlayerEasel().indexToMove = indexCounter;
                                easelPosition.isClicked = true;
                            }
                        } else if (event.button === 0 && this.lastWasLeftClick) {
                            const index = this.lettersToSwapByClick.indexOf(this.userService.getPlayerEasel().easelLetters[easelPosition.index]);
                            this.lettersToSwapByClick.splice(index, 1);
                            this.gridService.unclickLetter(indexCounter);
                            easelPosition.isClicked = false;
                        } else if (event.button === 2 && !this.lastWasLeftClick) {
                            this.cancelByClick();
                            this.userService.getPlayerEasel().indexToMove = UNDEFINED_INDEX;
                        }
                    }
                    easelIndex++;
                }
            } else {
                this.cancelByClick();
            }
        return this.lettersToSwapByClick;
    }
    swapByClick(event: MouseEvent) {
        const letters = this.easelClicked(event);
        this.placeTempCommand = '!echanger ';
        for (const lett of letters) {
            this.placeTempCommand += lett.charac;
        }
        this.commandObs.next(this.placeTempCommand);
        this.cancelByClick();
        this.userService.exchangeLetters = true;
    }

    cancelByClick() {
        this.lettersToSwapByClick = [];
        this.allIsClickedToFalse();
        this.gridService.easelContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_HEIGHT);
    }
    isLettersArrayEmpty() {
        if (this.lettersToSwapByClick.length > 0) return false;
        return true;
    }
    moveLeft() {
        if (!this.lastWasLeftClick) {
            this.easelLogic.moveLeft(this.userService.getPlayerEasel());
            this.cancelByClick();
            this.lastWasLeftClick = false;
            this.gridService.letterEaselToMove(this.userService.getPlayerEasel().indexToMove);
        }
    }
    moveRight() {
        if (!this.lastWasLeftClick) {
            this.easelLogic.moveRight(this.userService.getPlayerEasel());
            this.cancelByClick();
            this.lastWasLeftClick = false;
            this.gridService.letterEaselToMove(this.userService.getPlayerEasel().indexToMove);
        }
    }
    private allIsClickedToFalse() {
        for (const easelPosition of EASEL_POSITIONS) {
            easelPosition.isClicked = false;
        }
    }

    get tempCommand(): BehaviorSubject<string> {
        return this.commandObs;
    }
}
