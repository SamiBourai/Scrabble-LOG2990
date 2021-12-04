/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser } from '@app/classes/user';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { BehaviorSubject } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    const mockDialogRef2 = {
        open: jasmine.createSpy('open'),
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent],
            imports: [HttpClientModule, MatDialogModule],
            providers: [{ provide: MatSnackBar, useValue: mockDialogRef2 }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        component['userService'].joinedUser = userJ;
        component['assign'] = false;
    });

    it('should create', () => {
        spyOn(component['userService'], 'getPlayerEasel');
        spyOn(component['mouseHandlingService'], 'resetSteps');
        spyOn(component['mouseHandlingService'], 'clearAll');
        expect(component).toBeTruthy();
    });

    it('detectSkipTurnBtn', () => {
        component.detectSkipTurnBtn();
        spyOn(component['userService'], 'getPlayerEasel');
        spyOn(component['mouseHandlingService'], 'resetSteps');
        spyOn(component['mouseHandlingService'], 'clearAll');
        expect(component['userService'].userSkipingTurn).toBeTrue();
    });

    it('ngAfterViewInit', () => {
        const spy = spyOn(component, 'openShowEasel');
        spyOn(component['userService'], 'getPlayerEasel');
        spyOn(component['mouseHandlingService'], 'resetSteps');
        spyOn(component['mouseHandlingService'], 'clearAll');
        component.ngAfterViewInit();
        expect(spy).toHaveBeenCalled();
    });

    it('openShowEasel', () => {
        component['userService'].endOfGameBehaviorSubject = new BehaviorSubject<boolean>(true);
        const spy1 = spyOn(component['dataBase'], 'addScores');
        const spy2 = spyOn(component['dialogRef'], 'open');
        component.openShowEasel();
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});
