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
    Z,
} from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    letters = new Array<Letter>();
    random: number;
    save: Letter;
    reserveSize: number = 0;

    sizeObs = new BehaviorSubject(0);
    lettersReserveQty = new Map<Letter, number>();
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

        for (let i = 0; i < NB_TILES; i++) {
            this.letters.push(E);
            this.reserveSize++;
        }

        for (let i = 0; i < INDEX_2WORD; i++) {
            this.letters.push(L);
            this.reserveSize++;
        }

        this.lettersReserveQty.set(A, SWAP_LENGTH);
        this.lettersReserveQty.set(B, 2);
        this.lettersReserveQty.set(C, 2);
        this.lettersReserveQty.set(D, 3);
        this.lettersReserveQty.set(E, NB_TILES);
        this.lettersReserveQty.set(F, 2);
        this.lettersReserveQty.set(G, 2);
        this.lettersReserveQty.set(H, 2);
        this.lettersReserveQty.set(I, MIN_SWAP_LENGTH);
        this.lettersReserveQty.set(J, 1);
        this.lettersReserveQty.set(K, 1);
        this.lettersReserveQty.set(L, INDEX_2WORD);
        this.lettersReserveQty.set(M, 3);
        this.lettersReserveQty.set(N, SIX);
        this.lettersReserveQty.set(O, SIX);
        this.lettersReserveQty.set(P, 2);
        this.lettersReserveQty.set(Q, 1);
        this.lettersReserveQty.set(R, SIX);
        this.lettersReserveQty.set(S, SIX);
        this.lettersReserveQty.set(T, SIX);
        this.lettersReserveQty.set(U, SIX);
        this.lettersReserveQty.set(V, 2);
        this.lettersReserveQty.set(W, 1);
        this.lettersReserveQty.set(X, 1);
        this.lettersReserveQty.set(Y, 1);
        this.lettersReserveQty.set(Z, 1);
        this.sizeObs.next(this.reserveSize);
    }

    getRandomLetter(): Letter {
        this.random = Math.floor(Math.random() * this.letters.length);
        this.save = this.letters[this.random];

        this.letters.splice(this.random, 1);
        this.reserveSize--;

        // [A, 2]
        let qty = this.lettersReserveQty.get(this.save) as number;
        this.lettersReserveQty.set(this.save, --qty);

        this.sizeObs.next(this.reserveSize);
        return this.save;
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        this.letters.push(lett);
        this.reserveSize++;
        let qty = this.lettersReserveQty.get(lett) as number;
        this.lettersReserveQty.set(lett, ++qty);
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty(): boolean {
        return this.reserveSize === 0;
    }
}
