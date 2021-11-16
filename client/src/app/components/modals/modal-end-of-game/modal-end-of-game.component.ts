import { Component, OnInit } from '@angular/core';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';

@Component({
    selector: 'app-modal-end-of-game',
    templateUrl: './modal-end-of-game.component.html',
    styleUrls: ['./modal-end-of-game.component.scss'],
})
export class ModalEndOfGameComponent implements OnInit {
    gotWinner: boolean = false;
    constructor(public multiplayerService: MultiplayerModeService) {}
    ngOnInit(): void {
        this.multiplayerService.winnerOfGame.subscribe((response) => {
            this.gotWinner = response;
        });
    }

    setIsUserQuitGame(): void {
        window.location.assign('/home');
    }
    joinVrPlayer() {}
}
