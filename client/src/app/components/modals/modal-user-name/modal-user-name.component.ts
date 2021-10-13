import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserVsPlayerComponent } from '@app/components/modals/modal-user-vs-player/modal-user-vs-player.component';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-user-name',
    templateUrl: './modal-user-name.component.html',
    styleUrls: ['./modal-user-name.component.scss'],
})
export class ModalUserNameComponent {
    soloMode: boolean = false;
    createMultiplayerGame: boolean = false;
    joinMultiplayerGame: boolean = false;
    userName: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
    name: string;

    constructor(private dialogRef: MatDialog, private userService: UserService) {
        switch (this.userService.playMode) {
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

    openDialogOfVrUser() {
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }

    storeNameInLocalStorage() {
        this.name = this.userName.value;
        localStorage.setItem('userName', this.name);
    }
}
