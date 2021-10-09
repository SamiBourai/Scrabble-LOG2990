import { Component, OnDestroy, OnInit } from '@angular/core';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND } from '@app/constants/constants';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit, OnDestroy {
    isVrPlayerTurn: boolean;
    private turnToSubscription: Subscription;

    // vrScore: number = 0;
    constructor(public userService: UserService, public virtualPlayerService: VirtualPlayerService) {}

    ngOnInit(): void {
        this.getTurnToPlayReponse();
        if (!this.isVrPlayerTurn || this.userService.userSkipingTurn) {
            this.manageVrPlayerTime();
        }

        // this.virtualPlayerService.scoreVr.subscribe((res) => {
        //     setTimeout(() => {

        //         this.userService.vrUser.score += res;
        //     }, 1000);
        // });
    }

    manageVrPlayerTime() {
        console.log('virtual player is playing now');
        //this.userService.resetCounter(0, 20);
        const intervalId1 =setInterval(() => {
            this.virtualPlayerService.manageVrPlayerActions();
            clearInterval(intervalId1);
        }, this.userService.counter.sec);

        const intervalId2 = setInterval(() => {
            if (this.virtualPlayerService.played) {
                console.log('vr has played');
                this.userService.realUser.turnToPlay = true;
                this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                this.userService.counter.sec=59;
                clearInterval(intervalId2);
                return;
            }

            if (this.userService.counter.sec - ONE_MINUTE === -ONE_MINUTE) {
                this.userService.counter.min -= ONE_MINUTE;
                this.userService.counter.sec = MINUTE_TURN;
            } else this.userService.counter.sec -= ONE_MINUTE;

            if (this.userService.counter.min === 0 && this.userService.counter.sec === 0) {
                this.userService.realUser.turnToPlay = true;
                this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                clearInterval(intervalId2);
            }
        }, ONE_SECOND);
    }
        
    getTurnToPlayReponse() {
        this.turnToSubscription = this.userService.turnToPlayObs.subscribe((response) => {
            setInterval(() => {
                if (response === false) this.isVrPlayerTurn = false;
                else this.isVrPlayerTurn = true;
            }, 1000);
        });
    }
    ngOnDestroy(): void {
        this.turnToSubscription.unsubscribe();
    }
}
