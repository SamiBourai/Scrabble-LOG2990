/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselObject } from '@app/classes/EaselObject';
import { RealUser } from '@app/classes/user';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { ModalUserVsPlayerComponent } from './modal-user-vs-player.component';

describe('ModalUserVsPlayerComponent', () => {
    let component: ModalUserVsPlayerComponent;
    let fixture: ComponentFixture<ModalUserVsPlayerComponent>;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let timeServiceSpy: jasmine.SpyObj<TimeService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['isUserQuitGame']);
        timeServiceSpy = jasmine.createSpyObj('TimeService', ['timeUser']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HttpClientModule],
            declarations: [ModalUserVsPlayerComponent],
            providers: [
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ModalUserVsPlayerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return username on getNameFromLocalStorage', () => {
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const name = component.getNameFromLocalStorage();
        expect(name).toBe(component['userService'].realUser.name);
    });

    // it('quitMultiPlayerGame', () => {
    //     component['userService'].playMode = 'soloGame';
    //     spyOn(window.location,'assign').and.callThrough();
    //     component.quitMultiPlayerGame();

    // });
});
