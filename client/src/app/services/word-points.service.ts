import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { AZUR_BOX, BLUE_BOX, BONUS_POINTS_50, BONUS_WORD_LENGTH, PINK_BOX, RED_BOX } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class WordPointsService {
    constructor() {}

    private compare_vec2(a: Vec2, b: Vec2) {
        return a.x == b.x && a.y == b.y;
    }

    points_word(word: Letter[], position: Vec2[]): number {
        let sum = 0;
        let word_multiplier = 1;
        console.log(word.length == position.length);
        for (let letter_index = 0; letter_index < word.length; ++letter_index) {
            let score = word[letter_index].score;
            for (const i of RED_BOX) {
                if (this.compare_vec2(position[letter_index], i)) {
                    word_multiplier *= 3;
                }
            }

            for (const i of PINK_BOX) {
                if (this.compare_vec2(position[letter_index], i)) {
                    word_multiplier *= 2;
                }
            }

            for (const i of BLUE_BOX) {
                if (this.compare_vec2(position[letter_index], i)) {
                    score = word[letter_index].score * 3;
                }
            }

            for (const i of AZUR_BOX) {
                if (this.compare_vec2(position[letter_index], i)) {
                    score = word[letter_index].score * 2;
                }
            }
            sum += score;
        }
        sum *= word_multiplier;
        if (word.length === BONUS_WORD_LENGTH) {
            sum += BONUS_POINTS_50;
        }

        return sum;
    }
}
