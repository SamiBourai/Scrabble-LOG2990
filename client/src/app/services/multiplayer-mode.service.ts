import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { MessageServer } from '@app/classes/message-server';
import { UNDEFINED_INDEX } from '@app/constants/constants';
import { BehaviorSubject } from 'rxjs';
import { LettersService } from './letters.service';
import { MessageService } from './message.service';
import { ReserveService } from './reserve.service';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';
import { ValidWordService } from './valid-word.service';
import { VirtualPlayerService } from './virtual-player.service';

@Injectable({
    providedIn: 'root',
})
export class MultiplayerModeService {
    gameStarted: boolean = false;
    guestCommand: ChatCommand;
    first: boolean = true;
    playerLeft: boolean = false;
    playerLeftObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    gameDone: boolean = false;
    gameDoneObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private socketManagementService: SocketManagementService,
        private userService: UserService,
        private lettersService: LettersService,
        private reserveService: ReserveService,
        private messageService: MessageService,
        private validWordService: ValidWordService,
        private virtualPlayer: VirtualPlayerService,
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
                    easel: this.userService.getPlayerEasel().easelLetters,
                    command: this.userService.chatCommandToSend,
                    gameName: this.userService.gameName,
                    user: {
                        name: this.userService.realUser.name,
                        score: this.userService.realUser.score,
                    },
                    guestPlayer: {
                        name: this.userService.joinedUser.name,
                        score: this.userService.joinedUser.score,
                    },
                    usedWords: JSON.stringify(Array.from(this.validWordService.usedWords)),
                    reserve: JSON.stringify(Array.from(this.reserveService.letters)),
                    reserveSize: this.reserveService.reserveSize,
                });
                if (playMethod === 'guestUserPlayed') this.userService.realUser.turnToPlay = true;
                else this.userService.realUser.turnToPlay = false;
            }
        } else if (this.userService.passTurn) {
            this.socketManagementService.emit('passTurn', {
                gameName: this.userService.gameName,
                passTurn: this.userService.passTurn,
            });

            this.userService.passTurn = false;
        } else if (this.userService.exchangeLetters) {
            this.socketManagementService.emit('changeLetter', {
                reason: this.userService.playMode,
                gameName: this.userService.gameName,
                reserve: JSON.stringify(Array.from(this.reserveService.letters)),
                reserveSize: this.reserveService.reserveSize,
            });

            this.userService.exchangeLetters = false;
        }
    }
    getPlayedCommand(playedMethod: string) {
        this.socketManagementService.listen(playedMethod).subscribe((data) => {
            this.guestCommand = data.command ?? { word: 'errorServer', position: { x: 1, y: 1 }, direction: 'h' };
            this.reserveService.redefineReserve(
                data.reserve ?? JSON.stringify(Array.from(this.reserveService.letters)),
                data.reserveSize ?? UNDEFINED_INDEX,
            );

            if (this.guestCommand.word !== 'invalid') {
                this.lettersService.placeLettersWithDirection(this.guestCommand);
                this.validWordService.usedWords = new Map(JSON.parse(data.usedWords ?? JSON.stringify(Array.from(this.validWordService.usedWords))));
            }

            if (playedMethod === 'guestUserPlayed') {
                this.userService.joinedUser.easel.easelLetters = data.easel ?? [];
                //
                this.userService.realUser.turnToPlay = true;
                this.userService.joinedUser.score = data.guestPlayer?.score ?? 0;
                console.log('join:', this.userService.joinedUser.score);
            } else {
                this.userService.realUser.easel.easelLetters = data.easel ?? [];
                //
                this.userService.realUser.turnToPlay = false;
                console.log('user:', this.userService.realUser.score);
                this.userService.realUser.score = data.user?.score ?? 0;
            }
        });
    }
    updateReserveChangeLetters(player: string) {
        this.socketManagementService.listen(player).subscribe((data) => {
            this.reserveService.redefineReserve(
                data.reserve ?? JSON.stringify(Array.from(this.reserveService.letters)),
                data.reserveSize ?? UNDEFINED_INDEX,
            );
        });
    }

    sendReserve() {
        this.socketManagementService.reserveToserver(
            'updateReserveInServer',
            this.userService.gameName,
            this.reserveService.letters,
            this.reserveService.reserveSize,
            this.userService.getPlayerEasel().easelLetters,
        );
    }
    updateReserve() {
        this.socketManagementService.reserveToClient();
    }
    getJoinReserve() {
        this.socketManagementService.reserveToJoinOnfirstTurn(this.userService.gameName);
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
        this.userService.isBonusBox = room.aleatoryBonus ?? false;
    }
    getMessageSend(method: string) {
        this.socketManagementService.listen(method).subscribe((data) => {
            this.messageService.textMessage = data.message ?? this.messageService.textMessage;
            this.messageService.newTextMessage = true;
            this.messageService.newTextMessageObs.next(this.messageService.newTextMessage);
        });
    }
    sendMessage(method: string) {
        this.socketManagementService.emit(method, { gameName: this.userService.gameName, message: this.messageService.textMessage });
    }
    playersLeftGamge() {
        this.socketManagementService.listen('getWinner').subscribe((data) => {
            this.playerLeft = true;
            this.virtualPlayer.easel.easelLetters = data.easel ?? [];
            this.playerLeftObs.next(this.playerLeft);
        });
    }

    endOfGame() {
        this.socketManagementService.listen('endOfGame').subscribe(() => {
            setTimeout(() => {
                this.userService.endOfGame = true;
                this.gameDone = true;
                this.gameDoneObs.next(this.gameDone);
            }, 0);
        });
    }
}
