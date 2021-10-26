import { Injectable } from '@angular/core';
import { EaselObject } from '@app/classes/EaselObject';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { MINUTE_TURN, PARAMETERS_OF_SWAP } from '@app/constants/constants';
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
    playMode: string;
    counter: { min: number; sec: number } = { min: 0, sec: 59 };
    passesCounter: number = 0;
    realUser: RealUser;
    joinedUser: JoinedUser;
    vrUser: VrUser;
    intervalId = 0;
    time: number;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;
    realUserTurnObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    observableTurnToPlay: Observable<boolean>;
    realUserSkipHisTurn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    obsSkipTurn: BehaviorSubject<boolean>;
    creatorFirstPlayer: boolean;
    vrPlayerNames: string[] = ['Bobby1234', 'Martin1234', 'Momo1234'];

    constructor(private messageService: MessageService) {
        this.observableTurnToPlay = this.realUserTurnObs.asObservable();
        if (this.playMode !== 'soloMode') {
            this.joinedUser = {
                name: 'default',
                level: 'Joueur en ligne',
                round: '1 min',
                score: 0,
                turnToPlay: false,
                easel: new EaselObject(false),
            };
        } else {
            this.vrUser = {
                name: this.chooseRandomName(),
                level: 'Débutant',
                round: '20 sec',
                score: 0,
                easel: new EaselObject(false),
            };
            this.vrSkipingTurn = false;
        }
        const first = this.chooseFirstToPlay();
        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: first, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: first,
            easel: new EaselObject(false),
        };

        this.userSkipingTurn = false;
    }

    chooseFirstToPlay(): boolean {
        const randomIndex = Math.floor(Math.random() * PARAMETERS_OF_SWAP);
        if (randomIndex <= PARAMETERS_OF_SWAP / 2) {
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
        if (this.playMode === 'soloMode') {
            const userNameLocalStorage = localStorage.getItem('userName');
            return userNameLocalStorage ?? '';
        } else return 'default';
    }
    getVrUserName(): string {
        const userNameLocalStorage = localStorage.getItem('vrUserName');
        return userNameLocalStorage ?? '';
    }

    // resetCounter(min: number, sec: number) {
    //     this.counter = { min, sec };
    // }
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
