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
import { RealUser } from '@app/classes/user';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ViewModalComponent } from './ViewModal.component';

describe('ModalUserVsPlayerComponent', () => {
    let component: ViewModalComponent;
    let fixture: ComponentFixture<ViewModalComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let timeServiceSpy: jasmine.SpyObj<TimeService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['isUserQuitGame']);
        timeServiceSpy = jasmine.createSpyObj('TimeService', ['timeUser']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [ViewModalComponent],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getNameFromLocalStorage', () => {
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const name = component.getNameFromLocalStorage();
        expect(name).toBe(component['userService'].realUser.name);
    });

    it('setIsUserQuitGame', () => {
        const spy = spyOn<any>(component, 'getOne').and.callFake(() => {
            // call fake (so its not empty)
        });
        component.setIsUserQuitGame();
        expect(spy).toHaveBeenCalled();
    });

    it('quitMultiPlayerGame', () => {
        component.userService.playMode = 'soloGame';
        const spy = spyOn<any>(component, 'getOne').and.callFake(() => {
            // call fake (so its not empty)
        });
        component.quitMultiPlayerGame();
        expect(spy).toHaveBeenCalled();
    });

    it('quitMultiPlayerGame 2', () => {
        component.userService.gameName = 'game000111';
        const data: MessageServer = {
            gameName: 'game000111',
        };
        component.userService.playMode = 'joinMultiplayerGame';
        const spy = spyOn<any>(component, 'getOne').and.callFake(() => {
            // call fake (so its not empty)
        });
        const spy2 = spyOn<any>(component['socketManagementService'], 'emit').and.returnValue(data);

        component.quitMultiPlayerGame();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('quitMultiPlayerGame 3', () => {
        const data: MessageServer = {
            gameName: 'game000111',
        };
        component.userService.playMode = 'createMultiplayerGame';
        const spy = spyOn<any>(component, 'getOne').and.callFake(() => {
            // call fake (so its not empty)
        });
        const spy2 = spyOn<any>(component['socketManagementService'], 'emit').and.returnValue(data);
        component.quitMultiPlayerGame();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
});