import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { LettersService } from './letters.service';
import { ValidWordService } from './valid-world.service';
// import { LettersService } from './letters.service';
// import { A } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
    ) {}
    private vrPlayerEaselLetters: Easel[] = [];
    // private letters : Array<Letter> =[];
    matchWordLetters: Letter[] = [];

    generateVrPlayerEasel(): void {
        for (let i = 0; i < 7; i++) this.vrPlayerEaselLetters.push({ index: i, letters: this.reserveService.getRandomLetter() });
    }

    easelToLetters(): Letter[] {
        const letters: Letter[] = [];
        for (const playerLetters of this.vrPlayerEaselLetters) {
            letters.push(playerLetters.letters);
        }
        return letters;
    }
    caclculateGeneratedWordPoints(word: string): number {
        let points = 0;
        for (const point of this.lettersService.fromWordToLetters(word)) points += point.score;

        return points;
    }
    exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * 6) + 1;
        for (let i = 0; i <= numberOfLettersToExchange; i++) {
            this.vrPlayerEaselLetters[Math.floor(Math.random() * 6)];
        }
    }
    manageVrPlayerActions(): void {
        const probability: string[] = [
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'placeWord',
            'passTurn',
            'exchangeLetters',
        ];
        const randomIndex = Math.floor(Math.random() * 9);
        switch (probability[randomIndex]) {
            case 'placeWord': {
                this.generateVrPlayerEasel();
                this.validWordService.generateAllWordsPossible(this.easelToLetters());
                break;
            }
            case 'passTurn': {
                this.userService.vrSkipingTurn = true;
                break;
            }
            case 'exchangeLetters': {
                // this.validWordService.generateAllWordsPossible();
                break;
            }
        }
    }

    placeVrLettersInScrable(): void {}
}
