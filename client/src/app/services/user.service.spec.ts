/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser } from '@app/classes/user';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(UserService);
        jasmine.getEnv().allowRespy(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('chooseFirstToPlay', () => {
        const spy = spyOn<any>(Math, 'floor');
        service.chooseFirstToPlay();
        expect(spy).toHaveBeenCalled();
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

    it('checkForSixthSkip', () => {
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

    it('getWinnerName', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 7,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.vrUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('bob');
    });

    it('getWinnerName 2', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 0, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.vrUser = user;
        const x = service.getWinnerName();
        expect(x).toEqual('charles');
    });

    it('getWinnerName 3', () => {
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service.realUser = userR;
        const user: JoinedUser = {
            name: 'charles',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service.vrUser = user;
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


    it('updateScore', () => {
        service.playMode = 'joinMultiplayerGame';
        const points = 50;
        const bonus = true;
        const userR: JoinedUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true), guestPlayer: true };
        service.joinedUser = userR;
        service.updateScore(points, bonus);
        service.playMode = 'soloGame';
        service.updateScore(points, bonus);
    });
});
