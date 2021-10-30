/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {
    constructor(public userService: UserService, public timeService: TimeService, private mutltiplayerModeService: MultiplayerModeService) {}
    ngOnInit() {
        this.userService.turnToPlayObs.subscribe(() => {
            if (this.userService.realUser.turnToPlay && !this.userService.endOfGame && this.userService.playMode === 'soloGame')
                this.timeService.startTime('user');
            if (this.userService.playMode === 'createMultiplayerGame') this.mutltiplayerModeService.play('creatorPlayed');
        });
        this.mutltiplayerModeService.getPlayedCommand('guestUserPlayed');
    }
}
