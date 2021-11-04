import { Injectable } from '@angular/core';
import { ChatCommand } from '@app/classes/chat-command';
import { MessageServer } from '@app/classes/message-server';
import { Vec2 } from '@app/classes/vec2';
import { BehaviorSubject, Observable } from 'rxjs';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { LettersService } from './letters.service';
import { MessageService } from './message.service';
import { ReserveService } from './reserve.service';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';
import { ValidWordService } from './valid-world.service';

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
        private easelLogic: EaselLogiscticsService,
        private reserveService: ReserveService,
        private messageService: MessageService,
        private validWordService: ValidWordService,
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
                    guestPlayer: { name: this.userService.joinedUser.name, score: this.userService.joinedUser.score }
                });
                if (playMethod === 'guestUserPlayed') this.userService.realUser.turnToPlay = true;
                else this.userService.realUser.turnToPlay = false;
            }
        } else if (this.userService.exchangeLetters || this.userService.passTurn) {
            this.socketManagementService.emit('passTurn', { gameName: this.userService.gameName });
            this.userService.exchangeLetters = false;
            this.userService.passTurn = false;
        }
    }
    getPlayedCommand(playedMethod: string) {
        this.socketManagementService.listen(playedMethod).subscribe((data) => {
            this.guestCommand = data.command ?? { word: 'errorServer', position: { x: 1, y: 1 }, direction: 'h' };
            this.lettersService.placeLettersWithDirection(this.guestCommand);
            this.validWordService.usedWords.set(this.guestCommand.word, this.fillUsedWords(this.guestCommand));
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
        if (this.userService.playMode !== 'soloGame')
            this.socketManagementService.emit('updateReserve', {
                gameName: this.userService.gameName,
                reserve: this.reserveService.letters,
            });
    }
    updateReserve() {
        if (this.userService.playMode !== 'soloGame') {
            this.socketManagementService.emit('getReserve', { gameName: this.userService.gameName });
            this.socketManagementService.listen('updateReserve').subscribe((data) => {
                this.reserveService.letters = data.reserve?.slice() ?? this.reserveService.letters;
                this.reserveService.reserveSize = this.reserveService.letters.length;
                this.reserveService.sizeObs.next(this.reserveService.reserveSize);
                if (this.first && this.userService.playMode === 'joinMultiplayerGame') {
                    this.first = false;
                    this.easelLogic.fillEasel(this.userService.joinedUser.easel, true, false);
                    this.sendReserve();
                }
            });
        }
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
        this.socketManagementService.listen('getWinner').subscribe(() => {
            this.gotWinner = true;
            this.winnerObs.next(this.gotWinner);
        });
    }
    fillUsedWords(command: ChatCommand): Vec2[] {
        const positions: Vec2[] = [];
        if (command.direction === 'h') {
            for (let i = command.position.x; i < command.position.x + command.word.length; i++) positions.push({ x: i, y: command.position.y });
        }
        if (command.direction === 'v') {
            for (let i = command.position.y; i < command.position.y + command.word.length; i++) positions.push({ y: i, x: command.position.x });
        }
        return positions;
    }
}
