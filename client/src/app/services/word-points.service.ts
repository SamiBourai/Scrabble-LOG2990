import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { AZUR_BOX, BLUE_BOX, PINK_BOX, RED_BOX } from '@app/constants/array-constant';
import { ASCI_CODE_A, comparePositions } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class WordPointsService {
    usedBonus: Vec2[] = [];
    pointsWord(word: Letter[], position: Vec2[], newBonus: boolean): number {
        let sum = 0;
        let wordMultiplier = 1;
        for (let letterIndex = 0; letterIndex < word.length; ++letterIndex) {
            let score = word[letterIndex].score;

            wordMultiplier = this.wordBonus(position, wordMultiplier, letterIndex, newBonus);
            score = this.letterBonus(word, position, score, letterIndex, newBonus);
            sum += score;
        }
        sum *= wordMultiplier;

        return sum;
    }

    handleBestPointsVP(points: number, command: ChatCommand, maxPoint: number[], commands: ChatCommand[]) {
        if (points > maxPoint[0]) {
            maxPoint[3] = maxPoint[2];
            commands[3] = commands[2];
            maxPoint[2] = maxPoint[1];
            commands[2] = commands[1];
            maxPoint[1] = maxPoint[0];
            commands[1] = commands[0];
            maxPoint[0] = points;
            commands[0] = command;
        } else if (points > maxPoint[1]) {
            maxPoint[3] = maxPoint[2];
            commands[3] = commands[2];
            maxPoint[2] = maxPoint[1];
            commands[2] = commands[1];
            maxPoint[1] = points;
            commands[1] = command;
        } else if (points > maxPoint[2]) {
            maxPoint[3] = maxPoint[2];
            commands[3] = commands[2];
            maxPoint[2] = points;
            commands[2] = command;
        } else if (points > maxPoint[3]) {
            maxPoint[3] = points;
            commands[3] = command;
        }
    }
    buildPointCommandText(tempCommand: ChatCommand, points: number): string {
        return (
            '!placer ' +
            String.fromCharCode(ASCI_CODE_A + (tempCommand.position.y - 1)) +
            tempCommand.position.x +
            tempCommand.direction +
            ' ' +
            tempCommand.word +
            '  (' +
            points +
            ')<br/>'
        );
    }
    private wordBonus(position: Vec2[], wordMultiplier: number, letterIndex: number, newBonus: boolean) {
        for (const i of RED_BOX) {
            if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                wordMultiplier *= 3;
                if (!newBonus) this.usedBonus.push(i);
            }
        }

        for (const i of PINK_BOX) {
            if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                wordMultiplier *= 2;
                if (!newBonus) this.usedBonus.push(i);
            }
        }
        return wordMultiplier;
    }

    private letterBonus(word: Letter[], position: Vec2[], score: number, letterIndex: number, newBonus: boolean): number {
        for (const i of BLUE_BOX) {
            if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                score = word[letterIndex].score * 3;
                if (!newBonus) this.usedBonus.push(i);
            }
        }

        for (const i of AZUR_BOX) {
            if (this.compareVec2(position[letterIndex], i) && !this.isUsedBonus(i)) {
                score = word[letterIndex].score * 2;
                if (!newBonus) this.usedBonus.push(i);
            }
        }
        return score;
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
