/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MessageServer } from '@app/classes/message-server';
import { UNDEFINED_INDEX } from '@app/constants/constants';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { ScrableLog2990ModalComponent } from './scrable-log2990-modal.component';

describe('ScrableLog2990ModalComponent', () => {
    let component: ScrableLog2990ModalComponent;
    let fixture: ComponentFixture<ScrableLog2990ModalComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    let turn = 0;
    const socketMock = {
        listen: (message: string) => {
            if (turn === 1) {
                const messageTest: MessageServer = {
                    gameName: 'test',
                    achivedObjectif: {
                        name: 'fillBox',
                        bonus: UNDEFINED_INDEX,
                        completed: false,
                        definition: 'fill',
                    },
                    user: {
                        name: 'test',
                        score: 4,
                        easelLetters: 7,
                    },
                };
                return new BehaviorSubject(messageTest).asObservable();
            } else if (turn === 2) {
                const messageTest2: MessageServer = {
                    gameName: 'test2',
                    achivedObjectif: {
                        name: 'fillBox22',
                        bonus: UNDEFINED_INDEX,
                        completed: false,
                        definition: 'fill2',
                    },
                };
                return new BehaviorSubject(messageTest2).asObservable();
            } else return new BehaviorSubject(message).asObservable();
        },
        setGuestPlayerInfromation: () => '',
        emit: () => '',
    };
    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'firstMode', 'realUser', 'joinedUser']);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', [
            'initializedGame',
            'objectifAchived',
            'objectifAchivedByOpponnent',
            'choosedObjectifs',
            'completedObjectif',
            'log2990Mode',
        ]);
        await TestBed.configureTestingModule({
            declarations: [ScrableLog2990ModalComponent],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
                { provide: SocketManagementService, useValue: socketMock },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ScrableLog2990ModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        turn = 0;
        objectifManagerServiceSpy.completedObjectif = false;
        expect(component).toBeTruthy();
    });
    it('should call ngOnInit of component', () => {
        turn = 0;
        objectifManagerServiceSpy.completedObjectif = false;
        component.ngOnInit();
        expect(objectifManagerServiceSpy.completedObjectif).toBeTruthy();
    });
    it('should call ngOnInit of component with message', () => {
        objectifManagerServiceSpy.completedObjectif = false;
        turn = 1;
        component.ngOnInit();
        expect(objectifManagerServiceSpy.completedObjectif).toBeTruthy();
    });
    it('should call ngOnInit of component with no message and play mode is joinMultiplayer', () => {
        turn = 1;
        userServiceSpy.playMode = 'joinMultiplayerGame';
        userServiceSpy.realUser.score = 2;
        objectifManagerServiceSpy.completedObjectif = false;
        component.ngOnInit();
        expect(userServiceSpy.realUser.score).toEqual(4);
    });
    it('should call ngOnInit of component with no score in the message and play mode is joinMultiplayer', () => {
        turn = 2;
        userServiceSpy.playMode = 'joinMultiplayerGame';
        objectifManagerServiceSpy.completedObjectif = false;
        component.ngOnInit();
        expect(userServiceSpy.realUser.score).toEqual(-1);
    });
    it('should call ngOnInit of component with message and play mode is joinMultiplayer', () => {
        turn = 1;
        objectifManagerServiceSpy.completedObjectif = false;
        userServiceSpy.playMode = 'joinMultiplayerGame';
        component.ngOnInit();
        expect(objectifManagerServiceSpy.completedObjectif).toBeTruthy();
    });
    it('should call ngOnInit of component with no message', () => {
        objectifManagerServiceSpy.completedObjectif = false;
        component.ngOnInit();
        expect(objectifManagerServiceSpy.completedObjectif).toBeTruthy();
    });
    it('should call openDialog of component', () => {
        component.openDialog('test');
        expect(userServiceSpy.firstMode).toEqual('test');
    });
    it('should call getObjectifs of component', () => {
        const choodedobjectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: 'fill',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        objectifManagerServiceSpy.choosedObjectifs = choodedobjectifs.slice();
        const objectifs = component.getObjectifs();
        expect(objectifs[0]).toEqual('fill');
    });
    it('should call getObjectifs with first objectif completed of component', () => {
        const choodedobjectifs = [
            {
                name: 'fillBox',
                bonus: UNDEFINED_INDEX,
                completed: true,
                definition: 'fill',
            },
            {
                name: 'pass4Times',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
            {
                name: 'exchangeAllLetters',
                bonus: UNDEFINED_INDEX,
                completed: false,
                definition: '',
            },
        ];
        objectifManagerServiceSpy.choosedObjectifs = choodedobjectifs.slice();
        const objectifs = component.getObjectifs();
        expect(objectifs[0]).toEqual('fill. (complété)');
    });
});
