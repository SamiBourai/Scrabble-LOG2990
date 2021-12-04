import { Component } from '@angular/core';
import { LettersService } from '@app/services/letters.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-word.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-modal-user-vs-player',
    templateUrl: './view-modal.component.html',
    styleUrls: ['./view-modal.component.scss'],
})
export class ViewModalComponent {
    isUserAcceptQuit: boolean = false;
    constructor(
        public userService: UserService,
        public timeService: TimeService,
        public letterService: LettersService,
        public validWord: ValidWordService,
        public virtualPlayerService: VirtualPlayerService,
        public reserveService: ReserveService,
        private socketManagementService: SocketManagementService,
        private objectifManagerService: ObjectifManagerService,
        public multiplayerService: MultiplayerModeService,
    ) {}
    setIsUserQuitGame(): void {
    }
    quitMultiPlayerGame() {
        switch (this.userService.playMode) {
            case 'soloGame':
                break;
            case 'joinMultiplayerGame':
                this.socketManagementService.emit('guestLeftGame', {
                    gameName: this.userService.gameName,
                    easel: this.userService.getPlayerEasel().easelLetters,
                });
                break;
            case 'createMultiplayerGame':
                this.socketManagementService.emit('userLeftGame', {
                    gameName: this.userService.gameName,
                    easel: this.userService.getPlayerEasel().easelLetters,
                });
                break;
        }
        this.setIsUserQuitGame();
        if (this.objectifManagerService.log2990Mode) this.objectifManagerService.resetObjectifs();
    }
}
