import { Component, OnDestroy, OnInit } from '@angular/core';
import { Score } from '@app/classes/score';
import { DATABASE_COLLECTION_CLASSIC, DATABASE_COLLECTION_LOG2990 } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { ScoresService } from '@app/services/score/scores.service';
import { UserService } from '@app/services/user.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-modal-scores',
    templateUrl: './modal-scores.component.html',
    styleUrls: ['./modal-scores.component.scss'],
})
export class ModalScoresComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = ['name', 'score'];
    arrayOfScoresClassicMode: Score[];
    arrayOfScoresLog2990Mode: Score[];
    private resetDataSub: Subscription;

    constructor(private databaseService: DatabaseService, private scoresService: ScoresService, private userService: UserService) {}

    ngOnInit(): void {
        this.addScores();
        this.resetDataSub = this.scoresService.getIsUserResetDataObs.subscribe((res: boolean) => {
            if (res) {
                this.resetScores(DATABASE_COLLECTION_CLASSIC);
                this.resetScores(DATABASE_COLLECTION_LOG2990);
            }
        });

        this.getScoresMode(DATABASE_COLLECTION_CLASSIC);
        this.getScoresMode(DATABASE_COLLECTION_LOG2990);
    }
    ngOnDestroy(): void {
        this.resetDataSub.unsubscribe();
    }

    private getScoresMode(collectionName: string): void {
        const scores: Observable<Score[]> = this.databaseService.getAllScores(collectionName);
        scores.subscribe((data) => {
            if (collectionName === DATABASE_COLLECTION_CLASSIC) {
                this.arrayOfScoresClassicMode = data.map((score) => {
                    return { name: score.name, score: score.score };
                });
            } else if (collectionName === DATABASE_COLLECTION_LOG2990) {
                this.arrayOfScoresLog2990Mode = data.map((score) => {
                    return { name: score.name, score: score.score };
                });
            }
        });
    }

    private resetScores(collectionName: string): void {
        const scores: Observable<Score[]> = this.databaseService.resetAllScores(collectionName);
        scores.subscribe((data: Score[]) => {
            if (collectionName === DATABASE_COLLECTION_CLASSIC) {
                this.arrayOfScoresClassicMode = data.map((score) => {
                    return { name: score.name, score: score.score };
                });
            } else if (collectionName === DATABASE_COLLECTION_LOG2990) {
                this.arrayOfScoresLog2990Mode = data.map((score) => {
                    return { name: score.name, score: score.score };
                });
            }
        });
    }

    private addScores(): void {
        let score:Score={name: this.userService.realUser.name, score:this.userService.realUser.score}
        this.scoresService.getIsEndGame.subscribe((res: boolean) => {
            if (res && (this.userService.playMode === 'soloGame' || this.userService.playMode === 'createMultiplayerGame')) {

                this.databaseService.sendScore(DATABASE_COLLECTION_CLASSIC, score).subscribe();

            }
        });
    }
}
