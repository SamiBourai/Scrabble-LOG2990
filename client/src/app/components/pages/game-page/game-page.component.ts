import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EaselObject } from '@app/classes/easel-object';
import { ShowEndgameInfoComponent } from '@app/components/modals/show-endgame-info/show-endgame-info.component';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit, AfterViewInit, OnDestroy {
    remainingLetters: number = 0;
    soloMode: boolean = true;
    playersInGamePage: boolean = false;
    event: unknown;
    private numberOfLetterSubscription: Subscription;
    private endOfGameSubscription: Subscription;
    private turnToPlaySubscription: Subscription;
    constructor(
        public userService: UserService,
        private reserverService: ReserveService,
        private dialogRef: MatDialog,
        public virtualPlayerService: VirtualPlayerService,
        private socketManagementService: SocketManagementService,
        private multiplayerModeService: MultiplayerModeService,
        public mouseHandlingService: MouseHandelingService,
    ) {}
    detectSkipTurnBtn() {
        this.userService.userSkipingTurn = true;
    }
    ngOnInit() {
        this.getLetter();
        window.addEventListener('beforeunload', (event) => {
            event.stopPropagation();
        });
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
            case 'soloGame':
                this.soloMode = true;
                break;
            case 'createMultiplayerGame':
                this.soloMode = false;
                this.userService.joinedUser.easel = new EaselObject(false);
                this.multiplayerModeService.beginGame();
                break;
            case 'joinMultiplayerGame':
                this.soloMode = false;
                this.socketManagementService.emit('guestInGamePage', { gameName: this.userService.gameName });
                this.multiplayerModeService.beginGame();
                break;
        }
        this.isUserEaselEmpty();
    }
    ngAfterViewInit() {
        this.openDialog();
    }
    openDialog() {
        this.userService.endOfGameBehaviorSubject.subscribe((response) => {
            if (response) {
                this.dialogRef.open(ShowEndgameInfoComponent);
            }
        });
    }
    getLetter() {
        this.numberOfLetterSubscription = this.reserverService.size.subscribe((res) => {
            setTimeout(() => {
                this.remainingLetters = res;
            }, 0);
        });
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
                    this.userService.endOfGameBehaviorSubject.next(this.userService.endOfGame );
                }
            }, 0);
        });
    }
    ngOnDestroy(): void {
        this.numberOfLetterSubscription.unsubscribe();
        this.endOfGameSubscription.unsubscribe();
        this.turnToPlaySubscription.unsubscribe();
    }
}
