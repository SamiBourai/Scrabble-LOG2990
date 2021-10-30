/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatCommand } from '@app/classes/chatCommand';
import { PARAMETERS_OF_SWAP } from '@app/classes/constants';
import { Game } from '@app/classes/game';
import { Timer } from '@app/classes/timer';
import * as http from 'http';
import * as io from 'socket.io';
export class SocketManagerService {
    private sio: io.Server;
    private createdGame: Game;
    private players = new Map();
    private timers = new Map();
    private rooms = new Array<Game>();
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial
            socket.emit('hello', `je suis ${socket.id}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('createGame', (message: Game) => {
                this.createdGame = { clientName: message.clientName, gameName: message.gameName, socketId: socket.id };
                socket.join(message.gameName);
                this.rooms.push(this.createdGame);
            });
            socket.on('generateAllRooms', () => {
                socket.emit('createdGames', this.rooms);
            });
            socket.on('joinRoom', (game: Game) => {
                socket.join(game.gameName);
                this.sio.to(game.gameName).emit('userJoined', game);
                this.deleteRoom(game);
            });
            socket.on('acceptGame', (game: any) => {
                this.sio.to(game.gameName).emit('gameAccepted', game.accepted);
            });
            socket.on('chooseFirstToPlay', (gameName: string) => {
                const timer = new Timer();
                timer.creatorTurn = this.chooseFirstToPlay();
                this.timers.set(gameName, timer);
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            socket.on('creatorPlayed', (command: any) => {
                const chatCommand: ChatCommand = { word: command.word, position: command.position, direction: command.direction };
                this.sio.to(command.gameName).emit('creatorPlayed', chatCommand);
            });
            socket.on('guestUserPlayed', (command) => {
                const chatCommand: ChatCommand = { word: command.word, position: command.position, direction: command.direction };
                this.sio.to(command.gameName).emit('guestUserPlayed', chatCommand);
            });
            socket.on('creatorInGamePage', (gameName) => {
                this.startGame(gameName);
            });
            socket.on('guestInGamePage', (gameName) => {
                this.startGame(gameName);
            });
            socket.on('startTimer', (gameName) => {
                console.log(this.timers.get(gameName));
                this.timers.get(gameName).timerObs.subscribe((value: any) => {
                    const userTimer = { min: value.min, sec: value.sec, creatorTurn: this.timers.get(gameName).creatorTurn };
                    this.sio.to(gameName).emit('updateTime', userTimer);
                });
                console.log('update');
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
    private startGame(gameName: string) {
        if (this.players.size !== 0 && this.players.has(gameName)) {
            this.sio.to(gameName).emit('beginGame', true);
        } else this.players.set(gameName, { firstPlayer: true, secondPlayer: true });
    }
}
