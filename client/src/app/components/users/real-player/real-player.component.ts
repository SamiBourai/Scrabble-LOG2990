/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEndOfGameComponent } from '@app/modal-end-of-game/modal-end-of-game.component';
import { MessageService } from '@app/services/message.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ReserveService } from '@app/services/reserve.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {
    constructor(
        public userService: UserService,
        public timeService: TimeService,
        private mutltiplayerModeService: MultiplayerModeService,
        private messageService: MessageService,
        private reserveService: ReserveService,
        private dialogRef: MatDialog,
    ) {}
    ngOnInit() {
        if (this.userService.playMode === 'soloGame') {
            this.userService.turnToPlayObs.subscribe(() => {
                if (this.userService.realUser.turnToPlay && !this.userService.endOfGame && this.userService.playMode === 'soloGame')
                    this.timeService.startTime('user');
            });
        }
        if (this.userService.playMode === 'createMultiplayerGame') {
            this.userService.commandtoSendObs.subscribe(() => {
                this.mutltiplayerModeService.play('creatorPlayed', true);
            });
            this.userService.playedObs.subscribe(() => {
                this.mutltiplayerModeService.play('creatorPlayed', false);
            });
            this.messageService.textMessageObs.subscribe(() => {
                this.mutltiplayerModeService.sendMessage('sendMessage');
            });
            this.reserveService.reserveObs.subscribe(() => {
                this.mutltiplayerModeService.sendReserve();
                this.reserveService.reserveChanged = false;
            });
        }
        this.mutltiplayerModeService.getPlayedCommand('guestUserPlayed');
        this.mutltiplayerModeService.getMessageSend('getMessage');
        this.mutltiplayerModeService.updateReserve();
        this.mutltiplayerModeService.playersLeftGamge();
        this.mutltiplayerModeService.winnerObs.subscribe((response) => {
            if (response) this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
        });
    }
}
