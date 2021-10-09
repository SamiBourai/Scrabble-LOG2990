import { Component, OnDestroy, OnInit } from '@angular/core';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND } from '@app/constants/constants';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit, OnDestroy {
    isTurnOfUser: boolean;
    private turnToSubscription: Subscription;



    constructor(public userService: UserService, readonly easelLogisticService: EaselLogiscticsService, public timeService:TimeService) {}

    ngOnInit() {
        this.timeService.setTimeData({min:0,sec:59})
        this.timeService.startTime();
        // this.getTurnToPlayReponse();
        // if (this.isTurnOfUser || this.userService.vrSkipingTurn) this.manageUserTime();
    }

    manageUserTime() {
        console.log('real player is playing now');
        const intervalId = setInterval(() => {
            if (this.userService.counter.sec - ONE_MINUTE === -ONE_MINUTE) {
                this.userService.counter.min -= ONE_MINUTE;
                this.userService.counter.sec = MINUTE_TURN;
            } else this.userService.counter.sec -= ONE_MINUTE;

            if (this.userService.counter.min === 0 && this.userService.counter.sec === 0) {
                console.log('rentrer false');
                this.userService.realUser.turnToPlay = false;
                this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                clearInterval(intervalId);
            }
        }, ONE_SECOND);
    }
    getTurnToPlayReponse() {
        this.turnToSubscription= this.userService.turnToPlayObs.subscribe((response) => {
            setInterval(() => {
                if (response === true) this.isTurnOfUser === true;
                else this.isTurnOfUser === false;
            },1000);
        });
    }
    ngOnDestroy(): void {
        this.turnToSubscription.unsubscribe();
    }
}
