import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_HEIGHT, BOARD_WIDTH, CANEVAS_HEIGHT, CANEVAS_WIDTH, LEFTSPACE, NB_TILES, TOPSPACE } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { EASEL_POSITIONS, RANGE_Y, SWAP_BUTTON_RANGE_X, SWAP_BUTTON_RANGE_Y } from './../../constants/constants';

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit, OnInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    first = true;
    mousePosition: Vec2 = { x: 0, y: 0 };
    buttonPressed = '';
    containsAllChars: boolean = true;
    chatWord: string;
    remainingLetters: number = 0;
    dialogRef: unknown;
    isClicked: boolean = false;
    isGood: boolean = false;

    lettersToSwapByClick: Letter[] = [];

    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        readonly easelLogisticsService: EaselLogiscticsService,

        public userService: UserService,
        private readonly pvs: ValidWordService,
    ) {
        this.easelLogisticsService.fillEasel(this.userService.realUser.easel, true);
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    easelClicked(event: MouseEvent) {
        const vec = this.easelLogisticsService.showCoords(event);
        const rangeEasleValid =
            this.easelLogisticsService.isBetween(RANGE_Y, vec.y) && this.easelLogisticsService.isBetween({ min: 264, max: 637 }, vec.x);
        const rangeSwapButtonValid =
            this.easelLogisticsService.isBetween(SWAP_BUTTON_RANGE_X, vec.x) && this.easelLogisticsService.isBetween(SWAP_BUTTON_RANGE_Y, vec.y);
        if (rangeEasleValid || rangeSwapButtonValid) {
            this.isGood = true;

            for (const easelPosition of EASEL_POSITIONS) {
                // For each intervalle de lettre du chevalet

                if (this.easelLogisticsService.isBetween(easelPosition.letterRange, vec.x)) {
                    if (!easelPosition.isClicked) {
                        this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[easelPosition.index]);
                        easelPosition.isClicked = true;
                    } else {
                        const index = this.lettersToSwapByClick.indexOf(this.userService.realUser.easel.easelLetters[easelPosition.index]);
                        this.lettersToSwapByClick.splice(index, 1);
                        easelPosition.isClicked = false;
                    }
                }
            }
        } else {
            this.lettersToSwapByClick = [];
            this.allIsClickedToFalse();
        }
        return this.lettersToSwapByClick;
    }

    swapByClick(event: MouseEvent) {
        const letters = this.easelClicked(event);

        for (const letter of letters) {
            this.lettersService.changeLetterFromReserve(letter.charac, this.userService.realUser.easel);
        }
        this.lettersToSwapByClick = [];
        this.allIsClickedToFalse();
    }

    cancelByClick() {
        this.lettersToSwapByClick = [];
        this.allIsClickedToFalse();
    }

    isLettersArrayEmpty() {
        if (this.lettersToSwapByClick.length > 0) return false;
        return true;
    }

    detectSkipTurnBtn() {
        this.userService.detectSkipTurnBtn();
    }

    ngOnInit() {
        this.pvs.loadDictionary().then(() => {});
    }
    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.lettersService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.easelLogisticsService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawCentralTile();
        this.gridService.drawCoor();
        this.gridService.drawBonusBox();
        this.gridService.drawGrid();
        this.gridService.drawHand();
        this.gridCanvas.nativeElement.focus();
    }

    // TODO : déplacer ceci dans un service de gestion de la souris!
    mouseHitDetect(event: MouseEvent) {
        if (
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
        }
    }

    private allIsClickedToFalse() {
        for (const easelPosition of EASEL_POSITIONS) {
            easelPosition.isClicked = false;
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
