import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { J, W, X } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ReserveService {
    letters = new Array<Letter>();
    random: number;
    save: Letter;

    constructor() {
        // for (let i = 0; i < 9; i++) {
        //     this.letters.push(A);
        // }

        // for (let i = 0; i < 2; i++) {
        //     this.letters.push(B);
        //     this.letters.push(C);
        //     this.letters.push(F);
        //     this.letters.push(G);
        //     this.letters.push(H);
        //     this.letters.push(P);
        //     this.letters.push(V);
        // }
        // for (let i = 0; i < 3; i++) {
        //     this.letters.push(D);
        //     this.letters.push(M);
        // }
        // for (let i = 0; i < 15; i++) {
        //     this.letters.push(E);
        // }
        // for (let i = 0; i < 8; i++) {
        //     this.letters.push(I);
        // }
        // for (let i = 0; i < 5; i++) {
        //     this.letters.push(L);
        // }
        // for (let i = 0; i < 6; i++) {
        //     this.letters.push(N);
        //     this.letters.push(O);
        //     this.letters.push(R);
        //     this.letters.push(S);
        //     this.letters.push(T);
        //     this.letters.push(U);
        // }
        // for (let i = 0; i < 15; i++) {
        //     this.letters.push(E);
        // }

        this.letters.push(J);
        // this.letters.push(K);
        // this.letters.push(Q);
        this.letters.push(W);
        this.letters.push(X);
        // this.letters.push(Y);
        // this.letters.push(Z);
    }

    getRandomLetter(): Letter {
        this.random = Math.floor(Math.random() * this.letters.length);
        while (this.letters[this.random] == null) this.random = Math.floor(Math.random() * this.letters.length);
        this.save = this.letters[this.random];

        delete this.letters[this.random];

        return this.save;
    }
}
