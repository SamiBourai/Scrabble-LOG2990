import { Component, OnDestroy, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit, OnDestroy {
    hasPlayed: boolean = false;
    private scoreSubscription = new Subscription();
    private turnToPlaySubscription = new Subscription();

    constructor(public userService: UserService, public virtualPlayerService: VirtualPlayerService, public timeService: TimeService) {}

    ngOnInit() {
        this.setVrTurnToPlay();
        this.getScoreVrPlayer();
    }

    getScoreVrPlayer() {
        this.virtualPlayerService.vrScoreObs.subscribe((score) => {
            this.userService.vrUser.score += score;
        });
    }

    setVrTurnToPlay() {
        this.turnToPlaySubscription = this.userService.realUserTurnObs.subscribe(() => {
            if (!this.userService.isPlayerTurn() && !this.userService.endOfGame) {
                this.timeService.timeUser = { min: this.timeService.timeSave.min, sec: this.timeService.timeSave.sec };
                this.timeService.startTime('vrPlayer');
                this.virtualPlayerService.manageVrPlayerActions();
            }
        });
    }

    ngOnDestroy(): void {
        this.scoreSubscription.unsubscribe();
        this.turnToPlaySubscription.unsubscribe();
    }
}
