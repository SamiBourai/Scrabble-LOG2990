import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-vr-user',
    templateUrl: './vr-user.component.html',
    styleUrls: ['./vr-user.component.scss'],
})
export class VrUserComponent implements OnInit {
    constructor(public userService: UserService) {}

    ngOnInit(): void {
      
    }
}
