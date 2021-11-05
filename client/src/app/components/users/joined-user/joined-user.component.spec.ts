import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinedUserComponent } from './joined-user.component';

describe('JoinedUserComponent', () => {
    let component: JoinedUserComponent;
    let fixture: ComponentFixture<JoinedUserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinedUserComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinedUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
