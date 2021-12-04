/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { A, B, C, D, E, F, G, LETTERS_RESERVE_QTY, NOT_A_LETTER } from '@app/classes/constants';
import { GameObject } from '@app/classes/game-object';
import { Letter } from '@app/classes/letters';
import { MessageClient } from '@app/classes/message-client';
import { Timer } from '@app/classes/timer';
import { Vec2 } from '@app/classes/vec2';
import { expect } from 'chai';
import * as Sinon from 'sinon';
import { createStubInstance, SinonFakeTimers, SinonStubbedInstance, useFakeTimers } from 'sinon';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { SocketManagerService } from './socket-manager.service';
import { ValidWordService } from './validate-words.service';

// eslint-disable-next-line no-restricted-imports

describe('SocketManagerService', () => {
    let socketManagerService: SocketManagerService;
    let validateWordService: SinonStubbedInstance<ValidWordService>;
    let sio: SinonStubbedInstance<io.Server>;
    let gameObject: GameObject;
    let timer: Timer;
    let clock: SinonFakeTimers;
    const vec2: Vec2[][] = [[{ x: 1, y: 0 }], [{ x: 1, y: 0 }]];
    const letter: Letter[] = [A, B, C];
    const messagesClient: MessageClient = {
        gameName: 'test',
        aleatoryBonus: false,
        user: { name: 'sami', score: 10, easelLetters: 7 },
        timeConfig: { sec: 0, min: 0 },
        command: { word: 'je', position: { x: 0, y: 0 }, direction: 'v', gameName: 'test' },
        arrayOfBonusBox: vec2,
        timer: { sec: 5, min: 1, userTurn: false },
        passTurn: true,
        reserve: 'x1',
        reserveSize: 86,
        winner: 'guest',
        guestPlayer: { name: 'sami', score: 10, easelLetters: 7 },
        word: letter,
        modeLog2990: true,
    };
    const arrayOfMessage: string[] = ['salut', 'yofsds', 'edjeiufre'];
    const sioToStubed = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        emit: () => {},
    } as unknown as io.BroadcastOperator<DefaultEventsMap>;
    beforeEach(() => {
        clock = useFakeTimers();
        gameObject = new GameObject('test', false, { name: 'sami', score: 10, easelLetters: 7, socketId: '' }, 0, 0, false);
        timer = new Timer();
        timer.playerPlayed = false;
        validateWordService = createStubInstance(ValidWordService);
        sio = createStubInstance(io.Server);
        socketManagerService = new SocketManagerService(validateWordService);
        socketManagerService.sio = sio as unknown as io.Server;
        gameObject.passTurn = 6;
        gameObject.arrayOfMessage = arrayOfMessage;
        gameObject.timer = timer;
        gameObject.creatorPlayer = { name: 'sami', score: 7, easelLetters: 6, socketId: '' };
        socketManagerService['games'].set('test', gameObject);
    });
    afterEach(async () => {
        clock.restore();
    });
    it('connection', () => {
        const spySocket = {
            on: (eventName: string, callback: () => void) => {
                return;
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as io.Server;
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('createGame', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'createGame') {
                    callback(messagesClient);
                }
            },
            join: () => {},
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as io.Server;
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('generateAllRooms', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'generateAllRooms') {
                    callback(messagesClient);
                }
            },
            emit: () => {},
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as io.Server;
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('joinRoom', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'joinRoom') {
                    callback(messagesClient);
                }
            },
            join: () => {},
            emit: () => {},
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('getAleatoryBonus', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'getAleatoryBonus') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('setAleatoryBonusBox', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'setAleatoryBonusBox') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('acceptGame', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'acceptGame') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('guestInGamePage', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'guestInGamePage') callback(messagesClient);
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
        // mock.restore();
    });

    it('creatorPlayed', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'creatorPlayed') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('guestUserPlayed', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'guestUserPlayed') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });
    it('startTimer', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'startTimer') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // socketManagerService['games']
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
    });

    it('passTurn when pass turn it set to default', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'passTurn') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it('passTurn when pass turn counter is equal to 6', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'passTurn') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        messagesClient.passTurn = false;
        gameObject.passTurn = 6;
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        // Sinon.spy();
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });

    it(' on updateReserveInServer', () => {
        const reserveServer = new Map<Letter, number>(LETTERS_RESERVE_QTY);
        const spySocket = {
            on: (eventName: string, callback: (gameName: string, map: string, size: number) => void) => {
                if (eventName === 'updateReserveInServer') {
                    callback('test', JSON.stringify(Array.from(reserveServer)), 86);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it(' on changeLetter', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'changeLetter') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it(' on sendReserveJoin', () => {
        const spySocket = {
            on: (eventName: string, callback: (gameName: string) => void) => {
                if (eventName === 'sendReserveJoin') {
                    callback(messagesClient.gameName);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it(' on sendMessage', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'sendMessage') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });

    it(' on guestLeftGame', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'guestLeftGame') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        // socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });

    it(' on userLeftGame', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'userLeftGame') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation

        // socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it(' on userPassedInSoloMode', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'userPassedInSoloMode') {
                    callback(messagesClient);
                }
            },
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as unknown as io.Server;
        socketManagerService['updateDeletedGames'](messagesClient);
        // eslint-disable-next-line dot-notation
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    // it(' on userCanceled', () => {
    //     const spySocket = {
    //         on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
    //             if (eventName === 'userCanceled') {
    //                 callback(messagesClient);
    //             }
    //         },
    //     };
    //     socketManagerService.sio = {
    //         on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
    //             if (eventName === 'connection') callBackfunction(spySocket);
    //         },
    //     } as unknown as io.Server;
    //     socketManagerService['updateDeletedGames'](messagesClient);
    //     // eslint-disable-next-line dot-notation
    //     const spy = Sinon.spy(spySocket, 'on');
    //     socketManagerService.handleSockets();
    //     expect(spy.called).to.equal(true);
    //     spy.restore();
    // });
    it(' on verifyWordGuest', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'verifyWordGuest') {
                    callback(messagesClient);
                }
            },
            emit: () => {},
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
            to: () => {
                return sioToStubed;
            },
        } as unknown as io.Server;
        socketManagerService['games'].set(messagesClient.gameName, messagesClient);
        const word: Letter[] = [];
        validateWordService.verifyWord(messagesClient.word ?? word);
        // eslint-disable-next-line dot-notation
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });
    it(' on disconnect', () => {
        const spySocket = {
            on: (eventName: string, callback: (onMessage: MessageClient) => void) => {
                if (eventName === 'disconnect') {
                    callback(messagesClient);
                }
            },
            disconnect: () => {},
        };
        socketManagerService.sio = {
            on: (eventName: string, callBackfunction: (socket: unknown) => void) => {
                if (eventName === 'connection') callBackfunction(spySocket);
            },
        } as unknown as io.Server;
        // eslint-disable-next-line dot-notation
        const spy = Sinon.spy(spySocket, 'on');
        socketManagerService.handleSockets();
        expect(spy.called).to.equal(true);
        spy.restore();
    });

    it(' generateAllroom() should generate all room in case its log 2990 is true', () => {
        // eslint-disable-next-line dot-notation
        const messagesClient2: MessageClient = {
            gameName: 'test',
            aleatoryBonus: false,
            user: { name: 'sami', score: 10, easelLetters: 7 },
            timeConfig: { sec: 0, min: 0 },
            command: { word: 'je', position: { x: 0, y: 0 }, direction: 'v', gameName: 'test' },
            arrayOfBonusBox: vec2,
            timer: { sec: 5, min: 1, userTurn: false },
            passTurn: true,
            reserve: 'x1',
            reserveSize: 86,
            winner: 'guest',
            guestPlayer: { name: 'sami', score: 10, easelLetters: 7 },
            word: letter,
            modeLog2990: true,
        };

        socketManagerService['rooms'].push(messagesClient2);

        const room = socketManagerService['generateRooms'](messagesClient2);
        expect(room[0].modeLog2990).to.equal(true);
        socketManagerService['rooms'] = [];
    });

    it(' generateAllroom() should generate all room in case its log 2990 is false', () => {
        // eslint-disable-next-line dot-notation
        const messagesClient2: MessageClient = {
            gameName: 'test',
            aleatoryBonus: false,
            user: { name: 'sami', score: 10, easelLetters: 7 },
            timeConfig: { sec: 0, min: 0 },
            command: { word: 'je', position: { x: 0, y: 0 }, direction: 'v', gameName: 'test' },
            arrayOfBonusBox: vec2,
            timer: { sec: 5, min: 1, userTurn: false },
            passTurn: true,
            reserve: 'x1',
            reserveSize: 86,
            winner: 'guest',
            guestPlayer: { name: 'sami', score: 10, easelLetters: 7 },
            word: letter,
            modeLog2990: false,
        };

        socketManagerService['rooms'].push(messagesClient2);

        const room = socketManagerService['generateRooms'](messagesClient2);
        expect(room[0].modeLog2990).to.equal(false);
        socketManagerService['rooms'] = [];
    });

    it(' generateAllroom() should generate all room in case its log 2990 is note the same so not be added', () => {
        // eslint-disable-next-line dot-notation
        const messagesClient2: MessageClient = {
            gameName: 'test',
            aleatoryBonus: false,
            user: { name: 'sami', score: 10, easelLetters: 7 },
            timeConfig: { sec: 0, min: 0 },
            command: { word: 'je', position: { x: 0, y: 0 }, direction: 'v', gameName: 'test' },
            arrayOfBonusBox: vec2,
            timer: { sec: 5, min: 1, userTurn: false },
            passTurn: true,
            reserve: 'x1',
            reserveSize: 86,
            winner: 'guest',
            guestPlayer: { name: 'sami', score: 10, easelLetters: 7 },
            word: letter,
            modeLog2990: false,
        };
        const messagesClient3: MessageClient = {
            gameName: 'test',
            aleatoryBonus: false,
            user: { name: 'sami', score: 10, easelLetters: 7 },
            timeConfig: { sec: 0, min: 0 },
            command: { word: 'je', position: { x: 0, y: 0 }, direction: 'v', gameName: 'test' },
            arrayOfBonusBox: vec2,
            timer: { sec: 5, min: 1, userTurn: false },
            passTurn: true,
            reserve: 'x1',
            reserveSize: 86,
            winner: 'guest',
            guestPlayer: { name: 'sami', score: 10, easelLetters: 7 },
            word: letter,
            modeLog2990: true,
        };

        socketManagerService['rooms'].push(messagesClient2);

        const room = socketManagerService['generateRooms'](messagesClient3);
        expect(room.length).to.equal(0);
        socketManagerService['rooms'] = [];
    });
    it(' getEaselLength() should get essel length of 7', () => {
        // eslint-disable-next-line dot-notation
        const easel: Letter[] = [B, C, D, E, F, G, A];
        const numberReturned = socketManagerService['getEaselLength'](easel);
        expect(numberReturned).to.equal(7);
        // socketManagerService['rooms'] = [];
    });
    it(' getEaselLength() should get essel length of 0', () => {
        // eslint-disable-next-line dot-notation
        const easel: Letter[] = [NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER];
        const numberReturned = socketManagerService['getEaselLength'](easel);
        expect(numberReturned).to.equal(0);
    });

    it(' getEaselLength() should get essel length when thre is 2 not letter', () => {
        // eslint-disable-next-line dot-notation
        const easel: Letter[] = [A, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER];
        const numberReturned = socketManagerService['getEaselLength'](easel);
        expect(numberReturned).to.equal(1);
    });

    it(' getEaselLength() should get essel length when easel is empty', () => {
        // eslint-disable-next-line dot-notation
        const easel: Letter[] = [];
        const numberReturned = socketManagerService['getEaselLength'](easel);
        expect(numberReturned).to.equal(7);
    });
});
