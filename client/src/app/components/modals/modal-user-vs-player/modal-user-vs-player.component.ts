import { Component } from '@angular/core';
import { LettersService } from '@app/services/letters.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ReserveService } from '@app/services/reserve.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ValidWordService } from '@app/services/valid-world.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

@Component({
    selector: 'app-modal-user-vs-player',
    templateUrl: './modal-user-vs-player.component.html',
    styleUrls: ['./modal-user-vs-player.component.scss'],
})
export class ModalUserVsPlayerComponent {
    isUserReturnToMenu: boolean;
    isUserAcceptQuit: boolean;
    constructor(
        public userService: UserService,
        public timeService: TimeService,
        public letterService: LettersService,
        public validWord: ValidWordService,
        public virtualPlayerService: VirtualPlayerService,
        public reserveService: ReserveService,
        private socketManagementService: SocketManagementService,
        public multiplayerService: MultiplayerModeService,
    ) {}

    getNameFromLocalStorage() {
        return this.userService.realUser.name;
    }
    setIsUserQuitGame(): void {
        window.location.assign('/home');
    }
    quitMultiPlayerGame() {
        switch (this.userService.playMode) {
            case 'soloGame':
                break;
            case 'joinMultiplayerGame':
                this.socketManagementService.emit('guestLeftGame', { gameName: this.userService.gameName });

                break;
            case 'createMultiplayerGame':
                this.socketManagementService.emit('userLeftGame', { gameName: this.userService.gameName });
                break;
        }
        window.location.assign('/home');
    }
}
