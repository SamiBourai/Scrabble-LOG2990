import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CANEVAS_HEIGHT, CANEVAS_WIDTH, NOT_A_LETTER, UNDEFINED_INDEX } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';

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
    @ViewChild('tempCanvas', { static: false }) private tempCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('focusCanvas', { static: false }) private focusCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('easelCanvas', { static: false }) private easelCanvas!: ElementRef<HTMLCanvasElement>;

    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        public mousHandelingService: MouseHandelingService,
        private readonly lettersService: LettersService,
        readonly easelLogisticsService: EaselLogiscticsService,

        public userService: UserService,
        private readonly pvs: ValidWordService,
    ) {
        this.easelLogisticsService.fillEasel(this.userService.realUser.easel, true);
    }
    @HostListener('window:keydown', ['$event'])
    spaceEvent(event: KeyboardEvent) {
        if (this.mousHandelingService.previousClick.x !== UNDEFINED_INDEX)
            switch (event.key) {
                case 'Backspace':
                    this.mousHandelingService.deletPreviousLetter();
                    break;
                case 'Enter':
                    this.mousHandelingService.placeTempWord();
                    break;
                case 'Escape':
                    this.mousHandelingService.resetSteps();
                    this.mousHandelingService.previousClick = { x: -1, y: -1 };
                    break;
                // case 'left arrow':
                //     this.mousHandelingService.moveLeft();
                //     break;
                // case 'right arrow':
                //     console.log('right');
                //     this.mousHandelingService.moveRight();
                //     break;
                default:
                    if (this.lettersService.tiles[this.gridService.previousTile.y - 1][this.gridService.previousTile.x - 1] === NOT_A_LETTER) {
                        this.mousHandelingService.keyBoardEntryManage(event.key);
                    } else {
                        this.mousHandelingService.checkLetterInGrid(
                            event.key,
                            this.lettersService.tiles[this.gridService.previousTile.y - 1][this.gridService.previousTile.x - 1],
                        );
                    }
                    break;
            }
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
        this.gridService.tempContext = this.tempCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.focusContext = this.focusCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.easelLogisticsService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.easelContext = this.easelCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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
}
