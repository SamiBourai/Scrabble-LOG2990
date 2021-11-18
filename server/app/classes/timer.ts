import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND, ONE_SECOND_MS } from '@app/classes/constants';
import { Subject } from 'rxjs';
export class Timer {
    timeUser: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timerConfig: { min: number; sec: number };
    timerObs: Subject<{ min: number; sec: number }> = new Subject<{ min: number; sec: number }>();
    creatorTurn: boolean;
    playerPlayed: boolean = false;
    stopTimer: boolean = false;
    constructor() {
        this.timerObs.subscribe((timer) => {
            this.timeUser = timer;
        });
        this.startTime();
    }
    startTime() {
        const intervalId = setInterval(() => {
            if (this.timeUser.sec - ONE_SECOND === -ONE_SECOND) {
                this.timeUser.min -= ONE_MINUTE;
                this.timeUser.sec = MINUTE_TURN;
            } else this.timeUser.sec -= ONE_SECOND;
            if (this.playerPlayed) {
                this.timeUser = { min: this.timerConfig.min, sec: this.timerConfig.sec };
                this.playerPlayed = false;
                if (this.creatorTurn) this.creatorTurn = false;
                else this.creatorTurn = true;
            }
            if (this.stopTimer) {
                clearInterval(intervalId);
                console.log('timerstop');
            } else this.timerObs.next(this.timeUser);
        }, ONE_SECOND_MS);
    }
}
