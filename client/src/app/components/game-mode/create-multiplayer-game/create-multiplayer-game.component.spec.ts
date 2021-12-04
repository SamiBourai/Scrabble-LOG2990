/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
// import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryPresentation, LoadableDictionary } from '@app/classes/dictionary';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser } from '@app/classes/user';
import { DEFAULT_MODE, TIME_CHOICE } from '@app/constants/constants';
import { DatabaseService } from '@app/services/database.service';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
// import { observable } from 'rxjs';
import { CreateMultiplayerGameComponent } from './create-multiplayer-game.component';

const mockDictionaries = [
    { title: 'aloo', description: 'bye', words: ['moi', 'toi'] },
    { title: 'crSieste', description: 'SIII', words: ['lui', 'elle'] },
];
describe('CreateMultiplayerGameComponent', () => {
    let component: CreateMultiplayerGameComponent;
    let fixture: ComponentFixture<CreateMultiplayerGameComponent>;
    const mockDic = mockDictionaries;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let timeServiceSpy: jasmine.SpyObj<TimeService>;
    let dataBaseSpy: jasmine.SpyObj<DatabaseService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    const mockDialogRef2 = {
        open: jasmine.createSpy('open'),
        dismiss: jasmine.createSpy('dismiss'),
    };
    let getMetaDictionarySubject: Subject<LoadableDictionary[]>;

    const mockSocketManagementService = {
        listen: (name: string) => {
            return new BehaviorSubject(name).asObservable();
        },

        setGuestPlayerInfromation: () => '',
        emit: () => '',
    };

    const mockMultiplayerModeService = {
        setGuestPlayerInfromation: () => '',
    };

    beforeEach(() => {
        getMetaDictionarySubject = new Subject<LoadableDictionary[]>();
        // getMetaDictionarySubject.next([]);
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers', 'realUser', 'gameName']);
        timeServiceSpy = jasmine.createSpyObj('TimeService', ['setGameTime']);
        dataBaseSpy = jasmine.createSpyObj('DatabaseService', ['getMetaDictionary', 'sendChosenDic']);
        dataBaseSpy.getMetaDictionary.and.returnValue(getMetaDictionarySubject);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', ['log2990Mode', 'generateObjectifs', 'choosedObjectifs']);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateMultiplayerGameComponent],
            imports: [HttpClientModule],
            providers: [
                FormBuilder,
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: MatSnackBar, useValue: mockDialogRef2 },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: SocketManagementService, useValue: mockSocketManagementService },
                { provide: MultiplayerModeService, useValue: mockMultiplayerModeService },
                { provide: DatabaseService, useValue: dataBaseSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateMultiplayerGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        component['userService'].joinedUser = userJ;
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
        const generateObkectifsSpy = spyOn(component.objectifManagerService, 'generateObjectifs');
        component.objectifManagerService.log2990Mode = true;
        component.createGame();
        expect(generateObkectifsSpy).toHaveBeenCalled();
        // expect(game.objectifs).toBe(component.objectifManagerService.choosedObjectifs);
        expect(component['userService'].gameName).toBe(component.gameName);
    });

    it('createGame dans else', () => {
        component.objectifManagerService.log2990Mode = false;
        const spy = spyOn(component['socketManagementService'], 'emit');
        component.createGame();
        expect(spy).toHaveBeenCalled();
        expect(component.userService.realUser.name).toBe(component.playerName);
        expect(component.userService.gameName).toBe(component.gameName);
    });

    it('disconnectUser', () => {
        const spy = spyOn(component['socketManagementService'], 'emit');
        component.disconnectUser();
        expect(spy).toHaveBeenCalled();
    });

    it('beginGame', () => {
        const bool: boolean = false;
        const spy = spyOn(component['socketManagementService'], 'emit');
        component.beginGame(bool);
        expect(spy).toHaveBeenCalled();
    });
    it('beginGame', () => {
        const bool: boolean = true;
        const spy = spyOn(component['socketManagementService'], 'emit');
        component.beginGame(bool);
        expect(spy).toHaveBeenCalled();
    });

    it('enableBtn', () => {
        component.isNextBtnClicked = true;
        component.enableBtn();
        expect(component.isNextBtnClicked).toBe(false);
    });

    it('getDictionnaries', () => {
        const dics: DictionaryPresentation[] = [
            { title: 'allo', description: 'bye' },
            { title: 'siii', description: 'taaas' },
        ];
        spyOn(component['database'], 'getMetaDictionary').and.returnValue(of(mockDic).pipe(delay(1)));
        component.getDictionnaries();
        expect(dics.length).toBeGreaterThanOrEqual(2);
    });

    it('getDictionnariesDelete', () => {
        component['updateDics'] = [{ title: 'allo', description: 'bye' }];
        component.getDictionnariesDelete();
        expect(component['updateDics'].length).toBeGreaterThanOrEqual(1);
    });

    it('getDictionnariesDelete localStorage', () => {
        component['updateDics'] = [{ title: 'allo', description: 'bye' }];
        spyOn(component['database'], 'getMetaDictionary').and.returnValue(of(mockDic).pipe(delay(1)));
        component.getDictionnariesDelete();
        expect(component['updateDics'].length).toBeGreaterThanOrEqual(1);
    });

    it('selectedFile', () => {
        const event = new Event('change');
        component.chosenDictionnary = 'dictionnaire principal';
        spyOn<any>(Array.prototype, 'includes').and.returnValue(true);
        spyOn<any>(component['database'], 'sendChosenDic').and.returnValue(of().pipe(delay(1)));
        const spy = spyOn<any>(component['validWordService'], 'loadDictionary');
        component['selectedDictionnary'](event);
        expect(event).toBeInstanceOf(Event);
        expect(spy).toHaveBeenCalled();
    });

    it('selectedFile selectionnez', () => {
        const event = new Event('change');
        component.chosenDictionnary = '---- Selectionnez un dictionnaire ----';
        spyOn<any>(Array.prototype, 'includes').and.returnValue(true);
        spyOn<any>(component['database'], 'sendChosenDic').and.returnValue(of().pipe(delay(1)));
        const spy = spyOn<any>(component['snackBar'], 'dismiss');
        component['selectedDictionnary'](event);
        expect(event).toBeInstanceOf(Event);
        expect(spy).toHaveBeenCalled();
    });
});
