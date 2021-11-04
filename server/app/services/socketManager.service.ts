/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatCommand } from '@app/classes/chatCommand';
import { PARAMETERS_OF_SWAP } from '@app/classes/constants';
import { Game } from '@app/classes/game';
import { GameObject } from '@app/classes/gameObject';
import * as http from 'http';
import * as io from 'socket.io';
export class SocketManagerService {
    private sio: io.Server;
    private games = new Map();
    private rooms = new Array<Game>();
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            // message initial
            socket.emit('hello', `je suis ${socket.id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('createGame', (message: Game) => {
                const createdGame = new GameObject(
                    message.gameName,
                    message.aleatoryBonus,
                    {
                        name: message.clientName,
                        score: 0,
                        easelLetters: 7,
                        socketId: socket.id,
                    },
                    message.gameTime.sec,
                    message.gameTime.min,
                );
                socket.join(message.gameName);
                this.games.set(message.gameName, createdGame);
                this.rooms.push(message);
            });
            socket.on('generateAllRooms', () => {
                socket.emit('createdGames', this.rooms);
            });
            socket.on('joinRoom', (game: any) => {
                socket.join(game.gameName);
                this.sio.to(game.gameName).emit('userJoined', game);
                this.deleteRoom(game);
                this.games.get(game.gameName).guestPlayer = { name: game.clientName, score: 0, easelLetters: 7 };
            });
            socket.on('acceptGame', (game: any) => {
                this.sio.to(game.gameName).emit('gameAccepted', game.accepted);
            });
            socket.on('guestInGamePage', (gameName) => {
                this.games.get(gameName).setTimer(this.chooseFirstToPlay());
                this.sio.to(gameName).emit('beginGame', true);
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('creatorPlayed', (command: any) => {
                const chatCommand: ChatCommand = { word: command.word, position: command.position, direction: command.direction };
                this.sio.to(command.gameName).emit('creatorPlayed', chatCommand);
                this.games.get(command.gameName).timer.playerPlayed = true;
            });
            socket.on('guestUserPlayed', (command) => {
                const chatCommand: ChatCommand = { word: command.word, position: command.position, direction: command.direction };
                this.sio.to(command.gameName).emit('guestUserPlayed', chatCommand);
                this.games.get(command.gameName).timer.playerPlayed = true;
            });
            socket.on('startTimer', (gameName) => {
                this.games.get(gameName).timer.timerObs.subscribe((value: any) => {
                    const userTimer = { min: value.min, sec: value.sec, creatorTurn: this.games.get(gameName).timer.creatorTurn };
                    this.sio.to(gameName).emit('updateTime', userTimer);
                });
            });
            socket.on('passTurn', (gameName) => {
                if (this.games.has(gameName)) this.games.get(gameName).timer.playerPlayed = true;
            });
            socket.on('updateReserveInServer', (reserve) => {
                this.games.get(reserve.gameName).reserveServer = {
                    letters: reserve.reserveObject.letters,
                    size: reserve.reserveObject.size,
                };
                console.log(this.games.get(reserve.gameName).reserveServer);
                // this.games.get(reserve.gameName).lettersObs.next(this.games.get(reserve.gameName).reserve.letters);
            });
            socket.on('getReserveFromServer', (gameName) => {
                this.sio.to(gameName).emit('updateReserveInClient', this.games.get(gameName).reserveServer);
            });
            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
                socket.disconnect();
            });
        });
        setInterval(() => {
            this.emitTime();
        }, 1000);
    }
    deleteRoom(game: Game) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].gameName === game.gameName) {
                this.rooms.splice(i, 1);
            }
        }
    }
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    private chooseFirstToPlay(): boolean {
        const randomIndex = Math.floor(Math.random() * PARAMETERS_OF_SWAP);
        if (randomIndex <= PARAMETERS_OF_SWAP / 2) {
            return true;
        } else {
            return false;
        }
    }
}
