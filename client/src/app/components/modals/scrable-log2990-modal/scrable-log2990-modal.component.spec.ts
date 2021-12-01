import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { ScrableLog2990ModalComponent } from './scrable-log2990-modal.component';

describe('ScrableLog2990ModalComponent', () => {
    let component: ScrableLog2990ModalComponent;
    let fixture: ComponentFixture<ScrableLog2990ModalComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'firstMode', 'realUser', 'joinedUser']);
        socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms', 'subscribe']);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', [
            'initializedGame',
            'objectifAchived',
            'objectifAchivedByOpponnent',
            'choosedObjectifs',
            'achivedObjectif',
            'log2990Mode',
        ]);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ScrableLog2990ModalComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
                { provide: SocketManagementService, useValue: socketManagementServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScrableLog2990ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
