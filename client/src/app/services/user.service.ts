import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import {
    BONUS_POINTS_50,
    FIFTH_NAME,
    FIRST_NAME,
    FOURTH_NAME,
    PARAMETERS_OF_SWAP,
    SECOND_NAME,
    SIXTH_NAME,
    SIX_TURN,
    THIRD_NAME,
    UNDEFINED_INDEX,
} from '@app/constants/constants';
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
    realUser: RealUser;
    joinedUser: JoinedUser;
    vrUser: VrUser;
    gameName: string = 'default';
    chatCommandToSend: ChatCommand;
    commandtoSendObs: BehaviorSubject<ChatCommand> = new BehaviorSubject<ChatCommand>({
        word: '',
        position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX },
        direction: '',
    });
    observableCommandToSend: Observable<ChatCommand>;
    playedObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    observablePlayed: Observable<boolean>;
    passTurn: boolean = false;
    exchangeLetters: boolean = false;
    intervalId: number = 0;
    gameModeObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isUserQuitGame: boolean = false;
    userQuit: Observable<boolean>;
    isBonusBox: boolean;
    vrSkipingTurn: boolean;
    userSkipingTurn: boolean;
    realUserTurnObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    reInit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    vrPlayerNamesBeginner: string[][] = [[FIRST_NAME, SECOND_NAME, THIRD_NAME], []]; // admin ici pour nom vr user
    vrPlayerNamesExpert: string[][] = [[FOURTH_NAME, FIFTH_NAME, SIXTH_NAME], []];

    endOfGameCounter: number = 0;
    endOfGame: boolean;
    endOfGameBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    firstMode: string = '';

    isUserResetData: boolean;
    isUserResetDataObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    constructor(private messageService: MessageService, private virtualPlayer: VirtualPlayerService) {
        this.observableCommandToSend = this.commandtoSendObs.asObservable();
        this.observablePlayed = this.playedObs.asObservable();
        this.vrSkipingTurn = false;

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
                name: this.chooseRandomNameBeg(),
                level: 'Débutant',
                round: '1 min',
                score: 0,
                easel: new EaselObject(false),
            };
    }
    chooseFirstToPlay(): boolean {
        const randomIndex = Math.floor(Math.random() * PARAMETERS_OF_SWAP);
        if (randomIndex < PARAMETERS_OF_SWAP / 2) {
            return false;
        } else {
            return true;
        }
    }

    getPlayerEasel(): EaselObject {
        if (this.playMode === 'joinMultiplayerGame') {
            return this.joinedUser.easel;
        } else return this.realUser.easel;
    }
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
    mergeBoth(names: string[][]): string[] {
        const mergedNames: string[] = [];
        for (let i = 0; i < 2; i++) {
            for (const name of names[i]) {
                mergedNames.push(name);
            }
        }
        return mergedNames;
    }
    chooseRandomNameBeg(): string {
        const randomInteger = this.getRandomInt(this.mergeBoth(this.vrPlayerNamesBeginner).length);
        return this.mergeBoth(this.vrPlayerNamesBeginner)[randomInteger];
    }
    chooseRandomNameExp(): string {
        const randomInteger = this.getRandomInt(this.mergeBoth(this.vrPlayerNamesExpert).length);
        return this.mergeBoth(this.vrPlayerNamesExpert)[randomInteger];
    }
    getUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('userName');
        return this.userNameLocalStorage;
    }

    getVrUserName(): string {
        this.userNameLocalStorage = localStorage.getItem('vrUserName');
        return this.userNameLocalStorage;
    }
    setVrName() {
        if (this.virtualPlayer.expert) {
            do {
                this.vrUser.name = this.chooseRandomNameExp();
            } while (this.vrUser.name === this.realUser.name);
            localStorage.setItem('vrUserName', this.vrUser.name);
            this.vrUser.level = 'Expert';
        } else {
            this.vrUser.name = this.chooseRandomNameBeg();
            this.vrUser.level = 'Débutant';
        }
    }
    isUserTurn(): boolean {
        if (this.playMode === 'soloGame') return this.realUser.turnToPlay;
        if (!this.joinedUser.guestPlayer) return this.realUser.turnToPlay;
        else return !this.realUser.turnToPlay;
    }
    detectSkipTurnBtn(): boolean {
        this.messageService.skipTurnIsPressed = true;
        if (this.playMode === 'soloGame') {
            this.realUser.turnToPlay = false;
            this.realUserTurnObs.next(this.realUser.turnToPlay);
            this.checkForSixthSkip();
        } else {
            this.passTurn = true;
            this.playedObs.next(this.passTurn);
        }
        return true;
    }
    userPlayed() {
        this.endOfGameCounter = 0;
        this.realUser.turnToPlay = false;
        this.realUserTurnObs.next(this.realUser.turnToPlay);
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
        switch (this.playMode) {
            case 'soloGame':
                if (this.realUser.score > this.vrUser.score) return this.realUser.name;
                else if (this.realUser.score < this.vrUser.score) return this.vrUser.name;
                else return 'egale';

            default:
                if (this.realUser.score > this.joinedUser.score) return this.realUser.name;
                else if (this.realUser.score < this.joinedUser.score) return this.joinedUser.name;
                else return 'egale';
        }
    }

    isPlayerTurn(): boolean {
        if (this.playMode === 'joinMultiplayerGame' && !this.realUser.turnToPlay) {
            return true;
        } else if (this.playMode === 'joinMultiplayerGame' && this.realUser.turnToPlay) return false;
        else return this.realUser.turnToPlay;
    }
    get initArrayMessage(): Observable<boolean> {
        return this.reInit;
    }
    updateScore(points: number, bonus: boolean) {
        if (this.playMode === 'joinMultiplayerGame') {
            if (bonus) this.joinedUser.score += BONUS_POINTS_50;
            this.joinedUser.score += points;
        } else {
            if (bonus) this.realUser.score += BONUS_POINTS_50;
            this.realUser.score += points;
        }
    }
    setJoinAsReal() {
        this.realUser = {
            name: this.joinedUser.name,
            level: this.joinedUser.level,
            round: this.joinedUser.round,
            score: this.joinedUser.score,
            firstToPlay: true, // if true le realuser va commencer sinon c'est vrUser va commencer
            turnToPlay: this.isPlayerTurn(),
            easel: this.getPlayerEasel(),
        };
    }

    getScore(): number {
        if (this.playMode === 'joinMultiplayerGame') {
            return this.joinedUser.score;
        } else return this.realUser.score;
    }
    getPlayerName(): string {
        if (this.playMode === 'joinMultiplayerGame') {
            return this.joinedUser.name;
        } else return this.realUser.name;
    }

    get getIsUserResetDataObs(): BehaviorSubject<boolean> {
        return this.isUserResetDataObs;
    }
}
