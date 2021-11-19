import { EASEL_LENGTH, LETTERS_RESERVE_QTY, PARAMETERS_OF_SWAP } from '@app/classes/constants';
import { Player } from '@app/classes/players';
import { Timer } from '@app/classes/timer';
import { Letter } from './letters';
import { Vec2 } from './vec2';

export class GameObject {
    timeConfig = { min: 0, sec: 0 };
    gameName: string = '';
    timer: Timer;
    reserveServer = new Map<Letter, number>(LETTERS_RESERVE_QTY);
    reserverServerSize: number = 30;
    creatorEasel = new Array<Letter>(EASEL_LENGTH);
    joinEasel = new Array<Letter>(EASEL_LENGTH);
    endOfGame: boolean = false;
    aleatoryBonus: boolean = false;
    arrayOfMessage: string[];
    passTurn: number = 0;
    guestPlayer: Player = { name: 'default', score: 0, easelLetters: EASEL_LENGTH };
    creatorPlayer: Player = { name: 'default', score: 0, easelLetters: EASEL_LENGTH };
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
    chooseFirstToPlay(): boolean {
        const randomIndex = Math.floor(Math.random() * PARAMETERS_OF_SWAP);
        if (randomIndex <= PARAMETERS_OF_SWAP / 2) {
            return true;
        } else {
            return false;
        }
    }
}
