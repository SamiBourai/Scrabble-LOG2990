/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { MessageServer } from '@app/classes/message-server';
import { JoinedUser, RealUser } from '@app/classes/user';
import { of } from 'rxjs';
import { GameTime } from './../classes/time';
import { TimeService } from './time.service';
import { UserService } from './user.service';

fdescribe('TimeService', () => {
    let service: TimeService;
    let userService: jasmine.SpyObj<UserService>;

    beforeEach(() => {
        userService = jasmine.createSpyObj('UserService', ['detectSkipTurnBtn', 'realUserTurnObs']);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [{ provide: UserService, useValue: userService }],
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

    it('startTime should clear interval in case it a already end game', () => {
        // service.
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

    it('40,41', () => {
        const s = 'user';
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: false, easel: new EaselObject(true) };
        service['userService'].realUser = userR;
        service.timeUser.min = 2;
        service.timeUser.sec = 2;

        service.startTime(s);
        expect(service.timeUser.min).toEqual(2);
    });

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
