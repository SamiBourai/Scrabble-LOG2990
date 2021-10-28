import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private socket: Socket;
    private url = 'http://localhost:3000';

    constructor() {
        this.socket = io(this.url);
    }

    deconexion() {
        this.socket.disconnect();
    }

    connect() {
        this.socket.on('connect', () => {
            console.log('connexion avec le client  ' + this.socket.id);
        });
    }

    listen(eventName: string): Observable<string> {
        return new Observable((subscribe) => {
            this.socket.on(eventName, (data) => {
                subscribe.next(data);
            });
        });
    }

    emit(eventName: string, data: unknown) {
        this.socket.emit(eventName, data);
    }
}
