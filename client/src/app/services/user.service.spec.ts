// eslint-disable-next-line @typescript-eslint/no-explicit-any
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { VirtualPlayerService } from './virtual-player.service';

describe('UserService', () => {
    let userService: UserService;

    let vrPlayerService: jasmine.SpyObj<VirtualPlayerService>;

    beforeEach(() => {
        vrPlayerService = jasmine.createSpyObj('EaselLogiscticsService', ['manageVrPlayerActions']);

        vrPlayerService.manageVrPlayerActions.and.returnValue();

        TestBed.configureTestingModule({
            providers: [{ provide: VirtualPlayerService, useValue: vrPlayerService }],
        });

        vrPlayerService = jasmine.createSpyObj('VirtualPlayerService', ['manageVrPlayerActions']);

        TestBed.configureTestingModule({});
        userService = TestBed.inject(UserService);

        vrPlayerService = TestBed.inject(VirtualPlayerService) as jasmine.SpyObj<VirtualPlayerService>;
    });

    it('should be created', () => {
        expect(userService).toBeTruthy();
    });
    // test of getRandomInt() function
    it('getRandomInt should return a number >= to 0 and < max number ex :(0<=number<max number)', () => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const randomInt_1: number = userService.getRandomInt(5);
        expect(randomInt_1).toBeLessThan(5);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const randomInt_2: number = userService.getRandomInt(10);
        expect(randomInt_2).toBeLessThan(10);
    });

    it('should continue because Vr name is the same then  user name player', () => {
        const localStorageSpy = spyOn(Object.getPrototypeOf(localStorage), 'getItem');
        userService.vrPlayerNames = ['Bobby1234', 'Bobby1234', 'Bobby1234'];
        localStorage.setItem('userName', 'Bobby1234');
        userService.chooseRandomName();
        expect(localStorageSpy).toHaveBeenCalled();
    });

    it('chooseRandomName should return name Bobby1234 and local storage should be called only once', () => {
        const localStorageSpy = spyOn(Object.getPrototypeOf(localStorage), 'getItem');
        spyOn(userService, 'getRandomInt').and.callFake(() => {
            return 0;
        });
        userService.vrPlayerNames = ['Bobby1234', 'Martin1234', 'Momo1234'];
        localStorage.setItem('userName', 'Sami123445');
        const playerName = userService.chooseRandomName();
        expect(localStorageSpy).toHaveBeenCalledTimes(1);
        expect(playerName).toEqual('Bobby1234');
    });

    it('chooseRandomName of vr should return Martin1234', () => {
        spyOn(userService, 'getRandomInt').and.callFake(() => {
            return 1;
        });
        const playerName = userService.chooseRandomName();
        expect(playerName).toEqual('Martin1234');
    });

    it('chooseRandomName of vr should return Momo1234', () => {
        spyOn(userService, 'getRandomInt').and.callFake(() => {
            return 2;
        });
        const playerName = userService.chooseRandomName();
        expect(playerName).toEqual('Momo1234');
    });

    it('chooseRandomName of vr should return Bobby1234', () => {
        spyOn(userService, 'getRandomInt').and.callFake(() => {
            return 0;
        });
        const playerName = userService.chooseRandomName();
        expect(playerName).toEqual('Bobby1234');
    });

    it('chooseRandomName should continue and not choose name', () => {
        spyOn(Object.getPrototypeOf(localStorage), 'getItem');
        spyOn(userService, 'getRandomInt').and.callFake(() => {
            return 0;
        });
        userService.vrPlayerNames = ['Bobby1234', 'Martin1234', 'Momo1234'];
        localStorage.setItem('userName', 'Bobby1234');
        const name: string = userService.chooseRandomName();
        expect(name).not.toEqual('');
    });

    // startTime() tests
    it('test if vr skip turn . should get counter = 59 sec and time=59 sec', (done) => {
        userService.vrSkipingTurn = true;
        userService.userSkipingTurn = false;
        userService.startTimer();

        setTimeout(() => {
            expect(userService.vrSkipingTurn).toBeFalse();
            done();
        }, 3000);
    });

    it('test if vr skip turn . should get counter = 59 sec and time=59 sec', (done) => {
        const clearIntervalSpy = spyOn(global, 'clearInterval');
        userService.vrSkipingTurn = false;
        userService.userSkipingTurn = true;
        userService.startTimer();

        setTimeout(() => {
            expect(userService.userSkipingTurn).toBeFalse();
            expect(clearIntervalSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });

    // test skipTurnValidUSer()
    it('test skipTurnValidUser, expect true when time=59 ', () => {
        userService.time = 59;

        expect(userService.isUserTurn()).toBeTrue();
    });
    it('test skipTurnValidUser, expect false when time=20 ', () => {
        userService.time = 20;

        expect(userService.isUserTurn()).toBeFalse();
    });
    it('test skipTurnValidUser, expect false when time!=20 and time!=59 ', () => {
        userService.time = 0;

        expect(userService.isUserTurn()).toBeFalse();
    });
});
