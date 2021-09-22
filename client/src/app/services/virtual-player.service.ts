import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { ReserveService} from '@app/services/reserve.service'
//import { LettersService } from './letters.service';
//import { A } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    constructor(private readonly reserveService: ReserveService) {}
    vrPlayerEaselLetters : Array<Easel> = [];
    letters : Array<Letter> =[]; 
    generateVrPlayerEasel():void {
      for(let i = 0 ; i < 7 ; i++)
      this.vrPlayerEaselLetters.push({index : i , letters: this.reserveService.getRandomLetter() }); 
      console.log( this.vrPlayerEaselLetters, "VrPlayer"); 
  }

  easelToLetters(): Letter[] {
    for(let playerLetters of this.vrPlayerEaselLetters){
      this.letters.push(playerLetters.letters)
    }
    return this.letters; 
  }
  searchWordsToplace(): void {
    
  }
}
