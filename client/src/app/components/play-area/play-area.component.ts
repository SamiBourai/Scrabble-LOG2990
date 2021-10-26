import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { BOARD_HEIGHT, BOARD_WIDTH, CANEVAS_HEIGHT, CANEVAS_WIDTH, LEFTSPACE, NB_TILES, TOPSPACE } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { Letter } from '@app/classes/letter';

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
    
    lettersToSwapByClick: Letter[] = [];

    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };

    constructor(
        private readonly gridService: GridService,
        private readonly lettersService: LettersService,
        private readonly easelLogisticsService: EaselLogiscticsService,
        
        public userService: UserService,
        private readonly pvs: ValidWordService,
    ) {
        console.log('user Easel init');
        this.easelLogisticsService.refillEasel(this.userService.realUser.easel, true);
        console.log(this.userService.realUser.easel.easelLetters);
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    easelClicked(event:any) {
        let vec = this.easelLogisticsService.showCoords(event);

        if (this.easelLogisticsService.isBetween(vec.y, 840, 887)) {
            if (this.easelLogisticsService.isBetween(vec.x, 264, 313)) {
                // console.log('bien');
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[0]);
            }
            if (this.easelLogisticsService.isBetween(vec.x, 317, 371)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[1]);
            }

            if (this.easelLogisticsService.isBetween(vec.x, 373, 424)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[2]);
            }

            if (this.easelLogisticsService.isBetween(vec.x, 426, 478)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[3]);
            }

            if (this.easelLogisticsService.isBetween(vec.x, 480, 531)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[4]);
            }

            if (this.easelLogisticsService.isBetween(vec.x, 534, 584)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[5]);
            }

            if (this.easelLogisticsService.isBetween(vec.x, 586, 637)) {
                this.lettersToSwapByClick.push(this.userService.realUser.easel.easelLetters[6]);
            }
        }
        console.log(this.userService.realUser.easel)
        console.log(this.lettersToSwapByClick);
        return this.lettersToSwapByClick;
    }

    swapByClick(event:any) {
        const letters = this.easelClicked(event);
        for (const i of letters) {
            this.lettersService.changeLetterFromReserve(i.charac,this.userService.realUser.easel);
        }

        this.lettersToSwapByClick = [];
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
