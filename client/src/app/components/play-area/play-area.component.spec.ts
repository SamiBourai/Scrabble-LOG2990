// /* eslint-disable prettier/prettier */
// /* eslint-disable max-len */
// /* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule } from '@angular/material/dialog';
// import { EaselObject } from '@app/classes/easel-object';
// import { RealUser } from '@app/classes/user';
// import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
// import { EaselLogiscticsService } from '@app/services/easel-logisctics.service';
// import { MessageService } from '@app/services/message.service';
// import { ReserveService } from '@app/services/reserve.service';
// import { UserService } from '@app/services/user.service';
// import { VirtualPlayerService } from '@app/services/virtual-player.service';

// describe('PlayAreaComponent', () => {
//     let component: PlayAreaComponent;
//     let fixture: ComponentFixture<PlayAreaComponent>;

//     let easelLogiscticsServiceSpy: EaselLogiscticsService;
//     let reserveServiceSpy: ReserveService;
//     let userServiceSpy: UserService;
//     let messageServiceSpy: MessageService;
//     let virtualPlayerService: VirtualPlayerService;

//     beforeEach(async () => {
//         reserveServiceSpy = new ReserveService();
//         easelLogiscticsServiceSpy = new EaselLogiscticsService(reserveServiceSpy);
//         userServiceSpy = new UserService(messageServiceSpy, virtualPlayerService);
//         await TestBed.configureTestingModule({
//             imports: [HttpClientModule, MatDialogModule],
//             declarations: [PlayAreaComponent],
//             providers: [
//                 { provide: EaselLogiscticsService, useValue: easelLogiscticsServiceSpy },
//                 { provide: ReserveService, useValue: reserveServiceSpy },
//                 { provide: UserService, useValue: userServiceSpy },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(PlayAreaComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('spaceEvent enter', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'Enter',
//         });
//         component['mouseHandlingService'].previousClick.x = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'placeTempWord');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('spaceEvent Backspace', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'Backspace',
//         });
//         component['mouseHandlingService'].previousClick.x = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'deletPreviousLetter');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('spaceEvent Escape', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'Escape',
//         });
//         component['mouseHandlingService'].previousClick.x = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'resetSteps');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('spaceEvent default', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'fdh',
//         });
//         component['mouseHandlingService'].previousClick.x = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'keyBoardEntryManage');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('spaceEvent Arrowleft', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'ArrowLeft',
//         });
//         component['userService'].getPlayerEasel().indexToMove = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'moveLeft');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('spaceEvent Arrowright', () => {
//         const event = new KeyboardEvent('keypress', {
//             key: 'ArrowRight',
//         });
//         component['userService'].getPlayerEasel().indexToMove = 2;
//         const spy = spyOn(component['mouseHandlingService'], 'moveRight');
//         component.spaceEvent(event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('detectSkipTurnBtn', () => {
//         const spy = spyOn(component['userService'], 'detectSkipTurnBtn');
//         component.detectSkipTurnBtn();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('detectGameQuit', () => {
//         component.detectGameQuit();
//         expect(component['userService'].isUserQuitGame).toBeTrue();
//     });

//     it('disableButton', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser = user;
//         const event = 'passTurn';
//         component['userService'].playMode = 'fdfdf';

//         component.disableButton(event);
//         expect(component['userService'].realUser.turnToPlay).toBeTrue();
//     });

//     it('disableButton else', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser = user;
//         const event = 'passTurn';
//         component['userService'].playMode = 'joinMultiplayerGame';

//         component.disableButton(event);
//         expect(component['userService'].realUser.turnToPlay).toBeTrue();
//     });

//     it('disableButton else else', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser = user;
//         const event = 'sgfdjhf';
//         component['userService'].playMode = 'ffghf';

//         component.disableButton(event);
//         expect(component['userService'].realUser.turnToPlay).toBeTrue();
//     });
// });
