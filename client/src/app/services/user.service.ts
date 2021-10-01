import { Injectable } from '@angular/core';
import { RealUser, VrUser } from '@app/classes/user';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { MessageService } from './message.service';
import { ReserveService } from './reserve.service';

const USER_TURN_TIME = 5;
const VR_USER_TURN_TIME = 5;
@Injectable({
    providedIn: 'root',
})
export class UserService {
    // ici nous avons pas le choix que de declarer name as any, car local storage retourne string | null
    // alors ici on deux option : c'est soit on
    // Set strictNullChecks=false in tsconfig.json.
    // Declare your variable type as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userNameLocalStorage: any;
    counter: { min: number; sec: number };
    passesCounter: number = 0;
    realUser: RealUser;
    vrUser: VrUser;
    intervalId: any;
    time: number;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;
    vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];
    realUserTurn: boolean;

    constructor(
        private messageService: MessageService,
        private reserveService: ReserveService,
        private easelLogiscticsService: EaselLogiscticsService,
    ) {
        const first = this.chooseFirstToPlay();
        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: first, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: first,
        };

        this.vrUser = {
            name: this.chooseRandomName(),
            level: 'Débutant',
            round: '20 sec',
            score: 0,
        };
        this.vrSkipingTurn = false;
        this.userSkipingTurn = false;
    }

    chooseFirstToPlay(): boolean {
        // si le chiffre retournee est 0, alors c'est le real player qui commence
        if (this.getRandomInt(20) <= 10) {
            return false;
        } else {
            // sinon si ce qui est retourne est 1 alors c'est vr-player qui commence
            return true;
        }
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
    chooseRandomName(): string {
        // comme ces constante on en a besoin ici seulement
        let randomInteger = 0;

        for (;;) {
            randomInteger = this.getRandomInt(3);
            console.log('nom pige : ' + randomInteger);

            if (this.vrPlayerNames[randomInteger] === localStorage.getItem('userName')) {
                continue;
            } else break;
        }
        localStorage.setItem('vrUserName', this.vrPlayerNames[randomInteger]);
        return this.vrPlayerNames[randomInteger];
    }

    getUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('userName');
        return this.userNameLocalStorage;
    }

    getVrUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('vrUserName');
        return this.userNameLocalStorage;
    }

    // timer

    startTimer() {
        if (this.realUser.turnToPlay) {
            this.counter = { min: 0, sec: USER_TURN_TIME };
            this.realUser.turnToPlay = false;
            this.time = this.counter.sec;
            this.skipTurn();
            console.log('le vrai utilisateur qui joue');
        } else {
            this.counter = this.setCounter(0, VR_USER_TURN_TIME);
            this.realUser.turnToPlay = true;
            this.time = this.counter.sec;
            console.log('le Vr qui joue');
            this.skipTurn();
        }
        this.intervalId = setInterval(() => {
            if (this.vrSkipingTurn) {
                this.counter = this.setCounter(0, USER_TURN_TIME);
                this.vrSkipingTurn = false;

                // this.time = this.counter.sec;
                clearInterval(this.intervalId);
                this.startTimer(); //command
            }
            if (this.userSkipingTurn) {
                //|| this.manageSkipTurnChat(command)
                this.counter = this.setCounter(0, VR_USER_TURN_TIME);
                this.userSkipingTurn = false;
                //this.time = this.counter.sec;
                clearInterval(this.intervalId);
                this.startTimer(); //command
            }
            if (this.counter.sec - 1 == -1) {
                this.counter.min -= 1;
                this.counter.sec = USER_TURN_TIME;
            } else this.counter.sec -= 1;

            if (this.counter.min === 0 && this.counter.sec === 0) {
                clearInterval(this.intervalId);
                this.startTimer(); //command
            }
        }, 1000);
    }

    setCounter(min: number, sec: number): { min: number; sec: number } {
        const counter = { min: min, sec: sec };
        return counter;
    }
    skipTurnValidUser(): boolean {
        if (this.time === USER_TURN_TIME) return true;

        return false;
    }
    detectSkipTurnBtn(): boolean {
        this.messageService.skipTurnIsPressed = true;
        this.userSkipingTurn = true;
        return true;
    }

    skipTurn() {
        this.passesCounter++;
        console.log('asdfasdfa', this.passesCounter);
    }

    resetPassesCounter() {
        this.passesCounter = 0;
        console.log('reset worked');
    }

    isGameOver() {
        if (this.passesCounter === 6 || (this.reserveService.isReserveEmpty() && this.easelLogiscticsService.isEaselEmpty())) {
            //console.log('la partie est fini');
            this.endGame();
            return true;
        } else {
            return false;
        }
    }

    endGame() {
        clearInterval(this.intervalId);
        this.pointsCalculationUser();
        console.log(this.realUser.score);
    }

    pointsCalculationUser() {
        for (let i = 0; i < this.easelLogiscticsService.occupiedPos.length; i++) {
            if (this.easelLogiscticsService.occupiedPos[i] == true) {
                this.realUser.score -= this.easelLogiscticsService.getLetterFromEasel(i).score;
            }
        }
        if (this.realUser.score < 0) this.realUser.score = 0;
    }

    // pointsCalculationVr() {
    //     for (let i = 0; i < this.easelLogiscticsService.occupiedPos.length; i++) {
    //         if (this.easelLogiscticsService.occupiedPos[i] == true) {
    //             this.realUser.score -= this.easelLogiscticsService.getLetterFromEasel(i).score;
    //         }
    //     }
    // }
}
