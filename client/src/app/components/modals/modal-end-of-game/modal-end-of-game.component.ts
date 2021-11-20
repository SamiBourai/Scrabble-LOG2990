import { Component, OnInit } from '@angular/core';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-end-of-game',
    templateUrl: './modal-end-of-game.component.html',
    styleUrls: ['./modal-end-of-game.component.scss'],
})
export class ModalEndOfGameComponent implements OnInit {
    gotWinner: boolean = false;

    constructor(public multiplayerService: MultiplayerModeService, private userService: UserService) {}
    ngOnInit(): void {
        this.multiplayerService.winnerOfGame.subscribe((response) => {
            this.gotWinner = response;
        });
    }
    setIsUserQuitGame(): void {
        window.location.assign('/home');
    }

    joinVrPlayer() {
        if (this.userService.playMode === 'joinMultiplayerGame') this.userService.setJoinAsReal();

        this.userService.playMode = 'soloGame';
        this.userService.initiliseUsers(true);
        this.userService.endOfGame = false;
        this.userService.realUserTurnObs.next(this.userService.isPlayerTurn());
        this.userService.gameModeObs.next(this.userService.playMode);
    }
}
