import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { LETTERS_RESERVE_QTY, RESERVE_SIZE } from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    reserveSize: number = 0;

    sizeObs = new BehaviorSubject(0);
    letters = new Map<Letter, number>(LETTERS_RESERVE_QTY);

    constructor() {
        this.reserveSize = RESERVE_SIZE;
        this.sizeObs.next(this.reserveSize);
    }

    getRandomLetter(): Letter {
        const save = this.getRandomKey(this.letters);
        const qty = (this.letters.get(save) as number) - 1;
        this.letters.set(save, qty);
        this.reserveSize--;
        this.sizeObs.next(this.reserveSize);
        return save;
    }
    getRandomKey(map: Map<Letter, number>) {
        const keys = Array.from(map.keys());
        let random = keys[Math.floor(Math.random() * keys.length)];
        while ((this.letters.get(random) as number) === 0) {
            random = keys[Math.floor(Math.random() * keys.length)];
        }
        return random;
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        const qty = (this.letters.get(lett) as number) + 1;
        this.letters.set(lett, qty);
        this.reserveSize++;
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty(): boolean {
        return this.reserveSize === 0;
    }
    redefineReserve(map: string, size: number) {
        this.letters = new Map(JSON.parse(map));

        this.reserveSize = size;

        this.sizeObs.next(this.reserveSize);
    }
}
