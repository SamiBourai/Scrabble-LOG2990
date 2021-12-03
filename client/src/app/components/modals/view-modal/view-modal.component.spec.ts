/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/easel-object';
import { MessageServer } from '@app/classes/message-server';
import { JoinedUser, RealUser, VrUser } from '@app/classes/user';
import { A } from '@app/constants/constants';
import { ViewModalComponent } from '@app/components/modals/view-modal/view-modal.component'; 

describe('ViewModalComponent', () => {
    let component: ViewModalComponent;
    let fixture: ComponentFixture<ViewModalComponent>;
    // const mockUserService = {

    //     getPlayerEasel: () => '',

    // }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [ViewModalComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        component['userService'].joinedUser = userJ;
        const userV: VrUser = { name: 'bob', level: '2', round: '3', score: 8, easel: new EaselObject(true) };
        component['userService'].vrUser = userV;
        component['userService'].realUser.easel.easelLetters = [A, A, A, A, A, A, A];
        component['userService'].joinedUser.easel.easelLetters = [A, A, A, A, A, A, A];
        component['userService'].vrUser.easel.easelLetters = [A, A, A, A, A, A, A];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('quitMultiPlayerGame solo', () => {
        component['userService'].playMode = 'soloGame';
        const spy2 = spyOn(component, 'setIsUserQuitGame');
        component.quitMultiPlayerGame();
        expect(spy2).toHaveBeenCalled();
    });

    it('quitMultiPlayerGame join', () => {
        const data: MessageServer = {
            command: {
                word: 'azzz',
                direction: 'p',
                position: { x: 1, y: 1 },
            },
            gameName: 'game000111',
            user: { name: 'abdel3234', score: 0 },
            guestPlayer: { name: 'marouane3234', score: 45 },
        };
        component['userService'].playMode = 'joinMultiplayerGame';
        const spy = spyOn<any>(component['userService'], 'getPlayerEasel').and.returnValue(data);
        // const spy = spyOn(component['socketManagementService'], 'emit');
        const spy2 = spyOn(component, 'setIsUserQuitGame');
        component.quitMultiPlayerGame();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('quitMultiPlayerGame create', () => {
        component['userService'].playMode = 'createMultiplayerGame';
        const spy = spyOn<any>(component['socketManagementService'], 'emit').and.returnValue(component['userService'].realUser);
        const spy2 = spyOn(component, 'setIsUserQuitGame');
        component.quitMultiPlayerGame();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});