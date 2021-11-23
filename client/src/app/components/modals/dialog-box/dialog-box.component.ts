import { DictionaryPresentation } from './../../../../../../server/app/classes/dictionary';
import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    localData: any;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,

        @Optional() @Inject(MAT_DIALOG_DATA) public dictionnary: DictionaryPresentation,
    ) {
        console.log(dictionnary);
        this.localData = dictionnary;
        this.action = this.localData.action;
    }

    doAction() {
        this.dialogRef.close({ event: this.action, data: this.localData });
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
