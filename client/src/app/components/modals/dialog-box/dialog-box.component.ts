import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryPresentation } from './../../../classes/dictionary';

export interface UsersData {
    name: string;
    id: number;
}

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent {
    action: string;
    localData: DictionaryPresentation;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,

        @Inject(MAT_DIALOG_DATA) public dictionnary: DictionaryPresentation,
    ) {
        localStorage.setItem('dic', JSON.stringify(dictionnary.title));
        this.localData = dictionnary;
        this.action = this.localData.action as string;
    }

    doAction() {
        this.dialogRef.close({ event: this.action, data: this.localData });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
