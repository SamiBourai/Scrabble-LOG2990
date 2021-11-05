import { JoinedUser } from './../../classes/user';
/* eslint-disable prettier/prettier */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/EaselObject';
import { RealUser } from '@app/classes/user';
//import { EaselObject } from '@app/classes/EaselObject';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';

import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ReserveService } from '@app/services/reserve.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject, of } from 'rxjs';
//import { RealUser } from './../../classes/user';
import { ValidWordService } from './../../services/valid-world.service';

import SpyObj = jasmine.SpyObj;
import { Letter } from '@app/classes/letter';
import { A, B } from '@app/constants/constants';
import { MessageServer } from '@app/classes/message-server';

fdescribe('SidebarComponent', () => {
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
            'removeDuplicate'
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
            'userPlayed'
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
        reserveServiceSpy = jasmine.createSpyObj('reserveServiceSpy', ['reserveSize','isReserveEmpty']);

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
        const spy = spyOn<any>(component, 'invalidCommand');
        component.logMessage();
        expect(spy).toHaveBeenCalled();
    });

    it('should call the method switchCaseCommands', () => {
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

        spyOn<any>(component, 'isYourTurn').and.callFake(() => {
            return true;
        });
        spyOn<any>(component, 'isTheGameDone').and.callFake(() => {
            return false;
        });

        const spy = spyOn<any>(component, 'switchCaseCommands');

        component.logMessage();
        expect(spy).toHaveBeenCalled();
        
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

        const spy = spyOn<any>(component, 'getNameCurrentPlayer');
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
        spyOn<any>(component, 'isYourTurn').and.callFake(() => {
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
         spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(false)
        component.invalidCommand = false;
        const spy = spyOn<any>(component['userService'],'userPlayed')
        component['switchCaseCommands']();
        
        expect(spy).not.toHaveBeenCalled();
    });

    it('switchCaseCommands place',()=>{
        component.typeArea = '!placer h8h ami';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const spy = spyOn<any>(component,'checkIfFirstPlay');
        component['switchCaseCommands']();
        expect(spy).toHaveBeenCalled();

    })

    it('should verify that invalidCommand is true when the reserveSize < 7', () => {
        
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['reserveService'].reserveSize = 6;
        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(false)
        component['switchCaseCommands']();
        expect(component.invalidCommand).toBeTrue();
        
        
    });

    it('should verify that invalidCommand is false when changeLetter', () => {
        
        component.typeArea = '!echanger ea';
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['reserveService'].reserveSize = 89;
        spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.returnValue(true)
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
        const spy = spyOn<any>(component,'reserveLettersQuantity');
        component['switchCaseCommands']();
        expect(spy).toHaveBeenCalled();
        
    });

    it('verifyWord solo', () => {
        
        component['userService'].playMode = 'soloGame'
        const spy = spyOn<any>(component,'getLettersFromChat');
        component['verifyWord']();
        expect(spy).toHaveBeenCalled();
        
    });

    it('verifyWord multi', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
         messageServiceSpy.command = cmd;
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        component['userService'].playMode = 'multi'
        
        component['userService'].playMode = 'createMultiplayerGame';
        const spy = spyOn<any>(component['socketManagementService'],'emit');
        const spy1 = spyOn<any>(component['socketManagementService'],'listen');
        component['verifyWord']();
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
         
    });

    it('ngOnInit',()=>{
        
       component['userService'].playMode = 'multi';
       component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
       const spy = spyOn<any>(component['messageService'].newTextMessageObs,'subscribe');
       const spy1 = spyOn<any>(global,'setTimeout');
       component.ngOnInit();
       expect(spy).toHaveBeenCalled();
       expect(spy1).toHaveBeenCalled();

    });






    // it('ngOnDestroy',()=>{
        
    //    let x =2;
    //     component.ngOnDestroy();
    //     expect(x).toBe(2);

 
    //  });

    it('checkIfFirstPlay',()=>{
        
        component['userService'].playMode = 'multi';
        component.checkIfFirstPlay();
        expect(component.firstTurn).toEqual(component['userService'].firstTurn);
    });

    it('logMessage validPlay',()=>{
        spyOn<any>(component['messageService'],'replaceSpecialChar');
        
        messageServiceSpy.isCommand.and.returnValue(true);

        messageServiceSpy.isValid.and.returnValue(true);
        spyOn<any>(component, 'isYourTurn').and.returnValue(false);
        
        spyOn<any>(component, 'isTheGameDone').and.returnValue(false);
        spyOn<any>(component,'invalidCommand')
        component.isDebug = true;
        component.typeArea = '!reserve';
        //const spy = spyOn<any>(component,'reserveLettersQuantity');
        console.log(component.typeArea);
        component.logMessage();
        
        expect(component.invalidCommand).toBeFalse();
        expect(component.errorMessage).toEqual('');
        

    });

    it('skipTurnCommand',()=>{
        spyOn<any>(component['messageService'],'isSubstring').and.returnValue(true);
        component.skipTurnCommand();
        expect(component.skipTurn).toBeTrue();
    });

    it('skipTurnCommand else if',()=>{
        spyOn<any>(component['messageService'],'isSubstring').and.returnValue(false);
        component.typeArea = '!debug';
        component.isDebug = true;
        component.skipTurnCommand();
        expect(component.isDebug).toBeFalse();
    });

    it('isSkipButtonClicked',()=>{
        component['messageService'].skipTurnIsPressed = true;
        component.isSkipButtonClicked();
        expect(component['messageService'].skipTurnIsPressed).toBeFalse();
    });

    it('logDebug',()=>{
        const spy = spyOn<any>(component['messageService'],'debugCommand');
        component.logDebug();
        expect(spy).toHaveBeenCalled();
    });


    // it('verifyWord multi subscribe', () => {
    //     const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
    //      messageServiceSpy.command = cmd;
    //     const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
    //     component['userService'].realUser = user;
    //     component['userService'].playMode = 'multi'
        
    //     component['userService'].playMode = 'createMultiplayerGame';
        
    //     spyOn<any>(component['socketManagementService'].listen('verifyWord'),'subscribe').and.callThrough();
    //     const spy = spyOn<any>(component,'getLettersFromChat');
        
    //     component['verifyWord']();
        
    //     expect(spy).toHaveBeenCalled();
         
    // });

//     it('should verify that invalidCommand is true when the reserveSize > 7', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.containsSwapCommand.and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'changeLetterFromReserve').and.callFake(() => {
//             return true;
//         });

//         reserveServiceSpy.reserveSize = 8;
//         component.logMessage();
//         expect(component.invalidCommand).toBeFalse();
//     });

//     it('invalidCommand is true when containsSwapCommad is true and changeLetterFromReserve', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         reserveServiceSpy.reserveSize = 8;

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.containsSwapCommand.and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return true;
//         });

//         letterServiceSpy.changeLetterFromReserve.and.callFake(() => {
//             return false;
//         });

//         component.logMessage();
//         expect(component.invalidCommand).toBeTrue();
//     });

//     it('should verify that getLettersFromChat', () => {

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });
//         messageServiceSpy.containsPlaceCommand.and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return true;
//         });

