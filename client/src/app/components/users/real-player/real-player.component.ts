import { Component, OnInit } from '@angular/core';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {
    turnToPlay: boolean;
    constructor(public userService: UserService, readonly easelLogisticService: EaselLogiscticsService, public timeService: TimeService) {}

    ngOnInit() {
        this.userService.turnToPlayObs.subscribe(() => {
            setTimeout(() => {
                if (this.userService.realUser.turnToPlay) this.timeService.startTime('user');
            }, 0);
        });
    }
    
}
