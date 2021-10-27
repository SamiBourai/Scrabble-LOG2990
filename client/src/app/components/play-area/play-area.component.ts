import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Pair } from '@app/classes/pair';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_HEIGHT, BOARD_WIDTH, CANEVAS_HEIGHT, CANEVAS_WIDTH,  LEFTSPACE, NB_TILES, TOPSPACE } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { EASEL_POSITIONS, RANGE_Y } from './../../constants/constants';

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
    letterIsClicked = new Map<Pair, boolean>([
        [{ min: 264, max: 313 }, false],
        [{ min: 315, max: 371 }, false],
        [{ min: 373, max: 424 }, false],
        [{ min: 426, max: 478 }, false],
        [{ min: 480, max: 531 }, false],
        [{ min: 534, max: 584 }, false],
        [{ min: 586, max: 637 }, false],
    ]);

    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly easelLogisticsService: EaselLogiscticsService,

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

        if (this.easelLogisticsService.isBetween(RANGE_Y, vec.y) && this.easelLogisticsService.isBetween({ min: 264, max: 637 }, vec.x)) {
            this.isGood = true;
            this.letterIsClicked.forEach((value: boolean, key: Pair) => {
                for (const easelPosition of EASEL_POSITIONS) {
                    // For each intervalle de lettre du chevalet

                    if (
                        easelPosition.letterRange.min === key.min &&
                        easelPosition.letterRange.max === key.max &&
                        this.easelLogisticsService.isBetween(easelPosition.letterRange, vec.x)
                    ) {
                        if (!value) {
                            console.log('1111111111111111');
                            console.log('avant le push :' + value);
                            this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[easelPosition.index]);
                            this.letterIsClicked.set(key, true);
                            console.log('apres le push :' + value);
                            console.log(JSON.stringify(this.letterIsClicked));
                        } else {
                            console.log('2222222222222222');
                            const index = this.lettersToSwapByClick.indexOf(this.userService.realUser.easel.easelLetters[easelPosition.index]);
                            this.lettersToSwapByClick.splice(index, 1);
                            this.letterIsClicked.set(key, false);
                            console.log('Nous avons declique');
                            console.log(JSON.stringify(this.letterIsClicked));
                        }
                    }
                }
            });
        }

        console.log(this.userService.realUser.easel);
        console.log(this.lettersToSwapByClick);
        return this.lettersToSwapByClick;
    }

    swapByClick(event: MouseEvent) {
        const letters = this.easelClicked(event);

        for (const letter of letters) {
            this.lettersService.changeLetterFromReserve(letter.charac, this.userService.realUser.easel);
        }
        this.lettersToSwapByClick = [];
    }

    cancelByClick(){
        this.lettersToSwapByClick = [];
    }

    isLettersArrayEmpty(){
        if (this.lettersToSwapByClick.length > 0) return false;
        return true;

    }

    doubleClickOnLetter(letter: Letter) {
        const index = this.lettersToSwapByClick.indexOf(letter, 0);
        console.log(index);
        if (index > -1) this.lettersToSwapByClick.splice(index, 1);
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

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
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
}