//         const spy = spyOn<any>(component, 'getLettersFromChat');
//         component.logMessage();

//         expect(spy).toHaveBeenCalled();
//     });

    it('getLettersFromChat', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true,easel:new EaselObject(true) };
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

    it('playFirtTurn',()=>{
        const points = 10;
        const user: JoinedUser = {
            name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true),
            guestPlayer: false
        };
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        userServiceSpy.joinedUser = user;
        component['userService'].playMode = 'joinMultiplayerGame';
        const spy = spyOn<any>(component['userService'].joinedUser.easel,'contains');
        component.playFirstTurn(points);
        expect(spy).toHaveBeenCalled();
    });

    it('playFirtTurn call placeLettersInScrable',()=>{
        const points = 10;
        const user: JoinedUser = {
            name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true),
            guestPlayer: false
        };
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        userServiceSpy.joinedUser = user;
        component['userService'].playMode = 'joinMultiplayerGame';
        spyOn<any>(component['userService'].joinedUser.easel,'contains').and.returnValue(true);
        const spy = spyOn<any>(component['lettersService'],'placeLettersInScrable')
        component.playFirstTurn(points);
        expect(spy).toHaveBeenCalled();
    });

    it('playFirtTurn call placeLettersInScrable else',()=>{
        const points = 10;
       
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        
        component['userService'].playMode = 'solo';
        spyOn<any>(component['userService'].realUser.easel,'contains').and.returnValue(true);
        const spy = spyOn<any>(component,'updateUserVariables');
        component.playFirstTurn(points);
        expect(spy).toHaveBeenCalled();
    });

    it('placeOtherTurns call placeLettersInScrable else',()=>{
        const points = 10;
       
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        const userJ: JoinedUser = {
            name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true),
            guestPlayer: false
        };
        userServiceSpy.joinedUser = userJ;
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        
        component['userService'].playMode = 'joinMultiplayerGame';
        spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
            return true;
        });
        
        const spy = spyOn<any>(component,'updateGuestVariables');
        component.placeOtherTurns(points);
        expect(spy).toHaveBeenCalled();
    });

    it('placeOtherTurns else',()=>{
        const points = 10;
       
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        const userJ: JoinedUser = {
            name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true),
            guestPlayer: false
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

    it('reserveLettersQuantity',()=>{
        component['reserveService'].letters = new Map<Letter, number>([[A,2],[B,3]]);
        const spy = spyOn<any>(component.arrayOfReserveLetters,'push');
        component.reserveLettersQuantity();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyWord',()=>{
        component['userService'].playMode = 'multi';
        const data:MessageServer = {  gameName: 'game000111',
        gameStarted: false};
        const userR: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        userServiceSpy.realUser = userR;
        spyOn<any>(component['socketManagementService'],'listen').and.returnValue(of(data))
        const spy = spyOn<any>(component,'getLettersFromChat');
        component['verifyWord']();
        expect(spy).toHaveBeenCalled();
    });


//     it('verify that boolean skipTurn invalidCommand are set to true', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return false;
//         });
//         messageServiceSpy.isSubstring.and.callFake(() => {
//             return true;
//         });
//         component.logMessage();

//         expect(component.skipTurn).toBeTrue();
//         expect(component.invalidCommand).toBeTrue();
//     });

//     it('verify that arrayOfMessages is pushing', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         component.arrayOfMessages = [];

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });

