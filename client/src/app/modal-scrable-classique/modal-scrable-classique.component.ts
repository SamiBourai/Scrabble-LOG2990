import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalUserNameComponent } from '@app/modal-user-name/modal-user-name.component';

@Component({
  selector: 'app-modal-scrable-classique',
  templateUrl: './modal-scrable-classique.component.html',
  styleUrls: ['./modal-scrable-classique.component.scss']
})
export class ModalScrableClassiqueComponent implements OnInit {

  constructor(private dialogRef: MatDialog) { }

  ngOnInit(): void {
  }
  openDialog(){

    //const dialogConfig = new MatDialogConfig();
    //dialogConfig.autoFocus=true;
    this.dialogRef.open(ModalUserNameComponent);
    //this.dialogRef.open(ModalUserVsPlayerComponent);
     
  }
 
  

}
