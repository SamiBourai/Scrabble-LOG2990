import * as http from 'http';
import * as io from 'socket.io';

export class SocketManagerService {
    private sio: io.Server;
    private room: string = 'serverRoom';

    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });

            socket.on('identify', (name: string) => {
                console.log(`Socket ${socket.id} identified as ${name}`);

                socket.on('chat', (message: string) => {
                    this.sio.sockets.emit('chat', {
                        name: name,
                        message: message,
                    });
                });
            });

            // socket.on('message', (message: string) => {
            //     console.log(message);
            // });

            // message initial
            // socket.emit('hello', 'Hello World!');
            // socket.on('validate', (word: string) => {
            //     const isValid = word.length > 5;
            //     socket.emit('wordValidated', isValid);
            // });
            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });
            socket.on('joinRoom', () => {
                socket.join(this.room);
            });

            socket.on('roomMessage', (message: string) => {
                this.sio.to(this.room).emit('roomMessage', `${socket.id} : ${message}`);
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
