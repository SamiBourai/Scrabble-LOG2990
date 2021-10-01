import { Component, OnInit } from '@angular/core';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {
    score: number = 0;

    constructor(public userService: UserService, public readonly easelLogisticService: EaselLogiscticsService) {}

    ngOnInit(): void {
        // score+=this.validWordService.readWordsAndGivePointsIfValid();
        // this.userService.scoreOfRealPlayer.subscribe((response) => {
        //     setTimeout(() => {
        //         this.score = response;
        //     }, 1000);
        // });
        // this.score = this.userService.realUser.score;
    }
}
