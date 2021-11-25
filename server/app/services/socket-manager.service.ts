import { BOTH_EASEL_FILLED, EASEL_LENGTH, FIVE_SEC_MS, ONE_SECOND_MS, SIX_TURN } from '@app/classes/constants';
import { GameObject } from '@app/classes/game-object';
import { Letter } from '@app/classes/letters';
import { MessageClient } from '@app/classes/message-client';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { ValidWordService } from './validate-words.service';

@Service()
export class SocketManagerService {
    sio: io.Server;
    private games = new Map();
    private rooms = new Array<MessageClient>();
    constructor(private validWordService: ValidWordService) {}
    initiliaseSocket(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('createGame', (message: MessageClient) => {
                const createdGame = new GameObject(
                    message.gameName,
                    message.aleatoryBonus ?? false,
                    {
                        name: message.user?.name ?? 'default',
                        score: 0,
                        easelLetters: 7,
                        socketId: socket.id,
                    },
                    message.timeConfig?.sec ?? 0,
                    message.timeConfig?.min ?? 0,
                    message.modeLog2990 ?? false,
                );
                if (message.modeLog2990) createdGame.objectifs = message.objectifs ?? createdGame.objectifs;
                socket.join(message.gameName);
                this.games.set(message.gameName, createdGame);
                this.rooms.push(message);
            });
            socket.on('generateAllRooms', (message: MessageClient) => {
                socket.emit('createdGames', this.generateRooms(message));
            });
            socket.on('joinRoom', (game: MessageClient) => {
                socket.join(game.gameName);
                this.sio.to(game.gameName).emit('userJoined', game);
                this.deleteRoom(game);
                this.games.get(game.gameName).guestPlayer = { name: game.guestPlayer?.name, score: 0, easelLetters: EASEL_LENGTH };
            });
            socket.on('getAleatoryBonus', (message: MessageClient) => {
                this.sio
                    .to(message.gameName)
                    .emit('getAleatoryBonus', { gameName: message.gameName, arrayOfBonusBox: this.games.get(message.gameName).arrayOfBonusBox });
            });
            socket.on('setAleatoryBonusBox', (message: MessageClient) => {
                this.games.get(message.gameName).arrayOfBonusBox = message.arrayOfBonusBox ?? this.games.get(message.gameName).arrayOfBonusBox;
            });
            socket.on('acceptGame', (game: MessageClient) => {
                this.sio.to(game.gameName).emit('gameAccepted', game);
            });
            socket.on('guestInGamePage', (game: MessageClient) => {
                this.games.get(game.gameName).setTimer();
                game.gameStarted = true;
                this.sio.to(game.gameName).emit('beginGame', game);
            });
            socket.on('creatorPlayed', (command: MessageClient) => {
                this.games.get(command.gameName).creatorPlayer.score = command.user?.score ?? 0;
                this.sio.to(command.gameName).emit('creatorPlayed', command);
                this.games.get(command.gameName).timer.playerPlayed = true;
                this.games.get(command.gameName).passTurn = 0;
            });
            socket.on('guestUserPlayed', (command: MessageClient) => {
                this.games.get(command.gameName).guestPlayer.score = command.guestPlayer?.score ?? 0;
                this.sio.to(command.gameName).emit('guestUserPlayed', command);
                this.games.get(command.gameName).timer.playerPlayed = true;
                this.games.get(command.gameName).passTurn = 0;
            });
            socket.on('startTimer', (game: MessageClient) => {
                if (this.games.has(game.gameName)) {
                    this.games.get(game.gameName).timer.timerObs.subscribe((value: { min: number; sec: number }) => {
                        game.timeConfig = this.games.get(game.gameName).timeConfig;
                        game.timer = { min: value.min, sec: value.sec, userTurn: this.games.get(game.gameName).timer.creatorTurn ?? false };
                        this.sio.to(game.gameName).emit('updateTime', game);
                    });
                }
            });
            socket.on('passTurn', (game: MessageClient) => {
                this.games.get(game.gameName).timer.playerPlayed = true;
                this.checkIfEndGame(game);
            });
            socket.on('changeLetter', (game: MessageClient) => {
                this.games.get(game.gameName).timer.playerPlayed = true;
                this.games.get(game.gameName).passTurn = 0;
                this.sio.to(game.gameName).emit('updateAfterChange', game);
            });

            socket.on('updateReserveInServer', (gameName: string, map: string, size: number) => {
                this.games.get(gameName).reserveServer = new Map(JSON.parse(map));

                this.games.get(gameName).reserverServerSize = size;
                if (size === BOTH_EASEL_FILLED)
                    this.sio.to(gameName).emit('updateReserveInClient', JSON.stringify(Array.from(this.games.get(gameName).reserveServer)), size);
            });
            socket.on('objectifAchived', (objectif: MessageClient) => {
                this.sio.to(objectif.gameName).emit('objectifAchived', objectif);
            });

            socket.on('sendReserveJoin', (gameName: string) => {
                this.sio
                    .to(gameName)
                    .emit(
                        'updateReserveInClient',
                        JSON.stringify(Array.from(this.games.get(gameName).reserveServer)),
                        this.games.get(gameName).reserverServerSize,
                    );
            });
            socket.on('sendMessage', (message: MessageClient) => {
                this.games.get(message.gameName).arrayOfMessage = message.message ?? this.games.get(message.gameName).arrayOfMessage;
                this.sio.to(message.gameName).emit('getMessage', message);
            });
            socket.on('guestLeftGame', (message: MessageClient) => {
                message.winner = this.games.get(message.gameName).creatorPlayer.name;
                setTimeout(() => {
                    this.sio.to(message.gameName).emit('getWinner', message);
                    this.updateDeletedGames(message);
                    socket.disconnect();
                }, FIVE_SEC_MS);
            });
            socket.on('userLeftGame', (message: MessageClient) => {
                message.winner = this.games.get(message.gameName).guestPlayer.name;
                setTimeout(() => {
                    this.sio.to(message.gameName).emit('getWinner', message);
                    socket.disconnect();
                }, FIVE_SEC_MS);
            });
            socket.on('userPassedInSoloMode', (message: MessageClient) => {
                this.updateDeletedGames(message);
            });
            socket.on('userCanceled', (message: MessageClient) => {
                this.updateDeletedGames(message);
            });
            socket.on('verifyWord', (message: MessageClient) => {
                const word: Letter[] = [];
                message.isValid = this.validWordService.verifyWord(message.word ?? word);
                this.sio.to(message.gameName).emit('verifyWord', message);
            });
            socket.on('disconnect', () => {
                socket.disconnect();
            });
        });
        setInterval(() => {
            this.emitTime();
        }, ONE_SECOND_MS);
    }
    deleteRoom(game: MessageClient) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].gameName === game.gameName) {
                this.rooms.splice(i, 1);
            }
        }
    }
    updateDeletedGames(message: MessageClient) {
        this.deleteRoom(message);
        this.games.delete(message.gameName);
    }
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    private checkIfEndGame(game: MessageClient) {
        this.games.get(game.gameName).passTurn++;
        if (this.games.get(game.gameName).passTurn === SIX_TURN) {
            this.sio.to(game.gameName).emit('getWinner', game);
        }
    }

    private generateRooms(message: MessageClient): MessageClient[] {
        const rooms: MessageClient[] = [];
        for (const room of this.rooms) {
            if (message.modeLog2990 === room.modeLog2990) {
                rooms.push(room);
            }
        }
        return rooms;
    }
}
