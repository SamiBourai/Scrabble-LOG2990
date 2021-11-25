import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageServer } from '@app/classes/message-server';
import { GameInitializationComponent } from '@app/components/modals/game-initialization/game-initialization.component';
import { NUMBER_OF_SENTENCE, TWO_SECOND_INTERVAL, UNDEFINED_INDEX } from '@app/constants/constants';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
@Component({
    selector: 'app-scrable-log2990-modal',
    templateUrl: './scrable-log2990-modal.component.html',
    styleUrls: ['./scrable-log2990-modal.component.scss'],
})
export class ScrableLog2990ModalComponent implements OnInit {
    indexSentence: number = 0;
    sentence = new Array<boolean>(NUMBER_OF_SENTENCE);
    constructor(
        private dialogRef: MatDialog,
        private userService: UserService,
        private socketManagementService: SocketManagementService,
        public objectifManagerService: ObjectifManagerService,
    ) {}

    ngOnInit(): void {
        this.sentence[this.indexSentence] = true;
        if (!this.objectifManagerService.initializedGame) {
            const interValID = setInterval(() => {
                this.indexSentence++;
                this.sentence[this.indexSentence] = true;
                if (this.indexSentence === NUMBER_OF_SENTENCE) clearInterval(interValID);
            }, TWO_SECOND_INTERVAL);
        }
        this.socketManagementService.listen('objectifAchived').subscribe((objectif: MessageServer) => {
            if (objectif && !this.objectifManagerService.objectifAchived) {
                this.objectifManagerService.objectifAchived = true;
                this.objectifManagerService.objectifAchivedByOpponnent = true;
                this.objectifManagerService.achivedObjectif = {
                    name: objectif.achivedObjectif?.name ?? '',
                    bonus: objectif.achivedObjectif?.bonus ?? UNDEFINED_INDEX,
                    completed: objectif.achivedObjectif?.completed ?? false,
                    definition: objectif.achivedObjectif?.definition ?? '',
                };
                if (this.userService.playMode === 'joinMultiplayerGame') this.userService.realUser.score = objectif.user?.score ?? UNDEFINED_INDEX;
                else this.userService.joinedUser.score = objectif.user?.score ?? UNDEFINED_INDEX;
            }
        });
    }
    openDialog(gameMode: string) {
        this.userService.firstMode = gameMode;
        this.objectifManagerService.log2990Mode = true;
        this.dialogRef.open(GameInitializationComponent);
    }
    getObjectifs(): string[] {
        const objectifDefinition: string[] = [];
        for (const objectif of this.objectifManagerService.choosedObjectifs) {
            if (objectif.completed && !objectif.definition.includes('complété')) objectif.definition += '. (complété)';
            objectifDefinition.push(objectif.definition);
        }
        return objectifDefinition;
    }
}
