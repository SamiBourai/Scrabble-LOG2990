/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ModalEndOfGameComponent } from './modal-end-of-game.component';

describe('ModalEndOfGameComponent', () => {
    let component: ModalEndOfGameComponent;
    let fixture: ComponentFixture<ModalEndOfGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalEndOfGameComponent],
            imports: [HttpClientModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalEndOfGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit', () => {
        const data = true;
        const spy = spyOn<any>(component.multiplayerService, 'winnerOfGame').and.returnValue(of(data));
        component.ngOnInit();
        expect(spy).not.toHaveBeenCalled();
    });
});
