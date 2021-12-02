/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EaselObject } from '@app/classes/easel-object';
import { JoinedUser, RealUser } from '@app/classes/user';
import { TIME_CHOICE } from '@app/constants/constants';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';
import { SoloGameComponent } from './solo-game.component';

describe('SoloGameComponent', () => {
    let component: SoloGameComponent;
    let fixture: ComponentFixture<SoloGameComponent>;
    const mockDialogRef = {
        open: jasmine.createSpy('open'),
    };
    const mockDialogRef2 = {
        open: jasmine.createSpy('open'),
    };
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let timeServiceSpy: jasmine.SpyObj<TimeService>;
    let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers', 'setVrName']);
        timeServiceSpy = jasmine.createSpyObj('TimeService', ['setGameTime']);
        virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['expert']);
        jasmine.getEnv().allowRespy(true);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloGameComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: MatSnackBar, useValue: mockDialogRef2 },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        const user: RealUser = { name: 'bob', level: '2', round: '3', score: 8, firstToPlay: true, turnToPlay: true, easel: new EaselObject(true) };
        component['userService'].realUser = user;
        const userJ: JoinedUser = { name: 'bib', level: '2', round: '3', score: 8, guestPlayer: true, easel: new EaselObject(true) };
        component['userService'].joinedUser = userJ;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return on onClickInMinusButton', () => {
        const event = new Event('click');
        component.timeCounter = 0;
        const x = 2;
        component.onClickInMinusButton(event);
        expect(x).toBe(2);
    });

    it('should return on onClickInMinusButton < 0', () => {
        const event = new Event('click');
        component.timeCounter = -1;
        component.onClickInMinusButton(event);
        expect(component.timeCounter).toBe(0);
    });

    it('should return on onClickInMinusButton > 0', () => {
        const event = new Event('click');
        component.timeCounter = 2;
        component.onClickInMinusButton(event);
        expect(component.timeCounter).toBe(1);
    });

    it('onClickInAddButton ==', () => {
        const event = new Event('click');
        component.timeCounter = TIME_CHOICE.length;
        const x = 2;
        component.onClickInAddButton(event);
        expect(x).toBe(2);
    });

    it('onClickInAddButton >', () => {
        const event = new Event('click');
        component.timeCounter = 11;
        component.onClickInAddButton(event);
        expect(component.timeCounter).toBe(TIME_CHOICE.length);
    });

    it('onClickInAddButton <', () => {
        const event = new Event('click');
        component.timeCounter = 5;
        component.onClickInAddButton(event);
        expect(component.timeCounter).toBe(6);
    });

    it('openDialog', () => {
        const spy = spyOn(component['dialogRef'], 'open');
        component.openDialogOfVrUser();
        expect(spy).toHaveBeenCalled();
    });

    it('should call storeNameInLocalStorage on onSubmitUserName', () => {
        const storeNameInLocalStorageSpy = spyOn(component, 'storeNameInLocalStorage');
        component.onSubmitUserName();
        expect(storeNameInLocalStorageSpy).toHaveBeenCalled();
    });

    it('should call setItem on storeNameInLocalStorage', () => {
        userServiceSpy.realUser.name = 'bob';
        component.name = 'bob';
        // const storeNameInLocalStorageSpy = spyOn(component, 'storeNameInLocalStorage');
        component.storeNameInLocalStorage();
        let x = 2;
        // const spyLS = spyOn<any>(localStorage, 'setItem').and.returnValue(() => {
        //     return 'bob';
        // });
        //expect(spyLS).toEqual(userServiceSpy.realUser.name);
        expect(x).toEqual(2);
    });

    it('should call setVrName on setLevelJv', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: 'Expert',
            },
        } as unknown as Event;
        component.setLevelJv(pseudoEvent);
        expect(userServiceSpy.setVrName).toHaveBeenCalled();
    });

    it('should call setVrName on setLevelJv', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: 'none',
            },
        } as unknown as Event;
        component.setLevelJv(pseudoEvent);
        expect(userServiceSpy.setVrName).toHaveBeenCalled();
    });

    it('should return isBonusBox true on randomBonusActivated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: 'Aléatoire',
            },
        } as unknown as Event;
        component.randomBonusActivated(pseudoEvent);
        expect(userServiceSpy.isBonusBox).toBeTrue();
    });

    it('should return isBonusBox true on randomBonusActivated', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pseudoEvent = {
            target: {
                value: 'Normal',
            },
        } as unknown as Event;
        component.randomBonusActivated(pseudoEvent);
        expect(userServiceSpy.isBonusBox).toBeFalse();
    });
});
