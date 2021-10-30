/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { LettersService } from './letters.service';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerModeService {
    gameStarted: boolean = false;
    guestCommand: ChatCommand;
    constructor(private socketManagementService: SocketManagementService, private userService: UserService, private lettersService: LettersService) {}

    beginGame(): void {
        console.log('beginGame');
        this.socketManagementService.listen('beginGame').subscribe((data) => {
            const begin: any = data;
            this.gameStarted = begin;
            console.log('gamestarted', this.gameStarted);
            if (!this.userService.joinedUser.guestPlayer) {
                console.log('shuisla');
                this.socketManagementService.emit('chooseFirstToPlay', undefined, this.userService.gameName);
            }
        });
    }
    play(playMethod: string): void {
        if (this.userService.chatCommandToSend && this.userService.playMode !== 'soloGame') {
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
        });
    }
    isTimeStartable(guest: boolean): boolean {
        switch (this.userService.playMode) {
            case 'soloGame':
                if (this.userService.realUser.turnToPlay && !this.userService.endOfGame) return true;
                break;
            default:
                if (this.gameStarted && this.userService.realUser.turnToPlay && !this.userService.endOfGame && !guest) return true;
                if (this.gameStarted && !this.userService.realUser.turnToPlay && !this.userService.endOfGame && guest) return true;
                break;
        }
        return false;
    }
}
