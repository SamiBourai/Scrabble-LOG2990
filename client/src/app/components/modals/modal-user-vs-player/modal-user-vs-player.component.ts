import { Component } from '@angular/core';
import { LettersService } from '@app/services/letters.service';
import { ReserveService } from '@app/services/reserve.service';
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
    // @ViewChild('divX') divX:ElementRef<HTMLDivElement>
    isUserReturnToMenu: boolean;
    isUserAcceptQuit: boolean;
    // isUserClickOnGiveUp:string="0";
    constructor(
        public userService: UserService,
        public timeService: TimeService,
        public letterService: LettersService,
        public validWord: ValidWordService,
        public virtualPlayerService: VirtualPlayerService,
        public reserveService: ReserveService,
    ) {}

    getNameFromLocalStorage() {
        return this.userService.realUser.name;
    }
    setIsUserQuitGame(): void {
        window.location.assign('/home');
    }
}
