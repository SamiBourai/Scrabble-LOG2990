import { MINUTE_TURN, ONE_SECOND, ONE_SECOND_MS } from '@app/classes/constants';
import { Subject } from 'rxjs';
export class Timer {
    timeUser: { min: number; sec: number } = { min: 0, sec: MINUTE_TURN };
    timerObs: Subject<{ min: number; sec: number }> = new Subject<{ min: number; sec: number }>();
    creatorTurn: boolean;
    playerPlayed: boolean = false;
    constructor() {
        this.timerObs.subscribe((timer) => {
            this.timeUser = timer;
        });
        this.startTime();
    }
    startTime() {
        setInterval(() => {
            if (this.timeUser.sec === 0 || this.playerPlayed) {
                this.timeUser.sec = MINUTE_TURN;
                this.playerPlayed = false;
                if (this.creatorTurn) this.creatorTurn = false;
                else this.creatorTurn = true;
            } else this.timeUser.sec -= ONE_SECOND;
            this.timerObs.next(this.timeUser);
        }, ONE_SECOND_MS);
    }
}
