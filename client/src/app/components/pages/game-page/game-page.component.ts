import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowEndgameInfoComponent } from '@app/components/modals/show-endgame-info/show-endgame-info.component';
import { DatabaseService } from '@app/services/database.service';
import { MouseHandelingService } from '@app/services/mouse-handeling.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { UserService } from '@app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit, AfterViewInit, OnDestroy {
    soloMode: boolean = true;
    playersInGamePage: boolean = false;
    event: unknown;
    assign: boolean = true;

    private endOfGameSubscription = new Subscription();

    constructor(
        public userService: UserService,
        private dataBase: DatabaseService,
        private dialogRef: MatDialog,
        public mouseHandlingService: MouseHandelingService,
        public objectifManagerService: ObjectifManagerService,
    ) {}
    detectSkipTurnBtn() {
        this.userService.userSkipingTurn = true;
    }
    ngOnInit() {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            return;
        });
        this.objectifManagerService.initializedGame = true;
    }
    ngAfterViewInit() {
        this.openShowEasel();
    }
    openShowEasel() {
        this.userService.endOfGameBehaviorSubject.subscribe((response) => {
            if (response) {
                this.dataBase.addScores();
                this.dialogRef.open(ShowEndgameInfoComponent);
            }
        });
    }

    ngOnDestroy(): void {
        this.endOfGameSubscription.unsubscribe();
        if (this.objectifManagerService.log2990Mode) this.objectifManagerService.resetObjectifs();
    }
}
