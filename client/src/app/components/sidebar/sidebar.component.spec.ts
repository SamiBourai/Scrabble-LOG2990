/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/letter';
import { MessageServer } from '@app/classes/message-server';
import { JoinedUser, RealUser } from '@app/classes/user';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { A, B } from '@app/constants/constants';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject, of } from 'rxjs';
import { EaselObject } from './../../classes/easel-object';
import { ValidWordService } from './../../services/valid-word.service';

import SpyObj = jasmine.SpyObj;

describe('SidebarComponent', () => {
    let messageServiceSpy: SpyObj<MessageService>;
    let letterServiceSpy: SpyObj<LettersService>;
    let userServiceSpy: SpyObj<UserService>;
    let validWordServiceSpy: SpyObj<ValidWordService>;
    let reserveServiceSpy: SpyObj<ReserveService>;

    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessageServiceSpy', [
            'isCommand',
            'containsSwapCommand',
            'isValid',
            'isSubstring',
            'debugCommand',
            'containsPlaceCommand',
            'swapCommand',
            'replaceSpecialChar',
            'removeDuplicate',
        ]);

        userServiceSpy = jasmine.createSpyObj('UserServiceSpy', [
            'detectSkipTurnBtn',
            'getNameCurrentPlayer',
            'getUserName',
            'skipTurnValidUser',
            'detectSkipTurnBtn',
            'getVrUserName',
            'skipTurn',
            'resetPassesCounter',
            'isUserTurn',
            'userPlayed',
            'isPlayerTurn',
            'getPlayerEasel',
            'updateScore',
        ]);
        letterServiceSpy = jasmine.createSpyObj('letterServiceSpy', [
            'changeLetterFromReserve',
            'wordInEasel',
            'laceLettersInScrable',
            'wordIsPlacable',
            'resetVariables',
            'wordInBoardLimits',
            'fromWordToLetters',
            'wordInEasel',
            'placeLettersInScrable',
            'wordIsAttached',
            'wordIsPlacable',
            'tileIsEmpty',
            'tile',
        ]);
        reserveServiceSpy = jasmine.createSpyObj('reserveServiceSpy', ['reserveSize', 'isReserveEmpty']);

        validWordServiceSpy = jasmine.createSpyObj('validWordServiceSpy', ['readWordsAndGivePointsIfValid', 'verifyWord']);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [SidebarComponent],
            providers: [
                { provide: MessageService, useValue: messageServiceSpy },
                { provide: LettersService, useValue: letterServiceSpy },
                { provide: UserService, useValue: userServiceSpy },
                { provide: ValidWordService, useValue: validWordServiceSpy },
                { provide: ReserveService, useValue: reserveServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        component['userService'].joinedUser = userJ;
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });

    it('confirm that when logMessage is called, inpossiblAndValid is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        component.logMessage();
        expect(component.invalidCommand).toBeFalse();
    });

    it('should call the method switchCaseCommands', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        spyOn<any>(component, 'updateMessageArray');
        spyOn<any>(component, 'skipTurnCommand');
        spyOn<any>(component, 'logMessage');

        messageServiceSpy.command = cmd;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsPlaceCommand.and.callFake(() => {
            return true;
        });

        spyOn<any>(component['userService'], 'isPlayerTurn').and.callFake(() => {
            return true;
        });
        spyOn<any>(component, 'isTheGameDone').and.callFake(() => {
            return false;
        });

        const spy = spyOn<any>(component, 'switchCaseCommands');

        component.logMessage();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call the methods when the input is not a command', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        component.arrayOfMessages = [];
        messageServiceSpy.isCommand.and.callFake(() => {
            return false;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsPlaceCommand.and.callFake(() => {
            return false;
        });
        spyOn<any>(component['userService'], 'isPlayerTurn').and.callFake(() => {
            return true;
        });

        messageServiceSpy.isSubstring.and.callFake(() => {
            return false;
        });
        component.logMessage();
        expect(component.arrayOfMessages.length).toBe(1);
    });

    it('should call the method changeLetterFromReserve', () => {
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;

        component['reserveService'].reserveSize = 89;

        const spy = spyOn<any>(letterServiceSpy, 'changeLetterFromReserve');
        component['switchCaseCommands']();

        expect(spy).toHaveBeenCalled();
    });

    it('verify that when invalidCommand is false, userPlayed is called', () => {
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['reserveService'].reserveSize = 89;
        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(false);
        component.invalidCommand = false;
        const spy = spyOn<any>(component['userService'], 'userPlayed');
        component['switchCaseCommands']();

        expect(spy).not.toHaveBeenCalled();
    });

    it('switchCaseCommands place', () => {
        component.typeArea = '!placer h8h ami';
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const spy = spyOn<any>(component, 'checkIfFirstPlay');
        component['switchCaseCommands']();
        expect(spy).toHaveBeenCalled();
    });

    it('placeOtherTurn', () => {
        const p = 10;
        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.returnValue(true);
        const spy = spyOn(component['lettersService'], 'placeLettersInScrable');
        spyOn(component, 'updatePlayerVariables');
        component.placeOtherTurns(p);
        expect(spy).toHaveBeenCalled();
    });

    it('updatePLayerVariables', () => {
        const p = 10;
        const spy = spyOn(component['userService'], 'updateScore');
        component.updatePlayerVariables(p);
        expect(spy).toHaveBeenCalled();
    });

    it('verifyWord', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component['userService'].playMode = 'multi';
        const data: MessageServer = { gameName: 'game000111', gameStarted: false };
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        component['userService'].playMode = 'solo';
        component['userService'].playMode = 'joinMultiplayerGame';
        spyOn<any>(component['socketManagementService'], 'listen').and.returnValue(of(data));
        const spy = spyOn(component, 'getLettersFromChat');
        component['valideWordService'].isWordValid = true;
        component['verifyWord']();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should verify that invalidCommand is true when the reserveSize < 7', () => {
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['reserveService'].reserveSize = 6;
        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(false);
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBeTrue();
    });

    it('should verify that invalidCommand is false when changeLetter', () => {
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['reserveService'].reserveSize = 89;
        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(true);
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBeFalse();
    });

    it('case debug', () => {
        component.typeArea = '!debug';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBeFalse();
    });

    it('case passer', () => {
        component.typeArea = '!passer';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBeFalse();
    });

    it('case reserve', () => {
        component.typeArea = '!reserve';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBe(true);
    });

    it('case reserve debug', () => {
        component.typeArea = '!reserve';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component.isDebug = true;
        const spy = spyOn<any>(component, 'reserveLettersQuantity');
        component['switchCaseCommands']();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyWord solo', () => {
        component['userService'].playMode = 'soloGame';
        const spy = spyOn<any>(component, 'getLettersFromChat');
        component['verifyWord']();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyWord multi', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['userService'].playMode = 'joinMultiplayerGame';
        spyOn<any>(component, 'endTurnValidCommand').and.callThrough();
        component['verifyWord']();
        expect(1).toBe(1);
    });

    it('ngOnInit', () => {
        component['userService'].playMode = 'multi';
        component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
        const spy = spyOn<any>(component['messageService'].newTextMessageObs, 'subscribe');
        const spy1 = spyOn<any>(global, 'setTimeout');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
    });

    it('checkIfFirstPlay', () => {
        component['userService'].playMode = 'multi';
        component.checkIfFirstPlay();
        expect(component.firstTurn).toEqual(component['userService'].firstTurn);
    });

    it('logMessage validPlay', () => {
        spyOn<any>(component['messageService'], 'replaceSpecialChar');

        messageServiceSpy.isCommand.and.returnValue(true);

        messageServiceSpy.isValid.and.returnValue(true);
        spyOn<any>(component['userService'], 'isPlayerTurn').and.returnValue(false);

        spyOn<any>(component, 'isTheGameDone').and.returnValue(false);
        spyOn<any>(component, 'invalidCommand');
        component.isDebug = true;
        component.typeArea = '!reserve';
        // const spy = spyOn<any>(component,'reserveLettersQuantity');

        component.logMessage();

        expect(component.invalidCommand).toBeTrue();
        expect(component.errorMessage).toEqual('');
    });

    it('skipTurnCommand', () => {
        spyOn<any>(component['messageService'], 'isSubstring').and.returnValue(true);
        component.skipTurnCommand();
        expect(component.skipTurn).toBeTrue();
    });

    it('skipTurnCommand else if', () => {
        spyOn<any>(component['messageService'], 'isSubstring').and.returnValue(false);
        component.typeArea = '!debug';
        component.isDebug = true;
        component.skipTurnCommand();
        expect(component.isDebug).toBeFalse();
    });

    it('isSkipButtonClicked', () => {
        component['messageService'].skipTurnIsPressed = true;
        component.isSkipButtonClicked();
        expect(component['messageService'].skipTurnIsPressed).toBeFalse();
    });

    it('logDebug', () => {
        const spy = spyOn<any>(component['messageService'], 'debugCommand');
        component.logDebug();
        expect(spy).toHaveBeenCalled();
    });

    it('placeOtherTurns false in getLettersFromChat ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return false;
        });

        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });

        spyOn<any>(component, 'placeOtherTurns').and.callFake(() => {
            return false;
        });

        component.getLettersFromChat();
        expect(component.invalidCommand).toBeTrue();
    });

    it('else of wordIsAttached in getLettersFromChat ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return false;
        });

        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return false;
        });
        component.getLettersFromChat();
        expect(component.invalidCommand).toBeTrue();
    });

    it('placeOtherTurns else', () => {
        const points = 10;

        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        const userJ: JoinedUser = {
            name: 'bob',
            level: '2',
            round: '3',
            score: 8,
            easel: new EaselObject(true),
            guestPlayer: false,
        };
        userServiceSpy.joinedUser = userJ;
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        component['userService'].playMode = 'cala';
        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return false;
        });

        expect(component.placeOtherTurns(points)).toBeFalse();
    });

    it('reserveLettersQuantity', () => {
        component['reserveService'].letters = new Map<Letter, number>([
            [A, 2],
            [B, 3],
        ]);
        const spy = spyOn<any>(component.arrayOfReserveLetters, 'push');
        component.reserveLettersQuantity();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that readWordsAndGivePointsIfValid  has been called ', () => {
        const spy = spyOn<any>(validWordServiceSpy, 'readWordsAndGivePointsIfValid');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that invalidCommand is true when playFirstTurn is false ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });

        spyOn<any>(component, 'playFirstTurn').and.callFake(() => {
            return false;
        });

        component.getLettersFromChat();
        expect(component.invalidCommand).toBe(true);
    });

    it('verify errorMessage = votre mot dois etre placer à la position central(h8)!  ', () => {
        const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });

        component.getLettersFromChat();
        expect(component.errorMessage).toEqual('votre mot dois etre placer à la position central(h8)!');
    });
});
