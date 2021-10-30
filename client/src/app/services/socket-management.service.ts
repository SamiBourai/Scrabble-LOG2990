/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Game } from '@app/classes/game';
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
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: any) => {
                subscriber.next(data);
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(eventName: string, data?: Game, reason?: string, command?: any) {
        if (reason) this.socket.emit(eventName, reason);
        else if (data) this.socket.emit(eventName, data);
        else this.socket.emit(eventName, command);
    }
}
