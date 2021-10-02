import { Component } from '@angular/core';
import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent {
    constructor(public userService: UserService, readonly easelLogisticService: EaselLogiscticsService) {}
}
