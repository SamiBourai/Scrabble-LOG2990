import { Player } from '@app/classes/players';
import { Timer } from '@app/classes/timer';
import { Subject } from 'rxjs';
import { LETTERS_RESERVE_QTY } from './constants';
import { Letter } from './letters';
import { ReserveObject } from './ReserveObject';
export class GameObject {
    timeConfig = { min: 0, sec: 0 };
    gameName: string = '';
    timer: Timer;
    reserveServer: ReserveObject = { letters: new Map<Letter, number>(LETTERS_RESERVE_QTY), size: 100 };
    lettersObs: Subject<Letter[]> = new Subject<Letter[]>();
    aleatoryBonus: boolean = false;
    readyToPlay: boolean = false;
    guestPlayer: Player = { name: 'default', score: 0, easelLetters: 7 };
    creatorPlayer: Player = { name: 'default', score: 0, easelLetters: 7 };
    constructor(gameName: string, aleatoryBonus: boolean, creatorPlayer: Player, sec: number, min: number) {
        this.gameName = gameName;
        this.aleatoryBonus = aleatoryBonus;
        this.creatorPlayer = { name: creatorPlayer.name, score: creatorPlayer.score, easelLetters: creatorPlayer.score };
        this.timeConfig = { min, sec };
        // this.lettersObs.subscribe((letters) => {
        //     this.reserve = letters.slice();
        // });
    }
    setTimer(creatorTurn: boolean) {
        this.timer = new Timer();
        this.timer.creatorTurn = creatorTurn;
        this.timer.timeUser = { sec: this.timeConfig.sec, min: this.timeConfig.min };
    }
}
