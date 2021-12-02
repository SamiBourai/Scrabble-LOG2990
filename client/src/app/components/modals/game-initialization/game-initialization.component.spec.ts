/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { GameInitializationComponent } from './game-initialization.component';

describe('ModalUserNameComponent', () => {
    let component: GameInitializationComponent;
    let fixture: ComponentFixture<GameInitializationComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
    let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
    let multiplayerModeServiceSpy: jasmine.SpyObj<MultiplayerModeService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers']);
        formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['setValue', 'group']);
        socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms']);
        multiplayerModeServiceSpy = jasmine.createSpyObj('multiplayerModeService', ['setGuestPlayerInformation']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameInitializationComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                { provide: FormBuilder, useValue: formBuilderSpy },
                { provide: SocketManagementService, useValue: socketManagementServiceSpy },
                { provide: MultiplayerModeService, useValue: multiplayerModeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameInitializationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        jasmine.getEnv().allowRespy(true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOninit soloGame', () => {
        component['userService'].firstMode = 'soloGame';
        component.ngOnInit();
        expect(component.soloMode).toBeTrue();
    });

    it('ngOninit createMultiplayerGame', () => {
        component['userService'].firstMode = 'createMultiplayerGame';
        component.ngOnInit();
        expect(component.createMultiplayerGame).toBeTrue();
    });

    it('ngOninit joinMultiplayerGame', () => {
        component['userService'].firstMode = 'joinMultiplayerGame';
        component.ngOnInit();
        expect(component.joinMultiplayerGame).toBeTrue();
    });
    // it('ngOninit create listen', () => {
    //     const data: MessageServer = {
    //         command: {
    //             word: 'azzz',
    //             direction: 'p',
    //             position: { x: 1, y: 1 },
    //         },
    //         gameName: 'game000111',
    //         timer: { sec: 30, min: 1, userTurn: true },
    //         user: { name: 'abdel3234', score: 0 },
    //         guestPlayer: { name: 'marouane3234', score: 45 },
    //     };
    //     component['userService'].playMode = 'createMultiplayerGame';
    //     spyOn(component['formBuilder'], 'group');

    //     component.ngOnInit();
    //     if (data.guestPlayer?.name) expect(component.guestName).toEqual('');
    // });
});
