import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { UserService } from '@app/services/user.service';
import { ModalScrableClassiqueComponent } from './modal-scrable-classique.component';

describe('ModalScrableClassiqueComponent', () => {
    let component: ModalScrableClassiqueComponent;
    let fixture: ComponentFixture<ModalScrableClassiqueComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['isUserQuitGame']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [ModalScrableClassiqueComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalScrableClassiqueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should pass on openDialog', () => {
        component.openDialog('soloGame');
        expect(mockDialogRef.open).toHaveBeenCalled();
    });
});