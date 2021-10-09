import { Injectable } from '@angular/core';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND } from '@app/constants/constants';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    time: { min: number; sec: number }={min:0,sec:0};
    timeObs:BehaviorSubject<{min:number;sec:number}>=new BehaviorSubject<{min:number;sec:number}>(this.time);
    constructor() {}

    get getTimeDataObs():BehaviorSubject<{min:number;sec:number}> {
        return this.timeObs;
    }
    get getTimeData():{min:number;sec:number} {
        return this.time;
    }
    setTimeData(time:{min:number;sec:number}) {
        this.time=time;
        this.timeObs.next(this.time)
    }

    startTime() {
        let intervalId;
        clearInterval(intervalId);
        intervalId = setInterval(() => {
            if (this.time.sec - ONE_MINUTE === -ONE_MINUTE) {
                this.time.min -= ONE_MINUTE;
                this.time.sec = MINUTE_TURN;
            } else this.time.sec -= ONE_MINUTE;
            this.timeObs.next(this.time);

            if (this.time.min === 0 && this.time.sec === 0) {
                this.timeObs.next(this.time);
                this.time={min:0,sec:MINUTE_TURN};
                this.timeObs.next(this.time);
            }
        }, ONE_SECOND);

    }

    startGame(){


    }
}
