/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageServer } from '@app/classes/message-server';
import { DEFAULT_MODE, TIME_CHOICE } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
// import { observable } from 'rxjs';
import { CreateMultiplayerGameComponent } from './create-multiplayer-game.component';

describe('CreateMultiplayerGameComponent', () => {
    let component: CreateMultiplayerGameComponent;
    let fixture: ComponentFixture<CreateMultiplayerGameComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let timeServiceSpy: jasmine.SpyObj<TimeService>;
    let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
    let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
    let multiplayerModeServiceSpy: jasmine.SpyObj<MultiplayerModeService>;
    let dataBaseSpy: jasmine.SpyObj<DatabaseService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    const mockDialogRef2 = {
        open: jasmine.createSpy('open'),
    };

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers','realUser', 'gameName']);
        timeServiceSpy = jasmine.createSpyObj('TimeService', ['setGameTime']);
        formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['setValue', 'group']);
        socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms']);
        multiplayerModeServiceSpy = jasmine.createSpyObj('multiplayerModeService', ['setGuestPlayerInformation']);
        dataBaseSpy = jasmine.createSpyObj('DatabaseService', ['getMetaDictionary', 'sendChosenDic']);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', ['log2990Mode', 'generateObjectifs', 'choosedObjectifs']);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateMultiplayerGameComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: MatSnackBar, useValue: mockDialogRef2 },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: FormBuilder, useValue: formBuilderSpy },
                { provide: SocketManagementService, useValue: socketManagementServiceSpy },
                { provide: MultiplayerModeService, useValue: multiplayerModeServiceSpy },
                { provide: DatabaseService, useValue: dataBaseSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateMultiplayerGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return on onClickInMinusButton', () => {
        const event = new Event('click');
        component.timeCounter = 0;
        const x = 2;
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
        const x = 2;
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

    it('should return isBonusBox true on randomBonusActivated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: component.modes[0],
            },
        } as unknown as Event;
        component.chosenMode = component.modes[0];
        component.randomBonusActivated(pseudoEvent);
        expect(component.userService.isBonusBox).toBeTrue();
    });

    it('should return isBonusBox true on randomBonusActivated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: component.modes[DEFAULT_MODE],
            },
        } as unknown as Event;
        component.chosenMode = component.modes[DEFAULT_MODE];
        component.randomBonusActivated(pseudoEvent);
        expect(component.userService.isBonusBox).toBeFalse();
    });

    it('openDialog', () => {
        const spy = spyOn(component['dialogRef'], 'open');
        component.openDialogOfVrUser();
        expect(spy).toHaveBeenCalled();
    });

    it('should pass in solo mode on passInSoloMode', () => {
        const spy = spyOn(component, 'openDialogOfVrUser');
        component.passInSoloMode();
        expect(spy).toHaveBeenCalled();
    });

    it('createGame dans if', () => {
        const game: MessageServer = {
            user: { name: component.playerName },
            gameName: component.gameName,
            timeConfig: { min: component.time.min, sec: component.time.sec },
            aleatoryBonus: component.userService.isBonusBox,
            modeLog2990: component.objectifManagerService.log2990Mode,
        };
        const generateObkectifsSpy = spyOn(component.objectifManagerService, 'generateObjectifs');
        component.objectifManagerService.log2990Mode = true;
        component.createGame();
        expect(generateObkectifsSpy).toHaveBeenCalled();
        expect(game.objectifs).toBe(component.objectifManagerService.choosedObjectifs);
        expect(component['userService'].gameName).toBe(component.gameName);
    });

    it('createGame dans else', () => {
        const game: MessageServer = {
            user: { name: component.playerName },
            gameName: component.gameName,
            timeConfig: { min: component.time.min, sec: component.time.sec },
            aleatoryBonus: component.userService.isBonusBox,
            modeLog2990: component.objectifManagerService.log2990Mode,
        };
        component.objectifManagerService.log2990Mode = false;
        component.createGame();
        // const emitSpy = spyOn(component['socketManagementService'], 'emit');
        // expect(emitSpy).toHaveBeenCalled();     
        expect(component['socketManagementService'].emit('createGame', game)).toHaveBeenCalled();
        expect(component.userService.realUser.name).toBe(component.playerName);
        expect(component.userService.gameName).toBe(component.gameName);
    });

    it('disconnectUser', () => {
        // const game: MessageServer = {
        //     user: { name: component.playerName },
        //     gameName: component.gameName,
        //     timeConfig: { min: component.time.min, sec: component.time.sec },
        //     aleatoryBonus: component.userService.isBonusBox,
        //     modeLog2990: component.objectifManagerService.log2990Mode,
        // };
        component.disconnectUser();
        expect(component['socketManagementService'].emit('userCanceled', { gameName: component.gameName })).toHaveBeenCalled();
    });

    it('beginGame', () => {
        // const game: MessageServer = {
        //     user: { name: component.playerName },
        //     gameName: component.gameName,
        //     timeConfig: { min: component.time.min, sec: component.time.sec },
        //     aleatoryBonus: component.userService.isBonusBox,
        //     modeLog2990: component.objectifManagerService.log2990Mode,
        // };
        const pseudoBool = {
            boolean: false,
        } as unknown as boolean;
        component.beginGame(pseudoBool);
        expect(component.disconnectUser).toHaveBeenCalled();
    });
});
