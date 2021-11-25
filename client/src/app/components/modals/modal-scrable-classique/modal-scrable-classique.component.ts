import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameInitializationComponent } from '@app/components/modals/game-initialization/game-initialization.component';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { UserService } from '@app/services/user.service';

@Component({
    selector: 'app-modal-scrable-classique',
    templateUrl: './modal-scrable-classique.component.html',
    styleUrls: ['./modal-scrable-classique.component.scss'],
})
export class ModalScrableClassiqueComponent {
    constructor(private dialogRef: MatDialog, private userService: UserService, private objectifManagerService: ObjectifManagerService) {}

    openDialog(gameMode: string) {
        this.userService.firstMode = gameMode;
        this.objectifManagerService.log2990Mode = false;
        this.objectifManagerService.initializedGame = false;
        this.dialogRef.open(GameInitializationComponent);
    }
}
