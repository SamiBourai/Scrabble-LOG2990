import { Component, OnInit } from '@angular/core';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
// import { Subscription } from 'rxjs';
@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit {
    hasPlayed: boolean;

    constructor(public userService: UserService, public virtualPlayerService: VirtualPlayerService, public timeService: TimeService) {}

    ngOnInit() {
        this.userService.turnToPlayObs.subscribe(() => {
            setTimeout(() => {
                if (!this.userService.realUser.turnToPlay) {
                    this.timeService.startTime('vrPlayer');
                    this.virtualPlayerService.manageVrPlayerActions();
                }
            }, 0);
        });
    }
}
