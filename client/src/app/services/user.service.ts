import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    counter: { min: number; sec: number };
    constructor() {}

    startTimer() {
        this.counter = { min: 1, sec: 0 }; // choose whatever you want
        const intervalId = setInterval(() => {
            if (this.counter.sec - 1 == -1) {
                this.counter.min -= 1;
                this.counter.sec = 59;
            } else this.counter.sec -= 1;
            if (this.counter.min === 0 && this.counter.sec == 0) clearInterval(intervalId);
        }, 1000);
    }
}
