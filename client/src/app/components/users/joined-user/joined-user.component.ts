import { Component, OnInit } from '@angular/core';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-joined-user',
    templateUrl: './joined-user.component.html',
    styleUrls: ['./joined-user.component.scss'],
})
export class JoinedUserComponent implements OnInit {
    turnToPlay: boolean;
    constructor(public userService: UserService, readonly easelLogisticService: EaselLogiscticsService, public timeService: TimeService) {}

    ngOnInit() {
        console.log(this.userService.playMode, 'joined');
        this.userService.turnToPlayObs.subscribe(() => {
            setTimeout(() => {
                if (this.userService.realUser.turnToPlay) this.timeService.startTime('user');
            }, 0);
        });
    }
}
