import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CANEVAS_HEIGHT, CANEVAS_WIDTH, NOT_A_LETTER, UNDEFINED_INDEX } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { ModalUserVsPlayerComponent } from '../modals/modal-user-vs-player/modal-user-vs-player.component';

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
        private dialogRef: MatDialog,
        private multiplayer: MultiplayerModeService,
    ) {
        if (this.userService.playMode !== 'joinMultiplayerGame') {
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
        this.gridService.drawBox(this.userService.isBonusBox);
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

    detectGameQuit(): void {
        this.userService.isUserQuitGame = true;
    }

    openDialogOfVrUser(): void {
        this.dialogRef.open(ModalUserVsPlayerComponent, { disableClose: true });
    }

    quitGame() {
        window.location.assign('/home');
    }
    disableButton(event: string): boolean {
        if (event !== 'passTurn') {
            if (this.userService.playMode !== 'joinMultiplayerGame') {
                return !this.userService.realUser.turnToPlay || this.mousHandelingService.isLettersArrayEmpty();
            } else return this.userService.realUser.turnToPlay || this.mousHandelingService.isLettersArrayEmpty();
        } else {
            if (this.userService.playMode !== 'joinMultiplayerGame') return !this.userService.realUser.turnToPlay;
            else return this.userService.realUser.turnToPlay;
        }
    }
}
