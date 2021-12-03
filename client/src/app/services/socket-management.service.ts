import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/letter';
import { MessageServer } from '@app/classes/message-server';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    private first: boolean = true;
    private socket: Socket;
    constructor(private reserveService: ReserveService, private easelLogic: EaselLogiscticsService, private userService: UserService) {
        this.socket = io(environment.serverUrl) as unknown as Socket;
    }

    listen(eventName: string): Observable<MessageServer> {
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

    reserveToServer(eventName: string, gameName: string, map: Map<Letter, number>, size: number, easel: Letter[]) {
        this.socket.emit(eventName, gameName, JSON.stringify(Array.from(map)), size, easel);
    }
    reserveToClient() {
        this.socket.on('updateReserveInClient', (map: string, size: number, easel: Letter[]) => {
            this.reserveService.redefineReserve(map, size);
            this.userService.joinedUser.easel.easelLetters = easel;
        });
    }
    reserveToJoinOnfirstTurn(gameName: string) {
        this.socket.emit('sendReserveJoin', gameName);

        this.socket.on('updateReserveInClient', (map: string, size: number, easel: Letter[]) => {
            if (this.first) {
                this.first = false;
                this.reserveService.redefineReserve(map, size);
                this.easelLogic.fillEasel(this.userService.joinedUser.easel, true);
                this.userService.realUser.easel.easelLetters = easel;
                this.reserveToServer(
                    'updateReserveInServer',
                    gameName,
                    this.reserveService.letters,
                    this.reserveService.reserveSize,
                    this.userService.getPlayerEasel().easelLetters,
                );
            }
        });
    }
}
