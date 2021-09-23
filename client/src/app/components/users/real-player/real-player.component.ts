import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';


@Component({
    selector: 'app-real-player',
    templateUrl: './real-player.component.html',
    styleUrls: ['./real-player.component.scss'],
})
export class RealPlayerComponent implements OnInit {


    constructor(public userService:UserService) {}

    ngOnInit(): void {
    }

}
