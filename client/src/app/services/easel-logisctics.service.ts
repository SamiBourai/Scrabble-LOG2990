import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
import { A, BOX, DEFAULT_HEIGHT, DEFAULT_WIDTH, HAND_POSITION_START, LEFTSPACE, TOPSPACE } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EaselLogiscticsService {
    gridContext: CanvasRenderingContext2D;
    easelLetters = new Array<Easel>();
    size: number = 0;
    temp: Easel = { index: 0, letters: A };
    occupiedPos: Array<Boolean> = [false, false, false, false, false, false, false];
    first: boolean = true;

    placeEaselLetters(lett: Letter): void {   
    const img = new Image();
    img.src = lett.img;
    
        img.onload = () => {  
             
            this.occupiedPos[this.size] = true;
            
            this.gridContext.drawImage(
                img,
                (LEFTSPACE  + this.size* 40),
                TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX)
            
           this.size ++;
           console.log(this.size);
        }; 
    }

    deleteletterFromEasel(easel: Easel): void {
        delete this.easelLetters[easel.index];
        this.occupiedPos[easel.index] = false;
    }

    getLetterFromEasel(index: number): Letter {
        if (this.occupiedPos[index] == true) {
            this.gridContext.clearRect(
                LEFTSPACE + ((HAND_POSITION_START + index) * DEFAULT_WIDTH) / BOX,
                TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
                DEFAULT_WIDTH / BOX,
                DEFAULT_HEIGHT / BOX,
            );
            this.occupiedPos[index] = false;
            return this.easelLetters[index].letters;
        }
        return A;
    }

    isFull(): boolean {
        for (let i = 0; i <= 6; i++) {
            if (!this.occupiedPos[i]) return false;
        }
        return true;
    }
}
