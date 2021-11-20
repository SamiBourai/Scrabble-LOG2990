import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalEndOfGameComponent } from '@app/components/modals/modal-end-of-game/modal-end-of-game.component';
import { MessageService } from '@app/services/message.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-joined-user',
    templateUrl: './joined-user.component.html',
    styleUrls: ['./joined-user.component.scss'],
})
export class JoinedUserComponent implements OnInit {
    constructor(
        public userService: UserService,
        public timeService: TimeService,
        private mutltiplayerModeService: MultiplayerModeService,
        private messageService: MessageService,

        private dialogRef: MatDialog,
    ) {}
    ngOnInit() {
        this.timeService.startMultiplayerTimer();
        if (this.userService.playMode === 'joinMultiplayerGame') {
            this.userService.commandtoSendObs.subscribe(() => {
                this.mutltiplayerModeService.play('guestUserPlayed', true);
            });
            this.userService.playedObs.subscribe(() => {
                this.mutltiplayerModeService.play('guestUserPlayed', false);
            });
            this.messageService.textMessageObs.subscribe(() => {
                this.mutltiplayerModeService.sendMessage('sendMessage');
            });
            this.mutltiplayerModeService.getPlayedCommand('creatorPlayed');
            this.mutltiplayerModeService.getMessageSend('getMessage');

            this.mutltiplayerModeService.playersLeftGamge();
            this.mutltiplayerModeService.winnerObs.subscribe((response) => {
                if (response && this.userService.playMode === 'joinMultiplayerGame') {
                    this.dialogRef.open(ModalEndOfGameComponent, { disableClose: true });
                }
            });
        }
    }
}
