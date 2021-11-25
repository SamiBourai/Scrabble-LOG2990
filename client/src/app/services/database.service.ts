import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadableDictionary } from '@app/classes/dictionary';
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
    private readonly SEND_URL_REMOVE_PLAYER: string = 'http://localhost:3000/api/database/removePlayer';
    private readonly SEND_URL_REMOVE_ALL_PLAYER: string = 'http://localhost:3000/api/database/removeAllPlayer';
    private readonly SEND_URL_UPLOAD_DICTIONARY: string = 'http://localhost:3000/api/database/upload';
    private readonly SEND_URL_GET_DICTIONARY: string = 'http://localhost:3000/api/database/dictionary';
    private readonly SEND_URL_GET_DICTIONARIES: string = 'http://localhost:3000/api/database/dictionaries';

    constructor(private http: HttpClient) {}

    sendScore(collectionName: string, score: Score): Observable<number> {
        const fullUrl: string = this.SEND_URL + '/' + collectionName + '/' + score.name + '/' + score.score;
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
        const fullUrl: string = this.GET_URL_DEFAULT_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    getAllPlayers(collectionName: string): Observable<VirtualPlayer[]> {
        const fullUrl: string = this.GET_URL_ALL_PLAYERS + '/' + collectionName;
        return this.http.get<VirtualPlayer[]>(fullUrl);
    }

    sendPlayer(collectionName: string, player: string): Observable<number> {
        const fullUrl = this.SEND_URL_ADD_PLAYER + '/' + collectionName + '/' + player;
        return this.http.post<number>(fullUrl, player).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    removePlayer(collectionName: string, player: string): Observable<number> {
        const fullUrl = this.SEND_URL_REMOVE_PLAYER + '/' + collectionName + '/' + player;
        return this.http.delete<number>(fullUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    removeAllPlayer(collectionName: string): Observable<number> {
        const fullUrl = this.SEND_URL_REMOVE_ALL_PLAYER + '/' + collectionName;
        return this.http.delete<number>(fullUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    sendDictionary(file: LoadableDictionary, oldName?: string): Observable<number> {
        const fullUrl = this.SEND_URL_UPLOAD_DICTIONARY + '/' + (oldName ?? '');
        return this.http.post<number>(fullUrl, file).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    deleteDictionary(fileName: LoadableDictionary) {
        const fullUrl = this.SEND_URL_GET_DICTIONARY + '/' + fileName.title;
        return this.http.delete(fullUrl);
    }

    deleteAllDictionaries() {
        const fullUrl = this.SEND_URL_GET_DICTIONARIES;
        return this.http.delete(fullUrl);
    }

    getDictionary(title: string): Observable<LoadableDictionary> {
        const fullUrl = this.SEND_URL_GET_DICTIONARY + '/' + title;
        return this.http.get<LoadableDictionary>(fullUrl);
    }

    getMetaDictionary(): Observable<LoadableDictionary[]> {
        const fullUrl = this.SEND_URL_GET_DICTIONARIES;
        return this.http.get<LoadableDictionary[]>(fullUrl);
    }
}
