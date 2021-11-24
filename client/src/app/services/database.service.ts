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


    private readonly SEND_URL: string = 'http://localhost:3000/api/database/addScore';
    private readonly GET_URL_ALL_DATA: string = 'http://localhost:3000/api/database/Scores';
    private readonly GET_URL_DEFAULT_DATA: string = 'http://localhost:3000/api/database/resetAllScores';
    private readonly GET_URL_ALL_PLAYERS: string = 'http://localhost:3000/api/database/vrNames';
    private readonly SEND_URL_ADD_PLAYER: string = 'http://localhost:3000/api/database/addPlayer';

    constructor(private http: HttpClient) {}

    sendScore(collectionName:string, score: Score): Observable<number> {
        const fullUrl:string = this.SEND_URL + '/' + collectionName + '/' + score.name+'/'+score.score;
        return this.http.post<number>(fullUrl, 'name').pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    getAllScores(collectionName: string): Observable<Score[]> {
        const fullUrl = this.GET_URL_ALL_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    resetAllScores(collectionName: string): Observable<Score[]> {
        const fullUrl:string = this.GET_URL_DEFAULT_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    getAllPlayers(collectionName: string): Observable<VirtualPlayer[]> {
        const fullUrl:string = this.GET_URL_ALL_PLAYERS + '/' + collectionName;
        return this.http.get<VirtualPlayer[]>(fullUrl);
    }

    sendPlayer(collectionName:string, player: string): Observable<number> {
        const fullUrl:string = this.SEND_URL_ADD_PLAYER + '/' + collectionName + '/' + player;
        return this.http.post<number>(fullUrl, player).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

}
