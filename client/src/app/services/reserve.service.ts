import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { LETTERS_RESERVE_QTY } from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    reserveSize: number = 0;
    reserveChanged: boolean = false;
    reserveObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    sizeObs = new BehaviorSubject(0);
    letters = new Map<Letter, number>(LETTERS_RESERVE_QTY);

    constructor() {
        this.reserveSize = 100;
        this.sizeObs.next(this.reserveSize);
    }

    getRandomLetter(): Letter {
        const save = this.getRandomKey(this.letters);
        let qty = this.letters.get(save) as number;
        this.letters.set(save, --qty);
        this.reserveSize--;
        this.sizeObs.next(this.reserveSize);
        return save;
    }
    getRandomKey(map: Map<Letter, number>) {
        const keys = Array.from(map.keys());
        return keys[Math.floor(Math.random() * keys.length)];
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        let qty = this.letters.get(lett) as number;
        this.letters.set(lett, ++qty);
        this.reserveSize++;
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty(): boolean {
        return this.reserveSize === 0;
    }
    redefineReserve(letters: Map<Letter, number>, size: number) {
        this.letters = letters;
        this.reserveSize = size;
        this.sizeObs.next(this.reserveSize);
    }
}
