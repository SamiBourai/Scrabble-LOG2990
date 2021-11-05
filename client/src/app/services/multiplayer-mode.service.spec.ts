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
import { MultiplayerModeService } from './multiplayer-mode.service';

describe('MultiplayerModeService', () => {
    let service: MultiplayerModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(MultiplayerModeService);
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        service['userService'].realUser = userR;
        const user: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        service['userService'].joinedUser = user;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('winnerOfGame', () => {
        const i = service.winnerOfGame;
        expect(i).toEqual(service.winnerObs);
    });

    it('beginGame false', () => {
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: false,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));

        service.beginGame();
        expect(spy).toHaveBeenCalled();
    });

    it('beginGame true', () => {
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: true,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));

        service.beginGame();
        expect(spy).toHaveBeenCalled();
    });

    it('beginGame undefined', () => {
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: undefined,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));

        service.beginGame();
        expect(spy).toHaveBeenCalled();
    });

    it('play', () => {
        service.setGuestPlayerInfromation('abdel1232');
        service['userService'].chatCommandToSend = {
            word: 'azzz',
            direction: 'p',
            position: { x: 1, y: 1 },
        };
        const place = true;
        service['userService'].exchangeLetters = false;
        service['userService'].passTurn = false;
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };

        const spy = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        service.play('guestUserPlayed', place);
        expect(spy).toHaveBeenCalled();
        expect(service['userService'].realUser.turnToPlay).toBeTrue();
        service.play('soloGame', place);
        expect(service['userService'].realUser.turnToPlay).toBeFalse();
    });

    it('play 2', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const place = false;
        service['userService'].exchangeLetters = true;
        service['userService'].passTurn = false;
        const data: MessageServer = {
            gameName: 'game4546',
        };
        const spy = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        service.play('soloGame', place);
        expect(spy).toHaveBeenCalled();
    });

    it('play else if 1 true', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const place = false;
        service['userService'].exchangeLetters = false;
        service['userService'].passTurn = true;
        const data: MessageServer = {
            gameName: 'game4546',
            passTurn: true,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        service.play('soloGame', place);
        expect(spy).toHaveBeenCalled();
    });

    it('play if false', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const place = true;
        service['userService'].exchangeLetters = false;
        service['userService'].passTurn = false;
        service.play('guestUserPlayed', place);
    });

    it('play else if false', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const place = false;
        service['userService'].exchangeLetters = false;
        service['userService'].passTurn = false;
        service.play('guestUserPlayed', place);
    });

    it('updateReserveChangeLetters', () => {
        const data: MessageServer = {
            gameName: 'game000111',
            reserve: 'quel projet de plouc',
            reserveSize: 5,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy2 = spyOn<any>(service['reserveService'], 'redefineReserve');

        service.updateReserveChangeLetters();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('updateReserveChangeLetters with undefined data', () => {
        const data: MessageServer = {
            gameName: 'game000111',
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy2 = spyOn<any>(service['reserveService'], 'redefineReserve');

        service.updateReserveChangeLetters();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('getPlayedCommand', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            gameStarted: true,
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('soloGame');
        expect(spy).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('getPlayedCommand undefined data', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            gameStarted: true,
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
            reserve: 'quel projet de plouc',
            reserveSize: 5,
            usedWords: 'hello',
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        // const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
        // expect(spy3).toHaveBeenCalled();
    });

    it('getPlayedCommand undefined data', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            gameStarted: true,
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
            reserve: 'quel projet de plouc',
            reserveSize: 5,
            usedWords: 'hello',
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        // const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
        // expect(spy3).toHaveBeenCalled();
    });

    it('getPlayedCommand', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: true,
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('soloGame');
        expect(spy).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('getPlayedCommand', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: true,
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 0 },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(service['userService'].realUser.turnToPlay).toBeTrue();
        service.getPlayedCommand('soloGame');
        expect(spy).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
        expect(service['userService'].realUser.turnToPlay).toBeFalse();
    });

    it('getPlayedCommand if true', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: true,
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy3 = spyOn<any>(service['lettersService'], 'placeLettersWithDirection');
        service.getPlayedCommand('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('sendReserve', () => {
        const spy = spyOn<any>(service['socketManagementService'], 'reserveToserver');
        service.sendReserve();
        expect(spy).toHaveBeenCalled();
    });

    it('updateReserve', () => {
        const spy = spyOn<any>(service['socketManagementService'], 'reserveToClient');
        service.updateReserve();
        expect(spy).toHaveBeenCalled();
    });

    it('getJoinReserve', () => {
        const spy = spyOn<any>(service['socketManagementService'], 'reserveToJoinOnfirstTurn');
        service.getJoinReserve();
        expect(spy).toHaveBeenCalled();
    });

    it('setGuestPlayerInfromation', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const spy = spyOn<any>(service['userService'], 'initiliseUsers');
        service.setGuestPlayerInfromation('abdel234');
        expect(spy).toHaveBeenCalled();
    });

    it('setGameInformations', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const room: MessageServer = {
            gameName: 'partie111',
        };
        const data: MessageServer = {
            gameName: room.gameName,
            guestPlayer: { name: 'abdel' },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        const spy2 = spyOn<any>(service['userService'], 'initiliseUsers');

        service.setGameInformations(room, 'abdel');

        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(service['userService'].joinedUser.guestPlayer).toBeTrue();
        expect(service['userService'].realUser.name).toEqual('default');
        expect(service['userService'].joinedUser.name).toEqual('abdel');
        expect(service['userService'].gameName).toEqual('partie111');
    });

    it('setGameInformations', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const room: MessageServer = {
            gameName: 'partie111',
            user: { name: 'marouane' },
        };
        const data: MessageServer = {
            gameName: room.gameName,
            guestPlayer: { name: 'abdel' },
        };
        const spy = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(data);
        const spy2 = spyOn<any>(service['userService'], 'initiliseUsers');

        service.setGameInformations(room, 'abdel');

        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(service['userService'].joinedUser.guestPlayer).toBeTrue();
        expect(service['userService'].realUser.name).toEqual('marouane');
        expect(service['userService'].joinedUser.name).toEqual('abdel');
        expect(service['userService'].gameName).toEqual('partie111');
    });

    it('getMessageSend', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            gameName: 'game000111',
            message: [],
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        service.getMessageSend('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
    });

    it('getMessageSend', () => {
        service.setGuestPlayerInfromation('abdel1232');
        const data: MessageServer = {
            gameName: 'game000111',
            message: undefined,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        service.getMessageSend('guestUserPlayed');
        expect(spy).toHaveBeenCalled();
    });

    it('sendMessage', () => {
        const spy = spyOn<any>(service['socketManagementService'], 'emit');
        service.sendMessage('maison');
        expect(spy).toHaveBeenCalled();
    });

    it('playerLeftGame', () => {
        const data: MessageServer = {
            gameName: 'game000111',
            gameStarted: true,
        };
        const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy2 = spyOn<any>(service.winnerObs, 'next');
        service.playersLeftGamge();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
