import { Injectable } from '@angular/core';
import { Score } from '@app/classes/score';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScoresService {
    arrayOfScoresClassicMode: Score[];
    arrayOfScoresLog2990Mode: Score[];
    isUserResetData: boolean;
    isUserResetDataObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);
    isEndGameObs: BehaviorSubject<boolean> = new BehaviorSubject<boolean>({} as boolean);

    constructor() {}

    get getIsUserResetDataObs(): BehaviorSubject<boolean> {
        return this.isUserResetDataObs;
    }
    get getIsEndGame(): BehaviorSubject<boolean> {
        return this.isEndGameObs;
    }
}
