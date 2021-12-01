/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box.component';

fdescribe('DialogBoxComponent', () => {
    let component: DialogBoxComponent;
    let fixture: ComponentFixture<DialogBoxComponent>;
    // const mockDialogRef = {
    //     open: jasmine.createSpy('open'),
    // };

    const dialogMock = {
        close: () => { }
        };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogBoxComponent],
            
            
            providers: [{ provide: MatDialogRef, useValue: dialogMock },
                        {provide:MAT_DIALOG_DATA, useValue:{}}],
        }).compileComponents();
    });
    

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogBoxComponent);
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
