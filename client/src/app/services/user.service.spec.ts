/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { UserService } from './user.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('UserService', () => {
    let service: UserService;
    let virtualPlayerService: VirtualPlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [VirtualPlayerService],
        });
        service = TestBed.inject(UserService);
        virtualPlayerService = TestBed.inject(VirtualPlayerService);
        jasmine.getEnv().allowRespy(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initiliseUsers should init users in different mode', () => {
        service.initiliseUsers(false);
        expect(service.joinedUser.name).toEqual('default');
    });
    it('initiliseUsers should init vr users in solo mode', () => {
        service.initiliseUsers(true);
        expect(service.vrUser.level).toEqual('Débutant');
    });
    it('mergedBoth should return an array of one dimension', () => {
        const arrayTest: string[][] = [['sami'], ['salut']];

        const returnedsArray = service.mergeBoth(arrayTest);
        expect(returnedsArray[0]).toEqual('sami');
    });

    it('chooseFirstToPlay', () => {
        const spy = spyOn<any>(Math, 'floor');
        service.chooseFirstToPlay();
        expect(spy).toHaveBeenCalled();
    });
    it('chooseRandomNameBeg() should return the first name -salut', () => {
        spyOn<any>(service, 'getRandomInt').and.returnValue(1);
        service.vrPlayerNamesBeginner = [['sami'], ['salut']];
        const returnValue = service.chooseRandomNameBeg();
        expect(returnValue).toEqual('salut');
    });
    it('chooseRandomNameExp() should return the first-salut', () => {
        spyOn<any>(service, 'getRandomInt').and.returnValue(1);
        service.vrPlayerNamesBeginner = [['sami'], ['salut']];
        const returnValue = service.chooseRandomNameExp();
        expect(returnValue).toEqual('Emmanuel1234');
    });

    it('setVrName() should choose random name depend  on which vp that user choose', () => {
        virtualPlayerService.expert = true;
        const user: VrUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
        };
        service.vrUser = user;
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        spyOn<any>(service, 'getRandomInt').and.returnValue(0);
        spyOn<any>(service, 'mergeBoth').and.returnValue([['sami'], ['salut']]);
        spyOn<any>(service, 'chooseRandomNameExp').and.returnValue('sami');
        spyOn<any>(localStorage, 'setItem').and.callThrough();
        service.setVrName();
        expect(service.vrUser.level).toEqual('Expert');
    });

    it('setVrName() should choose random name depend  on which vp that user choose', () => {
        virtualPlayerService.expert = false;
        const user: VrUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
        };
        service.vrUser = user;
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        spyOn<any>(service, 'getRandomInt').and.returnValue(0);
        spyOn<any>(service, 'mergeBoth').and.returnValue([['sami'], ['salut']]);
        spyOn<any>(service, 'chooseRandomNameBeg').and.returnValue('sami');
        spyOn<any>(localStorage, 'setItem').and.callThrough();
        service.setVrName();
        expect(service.vrUser.level).toEqual('Débutant');
    });

    it('getPlayerEasel', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        service.playMode = 'joinMultiplayerGame';
        const x = service.getPlayerEasel();
        expect(x).toEqual(service.joinedUser.easel);
    });

    it('getPlayerEasel', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'soloGame';
        const x2 = service.getPlayerEasel();
        expect(x2).toEqual(service.realUser.easel);
    });

    it('chooseRandomName', () => {
        spyOn<any>(service, 'getRandomInt').and.returnValue(1);
        spyOn<any>(localStorage, 'getItem').and.returnValue('abdel124');
        const x = 2;
        expect(x).toEqual(2);
    });

    it('getVrUsername', () => {
        spyOn<any>(localStorage, 'getItem').and.returnValue('abdel124');
        const x2 = service.getVrUserName();
        expect(x2).toEqual('abdel124');
    });

    it('getVrUsername', () => {
        spyOn<any>(localStorage, 'getItem').and.returnValue('abdel124');
        const x2 = service.getVrUserName();
        expect(x2).toEqual('abdel124');
    });

    it('isUserTurn', () => {
        service.playMode = 'soloGame';
        const x2 = service.isUserTurn();
        expect(x2).toEqual(service.realUser.turnToPlay);
    });

    it('isUserTurn2', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        service.playMode = 'miedsad';
        const x2 = service.isUserTurn();
        expect(x2).toEqual(service.realUser.turnToPlay);
    });

    it('isUserTurn3', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.joinedUser = user;
        service.playMode = 'miedsad';
        const x2 = service.isUserTurn();
        expect(x2).toEqual(!service.realUser.turnToPlay);
    });

    it('detectSkipTurnBtn', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.joinedUser = user;
        service.playMode = 'soloGame';
        const spy = spyOn<any>(service.realUserTurnObs, 'next');
        const spy2 = spyOn<any>(service, 'checkForSixthSkip');
        service.detectSkipTurnBtn();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('detectSkipTurnBtn else', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.joinedUser = user;
        service.playMode = 'asdsad';
        const spy = spyOn<any>(service.playedObs, 'next');
        service.detectSkipTurnBtn();
        expect(spy).toHaveBeenCalled();
    });

    it('userPlayed', () => {
        const spy = spyOn<any>(service.realUserTurnObs, 'next');
        service.userPlayed();
        expect(spy).toHaveBeenCalled();
    });

    it('scoreRealPlayer', () => {
        const x = service.scoreRealPlayer();
        expect(x).toEqual(service.realUser.score);
    });

    it('checkForSixthSkip should set end game to true in case counter=5', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.vrUser = user;
        service.endOfGameCounter = 5;
        const spy = spyOn<any>(service.realUser.easel, 'pointInEasel');
        const spy2 = spyOn<any>(service['virtualPlayer'].easel, 'pointInEasel');
        const spy3 = spyOn<any>(service.endOfGameBehaviorSubject, 'next');
        service.checkForSixthSkip();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });
    it('checkForSixthSkip should increment counter 4 to 5', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.vrUser = user;
        service.endOfGameCounter = 4;
        const spy = spyOn<any>(service.realUser.easel, 'pointInEasel');
        const spy2 = spyOn<any>(service['virtualPlayer'].easel, 'pointInEasel');
        const spy3 = spyOn<any>(service.endOfGameBehaviorSubject, 'next');
        service.checkForSixthSkip();
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
        expect(spy3).not.toHaveBeenCalled();
        expect(service.endOfGameCounter).toEqual(5);
    });

    it('getWinnerName', () => {
        service.playMode = 'soloGame';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true), firstToPlay: true, turnToPlay: true };
        service.realUser = userR;
        const user: VrUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 7,
            easel: new EaselObject(true),
        };
        service.vrUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('bob');
    });

    it('getWinnerName 2', () => {
        service.playMode = 'soloGame';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 0, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: VrUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
        };
        service.vrUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('charles');
    });

    it('getWinnerName 3', () => {
        service.playMode = 'soloGame';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: VrUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
        };
        service.vrUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('egale');
    });

    it('getWinnerName case default 1', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true), firstToPlay: true, turnToPlay: true };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 7,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('bob');
    });

    it('getWinnerName 2 case default 2', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 0, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('charles');
    });

    it('getWinnerName 3 case default 3', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('egale');
    });

    it('isPlayerTurn', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: false, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'joinMultiplayerGame';
        const x = service.isPlayerTurn();
        expect(x).toEqual(true);
    });

    it('isPlayerTurn 2', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'joinMultiplayerGame';
        const x = service.isPlayerTurn();
        expect(x).toEqual(false);
    });

    it('isPlayerTurn 2', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'soloGame';
        const x = service.isPlayerTurn();
        expect(x).toEqual(service.realUser.turnToPlay);
    });
    it('getPlayerName() in different mode', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'soloGame';
        const x = service.getPlayerName();
        expect(x).toEqual('bob');
    });
    it('getPlayerName() in case if we play multiplayerGame', () => {
        service.playMode = 'joinMultiplayerGame';
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        const x = service.getPlayerName();
        expect(x).toEqual('charles');
    });
    it('updateScore() case we play in multi player game and bonus is true should add points defined to score of guest user', () => {
        service.playMode = 'joinMultiplayerGame';
        const userR: JoinedUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true), guestPlayer: true };
        service.joinedUser = userR;
        service.updateScore(50, true);
        expect(service.joinedUser.score).toEqual(83);
    });
    it('updateScore() case we play in multi player game and bonus is false should add points defined to score of guest user', () => {
        service.playMode = 'joinMultiplayerGame';
        const userR: JoinedUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true), guestPlayer: true };
        service.joinedUser = userR;
        service.updateScore(50, false);
        expect(service.joinedUser.score).toEqual(58);
    });
    it('updateScore() case we play in multi player game and bonus is false should add points defined to score of local user', () => {
        service.playMode = 'soloGame';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.updateScore(50, true);
        expect(service.realUser.score).toEqual(83);
    });
    it('updateScore() case we play in multi player game and bonus is false should add points defined to score of local user', () => {
        service.playMode = 'soloGame';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.updateScore(50, false);
        expect(service.realUser.score).toEqual(58);
    });

    it('setJoinAsReal() should transform user guest to real user', () => {
        service.playMode = 'joinMultiplayerGame';
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        service.setJoinAsReal();
        expect(user.name).toEqual(service.realUser.name);
    });

    it('getScore() in different mode', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        service.playMode = 'soloGame';
        const x = service.getScore();
        expect(x).toEqual(8);
    });
    it('getScore() in case if we play multiplayerGame', () => {
        service.playMode = 'joinMultiplayerGame';
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service.joinedUser = user;
        const x = service.getScore();
        expect(x).toEqual(8);
    });

    it('initArrayMessage', () => {
        const i = service.initArrayMessage;
        expect(i).toEqual(service.reInit);
    });
    it('getIsUserResetDataObs()', () => {
        const i = service.getIsUserResetDataObs;
        expect(i).toEqual(service.isUserResetDataObs);
    });
});
