/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND, ONE_SECOND_MS } from '@app/constants/constants';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';
import { VirtualPlayerService } from './virtual-player.service';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    timeUser: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timeVrPlayer: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timeGuestPlayer: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timeStarted: boolean = false;
    constructor(
        private userService: UserService,
        private virtualPlayerService: VirtualPlayerService,
        private socketManagementService: SocketManagementService,
    ) {}
    startTime(playerTurn: string) {
        switch (playerTurn) {
            case 'user': {
                const intervalId = setInterval(() => {
                    if (this.timeUser.sec === 0) {
                        this.timeUser.min -= ONE_MINUTE;
                        this.timeUser.sec = MINUTE_TURN;
                    } else this.timeUser.sec -= ONE_SECOND;

                    if (this.timeUser.min === 0 && this.timeUser.sec === 0) {
                        this.userService.detectSkipTurnBtn();
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    } else if (!this.userService.realUser.turnToPlay) {
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    }
                    console.log('shui dans le timer ');
                }, ONE_SECOND_MS);
                break;
            }
            case 'vrPlayer': {
                const intervalId = setInterval(() => {
                    if (this.timeVrPlayer.sec === 0) {
                        this.timeVrPlayer.min -= ONE_MINUTE;
                        this.timeVrPlayer.sec = MINUTE_TURN;
                    } else this.timeVrPlayer.sec -= ONE_SECOND;
                    if ((this.timeVrPlayer.min === 0 && this.timeVrPlayer.sec === 0) || this.virtualPlayerService.played) {
                        if (this.virtualPlayerService.skipTurn) {
                            this.userService.checkForSixthSkip();
                            this.virtualPlayerService.skipTurn = false;
                        } else {
                            this.userService.endOfGameCounter = 0;
                        }
                        this.userService.realUser.turnToPlay = true;
                        this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                        this.timeVrPlayer = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    }
                }, ONE_SECOND_MS);
                break;
            }
        }
    }
    startMultiplayerTimer() {
        console.log(this.userService.joinedUser.guestPlayer,'userjoiner guestPlayer')
        if (this.userService.joinedUser.guestPlayer && !this.timeStarted) {
            console.log('je suis dans start game');
            this.socketManagementService.emit('startTimer', undefined, this.userService.gameName);
            this.timeStarted = true;
        }
        this.socketManagementService.listen('updateTime').subscribe((timer) => {
            const time: any = timer;
            console.log(timer); 
            if (time.creatorTurn) {
                this.timeUser = { min: time.min, sec: time.sec };
                this.timeGuestPlayer = { min: 0, sec: MINUTE_TURN };
                this.userService.realUser.turnToPlay = true;
            } else {
                this.timeGuestPlayer = { min: time.min, sec: time.sec };
                this.timeUser = { min: 0, sec: MINUTE_TURN };
                this.userService.realUser.turnToPlay = false;
            }
        });
    }
}
