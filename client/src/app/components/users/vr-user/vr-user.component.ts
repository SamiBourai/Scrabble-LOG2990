import { Component, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
// import { Subscription } from 'rxjs';
@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit {
    hasPlayed: boolean;

    constructor(public userService: UserService, public virtualPlayerService: VirtualPlayerService, public timeService: TimeService) {}

    ngOnInit() {
        this.setVrTurnToPlay();
        this.getScoreVrPlayer();
        console.log('syu8iunla')
    }

    getScoreVrPlayer() {
        this.virtualPlayerService.scoreVr.subscribe((score) => {
            this.userService.vrUser.score += score;
        });
    }

    setVrTurnToPlay() {
        this.userService.turnToPlayObs.subscribe(() => {
            if (!this.userService.realUser.turnToPlay && !this.userService.endOfGame) {
                this.timeService.startTime('vrPlayer');
                this.virtualPlayerService.manageVrPlayerActions();
            }
        });
    }
}
