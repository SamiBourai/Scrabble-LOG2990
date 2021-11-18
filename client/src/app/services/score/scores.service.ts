import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ScoresService {
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
