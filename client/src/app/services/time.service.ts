import { Injectable } from '@angular/core';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND, ONE_SECOND_MS } from '@app/constants/constants';
import { UserService } from './user.service';
import { VirtualPlayerService } from './virtual-player.service';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    timeUser: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timeVrPlayer: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    constructor(private userService: UserService, private virtualPlayerService: VirtualPlayerService) {}
    // timeObs: BehaviorSubject<{ min: number; sec: number }> = new BehaviorSubject<{ min: number; sec: number }>(this.time);
    // here we disable the any eslint error, because there"s not type Timeout in typscript.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    // get getTimeDataObs(): BehaviorSubject<{ min: number; sec: number }> {
    //     return this.timeObs;
    // }
    // get getTimeData(): { min: number; sec: number } {
    //     return this.time;
    // }
    // setTimeData(time: { min: number; sec: number }) {
    //     this.time = time;
    //     this.timeObs.next(this.time);
    // }
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
                        this.userService.realUser.turnToPlay = false;
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                        clearInterval(intervalId);
                    } else if (!this.userService.realUser.turnToPlay) {
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    }
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
}
