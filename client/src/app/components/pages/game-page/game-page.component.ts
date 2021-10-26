import { Component, OnInit } from '@angular/core';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    remainingLetters: number = 0;
    soloMode: boolean = false;
    constructor(public userService: UserService, public reserverService: ReserveService) {}

    detectSkipTurnBtn() {
        this.userService.userSkipingTurn = true;
    }
    ngOnInit() {
        this.getLetter();
        if (this.userService.playMode === 'solomode') {
            this.soloMode = true;
        }
    }

    getLetter() {
        this.reserverService.size.subscribe((res) => {
            setTimeout(() => {
                this.remainingLetters = res;
            }, 0);
        });
    }
}
