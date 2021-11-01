import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CANEVAS_WIDTH } from '@app/constants/constants';
import { ModalEndOfGameComponent } from '@app/modal-end-of-game/modal-end-of-game.component';
import { GridService } from '@app/services/grid.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit, AfterViewInit {
    remainingLetters: number = 0;
    soloMode: boolean = false;
    playersInGamePage: boolean = false;
    constructor(
        public userService: UserService,
        private reserverService: ReserveService,
        private dialogRef: MatDialog,
        public virtualPlayerService: VirtualPlayerService,
        private socketManagementService: SocketManagementService,
        private multiplayerModeService: MultiplayerModeService,
        private mouseHandlingService: MouseHandelingService,
        private gridService: GridService,
    ) {}
    detectSkipTurnBtn() {
        this.userService.userSkipingTurn = true;
    }
    ngOnInit() {
        this.getLetter();
        switch (this.userService.playMode) {
            case 'createMultiplayerGame':
                this.multiplayerModeService.beginGame();
                break;
            case 'joinMultiplayerGame':
                this.socketManagementService.emit('guestInGamePage', undefined, this.userService.gameName);
                this.multiplayerModeService.beginGame();
                break;
        }
        this.isUserEaselEmpty();
    }
    ngAfterViewInit() {
        this.openDialog();
    }
    openDialog() {
        this.userService.isEndOfGame.subscribe((response) => {
            if (response) {
                this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
            }
        });
    }
    getLetter() {
        this.reserverService.size.subscribe((res) => {
            setTimeout(() => {
                this.remainingLetters = res;
            }, 0);
        });
    }

    isUserEaselEmpty() {
        this.userService.turnToPlayObs.subscribe(() => {
            setTimeout(() => {
                this.mouseHandlingService.previousClick = { x: -1, y: -1 };
                this.mouseHandlingService.resetSteps();
                this.mouseHandlingService.cancelByClick();
                this.gridService.easelContext.clearRect(0, 0, CANEVAS_WIDTH, CANEVAS_WIDTH);
                if (
                    this.remainingLetters === 0 &&
                    (this.userService.realUser.easel.getEaselSize() === 0 || this.virtualPlayerService.easel.getEaselSize() === 0)
                ) {
                    if (this.userService.realUser.easel.getEaselSize() === 0) {
                        this.userService.realUser.score += this.virtualPlayerService.easel.pointInEasel();
                    } else {
                        this.userService.vrUser.score += this.userService.realUser.easel.pointInEasel();
                    }
                    this.userService.endOfGame = true;
                    this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
                }
            }, 0);
        });
    }
}
