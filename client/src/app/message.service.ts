import { Injectable } from '@angular/core';
import { ChatCommand } from './classes/chat-command';
// import { Parameter } from './classes/parameter';
// import { Parameter } from './classes/parameter';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
  private ligne:string;
  private colonne:number;
  private orientation:string
  private mot:string;
  array= new Array <ChatCommand>() ; 

  private isDebug:boolean
  private possibleLigne: string = 'abcdefghijklmno';
  private possibleColonne:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; 
  private possibleOrientation:string = 'hv'
 
  
  
  commandPlacer(input:string){

    input = input.substring(8,input.length);

    
    this.ligne = input.substring(0,1);

    let n = input.substring(0,4)
    if(n.length == 4 && !n.includes(" ")){
      this.colonne = parseInt(n.substring(1,3));
      this.orientation = n.substring(3,4);
      this.mot = input.substring(4,input.length);
    }
    else if(n.includes(" ")){
      this.colonne = parseInt(n.substring(1,2));
      this.orientation = n.substring(2,3);
      
      this.mot = input.substring(3,input.length);
    
    }
    //console.log(n.length)
    //console.log(this.mot)
    if(this.possibleLigne.includes(this.ligne) && this.possibleColonne.includes(this.colonne) && this.possibleOrientation.includes(this.orientation) ){
      let word : ChatCommand = {word: this.mot, line : this.ligne, column : this.colonne, direction: this.orientation }; 
      this.array.push(word); 
    }
    return this.array; 
    
  }


    commandEchanger(input: string) {
        if (input.length > 8) {
            return input.substring(9, input.length);
        }
        return null;
        // recuperer les lettres a echanger
    }

    //!echanger
    commandDebug(input: string) {
        if (input === '!debug') this.isDebug = true;
        return this.isDebug;
    }
}
