import { Injectable } from '@angular/core';
import { GameTime } from '@app/classes/time';
import { MINUTE_TURN, ONE_MINUTE, ONE_SECOND, ONE_SECOND_MS } from '@app/constants/constants';
import { SocketManagementService } from './socket-management.service';
import { UserService } from './user.service';
import { VirtualPlayerService } from './virtual-player.service';

@Injectable({
    providedIn: 'root',
})
export class TimeService {
    timeUser: GameTime = { min: 0, sec: MINUTE_TURN };
    timeVrPlayer: GameTime = { min: 0, sec: MINUTE_TURN };
    timeGuestPlayer: GameTime = { min: 0, sec: MINUTE_TURN };
    timeStarted: boolean = false;
    constructor(
        private userService: UserService,
        private virtualPlayerService: VirtualPlayerService,
        private socketManagementService: SocketManagementService,
    ) {}

    timeMultiplayer(gameTime: GameTime): void {
        this.timeUser = gameTime;
    }

    startTime(playerTurn: string) {
        switch (playerTurn) {
            case 'user': {
                const intervalId = setInterval(() => {
                    if (this.timeUser.sec - ONE_SECOND === -ONE_SECOND) {
                        this.timeUser.min -= ONE_MINUTE;
                        this.timeUser.sec = MINUTE_TURN;
                    } else this.timeUser.sec -= ONE_SECOND;

                    if (this.timeUser.min === 0 && this.timeUser.sec === 0) {
                        this.userService.detectSkipTurnBtn();
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    } else if (!this.userService.realUser.turnToPlay) {
                        this.timeUser = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    }
                }, ONE_SECOND_MS);
                break;
            }
            case 'vrPlayer': {
                const intervalId = setInterval(() => {
                    if (this.timeVrPlayer.sec === 0) {
                        this.timeVrPlayer.min -= ONE_MINUTE;
                        this.timeVrPlayer.sec = MINUTE_TURN;
                    } else this.timeVrPlayer.sec -= ONE_SECOND;
                    if ((this.timeVrPlayer.min === 0 && this.timeVrPlayer.sec === 0) || this.virtualPlayerService.played) {
                        if (this.virtualPlayerService.skipTurn) {
                            this.userService.checkForSixthSkip();
                            this.virtualPlayerService.skipTurn = false;
                        } else {
                            this.userService.endOfGameCounter = 0;
                        }
                        this.userService.realUser.turnToPlay = true;
                        this.userService.realUserTurnObs.next(this.userService.realUser.turnToPlay);
                        this.timeVrPlayer = { min: 0, sec: MINUTE_TURN };
                        clearInterval(intervalId);
                    }
                }, ONE_SECOND_MS);
                break;
            }
        }
    }
    startMultiplayerTimer() {
        if (this.userService.joinedUser.guestPlayer && !this.timeStarted) {
            this.socketManagementService.emit('startTimer', { gameName: this.userService.gameName });
            this.timeStarted = true;
        }
        this.socketManagementService.listen('updateTime').subscribe((data) => {
            if (data.timer?.userTurn) {
                this.timeUser = { min: data.timer?.min, sec: data.timer?.sec };
                this.timeGuestPlayer = data.timeConfig ?? this.timeUser;
                this.userService.realUser.turnToPlay = true;
            } else {
                this.timeGuestPlayer = { min: data.timer?.min ?? 0, sec: data.timer?.sec ?? 0 };
                this.timeUser = data.timeConfig ?? this.timeUser;
                this.userService.realUser.turnToPlay = false;
            }
            console.log(this.timeUser);
            console.log(this.timeGuestPlayer);
        });
    }
    setGameTime(gameTime: GameTime) {
        this.timeUser = { min: gameTime.min, sec: gameTime.sec };
        this.timeVrPlayer = { min: gameTime.min, sec: gameTime.sec };
    }
}
