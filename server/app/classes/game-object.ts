import { EASEL_LENGTH, LETTERS_RESERVE_QTY, PARAMETERS_OF_SWAP, RESERVE_SIZE } from '@app/classes/constants';
import { Player } from '@app/classes/players';
import { Timer } from '@app/classes/timer';
import { Letter } from './letters';
import { Objectifs } from './Objectifs';
import { Vec2 } from './vec2';

export class GameObject {
    timeConfig = { min: 0, sec: 0 };
    gameName: string = '';
    timer: Timer;
    reserveServer = new Map<Letter, number>(LETTERS_RESERVE_QTY);
    reserverServerSize: number = RESERVE_SIZE;
    endOfGame: boolean = false;
    aleatoryBonus: boolean = false;
    arrayOfMessage: string[];
    passTurn: number = 0;
    guestPlayer: Player = { name: 'default', score: 0, easelLetters: EASEL_LENGTH };
    creatorPlayer: Player = { name: 'default', score: 0, easelLetters: EASEL_LENGTH };
    arrayOfBonusBox = new Array<Vec2[]>();
    modeLog2990: boolean = false;
    objectifs = new Array<Objectifs>();
    constructor(gameName: string, aleatoryBonus: boolean, creatorPlayer: Player, sec: number, min: number, modeLog2990: boolean) {
        this.gameName = gameName;
        this.aleatoryBonus = aleatoryBonus;
        this.creatorPlayer = { name: creatorPlayer.name, score: creatorPlayer.score, easelLetters: creatorPlayer.score };
        this.timeConfig = { min, sec };
        this.modeLog2990 = modeLog2990;
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