//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return false;
//         });
//         const spy = spyOn<any>(component.arrayOfMessages, 'push');

//         messageServiceSpy.isSubstring.and.callFake(() => {
//             return true;
//         });
//         component.logMessage();

//         expect(spy.length).toBe(1);
//     });

//     it('verify that detectSkipTurnBtn has been called when typeArea = !passer', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         component.typeArea = "!passer"

//         messageServiceSpy.isCommand.and.callFake(() => {
//             return true;
//         });
//         messageServiceSpy.isValid.and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return true;
//         });
        
//         component.logMessage();
//         expect(userServiceSpy.detectSkipTurnBtn).toHaveBeenCalled();
//     });

//     it('verify if the array has been spliced when index > -1', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         component.typeArea = '!passer';
//         component.arrayOfMessages = ['abc', 'def'];
//         spyOn<any>(component, 'isYourTurn').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(component.arrayOfMessages, 'indexOf').and.returnValue(-1);
//         component.logMessage();
//         expect(component.arrayOfMessages.indexOf('!passer', 0)).toEqual(-1);
//     });

//     test isSkipButtonClicked

//     it('verify that isSkipButtonClicked return true when the bouton is pressed', () => {
//         messageServiceSpy.skipTurnIsPressed = true;
//         expect(component.isSkipButtonClicked()).toBeTrue();
//     });

//     it('verify that isSkipButtonClicked return false when the bouton is not pressed', () => {
//         messageServiceSpy.skipTurnIsPressed = false;
//         expect(component.isSkipButtonClicked()).toBeFalse();
//     });

//     test logDebug

//     it('verify that if the debugCommand method return true logDebug do the same', () => {
//         messageServiceSpy.debugCommand.and.callFake(() => {
//             return true;
//         });
//         expect(component.logDebug()).toBeTrue();
//     });

//     it('verify that if the debugCommand method return false logDebug do the same', () => {
//         messageServiceSpy.debugCommand.and.callFake(() => {
//             return false;
//         });
//         expect(component.logDebug()).toBeFalse();
//     });

