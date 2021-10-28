import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { ASCI_CODE_A, BOARD_HEIGHT, BOARD_WIDTH, LEFTSPACE, NB_TILES, NOT_A_LETTER, TOPSPACE } from '@app/constants/constants';
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
            this.easelLogic.replaceTempInEasel(this.userService.realUser.easel);
        }
    }
    keyBoardEntryManage(key: string) {
        let letter: Letter = NOT_A_LETTER;

        if ((this.gridService.previousTile.x !== NB_TILES && this.gridService.previousTile.y !== NB_TILES) || this.firstBorderLetter) {
            letter = this.easelLogic.tempGetLetter(key, this.userService.realUser.easel);
            if (this.gridService.previousTile.x === NB_TILES || this.gridService.previousTile.y === NB_TILES) this.firstBorderLetter = false;
        }
        if (letter !== NOT_A_LETTER) {
            this.gridService.placeTempLetter(letter);
        }
    }
    checkLetterInGrid(key: string, letter: Letter) {
        if (key === letter.charac) {
            this.gridService.addLetterFromGrid(letter.charac);
        }
    }
    mouseHitDetect(event: MouseEvent) {
        if (
            this.userService.realUser.turnToPlay &&
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
        this.userService.realUser.easel.resetTempIndex();
        this.gridService.clearLayers();
        this.easelLogic.placeEaselLetters(this.userService.realUser.easel);
        this.gridService.tempWord = '';
    }

    get tempCommand(): BehaviorSubject<string> {
        return this.commandObs;
    }
}
