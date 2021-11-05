/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { GameTime } from './../classes/time';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TimeService } from './time.service';
import { JoinedUser, RealUser } from '@app/classes/user';
import { EaselObject } from '@app/classes/EaselObject';
import { of } from 'rxjs';
import { MessageServer } from '@app/classes/message-server';

describe('TimeService', () => {
    let service: TimeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(TimeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('timeMultiplayer', () => {
        const g: GameTime = { min: 1, sec: 30 };
        service.timeMultiplayer(g);
        expect(service.timeUser).toEqual(g);
    });

    it('startTime', () => {
        const s = 'user';
        const spy = spyOn<any>(global, 'setInterval');
        service.startTime(s);
        expect(spy).toHaveBeenCalled();
    });

    it('startTime if', () => {
        const s = 'user';
        service.timeUser.sec = 0;
        service.startTime(s);
        expect(service.timeUser.sec).toEqual(0);
    });

    it('startTime else', () => {
        const s = 'user';
        service.timeUser.sec = 1;
        service.startTime(s);
        expect(service.timeUser.sec).toEqual(1);
    });

    it('startTime vrPlayer', () => {
        const s = 'vrPlayer';
        service.timeVrPlayer.sec = 0;
        service.startTime(s);
        expect(service.timeVrPlayer.sec).toBe(0);
    });

    it('startTime vrPlayer else', () => {
        const s = 'vrPlayer';
        service.timeVrPlayer.sec = 1;
        service.startTime(s);
        expect(service.timeVrPlayer.sec).toBe(1);
    });

    it('40,41',()=>{
        const s = 'user';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: false, easel: new EaselObject(true) };
        service['userService'].realUser = userR;
        service.timeUser.min = 2;
        service.timeUser.sec = 2;
        
        service.startTime(s);
        expect(service.timeUser.min).toEqual(2)
    })

    // it('54,55', () => {
    //     const s = 'vrPlayer';

    //     service.timeVrPlayer.sec = 1;
    //     service['virtualPlayerService'].played = true;
    //     service['virtualPlayerService'].skipTurn = true;
    //     //const spy = spyOn(service['userService'], 'checkForSixthSkip');
    //     service.startTime(s);
    //     //expect(spy).not.toHaveBeenCalled();
    //     expect(service['virtualPlayerService'].skipTurn).toBeTrue();
    // });

    it('startMultiplayerTimer', () => {
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        const data = 'allo1234';
        service['userService'].joinedUser = user;
        service.timeStarted = false;
        spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        service.startMultiplayerTimer();
        expect(service.timeStarted).toBeTrue();
    });

    it('startMulti suite', () => {
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            timer: { sec: 30, min: 1, userTurn: true },
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: false, easel: new EaselObject(true) };
        service['userService'].realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service['userService'].joinedUser = user;
        spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        service.startMultiplayerTimer();
        expect(service['userService'].realUser.turnToPlay).toBeTrue();
    });

    it('startMultiplayerTimer suite 2', () => {
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            timer: { sec: 30, min: 1, userTurn: false },
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };

        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service['userService'].realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: true,
        };
        service['userService'].joinedUser = user;

        spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        service.startMultiplayerTimer();
        expect(service['userService'].realUser.turnToPlay).toBeFalse();
    });

    it('setGameTime', () => {
        const g: GameTime = { min: 1, sec: 30 };
        service.setGameTime(g);
        expect(service.timeUser).toEqual(g);
    });
});
