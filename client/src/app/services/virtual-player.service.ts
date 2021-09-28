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
    NOT_A_LETTER,
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
    // private lowScore : boolean = false; 
    // private averageScore : boolean= false ; 
    // private highScore : boolean= false; 
    private foundLetter: boolean[] = [false, false, false, false, false, false, false];
    private probWordScore: string; 
    private letterInscrable: ScrableLetters[] = [];

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

    generateVrPlayerEasel(): void {
        for (let i = 0; i < EASEL_LENGTH; i++) {
            console.log(i);
            this.vrPlayerEaselLetters.push({ index: i, letters: this.reserveService.getRandomLetter() });}
        console.log(this.vrPlayerEaselLetters);
    }

    private easelToLetters(): Letter[] {
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
    organiseWordsByScore(word : string): void {
            const points = this.caclculateGeneratedWordPoints(word);  
            switch(this.probWordScore){
                case'{0,6}':
                    if (points > ZERO_POINTS && points <= SIX_POINTS && this.isWordPlacable(word,this.letterInscrable.slice()) && this.validateWord(word)) {
                        if()
                        this.lowPointsWords.push(word);}
                        break; 
                
                case'{7,12}':
                    if (points > SEVEN_POINTS && points <=TWELVE_POINTS) this.averagePointsWords.push(word);
                    break; 
                
                case '{13,18}':
                    if (points > THIRTEEN_POINTS && points <= EIGHTEEN_POINTS) this.highPointsWords.push(word); 
                    break;              
            }  

    }
    validateWord(word : string): boolean{
        let concat : string = ''; 
        let counter=0;
        
        for(let i = 0 ; i< NB_TILES; i++){       
                if(this.letterInscrable[i+1]){ 
                    let space =this.letterInscrable[i+1].position.y - this.letterInscrable[i].position.y;
                    if(space > 1)
                    for(let i = 0 ; i< space; i++){
                        if(i!==(space-1)) 
                    concat+= '.'; 
                   
                    let regEx = new RegExp(concat)
                    let match =regEx.test(word); 
                    if(match)
                    return true; 
                }
                }
        }return false; 
    }

    private isWordPlacable(word:string,alreadyInBoard:ScrableLetters[]):boolean{
        let letterFromEasel:string='';
        let counterBoard=0;
       
        let validWord:boolean=false;
            for(let i=0;i<word.length;i++){
                if(word.charAt(i)!==alreadyInBoard[counterBoard].letter.charac)
                    letterFromEasel=letterFromEasel+alreadyInBoard[counterBoard].letter.charac;
                    else{
                        counterBoard++;
                    }
        }
        
           validWord= this.wordInEasel(letterFromEasel);
            this.foundLetter.fill(false);
           return validWord;
                
        
    }
    wordInEasel(word: string): boolean {
        // console.log(word);
        let found = false;
        let first = true;

        for (let i = 0; i < word.length; i++) {
            if (found || first) {
                first = false;
                found = false;

                for (let j = 0; j < EASEL_LENGTH; j++) {
                    //  console.log(word.charAt(i) + ' : ' + this.easelLogisticsService.easelLetters[j].letters.charac && this.foundLetter[j]);
                    if (word.charAt(i) === this.vrPlayerEaselLetters[j].letters.charac && this.foundLetter[j] === false) {
                        this.foundLetter[j] = true;

                      
                        // console.log('indexFind ' + j);
                        found = true;
                        break;
                    }
                }
            } else {
                
                break;
            }
        }
        // console.log(this.foundLetter);

        return found;
    }
    private exchangeLettersInEasel(): void {
        const numberOfLettersToExchange = Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL) + 1;
        for (let i = 0; i <= numberOfLettersToExchange; i++) {
            this.vrPlayerEaselLetters[Math.floor(Math.random() * MAX_INDEX_NUMBER_EASEL)];
        }
    }

    private chooseWordToplace() {
        const probability: string[] = ['{0,6}', '{0,6}', '{0,6}', '{0,6}', '{7,12}', '{7,12}', '{7,12}', '{13,18}', '{13,18}', '{13,18}'];
        const randomIndex = Math.floor(Math.random() * MAX_INDEX_NUMBER_PROBABILITY_ARRAY);
        this.probWordScore= probability[randomIndex]; 
    }
    getLetterForEachColumn(): void {
        let letter: ScrableLetters[] = [];
        console.log(this.lettersService.tiles); 
        for (let i = 0; i < NB_TILES; i++){
            for (let j = 0; j < NB_TILES; j++) {
                if( this.lettersService.tiles[j][i]?.charac !== NOT_A_LETTER.charac){
                      console.log('madafak', this.lettersService.tiles[j][i]);
                    letter.push({letter :{score:this.lettersService.tiles[j][i]?.score,
                        charac:this.lettersService.tiles[j][i]?.charac,
                        img:this.lettersService.tiles[j][i]?.img,
                    }, position: { x: i, y: j } });
                    console.log(letter, 'luwqhe');                    
            } }
                        this.verticalLetters.set(i, letter.slice());                      
                        letter.splice(0, letter.length );}
            console.log(this.verticalLetters, 'vertical'); 
    }

    getLetterForEachLine(): void {
        let lett : Letter[] =[];  
        for (let i = 0; i < NB_TILES; i++){
            for (let j = 0; j < NB_TILES; j++) {
                if( this.lettersService.tiles[i][j]?.charac !== NOT_A_LETTER.charac){
                    this.letterInscrable.push({letter :{score:this.lettersService.tiles[i][j]?.score,
                        charac:this.lettersService.tiles[i][j]?.charac,
                        img:this.lettersService.tiles[i][j]?.img,
                    }, position: { x: i, y: j } });
                    lett.push({score:this.lettersService.tiles[i][j]?.score,
                        charac:this.lettersService.tiles[i][j]?.charac,
                        img:this.lettersService.tiles[i][j]?.img,
                    })                   
            } }
                        this.horizontalLetters.set(i, this.letterInscrable.slice()); 
                        this.generateWords(lett);                      
                        this.letterInscrable.splice(0, this.letterInscrable.length );
                        
                        lett.splice(0, lett.length); 
                    }
    }

    generateWords(letter:Letter[]){
        console.log('generate word: '+this.vrPlayerEaselLetters);
        if(letter.length>0){
        for(let lett of this.vrPlayerEaselLetters){  letter.push(lett.letters);
            
        } 
        this.validWordService.generateAllWordsPossible(letter); 

    }
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
