import { Injectable } from '@angular/core';
import { MessageServer } from '@app/classes/message-server';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    private socket: Socket;
    constructor() {
        this.socket = io(environment.serverUrl) as unknown as Socket;
    }

    listen(eventName: string) {
        return new Observable<MessageServer>((subscriber) => {
            this.socket.on(eventName, (data: MessageServer) => {
                subscriber.next(data);
            });
        });
    }
    getRooms() {
        return new Observable<MessageServer[]>((subscriber) => {
            this.socket.on('createdGames', (data: MessageServer[]) => {
                subscriber.next(data);
            });
        });
    }
    emit(eventName: string, message?: MessageServer) {
        this.socket.emit(eventName, message);
    }
}
