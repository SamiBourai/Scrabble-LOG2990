import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { ScrableLetters } from '@app/classes/scrable-letters';
import {
    EASEL_LENGTH,
    EIGHTEEN_POINTS,
    MAX_INDEX_NUMBER_EASEL,
    MAX_INDEX_NUMBER_PROBABILITY_ARRAY,
    NB_TILES,
    SEVEN_POINTS,
    SIX_POINTS,
    THIRTEEN_POINTS,
    TWELVE_POINTS,
    ZERO_POINTS
} from '@app/constants/constants';
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
    private lowPointsWords: string[] = [];
    private averagePointsWords: string[] = [];
    private highPointsWords: string[] = [];
    private vrPlayerEaselLetters: Easel[] = [];
    private verticalLetters: Map<number, ScrableLetters[]>= new Map<number, ScrableLetters[]>();
    private horizontalLetters: Map<number, ScrableLetters[]> = new Map<number, ScrableLetters[]>();

    constructor(
        private readonly reserveService: ReserveService,
        private validWordService: ValidWordService,
        private lettersService: LettersService,
        private userService: UserService,
    ) {}

    // private letters : Array<Letter> =[];
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
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        switch (probability[randomIndex]) {
            case 'placeWord': {
                setTimeout(() => {
                    this.generateVrPlayerEasel();
                    this.validWordService.generateAllWordsPossible(this.easelToLetters());
                    if (this.validWordService.matchWords.length > 0) {
                        this.placeVrLettersInScrable();
                    }
                }, 3000);

                break;
            }
            case 'passTurn': {
                setTimeout(() => {
                    this.userService.vrSkipingTurn = true;
                }, 20000);
                break;
            }
            case 'exchangeLetters': {
                this.exchangeLettersInEasel();
                // this.validWordService.generateAllWordsPossible();
                break;
            }
        }
    }

    private generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) this.vrPlayerEaselLetters.push({ index: i, letters: this.reserveService.getRandomLetter() });
    }

    private easelToLetters(): Letter[] {
        const letters: Letter[] = [];
        for (const playerLetters of this.vrPlayerEaselLetters) {
            letters.push(playerLetters.letters);
        }
        return letters;
    }
    private caclculateGeneratedWordPoints(word: string): number {
        let points = 0;
        for (const point of this.lettersService.fromWordToLetters(word)) points += point.score;
        return points;
    }
    private organiseWordsByScore(): void {
        for (const word of this.validWordService.matchWords) {
            const points = this.caclculateGeneratedWordPoints(word);
            if (points > ZERO_POINTS && points < SIX_POINTS) this.lowPointsWords.push(word);
            else if (points > SEVEN_POINTS && points < TWELVE_POINTS) this.averagePointsWords.push(word);
            else if (points > THIRTEEN_POINTS && points < EIGHTEEN_POINTS) this.highPointsWords.push(word);
        }
    }
    private exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL) + 1;
        for (let i = 0; i <= numberOfLettersToExchange; i++) {
            this.vrPlayerEaselLetters[Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL)];
        }
    }

    private chooseWordToplace(firstToplay: boolean): Letter[] {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.organiseWordsByScore();
        // ajouter verif qu'il peut jouer d'autre s'il y a pas de mots dans un des tableau
        // first to place vrai, donc pas besoin de vérifier si les letters sont présentes
        switch (probability[randomIndex]) {
            case '{0,6}': {
                if (firstToplay && this.lowPointsWords) return this.lettersService.fromWordToLetters(this.lowPointsWords?.pop() ?? '');
                break;
            }
            case '{7,12}': {
                if (firstToplay && this.averagePointsWords) return this.lettersService.fromWordToLetters(this.averagePointsWords?.pop() ?? '');
                break;
            }
            case '{13,18}': {
                if (firstToplay && this.highPointsWords) return this.lettersService.fromWordToLetters(this.highPointsWords?.pop() ?? '');
                break;
            }
        }
        return [];
    }
     getLetterForEachColumn(): void {
        const letter: ScrableLetters[] = [];
        console.log(this.lettersService.tiles); 
        for (let i = 0; i < NB_TILES; i++)
            for (let j = 0; j < NB_TILES; j++) {
                console.log('madafak', this.lettersService.tiles[j][i]);
                let tamere: Letter= this.lettersService.tiles[j][i]!; 
                if (tamere) {
                    letter.push({ letter: this.lettersService.tiles[j][i], position: { x: i, y: j } });
                    if (j == 14) {
                        this.verticalLetters.set(i, letter);
                        console.log(letter, 'luwqhe'); 
                        letter.splice(0, letter.length - 1);
                    }
                }
            }
            console.log(this.verticalLetters, 'vertical'); 
    }

    getLetterForEachLine(): void {
        const letter: ScrableLetters[] = [];
        for (let i = 0; i < NB_TILES; i++)
            for (let j = 0; j < NB_TILES; j++) {
                if (this.lettersService.tiles[i][j]) {
                    letter.push({ letter: this.lettersService.tiles[i][j], position: { x: i, y: j } });

                    if (j === 14) {
                        console.log(letter, 'luwqhe'); 
                        this.horizontalLetters.set(i, letter);
                        letter.splice(0, letter.length - 1);
                    }
                }
            }
            console.log(this.horizontalLetters, 'horenzital'); 
    }

    // private generateMatchedWords(): void {
    //     let lettersFromColumn: Letter[] = [];
    //     for (let i = 0; i < NB_TILES; i++) {
    //         for (const sacrableLetters of this.horizontalLetters.get(i)!) lettersFromColumn.push(sacrableLetters.letter) 
    //     }
    //     for(let letters of this.vrPlayerEaselLetters)
    //         lettersFromColumn.push(letters.letters); 
    //     this.validWordService.generateAllWordsPossible(lettersFromColumn);
    // }
    // private manageAllMatchedWords():void {
    // }

    private placeVrLettersInScrable(): void {
        console.log('yoooo', this.userService.realUser.firstToPlay);
        if (!this.userService.realUser.firstToPlay) {
            const choosedWord = this.chooseWordToplace(true);
            console.log(choosedWord);
            let i = 0;
            for (const letter of choosedWord) {
                this.lettersService.placeLetter(letter, { x: 8 + i, y: 8 });
                this.lettersService.tiles[8][8 + i] = letter;
                i++;
            }
        } else if (!this.userService.realUserTurn) {
        }
    }
}
