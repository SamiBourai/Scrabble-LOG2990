/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { MessageServer } from '@app/classes/message-server';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { LettersService } from './letters.service';
import { ReserveService } from './reserve.service';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerModeService {
    gameStarted: boolean = false;
    guestCommand: ChatCommand;
    first: boolean = true;
    constructor(
        private socketManagementService: SocketManagementService,
        private userService: UserService,
        private lettersService: LettersService,
        private easelLogic: EaselLogiscticsService,
        private reserveService: ReserveService,
    ) {}

    beginGame(): void {
        this.socketManagementService.listen('beginGame').subscribe((data) => {
            this.gameStarted = data.gameStarted ?? false;
        });
    }
    play(playMethod: string, place: boolean): void {
        if (place) {
            if (this.userService.chatCommandToSend) {
                this.socketManagementService.emit(playMethod, {
                    command: this.userService.chatCommandToSend,
                    gameName: this.userService.gameName,
                    user: { name: this.userService.realUser.name, score: this.userService.realUser.score },
                    guestPlayer: { name: this.userService.joinedUser.name, score: this.userService.joinedUser.score },
                });
                if (playMethod === 'guestUserPlayed') this.userService.realUser.turnToPlay = true;
                else this.userService.realUser.turnToPlay = false;
            }
        } else if (this.userService.exchangeLetters || this.userService.passTurn) {
            this.socketManagementService.emit('passTurn', { gameName: this.userService.gameName });
            this.userService.exchangeLetters = false;
            this.userService.passTurn = false;
        }
        this.sendReserve();
    }
    getPlayedCommand(playedMethod: string) {
        this.socketManagementService.listen(playedMethod).subscribe((data) => {
            this.guestCommand = data.command ?? { word: 'errorServer', position: { x: 1, y: 1 }, direction: 'h' };
            this.lettersService.placeLettersWithDirection(this.guestCommand);
            if (playedMethod === 'guestUserPlayed') {
                this.userService.realUser.turnToPlay = true;
                this.userService.joinedUser.score = data.guestPlayer?.score ?? 0;
            } else {
                this.userService.realUser.turnToPlay = false;
                this.userService.realUser.score = data.user?.score ?? 0;
            }
            this.userService.firstTurn = false;
            this.updateReserve();
        });
    }
    sendReserve() {
        this.socketManagementService.emit('updateReserve', {
            gameName: this.userService.gameName,
            reserve: this.reserveService.letters,
        });
    }
    updateReserve() {
        this.socketManagementService.emit('getReserve', { gameName: this.userService.gameName });
        this.socketManagementService.listen('updateReserve').subscribe((data) => {
            this.reserveService.letters = data.reserve ?? this.reserveService.letters;
            this.reserveService.reserveSize = this.reserveService.letters.length;
            if (this.first && this.userService.playMode === 'joinMultiplayerGame') {
                this.first = false;
                this.easelLogic.fillEasel(this.userService.joinedUser.easel, true);
                this.sendReserve();
            }
        });
    }
    setGuestPlayerInfromation(guestUserName: string) {
        this.userService.initiliseUsers(false);
        this.userService.joinedUser.name = guestUserName;
        this.userService.joinedUser.guestPlayer = false;
    }
    setGameInformations(room: MessageServer, playerName: string) {
        this.socketManagementService.emit('joinRoom', { gameName: room.gameName, guestPlayer: { name: playerName } });
        this.userService.initiliseUsers(false);
        this.userService.realUser.name = room.user?.name ?? 'default';
        this.userService.joinedUser.name = playerName;
        this.userService.joinedUser.guestPlayer = true;
        this.userService.gameName = room.gameName;
    }
}
