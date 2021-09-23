import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserVsPlayerComponent } from './modal-user-vs-player.component';

describe('ModalUserVsPlayerComponent', () => {
    let component: ModalUserVsPlayerComponent;
    let fixture: ComponentFixture<ModalUserVsPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalUserVsPlayerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalUserVsPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
