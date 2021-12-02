/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogUpdatePlayerComponent } from './dialog-update-player.component';

describe('DialogUpdatePlayerComponent', () => {
    let component: DialogUpdatePlayerComponent;
    let fixture: ComponentFixture<DialogUpdatePlayerComponent>;

    const dialogMock = {
        close: () => { }
        };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogUpdatePlayerComponent],
            providers: [{ provide: MatDialogRef, useValue: dialogMock },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogUpdatePlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('doAction', () => {
        const spy = spyOn<any>(component['dialogRef'],'close').and.callThrough();
        component.doAction();
        expect(spy).toHaveBeenCalled();
    });

    it('closeDialog', () => {
        const spy = spyOn<any>(component['dialogRef'],'close').and.callThrough();
        component.closeDialog();
        expect(spy).toHaveBeenCalled();
    });
});
