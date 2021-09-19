import { Injectable } from '@angular/core';
import { Easel } from '@app/classes/easel';
import { Letter } from '@app/classes/letter';
//import { Vec2 } from '@app/classes/vec2';
import { BOX, DEFAULT_WIDTH, HAND_POSITION_START, LEFTSPACE } from '@app/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class EaselLogiscticsService {
    gridContext: CanvasRenderingContext2D;
    easelLetters = new Set<Easel>();
    pos = new Array<number>();
    occupiedPos = new Array<Boolean>();

    positions(): void {
        //let easel : Easel = {occupied : false ,letters : lett , pos: pos} ;
        for (let i = 0; i <= 6; i++) {
            let position = LEFTSPACE + ((HAND_POSITION_START + i) * DEFAULT_WIDTH) / BOX;
            this.pos.push(position);
            this.occupiedPos.push(true);
            // for (easel of this.easelLetters) {
            //   if ( (this.easelLetters.size < 1) && (this.easelLetters.size< 7) )
            //   this.easelLetters.add(easel);
        }
    }
    placeEaselLetters(lett: Letter[]): void {
        // const img = new Image();
        // img.src = lett.img;
        // this.positions();
        // img.onload = () => {
        //     for (let i = this.pos.length; i > 0; i--) {
        //         this.gridContext.drawImage(
        //             img,
        //             this.pos.pop() as number,
        //             TOPSPACE + DEFAULT_HEIGHT + TOPSPACE / 2,
        //             DEFAULT_WIDTH / BOX,
        //             DEFAULT_HEIGHT / BOX,
        //         );
        //     }
        // };
        // for( let letter of this.easelLetters){
        //     if(this.occupiedPos){
        //     letter.letters= lett;
        //     this.easelLetters.add(letter);
        //   }
        // }
    }

    deleteletterFromEasel(easel: Easel): void {
        this.easelLetters.delete(easel);
        this.occupiedPos[easel.index] = false;
    }
}
