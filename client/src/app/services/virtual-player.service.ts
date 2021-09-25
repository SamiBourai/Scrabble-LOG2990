import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { ReserveService} from '@app/services/reserve.service'
import { ValidWordService } from './valid-world.service';
import { LettersService } from './letters.service';
import { UserService} from '@app/services/user.service'
//import { LettersService } from './letters.service';
//import { A } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    constructor(private readonly reserveService: ReserveService, private validWordService: ValidWordService, private lettersService :  LettersService, private userService: UserService ) {}
    private vrPlayerEaselLetters : Array<Easel> = [];
    //private letters : Array<Letter> =[]; 
    matchWordLetters: Array<Letter> =[]; 
  
  generateVrPlayerEasel():void {
      for(let i = 0 ; i < 7 ; i++)
      this.vrPlayerEaselLetters.push({index : i , letters: this.reserveService.getRandomLetter() }); 
  }

  easelToLetters(): Letter[] {
    let letters : Array<Letter> =[]
    for(let playerLetters of this.vrPlayerEaselLetters){
      letters.push(playerLetters.letters)
    }
    return letters; 
  }
  caclculateGeneratedWordPoints(word : string): number {
    let points : number = 0; 
    for (let point of this.lettersService.fromWordToLetters(word))
        points +=  point.score; 
    
    return points ; 
  }
  exchangeLettersInEasel():void {
    var numberOfLettersToExchange = Math.floor(Math.random() * 6)+1;
    for(let i = 0 ; i<= numberOfLettersToExchange; i++ ){
      this.vrPlayerEaselLetters[Math.floor(Math.random() * 6)];
    }

  }
  manageVrPlayerActions(): void {
    let probability : string[] = ["placeWord","placeWord","placeWord","placeWord","placeWord"
    ,"placeWord","placeWord","placeWord","placeWord","passTurn", "exchangeLetters" ]; 
    var randomIndex = Math.floor(Math.random() * 9) ; 
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
      //this.validWordService.generateAllWordsPossible(); 
       break; 
    }
   
    
  }
  }

  placeVrLettersInScrable(): void {


  }
  
}
