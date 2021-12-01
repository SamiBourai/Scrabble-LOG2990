import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogUpdatePlayerComponent } from './dialog-update-player.component';

describe('DialogUpdatePlayerComponent', () => {
    let component: DialogUpdatePlayerComponent;
    let fixture: ComponentFixture<DialogUpdatePlayerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogUpdatePlayerComponent],
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
});
