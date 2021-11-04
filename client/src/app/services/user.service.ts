import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/EaselObject';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { FIRST_NAME, MAX_PLAYER, PARAMETERS_OF_SWAP, SECOND_NAME, SIX_TURN, THIRD_NAME } from '@app/constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageService } from './message.service';
import { VirtualPlayerService } from './virtual-player.service';
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
    playMode: string;
    passesCounter: number = 0;
    realUser: RealUser;
    joinedUser: JoinedUser;
    vrUser: VrUser;
    gameName: string;
    chatCommandToSend: ChatCommand;
    commandtoSendObs: BehaviorSubject<ChatCommand> = new BehaviorSubject<ChatCommand>({} as ChatCommand);
    observableCommandToSend: Observable<ChatCommand>;
    playedObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    observablePlayed: Observable<boolean>;
    passTurn: boolean = false;
    exchangeLetters: boolean = false;
    intervalId: number = 0;
    time: number;
    isUserQuitGame: boolean;
    isBonusBox: boolean;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;
    realUserTurnObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    observableTurnToPlay: Observable<boolean>;
    reInit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    vrPlayerNames: string[] = [FIRST_NAME, SECOND_NAME, THIRD_NAME];
    endOfGameCounter: number = 0;
    endOfGame: boolean;
    endOfGameBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    endOfGameObs: Observable<boolean>;
    firstTurn: boolean = true;
    firstMode: string = '';

    constructor(private messageService: MessageService, private virtualPlayer: VirtualPlayerService) {
        this.observableTurnToPlay = this.realUserTurnObs.asObservable();
        this.observableCommandToSend = this.commandtoSendObs.asObservable();
        this.observablePlayed = this.playedObs.asObservable();
        this.vrSkipingTurn = false;
        this.endOfGameObs = this.endOfGameBehaviorSubject.asObservable();
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
    initiliseUsers(soloMode: boolean) {
        if (!soloMode)
            this.joinedUser = {
                name: 'default',
                level: 'Joueur en ligne',
                round: '1 min',
                score: 0,
                guestPlayer: false,
                easel: new EaselObject(false),
            };
        else
            this.vrUser = {
                name: this.chooseRandomName(),
                level: 'Débutant',
                round: '1 min',
                score: 0,
                easel: new EaselObject(false),
            };
        console.log(this.vrUser);
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
        let randomInteger = this.getRandomInt(MAX_PLAYER);
        for (;;) {
            randomInteger = this.getRandomInt(MAX_PLAYER);
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

    isUserTurn(): boolean {
        if (this.playMode === 'soloGame') return this.realUser.turnToPlay;
        if (this.joinedUser.guestPlayer === false) return this.realUser.turnToPlay;
        else return !this.realUser.turnToPlay;
    }
    detectSkipTurnBtn(): boolean {
        if (this.playMode === 'soloGame') {
            this.messageService.skipTurnIsPressed = true;
            this.realUser.turnToPlay = false;
            this.realUserTurnObs.next(this.realUser.turnToPlay);
            this.checkForSixthSkip();
        } else this.passTurn = true;
        this.playedObs.next(this.passTurn);
        return true;
    }
    userPlayed() {
        this.endOfGameCounter = 0;
        this.realUser.turnToPlay = false;
        this.realUserTurnObs.next(this.realUser.turnToPlay);
    }
    get turnToPlayObs(): Observable<boolean> {
        return this.observableTurnToPlay;
    }
    get isEndOfGame(): Observable<boolean> {
        return this.endOfGameBehaviorSubject;
    }
    scoreRealPlayer(): number {
        return this.realUser.score;
    }
    checkForSixthSkip(): void {
        this.endOfGameCounter++;
        if (this.endOfGameCounter === SIX_TURN) {
            this.endOfGame = true;
            this.realUser.score = this.realUser.score - this.realUser.easel.pointInEasel();
            this.vrUser.score = this.vrUser.score - this.virtualPlayer.easel.pointInEasel();
            this.endOfGameBehaviorSubject.next(this.endOfGame);
        }
    }

    getWinnerName(): string {
        if (this.realUser.score > this.vrUser.score) return this.realUser.name;
        else if (this.realUser.score < this.vrUser.score) return this.vrUser.name;
        else return 'egale';
    }
    get initArrayMessage(): Observable<boolean> {
        return this.reInit;
    }
}
