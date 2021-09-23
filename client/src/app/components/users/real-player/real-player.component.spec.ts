import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealPlayerComponent } from './real-player.component';

describe('RealPlayerComponent', () => {
    let component: RealPlayerComponent;
    let fixture: ComponentFixture<RealPlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RealPlayerComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RealPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
