import { Injectable } from '@angular/core';
import { RealUser, VrUser } from '@app/classes/user';
//import { C } from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';

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
    counter: { min: number; sec: number } = { min: 0, sec: 0 };
    realUser: RealUser;
    vrUser: VrUser;
    intervalId = 0;
    time: number;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;
    realUserTurn: BehaviorSubject<boolean>;

    vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];

    constructor(private messageService: MessageService) // private vrPlayerService: VirtualPlayerService
    {
        const first = this.chooseFirstToPlay();
        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: first, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: first,
        };
        this.realUserTurn = new BehaviorSubject(this.realUser.turnToPlay);

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

    get turnOfVrPlayer(): BehaviorSubject<boolean> {
        return this.realUserTurn;
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

            if (this.vrPlayerNames[randomInteger] == localStorage.getItem('userName')) {
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
            console.log('tour du user de jouer' + this.realUser.turnToPlay);
            this.counter = { min: 0, sec: 59 };
            this.realUser.turnToPlay = false;
            this.time = this.counter.sec;

            // console.log('le vrai utilisateur qui joue');
        } else {
            console.log('tour du VR de jouer' + this.realUser.turnToPlay);
            this.counter = { min: 0, sec: 20 };
            //this.vrPlayerService.manageVrPlayerActions(!this.realUser.firstToPlay);
            this.realUser.turnToPlay = true;
            this.time = this.counter.sec;

            //console.log('le Vr qui joue');
        }
        this.realUserTurn.next(this.realUser.turnToPlay);
        let intervalId = setInterval(() => {
            if (this.vrSkipingTurn) {
                this.counter = this.setCounter(0, 59);
                this.vrSkipingTurn = false;

                // this.time = this.counter.sec;
                clearInterval(intervalId);
                this.startTimer(); //command
            }
            if (this.userSkipingTurn) {
                //|| this.manageSkipTurnChat(command)
                this.counter = this.setCounter(0, 20);
                this.userSkipingTurn = false;

                //this.time = this.counter.sec;
                clearInterval(intervalId);
                this.startTimer(); //command
            }
            if (this.counter.sec - 1 === -1) {
                this.counter.min -= 1;
                this.counter.sec = 59;
            } else this.counter.sec -= 1;

            if (this.counter.min === 0 && this.counter.sec === 0) {
                clearInterval(intervalId);
                this.startTimer(); //command
            }
        }, 1000);
    }

    setCounter(min: number, sec: number): { min: number; sec: number } {
        const counter = { min: min, sec: sec };
        return counter;
    }
    skipTurnValidUser(): boolean {
        if (this.time === 59) return true;
        else this.time === 20;
        return false;
    }
    detectSkipTurnBtn(): boolean {
        this.messageService.skipTurnIsPressed = true;
        this.userSkipingTurn = true;
        return true;
    }
}
