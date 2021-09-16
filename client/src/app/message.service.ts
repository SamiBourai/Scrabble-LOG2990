
import { Injectable } from '@angular/core';
// import { Parameter } from './classes/parameter';
// import { Parameter } from './classes/parameter';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  

  private ligne:string;
  private colonne:number;
  private orientation:string
  private mot:string;
  

  constructor(){}
  


  getParameters(input:string){

    input = input.substring(8,input.length);
    let array = []
    
    this.ligne = input.substring(0,1);

    let n = input.substring(0,4)
    console.log(n.length)
    console.log(n.substr(2,3))
    console.log(n.includes(" "))

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
    console.log(this.orientation)
    //console.log(n.length)
  
    //console.log(this.mot)
    array.push(this.ligne);
    array.push(this.colonne);
    array.push(this.orientation);
    array.push(this.mot);
    

    return array;

     
    //  this.parameter.position = input.substring(3,4);
    //  this.parameter.mot = input.substring(4,input.length);

     
     

    
    
    
  }
 
}


