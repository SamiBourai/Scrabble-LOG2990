import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserVsPlayerComponent } from '@app/modal-user-vs-player/modal-user-vs-player.component';



@Component({
    selector: 'app-modal-user-name',
    templateUrl: './modal-user-name.component.html',
    styleUrls: ['./modal-user-name.component.scss'],
})
export class ModalUserNameComponent implements OnInit {
    userName: FormControl = new FormControl('', [Validators.pattern('^[A-Za-z0-9]+$'), Validators.required]);
   
    constructor(private dialogRef: MatDialog) {}
    ngOnInit() {}
    openDialogOfVrUser(){
        this.dialogRef.open(ModalUserVsPlayerComponent);
    }
}
