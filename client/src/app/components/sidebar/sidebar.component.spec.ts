import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
        ]);

        userServiceSpy = jasmine.createSpyObj('UserServiceSpy', ['detectSkipTurnBtn', 'getNameCurrentPlayer', 'getUserName', 'skipTurnValidUser']);
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
        reserveServiceSpy = jasmine.createSpyObj('reserveServiceSpy', ['reserveSize']);

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
        spyOn<any>(component, 'isLettersInEaselToPlace').and.callThrough();
        let spy = spyOn(component, 'impossibleAndValid');
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

        spyOn<any>(component, 'isLettersInEaselToPlace').and.callFake(() => {
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

        let spy = spyOn(component, 'getNameCurrentPlayer');
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

        spyOn<any>(component, 'isLettersInEaselToSwap').and.callFake(() => {
            return true;
        });

        component.logMessage();
        expect(letterServiceSpy.changeLetterFromReserve).toHaveBeenCalled();
    });

    it('should verify that isImpossible is false when changeLetterFromReserve', () => {
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

        component.logMessage();
        expect(component.isImpossible).toBeFalse();
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
            return false;
        });

        reserveServiceSpy.reserveSize = 6;
        component.logMessage();
        expect(component.isImpossible).toBeTrue();
    });

    it('should verify that getLettersFromChat', () => {
        messageServiceSpy.containsPlaceCommand.and.callFake(() => {
            return true;
        });

        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });

        let spy = spyOn<any>(component, 'getLettersFromChat');
        component.logMessage();

        expect(spy).toHaveBeenCalled();
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

        let spy = spyOn(component, 'getNameCurrentPlayer');

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
        expect(component.isImpossible).toBeTrue();
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
        let spy = spyOn(component.arrayOfMessages, 'push');

        messageServiceSpy.isSubstring.and.callFake(() => {
            return true;
        });
        component.logMessage();

        expect(spy.length).toBe(1);
    });

    it('verify that detectSkipTurnBtn has been called when typeArea = !passer', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return true;
        });
        component.typeArea = '!passer';
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

    it('verify that isSkipButtonClicked return true when the bouton is pressed', () => {
        messageServiceSpy.skipTurnIsPressed = true;
        expect(component.isSkipButtonClicked()).toBeTrue();
    });

    it('verify that isSkipButtonClicked return false when the bouton is not pressed', () => {
        messageServiceSpy.skipTurnIsPressed = false;
        expect(component.isSkipButtonClicked()).toBeFalse();
    });

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

    //test for isYourTurn
    it('verify that if the skipTurnValidUser return true isYourTurn do the same', () => {
        userServiceSpy.skipTurnValidUser.and.callFake(() => {
            return true;
        });

        expect(component.isYourTurn()).toBeTrue();
    });

    it('verify that if the skipTurnValidUser return false isYourTurn do the same', () => {
        userServiceSpy.skipTurnValidUser.and.callFake(() => {
            return false;
        });

        expect(component.isYourTurn()).toBeFalse();
    });

    it('verify that readWordsAndGivePointsIfValid  has been called ', () => {
        let spy = spyOn(validWordServiceSpy, 'readWordsAndGivePointsIfValid');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that wordInBoardLimits has been called ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        let spy1 = spyOn(letterServiceSpy, 'wordInBoardLimits');
        let spy2 = spyOn(validWordServiceSpy, 'verifyWord');
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

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
            return true;
        });
        let spy = spyOn(letterServiceSpy, 'wordInEasel');

        component.getLettersFromChat();

        expect(component.firstTurn).toBe(false);
        expect(spy).toHaveBeenCalled();
    });

    it('verify that placeLettersInScrabble will be called ', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        let user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true };
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
        let spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');

        component.getLettersFromChat();

        expect(component.firstTurn).toBe(false);
        expect(spy).toHaveBeenCalled();
    });

    it('verify that when wordInEasel is false, the window alert is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        let user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true };
        userServiceSpy.realUser = user;

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return false;
        });

        let spy = spyOn(window, 'alert');

        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
        expect(component.getLettersFromChat()).toBe();
    });

    it('verify that when wordInEasel is false , a window alert will be called', () => {
        const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component.firstTurn = true;
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
            return false;
        });

        let spy = spyOn(window, 'alert');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalledWith('*PREMIER TOUR*: votre mot dois etre placer à la position central(h8)!');
    });

    it('verify that when wordIsAttached and wordIsPlacable, placeLettersInScrabble is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        let user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true };
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

        let spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalled();
    });

    it('verify that when wordIsAthached and wordIsPlacable return false, window alert is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        let user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true };
        userServiceSpy.realUser = user;

        component.firstTurn = false;

        spyOn<any>(validWordServiceSpy, 'readWordsAndGivePointsIfValid').and.callFake(() => {
            return 0;
        });

        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return true;
        });

        spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
            return true;
        });

        spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
            return false;
        });

        let spy = spyOn(window, 'alert');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalledWith('*MOT DETTACHÉ*: votre mot dois etre attaché à ceux déjà présent dans la grille!');
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

        let spy = spyOn(window, 'alert');

        component.getLettersFromChat();
        expect(spy).toHaveBeenCalledWith('*LE MOT DOIT ETRE DANS LE DIC.*: votre mot dois etre contenue dans le dictionnaire!');
    });

    it('verify that when wordInBoardLimits is false, the window alert is calling', () => {
        spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
            return false;
        });

        let spy = spyOn(window, 'alert');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalledWith('*LE MOT DEPASSE LA GRILLE*: votre mot dois etre contenue dans la grille!');
    });

    it('verify that when wordIsAttached is true and wordIsPlacable is false, the window alert is calling', () => {
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

        let spy = spyOn(window, 'alert');
        component.getLettersFromChat();
        expect(spy).toHaveBeenCalledWith('*ERREUR*: votre mot dois contenir les lettres dans le chevalet et sur la grille!');
    });

    it('verify that isImpossible is true when its not your turn and you type a command', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        spyOn<any>(component, 'isCommand').and.callFake(() => {
            return true;
        });
        spyOn(component, 'isYourTurn').and.callFake(() => {
            return false;
        });
        spyOn<any>(component, 'isLettersInEaselToSwap').and.callFake(() => {
            return false;
        });

        spyOn<any>(component, 'isLettersInEaselToPlace').and.callFake(() => {
            return false;
        });

        component.impossibleAndValid();
        expect(component.isImpossible).toBeTrue();
    });

    it('verify that logDebug is called', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn<any>(messageServiceSpy, 'isCommand').and.callFake(() => {
            return true;
        });

        spyOn<any>(messageServiceSpy, 'isValid').and.callFake(() => {
            return true;
        });

        spyOn<any>(component, 'logDebug').and.callFake(() => {
            return true;
        });

        component.logMessage();

        expect(component.isImpossible).toBeFalse();
    });
});
