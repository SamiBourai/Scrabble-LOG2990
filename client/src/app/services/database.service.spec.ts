/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-import-assign */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-vars */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadableDictionary } from '@app/classes/dictionary';
import { Score } from '@app/classes/score';
import { VirtualPlayer } from '@app/classes/virtual-players';
// import { VirtualPlayer } from '@app/classes/virtualPlayers';
import {
    GET_URL_ALL_DATA,
    GET_URL_ALL_PLAYERS,
    GET_URL_DEFAULT_DATA,
    SEND_URL,
    SEND_URL_ADD_PLAYER,
    SEND_URL_GET_DICTIONARIES,
    SEND_URL_GET_DICTIONARY,
    SEND_URL_LOCAL_STORAGE,
    SEND_URL_REMOVE_ALL_PLAYER,
    SEND_URL_REMOVE_PLAYER,
    SEND_URL_UPDATE_PLAYER,
    SEND_URL_UPLOAD_DICTIONARY,
} from '@app/constants/constants';
import { of } from 'rxjs';
import { DatabaseService } from './database.service';
import { ObjectifManagerService } from './objectif-manager.service';
import { UserService } from './user.service';

describe('DatabaseService', () => {
    let service: DatabaseService;
    let httpMock: HttpTestingController;
    let snackBar: MatSnackBar;
    let objectifService: ObjectifManagerService;
    let userService: jasmine.SpyObj<UserService>;
    let loadableDic: LoadableDictionary;
    // MatSnackBarModule

    beforeEach(() => {
        userService = jasmine.createSpyObj('UserService', ['getPlayerName', 'getScore']);
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, MatSnackBarModule],
            providers: [HttpClientTestingModule, ObjectifManagerService, { provide: UserService, useValue: userService }],
        });
        userService.getPlayerName.and.returnValue('sami');
        userService.getScore.and.returnValue(17);
        service = TestBed.inject(DatabaseService);
        httpMock = TestBed.inject(HttpTestingController);
        snackBar = TestBed.inject(MatSnackBar);
        objectifService = TestBed.inject(ObjectifManagerService);
        loadableDic = { title: 'dictionnaire', description: 'francais', words: ['aa', 'ab'] };
    });
    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('sendScore() should send a in database ', () => {
        const fakeScore: Score = { name: 'test', score: 10 };
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        service.sendScore('Scores', fakeScore).subscribe((result) => expect(result).toEqual(201));
        // tslint:disable-next-line: no-string-literal / reason: access private property
        const request = httpMock.expectOne(SEND_URL + '/' + 'Scores' + '/' + fakeScore.name + '/' + fakeScore.score);
        expect(request.request.method).toEqual('POST');
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        request.flush(201);
    });
    it('sendScore() should throw an error ', () => {
        const fakeScore: Score = { name: 'test', score: 10 };
        service.sendScore('Scores', fakeScore).subscribe((response) => {
            expect(response).toBe(400);
        });
        httpMock
            .expectOne(SEND_URL + '/' + 'Scores' + '/' + fakeScore.name + '/' + fakeScore.score)
            .error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });
    it('getAllCourse() should return all courses in database ', () => {
        const fakeScore: Score = { name: 'test', score: 10 };
        service.getAllScores('Scores').subscribe((result) => {
            expect(result[0].name).toEqual(fakeScore.name);
        });
        const request = httpMock.expectOne(GET_URL_ALL_DATA + '/' + 'Scores');
        expect(request.request.method).toEqual('GET');
        request.flush([fakeScore]);
    });

    it('resetAllScores() should reset all scors and then get them all ', () => {
        const fakeScore: Score = { name: 'test', score: 10 };
        service.resetAllScores('Scores').subscribe((result) => {
            expect(result[0].name).toEqual(fakeScore.name);
        });
        const request = httpMock.expectOne(GET_URL_DEFAULT_DATA + '/' + 'Scores');
        expect(request.request.method).toEqual('GET');
        request.flush([fakeScore]);
    });
    it('getAllPlayers() should return all players in database ', () => {
        const fakeScore: VirtualPlayer = { name: 'test' };
        service.getAllPlayers('Scores').subscribe((result) => {
            expect(result[0].name).toEqual(fakeScore.name);
        });
        const request = httpMock.expectOne(GET_URL_ALL_PLAYERS + '/' + 'Scores');
        expect(request.request.method).toEqual('GET');
        request.flush([fakeScore]);
    });

    it('sendPlayer() should send player and save it in database ', () => {
        const fakeScore: VirtualPlayer = { name: 'test' };
        service.sendPlayer('Scores', 'test').subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_ADD_PLAYER + '/' + 'Scores' + '/' + fakeScore.name);
        expect(request.request.method).toEqual('POST');
        request.flush(201);
    });
    it('sendPlayer() should throw an error ', () => {
        const fakeScore: VirtualPlayer = { name: 'test' };
        service.sendPlayer('Scores', 'test').subscribe((response) => {
            expect(response).toBe(400);
        });
        httpMock
            .expectOne(SEND_URL_ADD_PLAYER + '/' + 'Scores' + '/' + fakeScore.name)
            .error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });
    it('updatePlayer() should should update the vr player name spicified ', () => {
        service.updatePlayer('Scores', 'test', 'sami').subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_UPDATE_PLAYER + '/' + 'Scores' + '/' + 'test' + '/' + 'sami');
        expect(request.request.method).toEqual('PATCH');
        request.flush(201);
    });
    it('updatePlayer() should throw an error ', () => {
        service.updatePlayer('Scores', 'test', 'sami').subscribe((response) => {
            expect(response).toBe(400);
        });
        httpMock
            .expectOne(SEND_URL_UPDATE_PLAYER + '/' + 'Scores' + '/' + 'test' + '/' + 'sami')
            .error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });

    it('sendChosenDic() post the dictionary name get from the local storage ', () => {
        service.sendChosenDic('Scores').subscribe((result) => expect(result).toEqual('201'));
        const request = httpMock.expectOne(SEND_URL_LOCAL_STORAGE + '/' + 'Scores');
        expect(request.request.method).toEqual('POST');
        request.flush('201');
    });

    it('removePlayer should delete the spicified player', () => {
        const fakeScore: VirtualPlayer = { name: 'sami' };
        service.removePlayer('test', 'sami').subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_REMOVE_PLAYER + '/' + 'test' + '/' + fakeScore.name);
        expect(request.request.method).toEqual('DELETE');
        request.flush(201);
    });
    it('removePlayer should throw an error', () => {
        const fakeScore: VirtualPlayer = { name: 'sami' };
        service.removePlayer('test', 'sami').subscribe((result) => expect(result).toEqual(400));
        httpMock
            .expectOne(SEND_URL_REMOVE_PLAYER + '/' + 'test' + '/' + fakeScore.name)
            .error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });

    it('removeAllPlayer should delete the all players in the data base', () => {
        service.removeAllPlayer('test').subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_REMOVE_ALL_PLAYER + '/' + 'test');
        expect(request.request.method).toEqual('DELETE');
        request.flush(201);
    });
    it('removeAllPlayer should throw an error', () => {
        service.removeAllPlayer('test').subscribe((result) => expect(result).toEqual(400));
        httpMock.expectOne(SEND_URL_REMOVE_ALL_PLAYER + '/' + 'test').error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });
    it('sendDictionary() should send dictionnary and save it in the server ', () => {
        // const fakeDic: LoadableDictionary = { title: 'dictionnaire', description: 'francais', words: ['aa', 'ab'] };
        service.sendDictionary(loadableDic).subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_UPLOAD_DICTIONARY);
        expect(request.request.method).toEqual('POST');
        request.flush(201);
    });
    it('sendDictionary() should throw an error ', () => {
        // const fakeDic: LoadableDictionary = { title: 'or', description: 'francais', words: ['aa', 'ab'] };
        service.sendDictionary(loadableDic).subscribe((response) => {
            expect(response).toBe(400);
        });
        httpMock.expectOne(SEND_URL_UPLOAD_DICTIONARY).error(new ErrorEvent('error'), { status: 400, statusText: 'Bad Request' });
    });

    it('deleteDictionary() should delete the spicified dictionnary', () => {
        // const fakeDic: LoadableDictionary = { title: 'test', description: 'francais', words: ['aa', 'ab'] };
        service.deleteDictionary(loadableDic).subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_GET_DICTIONARY + '/' + loadableDic.title);
        expect(request.request.method).toEqual('DELETE');
        request.flush(201);
    });
    it('deleteAllDictionaries() should delete all dictionaries', () => {
        service.deleteAllDictionaries().subscribe((result) => expect(result).toEqual(201));
        const request = httpMock.expectOne(SEND_URL_GET_DICTIONARIES);
        expect(request.request.method).toEqual('DELETE');
        request.flush(201);
    });

    it('getDictionary() should return the spicified dictionary ', () => {
        // const fakeDic: LoadableDictionary = { title: 'izi', description: 'francais', words: ['aa', 'ab'] };
        service.getDictionary('dictionnaire', loadableDic.title).subscribe((result) => {
            expect(result.title).toEqual('dictionnaire');
        });
        const request = httpMock.expectOne(SEND_URL_GET_DICTIONARY + '/' + 'dictionnaire' + '/' + 'dictionnaire');
        expect(request.request.method).toEqual('GET');
        request.flush(loadableDic);
    });

    it('getMetaDictionary() should return all ditionry words ', () => {
        // const fakeDic: LoadableDictionary = { title: 'test', description: 'francais', words: ['aa', 'ab'] };
        service.getMetaDictionary().subscribe((result) => {
            expect(result[0].title).toEqual('dictionnaire');
        });
        const request = httpMock.expectOne(SEND_URL_GET_DICTIONARIES);
        expect(request.request.method).toEqual('GET');
        request.flush(loadableDic);
    });

    it('addScores() should call sendScore and open snackbar', () => {
        // const obs: Observable<number> = new Observable<number>();
        // const fakeScore: Score = { name: 'test', score: 10 };
        objectifService.log2990Mode = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any

        const spy = spyOn(service, 'sendScore').and.returnValue(of());
        spyOn(snackBar, 'open');
        // const spyX = spyOn(service, 'openSnackBar');

        // expect(spyOnSendScore).toHaveBeenCalled();
        service.addScores();
        expect(spy).toHaveBeenCalled();
        // expect(service.openSnackBar(SCORE_HAS_BEEN_SAVED, CLOSE_SNACKBAR)).toHaveBeenCalled();
    });
    it('addScores() should call sendScore and open snackbar whith another mode', () => {
        objectifService.log2990Mode = false;

        const spy = spyOn(service, 'sendScore').and.returnValue(of());
        spyOn(snackBar, 'open');
        service.addScores();
        expect(spy).toHaveBeenCalled();
    });

    it('should test if open snackBar work', () => {
        const spy = spyOn(snackBar, 'open');
        service['openSnackBar']('Hello', 'Fermer');
        expect(spy).toHaveBeenCalled();
    });
});
