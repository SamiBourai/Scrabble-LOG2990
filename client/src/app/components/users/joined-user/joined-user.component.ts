import { Component, OnInit } from '@angular/core';
import { MessageService } from '@app/services/message.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ReserveService } from '@app/services/reserve.service';
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
        private reserveService: ReserveService,
    ) {}
    ngOnInit() {
        this.timeService.startMultiplayerTimer();
        this.userService.commandtoSendObs.subscribe(() => {
            this.mutltiplayerModeService.play('guestUserPlayed', true);
        });
        this.userService.playedObs.subscribe(() => {
            this.mutltiplayerModeService.play('guestUserPlayed', false);
        });
        this.messageService.textMessageObs.subscribe(() => {
            this.mutltiplayerModeService.sendMessage('sendMessage');
        });
        this.reserveService.size.subscribe(() => {
            this.mutltiplayerModeService.sendReserve();
        });

        this.mutltiplayerModeService.getPlayedCommand('creatorPlayed');
        this.mutltiplayerModeService.getMessageSend('getMessage');
        this.mutltiplayerModeService.updateReserve();
    }
}
