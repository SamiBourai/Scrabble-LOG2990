import { Injectable } from '@angular/core';
import { EaselObject } from '@app/classes/EaselObject';
import { RealUser, VrUser } from '@app/classes/user';
import { PARAMETERS_OF_SWAP } from '@app/constants/constants';
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

        this.realUser = {
            name: this.getUserName(),
            level: 'Joueur en ligne',
            round: '1 min',
            score: 0,
            firstToPlay: first, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: first,
            easel: new EaselObject(false),
        };
        //
        this.vrUser = {
            name: this.chooseRandomName(),
            level: 'Débutant',
            round: '20 sec',
            score: 0,
            easel: new EaselObject(false),
        };
        this.vrSkipingTurn = false;
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
        this.userNameLocalStorage = localStorage.getItem('userName');
        return this.userNameLocalStorage;
    }
    getVrUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('vrUserName');
        return this.userNameLocalStorage;
    }

    resetCounter(min: number, sec: number) {
        this.counter = { min, sec };
    }
    isUserTurn(): boolean {
        return this.realUser.turnToPlay;
    }
    detectSkipTurnBtn(): boolean {
        this.messageService.skipTurnIsPressed = true;
        this.realUser.turnToPlay = false;
        this.realUserTurnObs.next(this.realUser.turnToPlay);
        return true;
    }

    userPlayed() {
        this.realUser.turnToPlay = false;
        this.realUserTurnObs.next(this.realUser.turnToPlay);
    }
    get turnToPlayObs(): Observable<boolean> {
        return this.observableTurnToPlay;
    }
    scoreRealPlayer(): number {
        return this.realUser.score;
    }
}
