import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-update-player',
    templateUrl: './dialog-update-player.component.html',
    styleUrls: ['./dialog-update-player.component.scss'],
})
export class DialogUpdatePlayerComponent {
    localData: string;

    constructor(
        public dialogRef: MatDialogRef<DialogUpdatePlayerComponent>,

        @Optional() @Inject(MAT_DIALOG_DATA) public name: string,
    ) {
        localStorage.setItem('oldPlayer', name);
        this.localData = name;
    }

    doAction() {
        this.dialogRef.close({ data: this.localData });
        localStorage.setItem('newPlayer', this.localData);
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
