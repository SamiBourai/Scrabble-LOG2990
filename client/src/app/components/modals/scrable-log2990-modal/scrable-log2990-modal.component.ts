import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameInitializationComponent } from '@app/components/modals/game-initialization/game-initialization.component';
import { NUMBER_OF_SENTENCE, TWO_SECOND_INTERVAL } from '@app/constants/constants';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { UserService } from '@app/services/user.service';
@Component({
    selector: 'app-scrable-log2990-modal',
    templateUrl: './scrable-log2990-modal.component.html',
    styleUrls: ['./scrable-log2990-modal.component.scss'],
})
export class ScrableLog2990ModalComponent implements OnInit {
    indexSentence: number = 0;
    sentence = new Array<boolean>(NUMBER_OF_SENTENCE);
    constructor(private dialogRef: MatDialog, private userService: UserService, public objectifManagerService: ObjectifManagerService) {}

    ngOnInit(): void {
        this.sentence[this.indexSentence] = true;
        const interValID = setInterval(() => {
            this.indexSentence++;
            this.sentence[this.indexSentence] = true;
            if (this.indexSentence === NUMBER_OF_SENTENCE) clearInterval(interValID);
        }, TWO_SECOND_INTERVAL);
    }
    openDialog(gameMode: string) {
        this.userService.firstMode = gameMode;
        this.objectifManagerService.initializedGame = true;
        this.dialogRef.open(GameInitializationComponent);
    }
}
