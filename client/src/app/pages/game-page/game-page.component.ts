import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    constructor(  public userService:UserService){

    }


    ngOnInit(): void {
    }

}
