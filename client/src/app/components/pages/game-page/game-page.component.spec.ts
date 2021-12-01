// /* eslint-disable dot-notation */
// import { HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatDialogModule } from '@angular/material/dialog';
// import { EaselObject } from '@app/classes/easel-object';
// import { JoinedUser, RealUser } from '@app/classes/user';
// import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
// import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
// import { GamePageComponent } from './game-page.component';

// describe('GamePageComponent', () => {
//     let component: GamePageComponent;
//     let fixture: ComponentFixture<GamePageComponent>;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent],
//             imports: [HttpClientModule, MatDialogModule],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(GamePageComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser = user;
//         const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
//         component['userService'].joinedUser = userJ;
//     });

//     it('should create', () => {
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         expect(component).toBeTruthy();
//     });

//     it('detectSkipTurnBtn', () => {
//         component.detectSkipTurnBtn();
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         expect(component['userService'].userSkipingTurn).toBeTrue();
//     });

//     it('ngOnInit', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser.easel = user.easel;
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         const spy = spyOn(component, 'getLetter');
//         component.ngOnInit();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('ngOnInit switch', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser.easel = user.easel;
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         const spy = spyOn(component['multiplayerModeService'], 'beginGame');
//         component.userService.playMode = 'createMultiplayerGame';
//         component.ngOnInit();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('ngOnInit switch join', () => {
//         const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
//         component['userService'].realUser.easel = user.easel;
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         const spy = spyOn(component['multiplayerModeService'], 'beginGame');
//         component.userService.playMode = 'joinMultiplayerGame';
//         component.ngOnInit();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('ngAfterViewInit', () => {
//         const spy = spyOn(component, 'openDialog');
//         spyOn(component['userService'], 'getPlayerEasel');
//         spyOn(component['mouseHandlingService'], 'resetSteps');
//         spyOn(component['mouseHandlingService'], 'clearAll');
//         component.ngAfterViewInit();
//         expect(spy).toHaveBeenCalled();
//     });
// });
