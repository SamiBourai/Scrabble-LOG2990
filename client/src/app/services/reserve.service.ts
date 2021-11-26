import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { LETTERS_RESERVE_QTY, NOT_A_LETTER, RESERVE_SIZE } from '@app/constants/constants';
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
        const save: Letter = this.getRandomKey(this.letters);
        const qty: number = (this.letters.get(save) ?? 0) - 1;
        this.letters.set(save, qty);
        this.reserveSize--;
        this.sizeObs.next(this.reserveSize);
        return save;
    }
    getRandomKey(map: Map<Letter, number>): Letter {
        const keys = Array.from(map.keys());
        const random = Math.floor(Math.random() * this.reserveSize);
        let counter = 0;
        for (const key of keys) {
            for (let i = 0; i < (map.get(key) ?? 0); i++) {
                counter++;
                if (counter === random) return key;
            }
        }

        return NOT_A_LETTER;
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        this.letters.forEach((value, key) => {
            if (JSON.stringify(key) === JSON.stringify(lett)) {
                value++;
                this.letters.set(key, value);
            }
        });
        this.reserveSize++;
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty(): boolean {
        return this.reserveSize === 0;
    }
    redefineReserve(map: string, size: number) {
        this.letters = new Map<Letter, number>(JSON.parse(map));
        this.reserveSize = size;
        this.sizeObs.next(this.reserveSize);
    }
}
