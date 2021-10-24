import { Game } from '@app/classes/game';
import * as http from 'http';
import * as io from 'socket.io';
export class SocketManagerService {
    private sio: io.Server;
    private room: string = 'serverRoom';
    private createdGame: Game;
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
                console.log('ici');
                this.createdGame = { clientName: message.clientName, gameName: message.gameName, socketId: socket.id };
                this.rooms.push(this.createdGame);
                console.log(this.rooms);
            });
            socket.emit('createdGame', this.rooms);
            socket.on('validate', (word: string) => {
                const isValid = word.length > 5;
                socket.emit('wordValidated', isValid);
            });
            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });
            socket.on('joinRoom', () => {
                socket.join(this.room);
            });
            socket.on('roomMessage', (message: string) => {
                this.sio.to(this.room).emit('roomMessage', `${socket.id} : ${message}`);
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
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
}
