import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { MessageServer } from '@app/classes/message-server';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environement';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    first: boolean = true;
    private socket: Socket;
    constructor(private reserveService: ReserveService, private easelLogic: EaselLogiscticsService, private userService: UserService) {
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

    reserveToserver(eventName: string, gameName: string, map: Map<Letter, number>, size: number) {
        this.socket.emit(eventName, gameName, JSON.stringify(Array.from(map)), size);
    }
    reserveToClient() {
        this.socket.on('updateReserveInClient', (map: string, size: number) => {
            this.reserveService.redefineReserve(map, size);
        });
    }
    reserveToJoinOnfirstTurn(gameName: string) {
        this.socket.emit('sendReserveJoin', gameName);

        this.socket.on('updateReserveInClient', (map: string, size: number) => {
            if (this.first) {
                this.first = false;
                this.reserveService.redefineReserve(map, size);
                this.easelLogic.fillEasel(this.userService.joinedUser.easel, true);

                this.reserveToserver('updateReserveInServer', gameName, this.reserveService.letters, this.reserveService.reserveSize);
            }
        });
    }
}
