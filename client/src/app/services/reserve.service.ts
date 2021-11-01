import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import {
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    INDEX_2WORD,
    J,
    K,
    L,
    LETTERS_RESERVE_QTY,
    M,
    MIN_SWAP_LENGTH,
    N,
    NB_TILES,
    O,
    P,
    Q,
    R,
    S,
    SIX,
    SWAP_LENGTH,
    T,
    U,
    V,
    W,
    X,
    Y,
    Z
} from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    letters = new Array<Letter>();
    reserveSize: number = 0;

    sizeObs = new BehaviorSubject(0);

    constructor() {
        for (let i = 0; i < SWAP_LENGTH; i++) {
            this.letters.push(A);
            this.reserveSize++;
        }

        for (let i = 0; i < 2; i++) {
            this.letters.push(B);
            this.letters.push(C);
            this.letters.push(F);
            this.letters.push(G);
            this.letters.push(H);
            this.letters.push(P);
            this.letters.push(V);
            this.reserveSize += 7;
        }

        for (let i = 0; i < 3; i++) {
            this.letters.push(D);
            this.letters.push(M);
            this.reserveSize += 2;
        }

        for (let i = 0; i < MIN_SWAP_LENGTH; i++) {
            this.letters.push(I);
            this.reserveSize++;
        }

        for (let i = 0; i < SIX; i++) {
            this.letters.push(N);
            this.letters.push(O);
            this.letters.push(R);
            this.letters.push(S);
            this.letters.push(T);
            this.letters.push(U);
            this.reserveSize += 6;
        }

        for (let i = 0; i < NB_TILES; i++) {
            this.letters.push(E);
            this.reserveSize++;
        }
        this.letters.push(J);
        this.letters.push(K);
        this.letters.push(Q);
        this.letters.push(W);
        this.letters.push(X);
        this.letters.push(Y);
        this.letters.push(Z);
        this.reserveSize += 7;

        for (let i = 0; i < INDEX_2WORD; i++) {
            this.letters.push(L);
            this.reserveSize++;
        }

        this.sizeObs.next(this.reserveSize);
    }

    getRandomLetter(): Letter {
        const random = Math.floor(Math.random() * this.letters.length);
        const save = this.letters[random];
        let qty = LETTERS_RESERVE_QTY.get(save) as number;
        LETTERS_RESERVE_QTY.set(save, --qty);
        this.letters.splice(random, 1);
        this.reserveSize--;
        this.sizeObs.next(this.reserveSize);
        return save;
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        this.letters.push(lett);
        this.reserveSize++;
        let qty = LETTERS_RESERVE_QTY.get(lett) as number;
        LETTERS_RESERVE_QTY.set(lett, ++qty);
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty(): boolean {
        return this.reserveSize === 0;
    }
}
