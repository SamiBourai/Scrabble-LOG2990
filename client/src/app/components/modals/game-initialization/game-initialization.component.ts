import { Component, OnInit } from '@angular/core';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-user-name',
    templateUrl: './game-initialization.component.html',
    styleUrls: ['./game-initialization.component.scss'],
})
export class GameInitializationComponent implements OnInit {
    soloMode: boolean = false;
    createMultiplayerGame: boolean = false;
    joinMultiplayerGame: boolean = false;

    constructor(public userService: UserService) {}

    ngOnInit(): void {
        this.userService.playMode = this.userService.firstMode;
        switch (this.userService.firstMode) {
            case 'soloGame':
                this.soloMode = true;
                break;

            case 'createMultiplayerGame':
                this.createMultiplayerGame = true;
                break;

            case 'joinMultiplayerGame':
                this.joinMultiplayerGame = true;
                break;
        }
    }
}
