/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { A, C } from '@app/constants/constants';
import { CommandManagerService } from '@app/services/command-manager.service';
import { LettersService } from '@app/services/letters.service';
import { MessageService } from '@app/services/message.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { ReserveService } from '@app/services/reserve.service';
import { TemporaryCanvasService } from '@app/services/temporary-canvas.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { EaselObject } from './../../classes/easel-object';
import { EaselLogiscticsService } from './../../services/easel-logisctics.service';
import { ValidWordService } from './../../services/valid-word.service';

import SpyObj = jasmine.SpyObj;

describe('SidebarComponent', () => {
    let messageServiceSpy: SpyObj<MessageService>;
    let letterServiceSpy: SpyObj<LettersService>;
    let userServiceSpy: SpyObj<UserService>;
    let validWordServiceSpy: SpyObj<ValidWordService>;
    let reserveServiceSpy: SpyObj<ReserveService>;
    let easelLogiscticsServiceSpy: SpyObj<EaselLogiscticsService>;
    let objectifMangerServiceSpy: SpyObj<ObjectifManagerService>;
    let commandManagerServiceSpy: SpyObj<CommandManagerService>;
    let tempCanvasServiceSpy: SpyObj<TemporaryCanvasService>;

    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('messageServiceSpy', [
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

        userServiceSpy = jasmine.createSpyObj('userServiceSpy', [
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
        easelLogiscticsServiceSpy = jasmine.createSpyObj('easelLogiscticsServiceSpy', ['tempGetLetter', 'placeEaselLetters']);
        objectifMangerServiceSpy = jasmine.createSpyObj('objectifMangerServiceSpy', ['verifyObjectifs']);
        commandManagerServiceSpy = jasmine.createSpyObj('commandManagerServiceSpy', [
            'verifyCommand',
            'verifyWordsInDictionnary',
            'verifyExchageCommand',
            'validateWord',
        ]);
        tempCanvasServiceSpy = jasmine.createSpyObj('tempCanvasServiceSpy', ['drawLetter', 'drawRedFocus', 'clearLayers', 'focusContext']);

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
                { provide: EaselLogiscticsService, useValue: easelLogiscticsServiceSpy },
                { provide: ObjectifManagerService, useValue: objectifMangerServiceSpy },
                { provide: CommandManagerService, useValue: commandManagerServiceSpy },
                { provide: TemporaryCanvasService, useValue: tempCanvasServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        const userV: VrUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true) };
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        userJ.easel.easelLetters = [A, C];
        userJ.easel.foundLetter = [false, false, false, true, false, false, false];
        userJ.easel.indexTempLetters = [];
        userServiceSpy.vrUser = userV;
        userServiceSpy.realUser = user;
        userServiceSpy.joinedUser = userJ;
        component.name = user.name;
        component.nameVr = userJ.name;
        if (userServiceSpy.playMode === 'joinMultiplayerGame') {
            spyOn<any>(userServiceSpy, 'getPlayerEasel').and.returnValue(userJ.easel);
        } else spyOn<any>(userServiceSpy, 'getPlayerEasel').and.returnValue(user.easel);
    });

    it('should create ', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit', () => {
        component['userService'].playMode = 'multi';
        component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
        component['reserveService'].sizeObs = new BehaviorSubject<number>(2);
        const spy = spyOn<any>(messageServiceSpy.newTextMessageObs, 'subscribe');
        const spy1 = spyOn<any>(global, 'setTimeout');
        const spy2 = spyOn<any>(reserveServiceSpy.sizeObs, 'subscribe');
        component.toggleReserve = true;

        component.ngOnInit();

        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it('ngOnInit with sizeObs defined ', (done) => {
        component['userService'].playMode = 'soloGame';
        component['messageService'].newTextMessageObs = new BehaviorSubject<boolean>(true);
        component['reserveService'].sizeObs = new BehaviorSubject<number>(2);
        userServiceSpy.isPlayerTurn.and.returnValue(true);
        const spy2 = spyOn<any>(component, 'manageCommands');
        component.ngOnInit();
        setTimeout(() => {
            expect(reserveServiceSpy.sizeObs).toBeDefined();
            expect(spy2).not.toHaveBeenCalled();
            done();
        }, 0);
    });

    it('logMessage true', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        const spy1 = spyOn<any>(component, 'manageCommands');
        component.logMessage();
        expect(spy1).toHaveBeenCalled();
    });

    it('logMessage false', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(false);
        spyOn<any>(messageServiceSpy, 'isSubstring').and.returnValue(true);
        component.logMessage();
        expect(component.errorMessage).toBe("ce n'est pas votre tour");
    });

    it('isSkipButtonClicked', () => {
        const spy1 = spyOn<any>(component, 'updateMessageArray');
        messageServiceSpy.skipTurnIsPressed = true;
        component.isSkipButtonClicked();
        expect(spy1).toHaveBeenCalled();
    });

    it('manageCommands placer', () => {
        component.typeArea = '!placer';
        commandManagerServiceSpy.verifyCommand.and.returnValue(true);
        const spy = spyOn<any>(component, 'placeWord');
        component['manageCommands']();
        expect(spy).toHaveBeenCalled();
    });
    it('manageCommands placer with false verify command', () => {
        component.typeArea = '!placer';
        commandManagerServiceSpy.verifyCommand.and.returnValue(false);
        const spy = spyOn<any>(component, 'placeWord');
        component['manageCommands']();
        expect(spy).not.toHaveBeenCalled();
    });

    it('manageCommands echanger', () => {
        component.typeArea = '!echanger';
        const spy1 = spyOn<any>(component, 'exchangeCommand');
        component['manageCommands']();
        expect(spy1).toHaveBeenCalled();
    });

    it('manageCommands passer', () => {
        component.typeArea = '!passer';
        const spy1 = spyOn<any>(userServiceSpy, 'detectSkipTurnBtn');
        component['manageCommands']();
        expect(spy1).toHaveBeenCalled();
    });

    it('placeWord should pass on soloMode', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        userServiceSpy.playMode = 'soloGame';
        commandManagerServiceSpy.validateWord.and.stub();
        const spy1 = spyOn<any>(component, 'placeWordIfValid').and.stub();

        component['placeWord']();
        expect(spy1).toHaveBeenCalled();
    });

    it('placeWord switch default', (done) => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        userServiceSpy.playMode = 'default';
        spyOn<any>(component, 'placeInTempCanvas').and.callFake(() => {
            return;
        });
        const spy1 = spyOn<any>(component, 'placeWordIfValid');
        commandManagerServiceSpy.verifyWordsInDictionnary.and.stub();
        spyOn<any>(component['mouseHandelingService'], 'clearAll').and.stub();

        component['placeWord']();
        setTimeout(() => {
            expect(spy1).toHaveBeenCalled();
            done();
        }, 3000);
    });

    it('placeInTempCanvas with direction h', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        component['placeInTempCanvas'](cmd);
        expect(tempCanvasServiceSpy.drawLetter).toHaveBeenCalled();
    });
    it('placeInTempCanvas with direction h', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'h' };
        messageServiceSpy.command = cmd;
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        component['placeInTempCanvas'](cmd);
        expect(tempCanvasServiceSpy.drawLetter).toHaveBeenCalled();
    });
    it('placeInTempCanvas with direction v', () => {
        const cmd = { word: 'mot', position: { x: 8, y: 8 }, direction: 'v' };
        messageServiceSpy.command = cmd;
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        component['placeInTempCanvas'](cmd);
        expect(tempCanvasServiceSpy.drawLetter).toHaveBeenCalled();
    });
    it('placeWordIfValid', () => {
        commandManagerServiceSpy.playerScore = 2;
        const spy = spyOn<any>(letterServiceSpy, 'placeLettersInScrable');
        spyOn<any>(component, 'verifyObjectifs');
        spyOn<any>(component, 'endTurn');
        component['placeWordIfValid']();
        expect(spy).toHaveBeenCalled();
    });
    it('placeWordIfValid else', () => {
        commandManagerServiceSpy.playerScore = 0;
        spyOn<any>(component, 'endTurn');
        component['placeWordIfValid']();
        expect(component.errorMessage).toBe(commandManagerServiceSpy.errorMessage);
    });
    it('exchangeCommand', () => {
        spyOn<any>(commandManagerServiceSpy, 'verifyExchageCommand').and.returnValue(true);
        const spy = spyOn<any>(component, 'endTurn');
        component['exchangeCommand']();
        expect(spy).toHaveBeenCalled();
    });
    it('exchangeCommand else', () => {
        spyOn<any>(commandManagerServiceSpy, 'verifyExchageCommand').and.returnValue(false);
        commandManagerServiceSpy.errorMessage = 'kk';
        component['exchangeCommand']();
        expect(component.errorMessage).toBe('kk');
    });
    it('endTurn with exchange', (done) => {
        const cmd = 'exchange';
        const msg = 'allo';
        userServiceSpy.playMode = 'dsds';
        userServiceSpy.playedObs = new BehaviorSubject<boolean>(true);
        spyOn<any>(component, 'verifyObjectifs');
        component['endTurn'](cmd, msg);
        setTimeout(() => {
            expect(userServiceSpy.exchangeLetters).toBeTruthy();
            done();
        }, 3000);
    });
    it('endTurn with exchange else', () => {
        const cmd = 'exchange';
        const msg = 'allo';
        userServiceSpy.playMode = 'soloGame';
        userServiceSpy.playedObs = new BehaviorSubject<boolean>(true);
        spyOn<any>(component, 'verifyObjectifs');
        component['endTurn'](cmd, msg);
        expect(userServiceSpy.userPlayed).toHaveBeenCalled();
    });
    it('endTurn placer first switch ', () => {
        const cmd = 'placer';
        const msg = 'allo';
        userServiceSpy.commandtoSendObs = new BehaviorSubject<ChatCommand>({} as ChatCommand);
        component.errorMessage = 'fdf';
        userServiceSpy.playMode = 'jhdsk';
        component['endTurn'](cmd, msg);
        expect(userServiceSpy.commandtoSendObs).toBeDefined();
    });
    it('endTurn else ', () => {
        const cmd = 'placer';
        const msg = 'allo';
        component.errorMessage = 'fdf';
        userServiceSpy.playMode = 'soloGame';
        const spy = spyOn<any>(userServiceSpy, 'userPlayed');
        component['endTurn'](cmd, msg);
        expect(spy).toHaveBeenCalled();
    });

    it('reserveLettersQuantity with reserveletter pass', () => {
        spyOn<any>(component.arrayOfReserveLetters, 'splice');
        const spy1 = spyOn<any>(component.arrayOfReserveLetters, 'push');
        reserveServiceSpy.letters = new Map<Letter, number>();
        reserveServiceSpy.letters.set(A, 3);
        component['reserveLettersQuantity']();
        expect(spy1).toHaveBeenCalled();
    });

    it('verifyInput', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(false);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        component['verifyInput']();
        expect(component.errorMessage).toBe('commande invalide');
    });

    it('verifyInput else debug', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!debug';
        component.isDebug = false;
        component['verifyInput']();
        expect(component.isDebug).toBe(true);
    });

    it('verifyInput else reserve', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!reserve';
        const spy = spyOn<any>(component, 'showReserve');
        component['verifyInput']();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyInput else aide', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(true);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        component.typeArea = '!aide';
        component.isHelpActivated = false;
        component['verifyInput']();
        expect(component.isHelpActivated).toBe(true);
    });

    it('verifyInput else default', () => {
        spyOn<any>(messageServiceSpy, 'isCommand').and.returnValue(false);
        spyOn<any>(messageServiceSpy, 'isValid').and.returnValue(true);
        spyOn<any>(userServiceSpy, 'isPlayerTurn').and.returnValue(true);
        component.typeArea = 'blba';
        const spy = spyOn<any>(component, 'updateMessageArray');
        component['verifyInput']();
        expect(spy).toHaveBeenCalled();
    });

    it('showReserve', () => {
        component.isDebug = true;
        component.toggleReserve = false;
        const spy = spyOn<any>(component, 'reserveLettersQuantity');
        component['showReserve']();
        expect(spy).toHaveBeenCalled();
        expect(component.toggleReserve).toBe(true);
    });

    it('showReserve else', () => {
        component.isDebug = false;
        component.toggleReserve = false;
        component['showReserve']();
        expect(component.errorMessage).toBe("vous n'êtes pas en mode debogage");
    });

    it('reserveLettersQuantity', () => {
        const spy = spyOn<any>(component.arrayOfReserveLetters, 'splice');
        component['reserveLettersQuantity']();
        expect(spy).toHaveBeenCalled();
    });

    it('verifyObjectifs', () => {
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'pass';
        const spy = spyOn<any>(component['objectifMangerService'], 'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
    });

    it('verifyObjectifs play', () => {
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'play';
        const spy = spyOn<any>(component['objectifMangerService'], 'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
    });

    it('verifyObjectifs exchange', () => {
        component['objectifMangerService'].log2990Mode = true;
        const cmd = 'exchange';
        const spy = spyOn<any>(component['objectifMangerService'], 'verifyObjectifs');
        component['verifyObjectifs'](cmd);
        expect(spy).toHaveBeenCalled();
    });
});
