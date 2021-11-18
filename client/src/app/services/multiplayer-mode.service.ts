import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { MessageServer } from '@app/classes/message-server';
import { UNDEFINED_INDEX } from '@app/constants/constants';
import { BehaviorSubject, Observable } from 'rxjs';
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
    gotWinner: boolean = false;
    winnerObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    observableWinner: Observable<boolean>;

    constructor(
        private socketManagementService: SocketManagementService,
        private userService: UserService,
        private lettersService: LettersService,
        private reserveService: ReserveService,
        private messageService: MessageService,
        private validWordService: ValidWordService,
        private virtualPlayer: VirtualPlayerService,
    ) {
        this.observableWinner = this.winnerObs.asObservable();
    }
    get winnerOfGame(): Observable<boolean> {
        return this.winnerObs;
    }

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
                this.userService.realUser.turnToPlay = true;
                this.userService.joinedUser.score = data.guestPlayer?.score ?? 0;
            } else {
                this.userService.realUser.turnToPlay = false;
                this.userService.realUser.score = data.user?.score ?? 0;
            }
            this.userService.firstTurn = false;
        });
    }
    sendReserve() {
        this.socketManagementService.reserveToserver(
            'updateReserveInServer',
            this.userService.gameName,
            this.reserveService.letters,
            this.reserveService.reserveSize,
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
            this.gotWinner = true;
            this.virtualPlayer.easel.easelLetters = data.easel ?? [];
            this.winnerObs.next(this.gotWinner);
        });
    }
}
