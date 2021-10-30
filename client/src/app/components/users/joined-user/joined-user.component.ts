/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-joined-user',
    templateUrl: './joined-user.component.html',
    styleUrls: ['./joined-user.component.scss'],
})
export class JoinedUserComponent implements OnInit {
    constructor(public userService: UserService, public timeService: TimeService, private mutltiplayerModeService: MultiplayerModeService) {}

    ngOnInit() {
        this.timeService.startMultiplayerTimer();
        this.userService.turnToPlayObs.subscribe(() => {
            if (this.userService.joinedUser.guestPlayer) this.mutltiplayerModeService.play('guestUserPlayed');
        });
        this.mutltiplayerModeService.getPlayedCommand('creatorPlayed');
    }
}
