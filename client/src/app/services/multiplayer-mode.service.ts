/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { Vec2 } from '@app/classes/vec2';
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
        this.socketManagementService.listen('beginGame').subscribe((data) => {
            const begin: any = data;
            this.gameStarted = begin;
            if (!this.userService.joinedUser.guestPlayer) {
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
    sendGridToJoiner(arrayOfBonusBox: Vec2[][]): void {
        console.log('shuidans send');
        const bonusArray = { gameName: this.userService.gameName, arrayOfBonusBox };
        this.socketManagementService.emit('randomBonusActivated', undefined, undefined, bonusArray);
    }
    receiveGridFromCreator(): Vec2[][] {
        console.log('shui dans receive');
        let bonusBoxArray = new Array<Vec2[]>();
        this.socketManagementService.emit('guestRandomBonusBox', undefined, this.userService.gameName, undefined);
        this.socketManagementService.listen('guestRandomBonusBox').subscribe((data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const arrayRecieved: any = data;
            bonusBoxArray = arrayRecieved;
            console.log('mon array', bonusBoxArray);
            console.log('data', data);
            return bonusBoxArray;
        });
        return bonusBoxArray;
    }
}
