import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { ShowEndgameInfoComponent } from '@app/components/modals/show-endgame-info/show-endgame-info.component';
import { CANEVAS_HEIGHT, CANEVAS_WIDTH, UNDEFINED_INDEX } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { GridService } from '@app/services/grid.service';
import { LettersService } from '@app/services/letters.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TemporaryCanvasService } from '@app/services/temporary-canvas.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { Subscription } from 'rxjs';

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
export class PlayAreaComponent implements AfterViewInit, OnInit, OnDestroy {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('tempCanvas', { static: false }) private tempCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('focusCanvas', { static: false }) private focusCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('easelCanvas', { static: false }) private easelCanvas!: ElementRef<HTMLCanvasElement>;
    soloMode: boolean = true;
    remainingLetters: number = 0;
    private canvasSize = { x: CANEVAS_WIDTH, y: CANEVAS_HEIGHT };
    private numberOfLetterSubscription: Subscription;
    private turnToPlaySubscription: Subscription;

    constructor(
        private tempCanvasService: TemporaryCanvasService,
        private readonly gridService: GridService,
        public mouseHandlingService: MouseHandelingService,
        private readonly lettersService: LettersService,
        readonly easelLogisticsService: EaselLogiscticsService,
        public userService: UserService,
        private readonly pvs: ValidWordService,
        private dialogRef: MatDialog,
        private multiplayer: MultiplayerModeService,
        private virtualPlayer: VirtualPlayerService,
        private objectifManagerService: ObjectifManagerService,
        public reserveService: ReserveService,
        private socketManagerService: SocketManagementService,
        public virtualPlayerService: VirtualPlayerService,
    ) {
        if (this.userService.playMode !== 'joinMultiplayerGame') {
            if (this.userService.playMode === 'soloGame') {
                this.easelLogisticsService.fillEasel(this.virtualPlayer.easel, false);
            }
            this.easelLogisticsService.fillEasel(this.userService.realUser.easel, true);
            if (this.userService.playMode === 'createMultiplayerGame') {
                this.multiplayer.sendReserve();
            }
        } else {
            this.multiplayer.getJoinReserve();
        }
        this.pvs.loadDictionary().then(() => {
            // promise to fill dictionnary
        });
    }
    @HostListener('window:keydown', ['$event'])
    spaceEvent(event: KeyboardEvent) {
        if (this.mouseHandlingService.previousClick.x !== UNDEFINED_INDEX) {
            switch (event.key) {
                case 'Backspace':
                    this.mouseHandlingService.deletPreviousLetter();
                    break;
                case 'Enter':
                    if (this.mouseHandlingService.previousClick.x !== UNDEFINED_INDEX) {
                        this.mouseHandlingService.placeTempWord();
                    }
                    break;
                case 'Escape':
                    this.mouseHandlingService.resetSteps();
                    this.mouseHandlingService.previousClick = { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX };
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
        this.getRemainingLetter();

        if (this.userService.gameModeObs) {
            this.userService.gameModeObs.subscribe(() => {
                setTimeout(() => {
                    if (this.userService.playMode === 'soloGame') {
                        this.soloMode = true;
                    }
                }, 0);
            });
        }
        switch (this.userService.playMode) {
            case 'createMultiplayerGame':
                this.soloMode = false;
                this.multiplayer.beginGame();
                break;
            case 'joinMultiplayerGame':
                this.soloMode = false;
                this.socketManagerService.emit('guestInGamePage', { gameName: this.userService.gameName });
                this.multiplayer.beginGame();
                break;
        }
        this.isUserEaselEmpty();
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
        this.gridService.drawBox(this.userService.isBonusBox, this.userService.playMode, this.userService.gameName);
        this.gridService.drawGrid();
        this.gridService.drawHand();
        this.gridCanvas.nativeElement.focus();
    }
    getRemainingLetter() {
        this.numberOfLetterSubscription = this.reserveService.size.subscribe((res) => {
            setTimeout(() => {
                this.remainingLetters = res;
            }, 0);
        });
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
        if (this.objectifManagerService.log2990Mode) this.objectifManagerService.resetObjectifs();
        window.location.assign('/home');
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
    isUserEaselEmpty() {
        this.turnToPlaySubscription = this.userService.realUserTurnObs.subscribe(() => {
            setTimeout(() => {
                this.mouseHandlingService.clearAll();
                if (
                    this.userService.playMode === 'soloGame' &&
                    this.remainingLetters === 0 &&
                    (this.userService.realUser.easel.getEaselSize() === 0 || this.virtualPlayerService.easel.getEaselSize() === 0)
                ) {
                    if (this.userService.realUser.easel.getEaselSize() === 0) {
                        this.userService.realUser.score += this.virtualPlayerService.easel.pointInEasel();
                    } else {
                        this.userService.vrUser.score += this.userService.realUser.easel.pointInEasel();
                    }

                    this.userService.endOfGame = true;
                    this.dialogRef.open(ShowEndgameInfoComponent);
                }
            }, 0);
        });
    }
    ngOnDestroy(): void {
        this.numberOfLetterSubscription.unsubscribe();
        this.turnToPlaySubscription.unsubscribe();
    }
}
