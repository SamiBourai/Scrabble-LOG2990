import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '@app/services/database.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';

@Component({
    selector: 'app-modal-end-of-game',
    templateUrl: './modal-end-of-game.component.html',
    styleUrls: ['./modal-end-of-game.component.scss'],
})
export class ModalEndOfGameComponent implements OnInit {
    gotWinner: boolean = false;

    constructor(
        public multiplayerService: MultiplayerModeService,
        private userService: UserService,
        private databaseService: DatabaseService,
        private validWordService: ValidWordService,
    ) {}

    ngOnInit(): void {
        this.multiplayerService.playerLeftObs.subscribe((response) => {
            this.gotWinner = true;
            if (response === 'dictionnaire principal') this.validWordService.loadDictionary();
            else this.validWordService.loadDictionary(response);
        });
    }
    setIsUserQuitGame(): void {
        this.databaseService.addScores();
    }

    joinVrPlayer() {
        if (this.userService.playMode === 'joinMultiplayerGame') this.userService.setJoinAsReal();
        this.userService.playMode = 'soloGame';
        this.userService.endOfGame = false;
        if (this.userService.realUserTurnObs && this.userService.gameModeObs) {
            this.userService.realUserTurnObs.next(this.userService.isPlayerTurn());
            this.userService.gameModeObs.next(this.userService.playMode);
        }
    }
}
