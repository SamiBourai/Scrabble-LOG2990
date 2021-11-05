import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { AZUR_BOX, BLUE_BOX, PINK_BOX, RED_BOX } from '@app/constants/array-constant';
import { comparePositions } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class WordPointsService {
    usedBonus: Vec2[] = [];
    pointsWord(word: Letter[], position: Vec2[]): number {
        let sum = 0;
        let wordMultiplier = 1;
        for (let letterIndex = 0; letterIndex < word.length; ++letterIndex) {
            let score = word[letterIndex].score;

            for (const i of RED_BOX) {
                if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                    wordMultiplier *= 3;
                    this.usedBonus.push(i);
                }
            }

            for (const i of PINK_BOX) {
                if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                    wordMultiplier *= 2;
                    this.usedBonus.push(i);
                }
            }

            for (const i of BLUE_BOX) {
                if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                    score = word[letterIndex].score * 3;
                    this.usedBonus.push(i);
                }
            }

            for (const i of AZUR_BOX) {
                if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                    score = word[letterIndex].score * 2;
                    this.usedBonus.push(i);
                }
            }
            sum += score;
        }
        sum *= wordMultiplier;

        return sum;
    }
    private compareVec2(a: Vec2, b: Vec2) {
        return a.x === b.x && a.y === b.y;
    }

    private isUsedBonus(position: Vec2) {
        let isUsed = false;
        for (const i of this.usedBonus) {
            if (comparePositions(i, position)) {
                isUsed = true;
            }
        }
        return isUsed;
    }
}
