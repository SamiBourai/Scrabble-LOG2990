/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
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
            const begin: any = data;
            this.gameStarted = begin;
        });
    }
    play(playMethod: string): void {
        if (this.userService.chatCommandToSend) {
            const command = {
                word: this.userService.chatCommandToSend.word,
                position: this.userService.chatCommandToSend.position,
                direction: this.userService.chatCommandToSend.direction,
                gameName: this.userService.gameName,
            };
            this.socketManagementService.emit(playMethod, undefined, undefined, command);
            if (playMethod === 'guestUserPlayed') this.userService.realUser.turnToPlay = true;
            else this.userService.realUser.turnToPlay = false;
        }
        if (this.userService.exchangeLetters || this.userService.passTurn) {
            this.socketManagementService.emit('passTurn', undefined, this.userService.gameName, undefined);
        }
        this.sendReserve();
    }
    getPlayedCommand(playedMethod: string) {
        this.socketManagementService.listen(playedMethod).subscribe((data) => {
            const command: any = data;
            this.guestCommand = command;
            this.lettersService.placeLettersWithDirection(this.guestCommand);
            if (playedMethod === 'guestUserPlayed') {
                this.userService.realUser.turnToPlay = true;
            } else {
                this.userService.realUser.turnToPlay = false;
            }
            this.userService.firstTurn = false;
            this.updateReserve();
        });
    }
    sendReserve() {
        this.socketManagementService.emit('updateReserveInServer', undefined, undefined, {
            gameName: this.userService.gameName,
            reserveObject: { letters: this.reserveService.letters, size: this.reserveService.size },
        });
    }
    updateReserve() {
        setTimeout(() => {
            console.log('nous la');
        }, 5000);
        this.socketManagementService.emit('getReserveFromServer', undefined, this.userService.gameName);
        this.socketManagementService.listen('updateReserveInClient').subscribe((data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const guestReserve: any = data;
            console.log('client newReserve=: ' + guestReserve.size);
            this.reserveService.redefineReserve(guestReserve.letters, guestReserve.size);
            if (this.first && this.userService.playMode === 'joinMultiplayerGame') {
                this.first = false;
                this.easelLogic.fillEasel(this.userService.joinedUser.easel, true);
            }
        });
    }
}
