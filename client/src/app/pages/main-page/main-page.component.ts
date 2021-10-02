import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@app/classes/message';
import { ModalScrableClassiqueComponent } from '@app/modal-scrable-classique/modal-scrable-classique.component';
import { CommunicationService } from '@app/services/communication.service';
import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    isclicked: boolean = false;

    constructor(private readonly communicationService: CommunicationService, private dialogRef: MatDialog) {}
    openDialog() {
        this.dialogRef.open(ModalScrableClassiqueComponent);
    }
    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        this.communicationService.basicPost(newTimeMessage).subscribe();
    }
}