//     test for isYourTurn
//     it('verify that if the skipTurnValidUser return true isYourTurn do the same', () => {
//         userServiceSpy.isUserTurn.and.callFake(() => {
//             return true;
//         });

//         expect(component.isYourTurn()).toBeTrue();
//     });

//     it('verify that if the skipTurnValidUser return false isYourTurn do the same', () => {
//         userServiceSpy.isUserTurn.and.callFake(() => {
//             return false;
//         });

//         expect(component.isYourTurn()).toBeFalse();
//     });

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
        expect(component.invalidCommand).toBe(true)
       
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
        expect(component.errorMessage).toEqual('votre mot dois etre placer à la position central(h8)!')
       
    });

//     it('verify that if firstTurn is false and the position is h8, firstTurn will be false and wordInEasel will be called', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         userServiceSpy.realUser = user;

        
//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });

        

//         spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
//             return true;
//         });
        
//         component.getLettersFromChat();

//         expect(component.firstTurn).toBe(false);
        
//     });

//     it('verify that placeLettersInScrabble will be called ', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//          const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true,easel:new EaselObject(true) };
//          userServiceSpy.realUser = user;

//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordInEasel').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(userServiceSpy.realUser.easel,'contains').and.callFake(() =>{
//             return true;
//         })
//         const spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');

//         component.getLettersFromChat();

//         expect(component.firstTurn).toBe(false);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('167', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });
//         const spy = spyOn<any>(validWordServiceSpy, 'verifyWord');

//         component.getLettersFromChat();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('verify that when wordInEasel is false , invalidCommand is true', () => {
//         const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         component.firstTurn = true;
//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'tileIsEmpty').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
//             return false;
//         });

//         let spy = spyOn<any>(component,'invalidCommand');
//         component.getLettersFromChat();
//         expect(component.invalidCommand).toBeTrue();
//     });

//     it('verify that when wordIsAttached and wordIsPlacable, placeLettersInScrabble is called', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
        
//          const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel:new EaselObject(true) };
//          userServiceSpy.realUser = user;

//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });

//         component.firstTurn = false;
//         spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
//             return true;
//         });

//         const spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');
//         component.getLettersFromChat();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('verify that when wordIsAthached and wordIsPlacable return false, invalidCommand is true', () => {
//         const cmd = { word: 'mot', position: { x: 9, y: 9 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         component.firstTurn = true;
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel:new EaselObject(true) };
//          userServiceSpy.realUser = user;
//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordInEasel').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
//             return false;
//         });

//         component.getLettersFromChat();
//         expect(component.invalidCommand).toBeTrue();
//     });

//     it('verify that when verifyWord is false  , the window alert should be called', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return false;
//         });

//         component.getLettersFromChat();
//         expect(component.errorMessage).toBeDefined();
//     });

//     it('verify that when wordIsAttached is true and wordIsPlacable is false, the errorMessage is defined', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;

//         spyOn<any>(validWordServiceSpy, 'readWordsAndGivePointsIfValid').and.callFake(() => {
//             return 0;
//         });

//         spyOn<any>(letterServiceSpy, 'wordInBoardLimits').and.callFake(() => {
//             return true;
//         });
//         spyOn<any>(validWordServiceSpy, 'verifyWord').and.callFake(() => {
//             return true;
//         });
//         component.firstTurn = false;
//         spyOn<any>(letterServiceSpy, 'wordIsAttached').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(letterServiceSpy, 'wordIsPlacable').and.callFake(() => {
//             return false;
//         });

//         component.getLettersFromChat();
//         expect(component.errorMessage).toBeDefined();
//     });

//     it('verify that logDebug is called', () => {
//         const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
//         messageServiceSpy.command = cmd;
//         spyOn<any>(messageServiceSpy, 'isCommand').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(messageServiceSpy, 'isValid').and.callFake(() => {
//             return true;
//         });

//         spyOn<any>(component, 'logDebug').and.callFake(() => {
//             return true;
//         });
//         component.logMessage();
//         expect(component.isDebug).toBeTrue();
//     });
// });
 });