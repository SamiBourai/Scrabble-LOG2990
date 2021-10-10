import { Injectable } from '@angular/core';
import { RealUser, VrUser } from '@app/classes/user';
import { MINUTE_TURN, NUMBER_COMPARED, NUMBER_TO_COMPARE } from '@app/constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from './message.service';
@Injectable({
    providedIn: 'root',
})
export class UserService {
    // ici nous avons pas le choix que de declarer userNameLocalStorage as any, car local storage retourne string | null
    // alors ici on deux option : c'est soit on
    // Set strictNullChecks=false in tsconfig.json.
    //  ou Declare your variable type as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userNameLocalStorage: any;
    counter: { min: number; sec: number } = { min: 0, sec: 59 };
    passesCounter: number = 0;
    realUser: RealUser;
    vrUser: VrUser;
    intervalId = 0;

    time: number;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;

    realUserTurnObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    observableTurnToPlay: Observable<boolean>;

    vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];

    constructor(private messageService: MessageService) {
        this.observableTurnToPlay = this.realUserTurnObs.asObservable();
        const first = this.chooseFirstToPlay();
        console.log(first, 'first');
        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: first, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: first,
        };
        //
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
        if (this.getRandomInt(NUMBER_COMPARED) <= NUMBER_TO_COMPARE) {
            return false;
        } else {
            return true;
        }
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
    chooseRandomName(): string {
        let randomInteger = 0;
        for (;;) {
            randomInteger = this.getRandomInt(3);
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

    // startTimer() {
    //     if (this.realUser.turnToPlay) {
    //         this.realUser.turnToPlay = false;
    //         this.counter = { min: 0, sec: MINUTE_TURN };
    //         this.time = this.counter.sec;
    //     } else {
    //         this.counter = { min: 0, sec: VR_TIME_PASS_TURN };
    //         this.virtualPlayerService.manageVrPlayerActions();
    //         this.realUser.turnToPlay = true;
    //         this.time = this.counter.sec;
    //     }

    //     const intervalId = setInterval(() => {
    //         if (this.vrSkipingTurn) {
    //             this.counter = this.setCounter(0, MINUTE_TURN);
    //             this.vrSkipingTurn = false;

    //             this.time = this.counter.sec;
    //             clearInterval(intervalId);
    //             this.startTimer();
    //         }
    //         if (this.userSkipingTurn) {
    //             this.counter = this.setCounter(0, VR_TIME_PASS_TURN);
    //             this.time = this.counter.sec;
    //             this.realUser.turnToPlay = false;
    //             this.userSkipingTurn = false;
    //             clearInterval(intervalId);
    //             this.startTimer();
    //         }
    //         if (this.counter.sec < TIME_OF_VR && this.virtualPlayerService.played) {
    //             this.counter = this.setCounter(0, MINUTE_TURN);
    //             this.realUser.turnToPlay = true;
    //             this.time = MINUTE_TURN;
    //         }
    //         if (this.counter.sec - ONE_MINUTE === -ONE_MINUTE) {
    //             this.counter.min -= ONE_MINUTE;
    //             this.counter.sec = MINUTE_TURN;
    //         } else this.counter.sec -= ONE_MINUTE;

    //         if (this.counter.min === 0 && this.counter.sec === 0) {
    //             clearInterval(intervalId);
    //             this.startTimer();
    //         }
    //     }, ONE_SECOND);
    // }

    resetCounter(min: number, sec: number) {
        this.counter = { min, sec };
    }
    skipTurnValidUser(): boolean {
        if (this.time === MINUTE_TURN) return true;
        return false;
    }
    detectSkipTurnBtn(): boolean {
        this.messageService.skipTurnIsPressed = true;
        this.userSkipingTurn = true;
        this.realUser.turnToPlay = false;
        return true;
    }
    get turnToPlayObs(): Observable<boolean> {
        return this.observableTurnToPlay;
    }
}
