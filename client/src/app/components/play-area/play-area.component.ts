import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CANEVAS_HEIGHT, CANEVAS_WIDTH, UNDEFINED_INDEX } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { TemporaryCanvasService } from '@app/services/temporary-canvas.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

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
        private tempCanvasService: TemporaryCanvasService,
        private readonly gridService: GridService,
        public mouseHandlingService: MouseHandelingService,
        private readonly lettersService: LettersService,
        readonly easelLogisticsService: EaselLogiscticsService,
        public userService: UserService,
        private readonly pvs: ValidWordService,
        private multiplayer: MultiplayerModeService,
        private virtualPlayer: VirtualPlayerService,
    ) {
        if (this.userService.playMode !== 'joinMultiplayerGame') {
            if (this.userService.playMode === 'soloGame') {
                this.easelLogisticsService.fillEasel(this.virtualPlayer.easel, false);
            }
            this.easelLogisticsService.fillEasel(this.userService.realUser.easel, true);
            if (this.userService.playMode === 'createMultiplayerGame') {
                this.multiplayer.sendReserve();
                this.multiplayer.updateReserve();
            }
        } else {
            this.multiplayer.updateReserve();
        }
    }
    @HostListener('window:keydown', ['$event'])
    spaceEvent(event: KeyboardEvent) {
        if (this.mouseHandlingService.previousClick.x !== UNDEFINED_INDEX) {
            switch (event.key) {
                case 'Backspace':
                    this.mouseHandlingService.deletPreviousLetter();
                    break;
                case 'Enter':
                    this.mouseHandlingService.placeTempWord();
                    break;
                case 'Escape':
                    this.mouseHandlingService.resetSteps();
                    this.mouseHandlingService.previousClick = { x: -1, y: -1 };
                    break;
                default:
                    this.mouseHandlingService.keyBoardEntryManage(event.key);

                    break;
            }
        }
        if (this.userService.getPlayerEasel().indexToMove !== UNDEFINED_INDEX)
            switch (event.key) {
                case 'ArrowLeft':
                    this.mouseHandlingService.moveLeft();
                    break;
                case 'ArrowRight':
                    this.mouseHandlingService.moveRight();
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
        this.tempCanvasService.tempContext = this.tempCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.tempCanvasService.focusContext = this.focusCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.tempCanvasService.easelContext = this.easelCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
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
    disableButton(event: string): boolean {
        if (event !== 'passTurn') {
            if (this.userService.playMode !== 'joinMultiplayerGame') {
                return !this.userService.realUser.turnToPlay || this.mouseHandlingService.isLettersArrayEmpty();
            } else return this.userService.realUser.turnToPlay || this.mouseHandlingService.isLettersArrayEmpty();
        } else {
            if (this.userService.playMode !== 'joinMultiplayerGame') return !this.userService.realUser.turnToPlay;
            else return this.userService.realUser.turnToPlay;
        }
    }

    quitGame() {
        window.location.assign('/home');
    }
}
