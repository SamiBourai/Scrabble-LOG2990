import { Component } from '@angular/core';
// import { FormBuilder } from '@angular/forms';
// import { MainPageComponent } from '@app/pages/main-page/main-page.component';
// import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserNameComponent } from '@app/components/modals/modal-user-name/modal-user-name.component';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-scrable-classique',
    templateUrl: './modal-scrable-classique.component.html',
    styleUrls: ['./modal-scrable-classique.component.scss'],
})
export class ModalScrableClassiqueComponent {
    constructor(private dialogRef: MatDialog, private userService: UserService) {}

    openDialog(gameMode: string) {
        this.userService.playMode = gameMode;
        this.dialogRef.open(ModalUserNameComponent);
    }
}
