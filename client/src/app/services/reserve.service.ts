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
    _size: number = 0;
    sizeObs= new BehaviorSubject(this._size);


    constructor() {
        for (let i = 0; i < 9; i++) {
            this.letters.push(A);
            this._size++;
        }

        for (let i = 0; i < 2; i++) {
            this.letters.push(B);
            this.letters.push(C);
            this.letters.push(F);
            this.letters.push(G);
            this.letters.push(H);
            this.letters.push(P);
            this.letters.push(V);
            this._size += 7;
        }
        for (let i = 0; i < 3; i++) {
            this.letters.push(D);
            this.letters.push(M);
            this._size += 2;
        }
        for (let i = 0; i < 15; i++) {
            this.letters.push(E);
            this._size++;
        }
        for (let i = 0; i < 8; i++) {
            this.letters.push(I);
            this._size++;
        }
        for (let i = 0; i < 5; i++) {
            this.letters.push(L);
            this._size++;
        }
        for (let i = 0; i < 6; i++) {
            this.letters.push(N);
            this.letters.push(O);
            this.letters.push(R);
            this.letters.push(S);
            this.letters.push(T);
            this.letters.push(U);
            this._size += 6;
        }
        for (let i = 0; i < 15; i++) {
            this.letters.push(E);
            this._size++;
        }

        this.letters.push(J);
        this.letters.push(K);
        this.letters.push(Q);
        this.letters.push(W);
        this.letters.push(X);
        this.letters.push(Y);
        this.letters.push(Z);
        this._size += 7;
    }

    getRandomLetter(): Letter {
        this.random = Math.floor(Math.random() * this.letters.length);
        while (this.letters[this.random] == null) this.random = Math.floor(Math.random() * this.letters.length);
        this.save = this.letters[this.random];

        delete this.letters[this.random];

        this._size--;
        console.log("cout ligne 79 "+this._size);
        this.sizeObs.next(this._size);
        return this.save;
    }

    get size(): BehaviorSubject<number> {
        console.log("size "+ this._size);

        return this.sizeObs;
    }

    reFillReserve(lett: Letter): boolean {
        for (let i = 0; i < this.letters.length; i++) {
            if (this.letters[i] == null) {
                this.letters[i] = lett;
                console.log(this.letters[i]);
                return true;
            }
        }
        return false;
    }
}
