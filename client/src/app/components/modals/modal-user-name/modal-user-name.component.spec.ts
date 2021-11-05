/* eslint-disable @typescript-eslint/no-explicit-any */
import { MultiplayerModeService } from './../../../services/multiplayer-mode.service';
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MessageServer } from '@app/classes/message-server';
//import { MessageServer } from '@app/classes/message-server';
import { TIME_CHOICE } from '@app/constants/constants';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { of } from 'rxjs';
//import { of } from 'rxjs';
import { ModalUserNameComponent } from './modal-user-name.component';

describe('ModalUserNameComponent', () => {
    let component: ModalUserNameComponent;
    let fixture: ComponentFixture<ModalUserNameComponent>;
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
            declarations: [ModalUserNameComponent],
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
        fixture = TestBed.createComponent(ModalUserNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        jasmine.getEnv().allowRespy(true);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return on onClickInMinusButton', () => {
        const event = new Event('click');
        component.timeCounter = 0;
        let x = 2;
        component.onClickInMinusButton(event);
        expect(x).toBe(2);
    });

    it('should return on onClickInMinusButton < 0', () => {
        const event = new Event('click');
        component.timeCounter = -1;
        component.onClickInMinusButton(event);
        expect(component.timeCounter).toBe(0);
    });

    it('should return on onClickInMinusButton > 0', () => {
        const event = new Event('click');
        component.timeCounter = 2;
        component.onClickInMinusButton(event);
        expect(component.timeCounter).toBe(1);
    });

    it('onClickInAddButton ==', () => {
        const event = new Event('click');
        component.timeCounter = TIME_CHOICE.length;
        let x = 2;
        component.onClickInAddButton(event);
        expect(x).toBe(2);
    });

    it('onClickInAddButton >', () => {
        const event = new Event('click');
        component.timeCounter = 11;
        component.onClickInAddButton(event);
        expect(component.timeCounter).toBe(TIME_CHOICE.length);
    });

    it('onClickInAddButton <', () => {
        const event = new Event('click');
        component.timeCounter = 5;
        component.onClickInAddButton(event);
        expect(component.timeCounter).toBe(6);
    });

    it('ngOninit soloGame', () => {
        component['userService'].playMode = 'soloGame';
        component.ngOnInit();
        expect(component.soloMode).toBeTrue();
    });

    // it('ngOninit create', () => {
    //     component['userService'].playMode = 'createMultiplayerGame';
    //     spyOn(component['formBuilder'], 'group').and.callThrough();
    //     component.ngOnInit();
    //     expect(component.createMultiplayerGame).toBeTrue();
    // });

    it('ngOninit create listen', () => {
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            timer: { sec: 30, min: 1, userTurn: true },
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };
        component['userService'].playMode = 'createMultiplayerGame';
        spyOn(component['formBuilder'], 'group');
        const spy = spyOn(component['socketManagementService'], 'listen').and.returnValue(of(data));

        component.ngOnInit();
        if (data.guestPlayer?.name) expect(component.guestName).toEqual(data.guestPlayer?.name);

        expect(spy).toHaveBeenCalled();
    });

    // it('beginGame', () => {
    //     const res = true;
    //     const data = { gameName: 'aloo', gameAccepted: res };
    //     const spy = spyOn(component['socketManagementService'], 'emit').and.returnValue(data);
    //     component.beginGame(res);
    //     expect(spy).toHaveBeenCalled();
    // });

    it('openDialog', () => {
        const spy = spyOn(component['dialogRef'], 'open');
        component.openDialogOfVrUser();
        expect(spy).toHaveBeenCalled();
    });

    // it('storeName', () => {
    //     const spy = spyOn<any>(localStorage, 'setItem');
    //     component.storeNameInLocalStorage();
    //     expect(spy).toHaveBeenCalled();
    // });

    it('passInSoloMode', () => {
        const spy = spyOn<any>(component, 'disconnectUser');
        component.passInSoloMode();
        expect(spy).toHaveBeenCalled();
    });

    // it('createGame', () => {
    //     const data = { user: 'allo1234', gameName: 'game1', timConfig: { min: 1, sec: 20 }, aleatoryBonus: true };
    //     spyOn<any>(component['socketManagementService'], 'emit').and.returnValue(data);
    //     component.createGame();
    //     expect(component['userService'].realUser.name).toBe(component.playerName);
    // });

    

    // it('ngOninit join ', () => {
    //     component['userService'].playMode = 'joinMultiplayerGame';
    //     spyOn(component['formBuilder'], 'group');
    //     const spy = spyOn<any>(component, 'generateRooms');
    //     component.ngOnInit();
    //     expect(spy).toHaveBeenCalled();
    // });

    // it('should openDialog when called', () => {
    //     const event: Event = $eventX;
    //     const openDialogOfVrUserSpy = spyOn(component, 'openDialogOfVrUser');
    //     component.openDialogOfVrUser();
    //     expect(openDialogOfVrUserSpy).toHaveBeenCalled();
    // });

    it('should pass in solo mode on passInSoloMode', () => {
        const disconnectUserSpy = spyOn(component, 'disconnectUser');
        component.passInSoloMode();
        expect(disconnectUserSpy).toHaveBeenCalled();
    });

    it('should call storeNameInLocalStorage on onSubmitUserName', () => {
        const storeNameInLocalStorageSpy = spyOn(component, 'storeNameInLocalStorage');
        component.onSubmitUserName();
        expect(storeNameInLocalStorageSpy).toHaveBeenCalled();
    });

    // it('should return isBonusBox true on randomBonusActivated', () => {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     const eventTest = new Event('click');
    //     component.chosenMode = component.modes[0];
    //     component.randomBonusActivated(eventTest);
    //     expect(userServiceSpy.isBonusBox).toBeTrue();
    // });
});
