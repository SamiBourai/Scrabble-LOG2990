import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@app/classes/message';
import { ModalScoresComponent } from '@app/components/modals/modal-scores/modal-scores.component';
import { ModalScrableClassiqueComponent } from '@app/components/modals/modal-scrable-classique/modal-scrable-classique.component';
import { ScrableLog2990ModalComponent } from '@app/components/modals/scrable-log2990-modal/scrable-log2990-modal.component';
import { CommunicationService } from '@app/services/communication.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    isNameSectionHide: boolean;
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private readonly communicationService: CommunicationService, private dialogRef: MatDialog) {}
    openStartGameModal() {
        this.dialogRef.open(ModalScrableClassiqueComponent);
    }

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client to samy plzzzz',
            body: 'Time is : ' + new Date().toString(),
        };

        this.communicationService.basicPost(newTimeMessage).subscribe();
    }
    getMessagesFromServer(): void {
        this.communicationService
            .basicGet()

            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }

    openScoreModal(): void {
        this.dialogRef.open(ModalScoresComponent);
    }
    openScrableLog2990Modal(): void {
        this.dialogRef.open(ScrableLog2990ModalComponent);
    }
}
