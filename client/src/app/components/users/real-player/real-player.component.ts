import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEndOfGameComponent } from '@app/components/modals/modal-end-of-game/modal-end-of-game.component';
import { MessageService } from '@app/services/message.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
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
        private dialogRef: MatDialog,
    ) {}
    ngOnInit() {
        this.userService.realUserTurnObs.subscribe(() => {
            if (this.isTimeStartableSoloMode()) this.timeService.startTime('user');
        });

        if (this.userService.playMode === 'createMultiplayerGame') {
            this.mutltiplayerModeService.updateReserve();
            this.userService.commandtoSendObs.subscribe(() => {
                this.mutltiplayerModeService.play('creatorPlayed', true);
            });
            this.userService.playedObs.subscribe(() => {
                this.mutltiplayerModeService.play('creatorPlayed', false);
            });
            this.messageService.textMessageObs.subscribe(() => {
                this.mutltiplayerModeService.sendMessage('sendMessage');
            });
            this.mutltiplayerModeService.updateReserveChangeLetters('guestUserExchanged');
            this.mutltiplayerModeService.getPlayedCommand('guestUserPlayed');
            this.mutltiplayerModeService.getMessageSend('getMessage');
            this.mutltiplayerModeService.playersLeftGamge();
            this.mutltiplayerModeService.playerLeftObs.subscribe((response) => {
                if (response !== '' && !this.userService.endOfGame) {
                    this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
                }
            });
            this.mutltiplayerModeService.endOfGame();
        }
    }
    isTimeStartableSoloMode(): boolean {
        return this.userService.isPlayerTurn() && !this.userService.endOfGame && this.userService.playMode === 'soloGame';
    }
}
