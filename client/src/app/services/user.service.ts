import { Injectable } from '@angular/core';
import { RealUser, VrUser } from '@app/classes/user';


@Injectable({
    providedIn: 'root',
})
export class UserService {
    // ici nous avons pas le choix que de declarer name as any, car local storage retourne string | null
    // alors ici on deux option : c'est soit on
    // Set strictNullChecks=false in tsconfig.json.
    // Declare your variable type as any

    userNameLocalStorage: any;
    counter: { min: number; sec: number };
    realUser: RealUser;
    vrUser: VrUser;
    intervalId = 0;
    time: number;
    vrSkipingTurn:boolean;
    userSkipingTurn:boolean

    constructor() {
        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: this.chooseFirstToPlay(), // if true le realuser va commencer sinon c'est vrUser va commencer
        };

        this.vrUser = {
            name: this.chooseRandomName(),
            level: 'Débutant',
            round: '20 sec',
            score: 0,
        };
        this.vrSkipingTurn=false;
        this.userSkipingTurn=false;
    }

    chooseFirstToPlay(): boolean {
        // si le chiffre retournee est 0, alors c'est le real player qui commence
        if (this.getRandomInt(20) < 10) {
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
        const vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];

        let randomInteger: number = 0;

        while (true) {
            randomInteger = this.getRandomInt(3);
            console.log('nom pige : ' + randomInteger);

            if (vrPlayerNames[randomInteger] == localStorage.getItem('userName')) {
                continue;
            } else break;
        }
        return vrPlayerNames[randomInteger];
    }

    getUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('userName');
        return this.userNameLocalStorage;
    }

    // timer

    startTimer() {
        if (this.realUser.firstToPlay) {
            this.counter = { min: 0, sec: 59 };
            this.realUser.firstToPlay = false;
            this.time = this.counter.sec;
            console.log('le vrai utilisateur qui joue');
        } else {
            this.counter = { min: 0, sec: 20 };
            this.realUser.firstToPlay = true;
            this.time = this.counter.sec;
            console.log('le Vr qui joue');
        }
        let intervalId = setInterval(() => {
            if(this.vrSkipingTurn){
                this.counter = { min: 0, sec: 59 };
                this.vrSkipingTurn=false;
                clearInterval(intervalId);
                this.startTimer();
            }
            if(this.userSkipingTurn){
                this.counter = { min: 0, sec: 20 };
                this.userSkipingTurn=false;
                clearInterval(intervalId);
                this.startTimer();
            }
            if (this.counter.sec - 1 == -1) {
                this.counter.min -= 1;
                this.counter.sec = 59;
            } else this.counter.sec -= 1;

            if (this.counter.min === 0 && this.counter.sec === 0) {
                clearInterval(intervalId);
                this.startTimer();
            }
        }, 1000);
    }


    skipTurnValidUser(): boolean {
        if (this.time ===59) return true;
        else this.time === 20;
        return false;
    }



}
