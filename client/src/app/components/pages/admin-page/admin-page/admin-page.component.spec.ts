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
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'modifier' };
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () => of(obj),
        } as MatDialogRef<typeof component>);
        component.openDialog('modifier', obj);
    });

    it('openDialog', () => {
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'tirer' };
        spyOn(component.dialog, 'open').and.returnValue({
            afterClosed: () =>
                of(() => {
                    spyOn<any>(component, 'updateRowData');
                }),
        } as MatDialogRef<typeof component>);
        component.openDialog('tirer', obj);
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
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const obj: DictionaryPresentation = { title: 'yes', description: 'yes', action: 'modifier' };
        const dic: LoadableDictionary = { title: 'yes', description: 'yes', words: [] };
        const dic2: Dictionary = { title: 'yes', description: 'yes', words: [] };
        spyOn<any>(localStorage, 'getItem').and.returnValue('aanimall');
        spyOn<any>(component, 'isSameDictionnaryName').and.returnValue(false);

        spyOn(component.database, 'getDictionary').and.returnValue(of(dic));
        spyOn<any>(ValidWordService, 'loadableDictToDict').and.returnValue(dic2);

        component.updateRowData(obj);
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

    it('onFileSelected', () => {
        // do it
    });

    it('download', () => {
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        const dic: LoadableDictionary = { title: 'yes', description: 'yes', words: [] };
        const spy1 = spyOn<any>(component.database, 'getDictionary').and.returnValue(of(component.dataSource));
        component.download(dic);
        expect(spy1).toHaveBeenCalled();
    });

    it('add beginner', () => {
        const event: MatChipInputEvent = { value: '', input: '' as unknown as HTMLInputElement };
        const level = 'beginner';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'addPlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesBeg');
        component.add(event, level);
    });

    it('add expert', () => {
        const event: MatChipInputEvent = { value: '', input: '' as unknown as HTMLInputElement };
        const level = 'expert';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'addPlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesExp');
        component.add(event, level);
    });

    it('remove beginner', () => {
        const name = '';
        const level = 'beginner';
        spyOn<any>(component, 'removePlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesBeg');
        component.remove(name, level);
    });

    it('remove expert', () => {
        const name = '';
        const level = 'expert';
        spyOn<any>(component, 'verifyValidity').and.returnValue(true);
        spyOn<any>(component, 'removePlayerToDatabase');
        spyOn<any>(component, 'getPlayersNamesExp');
        component.remove(name, level);
    });

    it('resetDictionaries', () => {
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'deleteAllDictionaries').and.returnValue(of(component.dataSource));
        component.resetDictionaries();
    });

    it('resetVPNames', () => {
        spyOn<any>(component, 'removeAllPlayerToDatabase');
        component.resetVPNames();
    });

    it('setResetData', () => {
        spyOn<any>(component['userService'].getIsUserResetDataObs, 'next');
        component.setResetData();
    });

    it('resetScores', () => {
        const collectionName = 'vrBeg';
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'resetAllScores').and.returnValue(
            of(() => {
                spyOn<any>(component, 'openSnackBar');
            }),
        );

        component.resetScores(collectionName);
    });

    it('resetScores rejected 278', () => {
        const rejected = 1;
        const collectionName = 'vrBeg';
        component.dataSource = [{ title: 'yes', description: 'yes' }];
        spyOn<any>(component.database, 'resetAllScores').and.returnValue(of(rejected));

        component.resetScores(collectionName);
    });

    it('removePlayerToDatabase', () => {
        const playerName = '';
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'removePlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['removePlayerToDatabase'](collectionName, playerName);
    });

    it('removeAllPlayerToDatabase', () => {
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'removeAllPlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['removeAllPlayerToDatabase'](collectionName);
    });

    it('verifyValidity true', () => {
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].push('abdel');
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(true);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
    });

    it('verifyValidity false', () => {
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].push('abdel');
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(false);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
    });

    it('verifyValidity length 0', () => {
        const name = 'abdel';
        component['userService'].vrPlayerNamesBeginner[1].length = 0;
        spyOn<any>(component['userService'].vrPlayerNamesBeginner[1], 'includes').and.returnValue(false);
        spyOn<any>(component, 'openSnackBar');
        component['verifyValidity'](name);
    });

    it('isSameDictionnaryName true', () => {
        const name = 'abdel';
        const obj: DictionaryPresentation[] = [{ title: 'yes', description: 'yes', action: 'modifier' }];
        component['isSameDictionnaryName'](name, obj);
    });

    it('isSameDictionnaryName false', () => {
        const name = 'abdel';
        const obj: DictionaryPresentation[] = [{ title: 'abdel', description: 'abdel', action: 'modifier' }];
        component['isSameDictionnaryName'](name, obj);
    });

    it('validateJson', () => {
        const data = 'vrBeg';
        spyOn<any>(JSON, 'parse');
        component['validateJson'](data);
    });

    it('validateJson', () => {
        const data = 'vrBeg';
        spyOn<any>(JSON, 'parse').and.throwError('erreur');
        component['validateJson'](data);
    });

    it('addPlayerToDatabase', () => {
        const playerName = '';
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'sendPlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['addPlayerToDatabase'](collectionName, playerName);
    });

    it('updatePlayerToDatabase', () => {
        const playerName = '';
        const collectionName = 'vrBeg';
        spyOn<any>(component.database, 'updatePlayer').and.returnValue(
            of(() => {
                spyOn<any>(component, 'getPlayersNamesBeg');
                spyOn<any>(component, 'getPlayersNamesExp');
            }),
        );
        component['updatePlayerToDatabase'](collectionName, playerName, 'mounib');
    });
});
