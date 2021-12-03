/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Score } from '@app/classes/score';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalScoresComponent } from './modal-scores.component';
const scoreMock:Score[] = [{name:'sami',score:12},{name:'abdel',score:30}];
describe('ModalScoresComponent', () => {
    let component: ModalScoresComponent;
    let fixture: ComponentFixture<ModalScoresComponent>;
    const scoreList = scoreMock;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    const MatMock = {
        open: () => {},
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalScoresComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: MatSnackBar, useValue: MatMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit',()=>{
        const spy = spyOn<any>(component,'getScoresMode');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('ngOnDestroy',()=>{
        const spy = spyOn<any>(component['unsubscribeFromGet1'],'unsubscribe');
        component.ngOnDestroy();
        expect(spy).toHaveBeenCalled();
    });

    it('openSnackBar',()=>{
        const msg = 'allo';
        const act = 'close';
        const spy = spyOn<any>(component['snackBar'],'open');
        component['openSnackBar'](msg,act);
        expect(spy).toHaveBeenCalled();
    });

    it('getScoresMode',()=>{
        const collection = 'score';
          spyOn(component['databaseService'],'getAllScores').and.returnValue(of(scoreList).pipe(delay(1)));
        component['getScoresMode'](collection);
        expect(component.arrayOfScoresClassicMode).not.toBeDefined();
        
        
    });

    it('getScoresMode 2',()=>{
        const collection = 'scoreLog2990';
          spyOn(component['databaseService'],'getAllScores').and.returnValue(of(scoreList).pipe(delay(1)));
          const spy = spyOn<any>(component,'openSnackBar');
        component['getScoresMode'](collection);
        expect(component.arrayOfScoresLog2990Mode).not.toBeDefined();
        expect(spy).not.toHaveBeenCalled();
    });
});
