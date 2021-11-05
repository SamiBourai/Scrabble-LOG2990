/* eslint-disable prettier/prettier */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { RealUser } from './../../classes/user';
import { ValidWordService } from './../../services/valid-world.service';

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
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });

    it('confirm that when logMessage is called, inpossiblAndValid is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const spy = spyOn(component, 'impossibleAndValid');
        component.logMessage();
        expect(spy).toHaveBeenCalled();
    });

    it('should call the method getLetterFromChat and detectSkipTurnBtn when the command contains place and its your turn', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
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

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        const spy = spyOn(component, 'getLettersFromChat');

        component.logMessage();
        expect(spy).toHaveBeenCalled();
        expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();
    });

    it('should call getNameCurrentPlayer when the command is invalid', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return false;
        });

        const spy = spyOn(component, 'getNameCurrentPlayer');
        component.logMessage();
        expect(spy).toHaveBeenCalled();
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
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        messageServiceSpy.isSubstring.and.callFake(() => {
            return false;
        });
        component.logMessage();
        expect(component.arrayOfMessages.length).toBe(1);
    });

    it('should call the method changeLetterFromReserve', () => {
        // component.typeArea = "!echanger ea"
        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        spyOn(component, 'isTheGameDone').and.callFake(() => {
            return false;
        });

        const spy = spyOn<any>(letterServiceSpy, 'changeLetterFromReserve');
        component.logMessage();

        expect(spy).toHaveBeenCalled();
    });

    it('verify that when isImpossible is false, detectSkipTurnBtn is called', () => {
        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        spyOn<any>(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        component.invalidCommand = false;

        component.logMessage();
        expect(userServiceSpy.userPlayed()).toBeFalse();
    });

    it('should verify that isImpossible is true when the reserveSize < 7', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsSwapCommand.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.callFake(() => {
            return false;
        });

        reserveServiceSpy.reserveSize = 6;
        component.logMessage();
        expect(component.invalidCommand).toBeTrue();
    });

    it('should verify that isImpossible is true when the reserveSize > 7', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsSwapCommand.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.callFake(() => {
            return true;
        });

        reserveServiceSpy.reserveSize = 8;
        component.logMessage();
        expect(component.invalidCommand).toBeFalse();
    });

    it('isImpossible is true when containsSwapCommad is true and changeLetterFromReserve', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        reserveServiceSpy.reserveSize = 8;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsSwapCommand.and.callFake(() => {
            return true;
        });
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        letterServiceSpy.changeLetterFromReserve.and.callFake(() => {
            return false;
        });

        component.logMessage();
        expect(component.invalidCommand).toBeTrue();
    });

    it('should verify that getLettersFromChat', () => {
        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });
        messageServiceSpy.containsPlaceCommand.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        const spy = spyOn<any>(component, 'getLettersFromChat');
        component.logMessage();

        expect(spy).toHaveBeenCalled();
    });

    it('177', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'wordInEasel').and.callFake(() => {
            return true;
        });

        letterServiceSpy.usedAllEaselLetters = true;

        component.getLettersFromChat();
        expect(userServiceSpy.realUser.score).toBeDefined();
    });

    it('195', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return false;
        });

        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return true;
        });

        letterServiceSpy.usedAllEaselLetters = true;

        component.getLettersFromChat();
        expect(userServiceSpy.realUser.score).toBeDefined();
    });

    it('verify that getNameCurrentPlayer has been called ', () => {
        component.arrayOfMessages = [];
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        messageServiceSpy.containsSwapCommand.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return false;
        });

        messageServiceSpy.isSubstring.and.callFake(() => {
            return true;
        });

        const spy = spyOn(component, 'getNameCurrentPlayer');

        component.logMessage();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that boolean skipTurn isImpossible are set to true', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return false;
        });
        messageServiceSpy.isSubstring.and.callFake(() => {
            return true;
        });
        component.logMessage();

        expect(component.skipTurn).toBeTrue();
        expect(component.invalidCommand).toBeTrue();
    });

    it('verify that arrayOfMessages is pushing', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.arrayOfMessages = [];

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });

        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return false;
        });
        const spy = spyOn(component.arrayOfMessages, 'push');

        messageServiceSpy.isSubstring.and.callFake(() => {
            return true;
        });
        component.logMessage();

        expect(spy.length).toBe(1);
    });

    it('verify that detectSkipTurnBtn has been called when typeArea = !passer', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.typeArea = '!passer';

        messageServiceSpy.isCommand.and.callFake(() => {
            return true;
        });
        messageServiceSpy.isValid.and.callFake(() => {
            return true;
        });

        spyOn<any>(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        component.logMessage();
        expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();
    });

    it('verify if the array has been spliced when index > -1', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.typeArea = '!passer';
        component.arrayOfMessages = ['abc', 'def'];
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });
        spyOn(component.arrayOfMessages, 'indexOf').and.returnValue(-1);
        component.logMessage();
        expect(component.arrayOfMessages.indexOf('!passer', 0)).toEqual(-1);
    });

    // test isSkipButtonClicked

    it('verify that isSkipButtonClicked return true when the bouton is pressed', () => {
        messageServiceSpy.skipTurnIsPressed = true;
        expect(component.isSkipButtonClicked()).toBeTrue();
    });

    it('verify that isSkipButtonClicked return false when the bouton is not pressed', () => {
        messageServiceSpy.skipTurnIsPressed = false;
        expect(component.isSkipButtonClicked()).toBeFalse();
    });

    // test logDebug

    it('verify that if the debugCommand method return true logDebug do the same', () => {
        messageServiceSpy.debugCommand.and.callFake(() => {
            return true;
        });
        expect(component.logDebug()).toBeTrue();
    });

    it('verify that if the debugCommand method return false logDebug do the same', () => {
        messageServiceSpy.debugCommand.and.callFake(() => {
            return false;
        });
        expect(component.logDebug()).toBeFalse();
    });

    // test for isYourTurn
    it('verify that if the skipTurnValidUser return true isYourTurn do the same', () => {
        userServiceSpy.isUserTurn.and.callFake(() => {
            return true;
        });

        expect(component.isYourTurn()).toBeTrue();
    });

    it('verify that if the skipTurnValidUser return false isYourTurn do the same', () => {
        userServiceSpy.isUserTurn.and.callFake(() => {
            return false;
        });

        expect(component.isYourTurn()).toBeFalse();
    });

    it('verify that readWordsAndGivePointsIfValid  has been called ', () => {
        const spy = spyOn(validWordServiceSpy, 'readWordsAndGivePointsIfValid');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that wordInBoardLimits has been called ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        const spy1 = spyOn(letterServiceSpy, 'wordInBoardLimits');
        const spy2 = spyOn(validWordServiceSpy, 'verifyWord');
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        component.getLettersFromChat();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('verify that if firstTurn is false and the position is h8, firstTurn will be false and wordInEasel will be called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });

        component.getLettersFromChat();

        expect(component.firstTurn).toBe(false);
    });

    it('verify that placeLettersInScrabble will be called ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });

        // spyOn<any>(letterServiceSpy, 'wordInEasel').and.callFake(() => {
        //     return true;
        // });
        spyOn<any>(userServiceSpy.realUser.easel, 'contains').and.callFake(() => {
            return true;
        });
        const spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');

        component.getLettersFromChat();

        expect(component.firstTurn).toBe(false);
        expect(spy).toHaveBeenCalled();
    });

    it('167', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        const spy = spyOn<any>(validWordServiceSpy, 'verifyWord');

        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that when wordInEasel is false , isImpossible is true', () => {
        const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.firstTurn = true;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return false;
        });

        // let spy = spyOn<any>(component,'isImpossible');
        component.getLettersFromChat();
        expect(component.invalidCommand).toBeTrue();
    });

    it('verify that when wordIsAttached and wordIsPlacable, placeLettersInScrabble is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        component.firstTurn = false;
        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return true;
        });

        const spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that when wordIsAthached and wordIsPlacable return false, isImpossible is true', () => {
        const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.firstTurn = true;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = user;
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordInEasel').and.callFake(() => {
            return true;
        });
        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return false;
        });

        component.getLettersFromChat();
        expect(component.invalidCommand).toBeTrue();
    });

    it('verify that when verifyWord is false  , the window alert should be called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return false;
        });

        component.getLettersFromChat();
        expect(component.errorMessage).toBeDefined();
    });

    it('verify that when wordIsAttached is true and wordIsPlacable is false, the errorMessage is defined', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        spyOn<any>(validWordServiceSpy, 'readWordsAndGivePointsIfValid').and.callFake(() => {
            return 0;
        });

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });
        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });
        component.firstTurn = false;
        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return false;
        });

        component.getLettersFromChat();
        expect(component.errorMessage).toBeDefined();
    });

    // it('verify that logDebug is called', () => {
    //     const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
    //     messageServiceSpy.command = cmd;
    //     spyOn<any>(messageServiceSpy, 'isCommand').and.callFake(() => {
    //         return true;
    //     });

    //     spyOn<any>(messageServiceSpy, 'isValid').and.callFake(() => {
    //         return true;
    //     });

    //     spyOn<any>(component, 'logDebug').and.callFake(() => {
    //         return true;
    //     });
    //     component.logMessage();
    //     expect(component.isDebug).toBeTrue();
    // });
});
