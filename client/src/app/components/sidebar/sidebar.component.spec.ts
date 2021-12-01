/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Letter } from '@app/classes/letter';
// import { MessageServer } from '@app/classes/message-server';
import { JoinedUser, RealUser } from '@app/classes/user';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
// import { A, B } from '@app/constants/constants';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';
// import { BehaviorSubject, of } from 'rxjs';
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
            'resetVariables',
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

    it('ngOnInit', () => {
        component['userService'].playMode = 'multi';
        component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
        const spy = spyOn<any>(component['messageService'].newTextMessageObs, 'subscribe');
        const spy1 = spyOn<any>(global, 'setTimeout');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
    });
    it('isSkipButtonClicked', () => {
        const spy1 = spyOn<any>(component, 'updateMessageArray');
        component['messageService'].skipTurnIsPressed = true;
        component.isSkipButtonClicked();
        expect(spy1).toHaveBeenCalled();
    });

    it('manageCommands placer', () => {
        component.typeArea = '!placer';
        const spy1 = spyOn<any>(component['commandManagerService'], 'verifyCommand');
        component['manageCommands']();
        expect(spy1).toHaveBeenCalled();
    });

    it('manageCommands echanger', () => {
        component.typeArea = '!echanger';
        const spy1 = spyOn<any>(component, 'exchangeCommand');
        component['manageCommands']();
        expect(spy1).toHaveBeenCalled();
    });

    it('manageCommands passer', () => {
        component.typeArea = '!passer';
        const spy1 = spyOn<any>(component['userService'], 'detectSkipTurnBtn');
        component['manageCommands']();
        expect(spy1).toHaveBeenCalled();
    });

    it('placeWord', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn<any>(component, 'placeInTempCanvas');
        const spy1 = spyOn<any>(component['commandManagerService'], 'validateWord');
        component['placeWord']();
        expect(spy1).toHaveBeenCalled();
    });

    it('placeWord switch', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component['userService'].playMode = 'soloGame';
        spyOn<any>(component, 'placeInTempCanvas');
        const spy1 = spyOn<any>(component, 'placeWordIfValid');
        const spy2 = spyOn<any>(component['commandManagerService'], 'verifyWordsInDictionnary');
        component['placeWord']();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('placeWord switch 2', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        component['userService'].playMode = 'fdfdf';
        spyOn<any>(component, 'placeInTempCanvas');
        const spy1 = spyOn<any>(component, 'placeInTempCanvas');
        component['placeWord']();
        expect(spy1).toHaveBeenCalled();
    });

    it('placeInTempCanvas', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;

        const spy1 = spyOn<any>(component['tempCanvasService'], 'drawRedFocus');

        component['placeInTempCanvas'](cmd);
        expect(spy1).toHaveBeenCalled();
    });

    it('placeInTempCanvas if', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        spyOn<any>(component['easelLogicService'], 'tempGetLetter');
        spyOn<any>(component['tempCanvasService'], 'drawRedFocus');
        spyOn<any>(component['lettersService'], 'tileIsEmpty').and.returnValue(true);
        const spy1 = spyOn<any>(component['tempCanvasService'], 'drawLetter');

        component['placeInTempCanvas'](cmd);
        expect(spy1).toHaveBeenCalled();
    });

    it('placeInTempCanvas else', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'v' };
        messageServiceSpy.command = cmd;
        spyOn<any>(component['easelLogicService'], 'tempGetLetter');
        spyOn<any>(component['tempCanvasService'], 'drawRedFocus');
        spyOn<any>(component['lettersService'], 'tileIsEmpty').and.returnValue(true);
        const spy1 = spyOn<any>(component['tempCanvasService'], 'drawRedFocus');
        const spy2 = spyOn<any>(component['tempCanvasService'], 'drawLetter');

        component['placeInTempCanvas'](cmd);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
