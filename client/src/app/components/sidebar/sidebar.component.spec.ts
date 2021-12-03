/* eslint-disable no-duplicate-imports */
/* eslint-disable @typescript-eslint/no-duplicate-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { A, C } from '@app/constants/constants';
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
        const userV: VrUser = { name: 'bob', level: '2', round: '3', score: 8,   easel: new EaselObject(true) };
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        userJ.easel.easelLetters = [A,C];
        userJ.easel.foundLetter = [false,false,false,true,false,false,false];
        userJ.easel.indexTempLetters = [];
        component['userService'].vrUser = userV;
        component['userService'].realUser = user;
        component['userService'].joinedUser = userJ;
        component.name = user.name;
        component.nameVr = userJ.name;
        if (component['userService'].playMode === 'joinMultiplayerGame') {
            spyOn<any>(component['userService'],'getPlayerEasel').and.returnValue(userJ.easel);
        } else spyOn<any>(component['userService'],'getPlayerEasel').and.returnValue(user.easel);
         
        
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
        
    });

    it('ngOnInit', () => {
       
        component['userService'].playMode = 'multi';
        component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
        component['reserveService'].sizeObs = new BehaviorSubject<number>(2);
        const spy = spyOn<any>(component['messageService'].newTextMessageObs, 'subscribe');
        const spy1 = spyOn<any>(global, 'setTimeout');
        const spy2 = spyOn<any>(component['reserveService'].sizeObs, 'subscribe');
        component.toggleReserve = true;
        
        
        component.ngOnInit();
        
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        
        
    });

    it('logMessage true',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        const spy1 = spyOn<any>(component,'manageCommands');
        component.logMessage();
        expect(spy1).toHaveBeenCalled();
    });

    it('logMessage false',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(false);
         spyOn<any>(component['messageService'],'isSubstring').and.returnValue(true);
        component.logMessage();
        expect(component.errorMessage).toBe("ce n'est pas votre tour");
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

    it('placeWordIfValid',()=>{
        component['commandManagerService'].playerScore = 2;
        const spy = spyOn<any>(component['lettersService'],'placeLettersInScrable');
        spyOn<any>(component,'endTurn');
        component['placeWordIfValid']();
        expect(spy).toHaveBeenCalled();
    });

    it('placeWordIfValid else',()=>{
        component['commandManagerService'].playerScore = 0;
        spyOn<any>(component,'endTurn');
        component['placeWordIfValid']();
        expect(component.errorMessage).toBe(component['commandManagerService'].errorMessage);
    });

    it('exchangeCommand',()=>{
        spyOn<any>(component['commandManagerService'],'verifyExchageCommand').and.returnValue(true);
        const spy = spyOn<any>(component,'endTurn');
        component['exchangeCommand']();
        expect(spy).toHaveBeenCalled();
    });

    it('exchangeCommand else',()=>{
        spyOn<any>(component['commandManagerService'],'verifyExchageCommand').and.returnValue(false);
        component['exchangeCommand']();
        expect(component.errorMessage).toBe(component['commandManagerService'].errorMessage);
    });

    it('endTurn ',()=>{
        const cmd = 'exchange';
        const msg = 'allo';
        jasmine.clock().install();
        component['userService'].playMode = 'dsds';
         const spy = spyOn<any>(global,'setTimeout');
        component['endTurn'](cmd,msg);
        jasmine.clock().tick(1000);
        jasmine.clock().uninstall();
        expect(spy).toHaveBeenCalled();
    });
    

    it('endTurn else ',()=>{
        const cmd = 'placer';
        const msg = 'allo';
        component.errorMessage = 'fdf';
        component['userService'].playMode = 'soloGame';
        const spy = spyOn<any>(component['userService'],'userPlayed');
        component['endTurn'](cmd,msg);
         expect(spy).toHaveBeenCalled();
        
    });

    it('verifyInput',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(false);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        component['verifyInput']();
        expect(component.errorMessage).toBe('commande invalide');
    });

    it('verifyInput else debug',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!debug';
        component.isDebug = false;
        component['verifyInput']();
        expect(component.isDebug).toBe(true);
        
    });

    it('verifyInput else reserve',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!reserve';
        const spy = spyOn<any>(component,'showReserve');
        component['verifyInput']();
        expect(spy).toHaveBeenCalled();
        
    });

    it('verifyInput else aide',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(true);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!aide';
        component.isHelpActivated = false;
        component['verifyInput']();
        expect(component.isHelpActivated).toBe(true);
        
    });

    it('verifyInput else default',()=>{
        spyOn<any>(component['messageService'],'isCommand').and.returnValue(false);
        spyOn<any>(component['messageService'],'isValid').and.returnValue(true);
        spyOn<any>(component['userService'],'isPlayerTurn').and.returnValue(true);
        component.typeArea = 'blba';
        const spy = spyOn<any>(component,'updateMessageArray');
        component['verifyInput']();
        expect(spy).toHaveBeenCalled();
        
    });

    it('showReserve',()=>{
        component.isDebug = true;
        component.toggleReserve = false;
        const spy = spyOn<any>(component,'reserveLettersQuantity');
        component['showReserve']();
        expect(spy).toHaveBeenCalled();
        expect(component.toggleReserve).toBe(true);
    });

    it('showReserve else',()=>{
        component.isDebug = false;
        component.toggleReserve = false;
        component['showReserve']();
        expect(component.errorMessage).toBe("vous n'êtes pas en mode debogage");
    });

    it('reserveLettersQuantity',()=>{
        const spy = spyOn<any>(component.arrayOfReserveLetters,'splice');
        component['reserveLettersQuantity']();
         expect(spy).toHaveBeenCalled();
         
    });

    it('verifyObjectifs',()=>{
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'pass';
        const spy = spyOn<any>(component['objectifMangerService'],'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
         
    });

    it('verifyObjectifs play',()=>{
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'play';
        const spy = spyOn<any>(component['objectifMangerService'],'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
         
    });

    it('verifyObjectifs exchange',()=>{
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'exchange';
        const spy = spyOn<any>(component['objectifMangerService'],'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
         
    });
});
