import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WordPointsService {
    constructor() {}

    points_word(word: string): number {
        let points_letters = new Map([
            ['a', 1],
            ['e', 1],
            ['i', 1],
            ['l', 1],
            ['n', 1],
            ['o', 1],
            ['r', 1],
            ['s', 1],
            ['t', 1],
            ['u', 1],
            ['d', 2],
            ['g', 2],
            ['m', 2],
            ['b', 3],
            ['c', 3],
            ['p', 3],
            ['f', 4],
            ['h', 4],
            ['v', 4],
            ['j', 8],
            ['q', 8],
            ['k', 10],
            ['w', 10],
            ['x', 10],
            ['y', 10],
            ['z', 10],
        ]);
        let somme: number = 0;
        for (let letter_index = 0; letter_index < word.length; ++letter_index) {
            let point = points_letters.get(word[letter_index]);
            if (!point) {
                continue;
            }
            somme = somme + point;
        }
        if (word.length == 7) {
            somme = somme + 50;
        }
        return somme;
    }
}
