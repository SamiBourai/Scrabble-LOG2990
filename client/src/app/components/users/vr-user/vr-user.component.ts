import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit {
    // vrScore: number = 0;
    constructor(public userService: UserService, private virtualPlayerService: VirtualPlayerService) {}

    ngOnInit(): void {
        this.virtualPlayerService.scoreVr.subscribe((res) => {
            setTimeout(() => {
                // this.vrScore += res;
                this.userService.vrUser.score += res;
            }, 0);
        });
    }
}
