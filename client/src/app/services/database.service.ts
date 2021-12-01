import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadableDictionary } from '@app/classes/dictionary';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtualPlayers';
import {
    CLOSE_SNACKBAR,
    DATABASE_COLLECTION_CLASSIC,
    DATABASE_COLLECTION_LOG2990,
    ERROR_HTTP,
    GET_URL_ALL_DATA,
    GET_URL_ALL_PLAYERS,
    GET_URL_DEFAULT_DATA,
    MAX_TIME_SNACKBAR,
    SCORE_HAS_BEEN_SAVED,
    SCORE_NOT_SAVED,
    SEND_URL,
    SEND_URL_ADD_PLAYER,
    SEND_URL_GET_DICTIONARIES,
    SEND_URL_GET_DICTIONARY,
    SEND_URL_REMOVE_ALL_PLAYER,
    SEND_URL_REMOVE_PLAYER,
    SEND_URL_UPLOAD_DICTIONARY,
} from '@app/constants/constants';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ObjectifManagerService } from './objectif-manager.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar,
        private objectifService: ObjectifManagerService,
        private userService: UserService,
    ) {}

    sendScore(collectionName: string, score: Score): Observable<number> {
        const fullUrl: string = SEND_URL + '/' + collectionName + '/' + score.name + '/' + score.score;
        return this.http.post<number>(fullUrl, 'name').pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    getAllScores(collectionName: string): Observable<Score[]> {
        const fullUrl = GET_URL_ALL_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    resetAllScores(collectionName: string): Observable<Score[]> {
        const fullUrl: string = GET_URL_DEFAULT_DATA + '/' + collectionName;
        return this.http.get<Score[]>(fullUrl);
    }
    getAllPlayers(collectionName: string): Observable<VirtualPlayer[]> {
        const fullUrl: string = GET_URL_ALL_PLAYERS + '/' + collectionName;
        return this.http.get<VirtualPlayer[]>(fullUrl);
    }

    sendPlayer(collectionName: string, player: string): Observable<number> {
        const fullUrl = SEND_URL_ADD_PLAYER + '/' + collectionName + '/' + player;
        return this.http.post<number>(fullUrl, player).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    removePlayer(collectionName: string, player: string): Observable<number> {
        const fullUrl = SEND_URL_REMOVE_PLAYER + '/' + collectionName + '/' + player;
        return this.http.delete<number>(fullUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    removeAllPlayer(collectionName: string): Observable<number> {
        const fullUrl = SEND_URL_REMOVE_ALL_PLAYER + '/' + collectionName;
        return this.http.delete<number>(fullUrl).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    sendDictionary(file: LoadableDictionary): Observable<number> {
        const fullUrl = SEND_URL_UPLOAD_DICTIONARY;
        return this.http.post<number>(fullUrl, file).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    deleteDictionary(fileName: LoadableDictionary) {
        const fullUrl = SEND_URL_GET_DICTIONARY + '/' + fileName.title;
        return this.http.delete(fullUrl);
    }

    deleteAllDictionaries() {
        return this.http.delete(SEND_URL_GET_DICTIONARIES);
    }

    getDictionary(title: string, oldName?: string): Observable<LoadableDictionary> {
        const fullUrl = SEND_URL_GET_DICTIONARY + '/' + title + '/' + (oldName ?? '');
        return this.http.get<LoadableDictionary>(fullUrl);
    }

    getMetaDictionary(): Observable<LoadableDictionary[]> {
        const fullUrl = SEND_URL_GET_DICTIONARIES;
        return this.http.get<LoadableDictionary[]>(fullUrl);
    }
    addScores(): void {
        const collectionConcerned: string = this.objectifService.log2990Mode ? DATABASE_COLLECTION_LOG2990 : DATABASE_COLLECTION_CLASSIC;

        const score: Score = { name: this.userService.getPlayerName(), score: this.userService.getScore() };
        this.sendScore(collectionConcerned, score).subscribe(
            () => {
                this.openSnackBar(SCORE_HAS_BEEN_SAVED, CLOSE_SNACKBAR);
            },
            (reject: number) => {
                this.openSnackBar(ERROR_HTTP + reject + SCORE_NOT_SAVED, CLOSE_SNACKBAR);
            },
        );
    }
    openSnackBar(message: string, action: string): void {
        this.snackBar.open(message, action, { duration: MAX_TIME_SNACKBAR });
    }
}
