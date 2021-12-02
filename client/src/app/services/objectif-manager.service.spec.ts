/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { UNDEFINED_INDEX } from '@app/constants/constants';
import { ObjectifManagerService } from './objectif-manager.service';

describe('ObjectifManagerService', () => {
    let service: ObjectifManagerService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ObjectifManagerService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should pass in verifyObjectifs user ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(true);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(3);
    });
    it('should pass in verifyObjectifs vrplayer ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(false);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(3);
    });
    it('should pass in verifyObjectifs user ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(true, { word: '', position: { x: 0, y: 1 }, direction: 'h' }, 0);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(3);
    });
    it('should pass in verifyObjectifs vrplayer ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(false, { word: '', position: { x: 0, y: 1 }, direction: 'h' }, 0);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(3);
    });
    it('should pass in verifyObjectifs vrplayer and one objectif completed ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: true,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(false);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(2);
    });
    it('should pass in verifyObjectifs user and two objectif completed ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: true,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: true,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const updateObjectifsSpy = spyOn<any>(service, 'updateObjectifs').and.callThrough();
        service.verifyObjectifs(true);
        expect(updateObjectifsSpy).toHaveBeenCalledTimes(1);
    });
    it('should generate objectifs mode createMultiplayerGame', () => {
        service.generateObjectifs('createMultiplayerGame');
        expect(service.choosedObjectifs.length).toBe(3);
    });
    it('should generate objectifs mode soloGame', () => {
        service.generateObjectifs('soloGame');
        expect(service.opponentPrivateObjectif.name).not.toEqual('');
    });
    it('should generate objectifs mode joinMultiplayerGame', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        service.generateObjectifs('joinMultiplayerGame');
        expect(service.choosedObjectifs[0].name).toEqual(objectifs[0].name);
        expect(service.choosedObjectifs[1].name).toEqual(objectifs[1].name);
        expect(service.choosedObjectifs[2].name).not.toEqual(objectifs[2].name);
    });
    it('should reset objectifs', () => {
        service.resetObjectifs();
        expect(service.passTurnCounter).toEqual(0);
        expect(service.vrPassTurnCounter).toEqual(0);
        expect(service.bonusMultupticator).toEqual(0);
        expect(service.initializedGame).toBeFalsy();
        expect(service.log2990Mode).toBeFalsy();
    });
    it('should displayOppenentObjectifs public ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        const definition = service.displayOppenentObjectifs({
            name: 'fillBox',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: '',
        });
        expect(definition).toBeDefined();
    });
    it('should displayOppenentObjectifs Private ', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.choosedObjectifs = objectifs.slice();
        service.displayOppenentObjectifs({
            name: 'placeInA1',
            bonus: UNDEFINED_INDEX,
            completed: false,
            definition: '',
        });
        expect(service.opponentPrivateObjectif.name).toEqual('placeInA1');
    });

    it('should updateScore and get score 2', () => {
        const objectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        const score = service.updateScore(objectifs[0], 3);
        expect(score).toEqual(2);
    });
    it('should updateScore and get score', () => {
        const objectifs = [
            {
                name: 'placeNumber',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        service.bonusMultupticator = 2;
        const score = service.updateScore(objectifs[0], 3);
        expect(score).toEqual(6);
    });
    it('should pass in updateObjectifs', () => {
        spyOn<any>(service, 'isObjectifAchived').and.returnValue(true);
        service.userPlay = true;
        service['updateObjectifs'](
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            { word: '', position: { x: 0, y: 1 }, direction: 'h' },
            0,
        );
        expect(service.completedObjectif).toBeTruthy();
    });
    it('should pass in updateObjectifs with vrPlayer play', () => {
        spyOn<any>(service, 'isObjectifAchived').and.returnValue(true);
        service.userPlay = false;
        service['updateObjectifs'](
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            { word: '', position: { x: 0, y: 1 }, direction: 'h' },
            0,
        );
        expect(service.completedObjectif).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for pass4Times with undefind command', () => {
        service.userPlay = true;
        const condition = service['isObjectifAchived']('pass4Times');
        expect(condition).toBeFalsy();
    });
    it('should pass in isObjectifAchived and return true for placeXOrZ', () => {
        service.userPlay = true;
        service['isObjectifAchived']('placeXOrZ', { word: 'existez', position: { x: 0, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for placeXOrZ', () => {
        service['isObjectifAchived']('placeXOrZ', { word: 'existez', position: { x: 0, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for place3Consonants', () => {
        spyOn<any>(service, 'is3ConsonantsPlaced').and.returnValue(true);
        service['isObjectifAchived']('place3Consonants', { word: '', position: { x: 0, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for placeInA1', () => {
        service['isObjectifAchived']('placeInA1', { word: '', position: { x: 1, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for wordToPlace', () => {
        service['isObjectifAchived']('wordToPlace', { word: 'bonus', position: { x: 1, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in isObjectifAchived and return true for placeNumber', () => {
        spyOn<any>(service, 'isNumberPlaced').and.returnValue(true);
        service['isObjectifAchived']('placeNumber', { word: '', position: { x: 1, y: 1 }, direction: 'h' }, 0);
        expect(service['isObjectifAchived']).toBeTruthy();
    });
    it('should pass in is3ConsonantsPlaced and return true', () => {
        service['is3ConsonantsPlaced']({ word: 'satirique', position: { x: 1, y: 1 }, direction: 'h' });
        expect(service['is3ConsonantsPlaced']).toBeTruthy();
    });
    it('should pass in is3ConsonantsPlaced and return false', () => {
        const condition = service['is3ConsonantsPlaced']({ word: '', position: { x: 1, y: 1 }, direction: 'h' });
        expect(condition).toBeFalsy();
    });
    it('should pass in isNumberPlaced and return true with word deux', () => {
        const condition = service['isNumberPlaced']({ word: 'deux', position: { x: 1, y: 1 }, direction: 'h' });
        expect(condition).toBeTruthy();
        expect(service.bonusMultupticator).toBe(2);
    });
    it('should pass in isNumberPlaced and return true with word trois', () => {
        const condition = service['isNumberPlaced']({ word: 'trois', position: { x: 1, y: 1 }, direction: 'h' });
        expect(condition).toBeTruthy();
        expect(service.bonusMultupticator).toBe(3);
    });
    it('should pass in isNumberPlaced and return false ', () => {
        const condition = service['isNumberPlaced']({ word: '', position: { x: 1, y: 1 }, direction: 'h' });
        expect(condition).toBeFalsy();
        expect(service.bonusMultupticator).toBe(0);
    });
    it('should pass in isFillBox and return true ', () => {
        const condition = service['isFillBox']({ word: 'jouer', position: { x: 4, y: 4 }, direction: 'h' });
        expect(condition).toBeTruthy();
    });
    it('should pass in isPassed4Times and return true ', () => {
        service.userPlay = true;
        service.passTurnCounter = 4;
        const condition = service['isPassed4Times']();
        expect(condition).toBeTruthy();
    });
    it('should pass in isPassed4Times and return true ', () => {
        service.userPlay = false;
        service.vrPassTurnCounter = 4;
        const condition = service['isPassed4Times']();
        expect(condition).toBeTruthy();
    });
});
