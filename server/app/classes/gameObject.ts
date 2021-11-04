import { PARAMETERS_OF_SWAP } from '@app/classes/constants';
import { Player } from '@app/classes/players';
import { Timer } from '@app/classes/timer';
import { LETTERS_RESERVE_QTY } from './constants';
import { Letter } from './letters';
import { Vec2 } from './vec2';

export class GameObject {
    timeConfig = { min: 0, sec: 0 };
    gameName: string = '';
    timer: Timer;
    reserveServer = new Map<Letter, number>(LETTERS_RESERVE_QTY);
    reserverServerSize: number = 100;
    endOfGame: boolean = false;
    aleatoryBonus: boolean = false;
    passTurn: number = 0;
    guestPlayer: Player = { name: 'default', score: 0, easelLetters: 7 };
    creatorPlayer: Player = { name: 'default', score: 0, easelLetters: 7 };
    arrayOfBonusBox = new Array<Vec2[]>();
    constructor(gameName: string, aleatoryBonus: boolean, creatorPlayer: Player, sec: number, min: number) {
        this.gameName = gameName;
        this.aleatoryBonus = aleatoryBonus;
        this.creatorPlayer = { name: creatorPlayer.name, score: creatorPlayer.score, easelLetters: creatorPlayer.score };
        this.timeConfig = { min, sec };
    }
    setTimer() {
        this.timer = new Timer();
        this.timer.creatorTurn = this.chooseFirstToPlay();
        this.timer.timerConfig = { sec: this.timeConfig.sec, min: this.timeConfig.min };
        this.timer.timeUser = { sec: this.timeConfig.sec, min: this.timeConfig.min };
    }
    private chooseFirstToPlay(): boolean {
        const randomIndex = Math.floor(Math.random() * PARAMETERS_OF_SWAP);
        if (randomIndex <= PARAMETERS_OF_SWAP / 2) {
            return true;
        } else {
            return false;
        }
    }
}
