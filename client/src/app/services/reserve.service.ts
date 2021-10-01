import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    letters = new Array<Letter>();
    random: number;
    save: Letter;
    reserveSize: number = 0;
    sizeObs = new BehaviorSubject(this.reserveSize);

    constructor() {
        for (let i = 0; i < 9; i++) {
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
        for (let i = 0; i < 15; i++) {
            this.letters.push(E);
            this.reserveSize++;
        }
        for (let i = 0; i < 8; i++) {
            this.letters.push(I);
            this.reserveSize++;
        }
        for (let i = 0; i < 5; i++) {
            this.letters.push(L);
            this.reserveSize++;
        }
        for (let i = 0; i < 6; i++) {
            this.letters.push(N);
            this.letters.push(O);
            this.letters.push(R);
            this.letters.push(S);
            this.letters.push(T);
            this.letters.push(U);
            this.reserveSize += 6;
        }
        for (let i = 0; i < 15; i++) {
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
    }

    getRandomLetter(): Letter {
        this.random = Math.floor(Math.random() * this.letters.length);
        this.random = Math.floor(Math.random() * this.letters.length);
        this.save = this.letters[this.random];

        this.letters.splice(this.random, 1);
        this.reserveSize--;

        this.sizeObs.next(this.reserveSize);
        return this.save;
    }

    get size(): BehaviorSubject<number> {
        return this.sizeObs;
    }

    reFillReserve(lett: Letter) {
        this.letters.push(lett);
        this.reserveSize++;
        this.sizeObs.next(this.reserveSize);
    }

    isReserveEmpty() {
        return this.reserveSize == 0;
    }
}
