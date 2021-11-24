import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Score } from '@app/classes/score';
import {
    CLOSE_SNACKBAR,
    DATABASE_COLLECTION_CLASSIC,
    DATABASE_COLLECTION_LOG2990,
    ERROR_HTTP,
    MAX_TIME_SNACKBAR,
    NAME_COLUMN,
    REQUEST_SUCCESFULLY_EXECUTED,
    SCORE_COLUMN,
    SCORE_HAS_BEEN_SAVED,
    SCORE_NOT_SAVED,
    SERVER_NOT_RESPONDING,
} from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-modal-scores',
    templateUrl: './modal-scores.component.html',
    styleUrls: ['./modal-scores.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ModalScoresComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [NAME_COLUMN, SCORE_COLUMN];
    arrayOfScoresClassicMode: Score[];
    arrayOfScoresLog2990Mode: Score[];
    isPlayerAdd: boolean;
    private unsubscribeFromGet1: Subscription;
    // private unsubscribeFromGet2: Subscription;
    constructor(private databaseService: DatabaseService, private snackBar: MatSnackBar) {}

    ngOnInit() {
        this.getScoresMode(DATABASE_COLLECTION_CLASSIC);
        this.getScoresMode(DATABASE_COLLECTION_LOG2990);
    }
    ngOnDestroy(): void {
        this.unsubscribeFromGet1.unsubscribe();
        // this.unsubscribeFromGet2.unsubscribe();
    }

    addScores(): void {
        // A REMPLACER QUAND FIN DE PARTIE VA MARCHER
        const score: Score = { name: 'sami', score: 6 };
        this.databaseService.sendScore(DATABASE_COLLECTION_CLASSIC, score).subscribe(
            () => {
                this.openSnackBar(SCORE_HAS_BEEN_SAVED, CLOSE_SNACKBAR);

                this.getScoresMode(DATABASE_COLLECTION_CLASSIC);
                this.getScoresMode(DATABASE_COLLECTION_LOG2990);
            },
            (reject: number) => {
                this.openSnackBar(ERROR_HTTP + reject + SCORE_NOT_SAVED, CLOSE_SNACKBAR);
            },
        );
    }
    private openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, { duration: MAX_TIME_SNACKBAR });
    }
    private getScoresMode(collectionName: string): void {
        const scores: Observable<Score[]> = this.databaseService.getAllScores(collectionName);
        this.unsubscribeFromGet1 = scores.subscribe(
            (data: Score[]) => {
                if (collectionName === DATABASE_COLLECTION_CLASSIC) {
                    this.arrayOfScoresClassicMode = data.map((score) => {
                        return { name: score.name, score: score.score };
                    });
                } else if (collectionName === DATABASE_COLLECTION_LOG2990) {
                    this.arrayOfScoresLog2990Mode = data.map((score) => {
                        return { name: score.name, score: score.score };
                    });
                    this.openSnackBar(REQUEST_SUCCESFULLY_EXECUTED, CLOSE_SNACKBAR);
                }
            },
            (rejected: number) => {
                this.openSnackBar(ERROR_HTTP + rejected + SERVER_NOT_RESPONDING, CLOSE_SNACKBAR);
            },
        );
    }
}
