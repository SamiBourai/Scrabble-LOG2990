import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private readonly SEND_URL: string = 'http://localhost:3000/api/database/Score/addScore';
    private readonly GET_URL_ALL_DATA: string = 'http://localhost:3000/api/database/Scores';
    private readonly GET_URL_DEFAULT_DATA: string = 'http://localhost:3000/api/database/Scores/resetAllScores';
    private readonly GET_URL_ALL_PLAYERS: string = 'http://localhost:3000/api/database/vrNames';

    constructor(private http: HttpClient) {}

    sendScore(score: Score): Observable<number> {
        return this.http.post<number>(this.SEND_URL, score).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    getAllScores(collectionName: string): Observable<Score[]> {
        const fullUrl = this.GET_URL_ALL_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    resetAllScores(collectionName: string): Observable<number | Score> {
        return this.http.get<Score | number>(this.GET_URL_DEFAULT_DATA + collectionName).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
    getAllPlayers(collectionName: string): Observable<VirtualPlayer[]> {
        const fullUrl = this.GET_URL_ALL_PLAYERS + '/' + collectionName;
        return this.http.get<VirtualPlayer[]>(fullUrl);
    }
}
