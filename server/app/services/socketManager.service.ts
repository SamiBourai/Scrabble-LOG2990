import { GameObject } from '@app/classes/gameObject';
import { Letter } from '@app/classes/letters';
import { MessageClient } from '@app/classes/MessageClient';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { ValidWordService } from './validateWords.service';

@Service()
export class SocketManagerService {
    private sio: io.Server;
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
                );
                socket.join(message.gameName);
                this.games.set(message.gameName, createdGame);
                this.rooms.push(message);
            });
            socket.on('generateAllRooms', () => {
                socket.emit('createdGames', this.rooms);
            });
            socket.on('joinRoom', (game: MessageClient) => {
                socket.join(game.gameName);
                this.sio.to(game.gameName).emit('userJoined', game);
                this.deleteRoom(game);
                this.games.get(game.gameName).guestPlayer = { name: game.guestPlayer?.name, score: 0, easelLetters: 7 };
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
            });
            socket.on('guestUserPlayed', (command: MessageClient) => {
                this.games.get(command.gameName).guestPlayer.score = command.guestPlayer?.score ?? 0;
                this.sio.to(command.gameName).emit('guestUserPlayed', command);
                this.games.get(command.gameName).timer.playerPlayed = true;
            });
            socket.on('startTimer', (game: MessageClient) => {
                this.games.get(game.gameName).timer.timerObs.subscribe((value: { min: number; sec: number }) => {
                    game.timer = { min: value.min, sec: value.sec, userTurn: this.games.get(game.gameName).timer.creatorTurn };
                    this.sio.to(game.gameName).emit('updateTime', game);
                });
            });
            socket.on('passTurn', (game: MessageClient) => {
                if (this.games.has(game.gameName)) this.games.get(game.gameName).timer.playerPlayed = true;
            });
            socket.on('updateReserve', (message: MessageClient) => {
                this.games.get(message.gameName).reserve.letters = message.reserve ?? this.games.get(message.gameName).reserve.letters;
            });
            socket.on('getReserve', (game: MessageClient) => {
                game.reserve = this.games.get(game.gameName).reserve.letters;
                this.sio.to(game.gameName).emit('updateReserve', game);
            });
            socket.on('verifyWord', (message: MessageClient) => {
                const word: Letter[] = [];
                message.isValid = this.validWordService.verifyWord(message.word ?? word);
                this.sio.to(message.gameName).emit('verifyWord', message);
            });
            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });
        setInterval(() => {
            this.emitTime();
        }, 1000);
    }
    deleteRoom(game: MessageClient) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].gameName === game.gameName) {
                this.rooms.splice(i, 1);
            }
        }
    }
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
}
