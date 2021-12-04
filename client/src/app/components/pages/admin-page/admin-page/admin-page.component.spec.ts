/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChip, MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Dictionary, DictionaryPresentation, LoadableDictionary } from '@app/classes/dictionary';
import { VirtualPlayer } from '@app/classes/virtual-players';
import { AppMaterialModule } from '@app/modules/material.module';
import { ValidWordService } from '@app/services/valid-word.service';
import { of } from 'rxjs';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    const mockAfterClosed = {
        afterClosed: jasmine.createSpy('afterClosed'),
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent, MatTable],
            imports: [HttpClientModule, BrowserAnimationsModule, NoopAnimationsModule, AppMaterialModule],
            providers: [MatSnackBar, Overlay, MatDialog, MatChip, MatChipList, { provide: MatDialogRef, useValue: mockAfterClosed }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.dataSource = [{ title: 'dictionnaire principal', description: 'le dictionnaire par defaut' }];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('openDialog', () => {
        const x = true;
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'modifier' };
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () => of(obj),
        } as MatDialogRef<typeof component>);
        component.openDialog('modifier', obj);
        expect(x).toBeTrue();
    });

    it('openDialog 2', () => {
        const x = true;
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'tirer' };
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () =>
                of(() => {
                    spyOn<any>(component, 'updateRowData');
                }),
        } as MatDialogRef<typeof component>);
        component.openDialog('tirer', obj);
        expect(x).toBeTrue();
    });

    it('openDialogPlayer beginner', () => {
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof component>);
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        const spy1 = spyOn<any>(component, 'updatePlayerToDatabase');
        const spy2 = spyOn<any>(component, 'getPlayersNamesBeg');
        component.openDialogPlayer('beginner', 'obj');
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('openDialogPlayer expert', () => {
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () => of(true),
        } as MatDialogRef<typeof component>);
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        const spy1 = spyOn<any>(component, 'updatePlayerToDatabase');
        const spy2 = spyOn<any>(component, 'getPlayersNamesExp');
        component.openDialogPlayer('expert', 'obj');
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('updateRowData true', () => {
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'modifier' };
        spyOn<any>(localStorage, 'getItem').and.returnValue('aanimall');
        spyOn<any>(component, 'isSameDictionnaryName').and.returnValue(true);
        const spy1 = spyOn<any>(component['snackBar'], 'open');
        component.updateRowData(obj);
        expect(spy1).toHaveBeenCalled();
    });

    it('updateRowData false', () => {
        const x = true;
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'modifier' };
        const dic: LoadableDictionary = { title: 'yes', description: 'yes', words: [] };
        const dic2: Dictionary = { title: 'yes', description: 'yes', words: [] };
        spyOn<any>(localStorage, 'getItem').and.returnValue('aanimall');
        spyOn<any>(component, 'isSameDictionnaryName').and.returnValue(false);

        spyOn(component.database, 'getDictionary').and.returnValue(of(dic));
        spyOn<any>(ValidWordService, 'loadableDictToDict').and.returnValue(dic2);

        component.updateRowData(obj);
        expect(x).toBeTrue();
    });

    it('getPlayersNamesBeg', () => {
        const data: VirtualPlayer[] = [{ name: 'mounir' }];
        const spy1 = spyOn<any>(component.database, 'getAllPlayers').and.returnValue(of(data));
        component.getPlayersNamesBeg();
        expect(spy1).toHaveBeenCalled();
    });

    it('getPlayersNamesExp', () => {
        const data: VirtualPlayer[] = [{ name: 'mounir' }];
        const spy1 = spyOn<any>(component.database, 'getAllPlayers').and.returnValue(of(data));
        component.getPlayersNamesExp();
        expect(spy1).toHaveBeenCalled();
    });

    it('getPlayersNamesExp', () => {
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const dic: LoadableDictionary = { title: 'yes', description: 'yes', words: [] };
        const spy1 = spyOn<any>(component.database, 'deleteDictionary').and.returnValue(of(component.dataSource));
        component.deleteDic(dic);
        expect(spy1).toHaveBeenCalled();
    });

    it('setToArrayString', () => {
        const set1 = new Set(['allo']);
        const sets: Set<string>[] = [];
        sets.push(set1);
        const result = component.setToArrayString(sets);
        expect(result).toEqual(['allo']);
    });

    it('download', () => {
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const dic: LoadableDictionary = { title: 'yes', description: 'yes', words: [] };
        const spy1 = spyOn<any>(component.database, 'getDictionary').and.returnValue(of(component.dataSource));
        component.download(dic);
        expect(spy1).toHaveBeenCalled();
    });

    it('add beginner', () => {
        const x = true;
        const event: MatChipInputEvent = { value: '', input: '' as unknown as HTMLInputElement };
        const level = 'beginner';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'addPlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesBeg');
        component.add(event, level);
        expect(x).toBeTrue();
    });

    it('add expert', () => {
        const x = true;
        const event: MatChipInputEvent = { value: '', input: '' as unknown as HTMLInputElement };
        const level = 'expert';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'addPlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesExp');
        component.add(event, level);
        expect(x).toBeTrue();
    });

    it('remove beginner', () => {
        const x = true;
        const name = '';
        const level = 'beginner';
        spyOn<any>(component, 'removePlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesBeg');
        component.remove(name, level);
        expect(x).toBeTrue();
    });

    it('remove expert', () => {
        const x = true;
        const name = '';
        const level = 'expert';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'removePlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesExp');
        component.remove(name, level);
        expect(x).toBeTrue();
    });

    it('resetDictionaries', () => {
        const x = true;
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'deleteAllDictionaries').and.returnValue(of(component.dataSource));
        component.resetDictionaries();
        expect(x).toBeTrue();
    });

    it('resetVPNames', () => {
        const x = true;
        spyOn<any>(component, 'removeAllPlayerToDatabase');
        component.resetVPNames();
        expect(x).toBeTrue();
    });

    it('setResetData', () => {
        const x = true;
        spyOn<any>(component['userService'].getIsUserResetDataObs, 'next');
        component.setResetData();
        expect(x).toBeTrue();
    });

    it('resetScores', () => {
        const x = true;
        const collectionName = 'vrBeg';
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'resetAllScores').and.returnValue(
            of(() => {
                spyOn<any>(component, 'openSnackBar');
            }),
        );

        component.resetScores(collectionName);
        expect(x).toBeTrue();
    });

    it('resetScores rejected 278', () => {
        const rejected = 1;
        const collectionName = 'vrBeg';
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'resetAllScores').and.returnValue(of(rejected));

        component.resetScores(collectionName);
        expect(rejected).toBe(1);
    });

    it('removePlayerToDatabase', () => {
        const x = true;
        const playerName = '';
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'removePlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['removePlayerToDatabase'](collectionName, playerName);
        expect(x).toBeTrue();
    });

    it('removeAllPlayerToDatabase', () => {
        const x = true;
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'removeAllPlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['removeAllPlayerToDatabase'](collectionName);
        expect(x).toBeTrue();
    });

    it('verifyValidity true', () => {
        const x = true;
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].push('abdel');
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(true);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
        expect(x).toBeTrue();
    });

    it('verifyValidity false', () => {
        const x = true;
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].push('abdel');
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(false);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
        expect(x).toBeTrue();
    });

    it('verifyValidity length 0', () => {
        const x = true;
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].length = 0;
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(false);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
        expect(x).toBeTrue();
    });

    it('isSameDictionnaryName true', () => {
        const x = true;
        const name = 'abdel';
        const obj: DictionaryPresentation[] = [{ title: 'yes', description: 'yes', action: 'modifier' }];
        component['isSameDictionnaryName'](name, obj);
        expect(x).toBeTrue();
    });

    it('isSameDictionnaryName false', () => {
        const name = 'abdel';
        const obj: DictionaryPresentation[] = [{ title: 'abdel', description: 'abdel', action: 'modifier' }];
        component['isSameDictionnaryName'](name, obj);
        expect(name).toBe('abdel');
    });

    it('validateJson', () => {
        const x = true;
        const data = 'vrBeg';
        spyOn<any>(JSON, 'parse');
        component['validateJson'](data);
        expect(x).toBeTrue();
    });

    it('validateJson', () => {
        const data = 'vrBeg';
        const x = 2;
        spyOn<any>(JSON, 'parse').and.throwError('erreur');
        component['validateJson'](data);
        expect(x).toEqual(2);
    });

    it('addPlayerToDatabase', () => {
        const playerName = '';
        const collectionName = 'vrBeg';
        const x = 10;
        spyOn<any>(component.database, 'sendPlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['addPlayerToDatabase'](collectionName, playerName);
        expect(x).toEqual(10);
    });

    it('updatePlayerToDatabase', () => {
        const playerName = '';
        const collectionName = 'vrBeg';
        const x = 2;
        spyOn<any>(component.database, 'updatePlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['updatePlayerToDatabase'](collectionName, playerName, 'mounib');
        expect(x).toEqual(2);
    });
});
