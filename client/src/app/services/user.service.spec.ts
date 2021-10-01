import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        userService = TestBed.inject(UserService);
    });

    it('should be created', () => {
        expect(userService).toBeTruthy();
    });
    // test of getRandomInt() function
    it('getRandomInt should return a number >= to 0 and < max number ex :(0<=number<max number)', () => {
        let randomInt_1: number = userService.getRandomInt(5);
        expect(randomInt_1).toBeLessThan(5);
        let randomInt_2: number = userService.getRandomInt(10);
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

    // startTime() tests

    it('test if real user is first to play. should get counter = 59 sec and time=59 sec', () => {
        userService.realUser.firstToPlay = true;
        userService.startTimer();
        expect(userService.counter.sec).toBe(59);
        expect(userService.time).toBe(59);
    });
    it('test if real user is second to play. should get counter = 20 sec and time=20 sec', () => {
        userService.realUser.firstToPlay = false;
        userService.startTimer();
        expect(userService.counter.sec).toBe(20);
        expect(userService.time).toBe(20);
    });

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

    it('test second get decreased, should get counter.sec=59', (done) => {
        //userService.counter.sec=-1;
        userService.vrSkipingTurn = false;
        userService.userSkipingTurn = false;
        spyOn(userService, 'setCounter').and.callFake(() => {
            return { min: 0, sec: 0 };
        });
        userService.startTimer();

        setTimeout(() => {
            expect(userService.counter.sec).toBe(59);
            done();
        }, 1000);
    });
    it('test when counter (time) is on value 0:0, expect to call clearTnterval()', (done) => {
        const clearIntervalSpy = spyOn(global, 'clearInterval');
        userService.vrSkipingTurn = false;
        userService.userSkipingTurn = false;
        spyOn(userService, 'setCounter').and.callFake(() => {
            return { min: 0, sec: 1 };
        });
        userService.startTimer();

        setTimeout(() => {
            expect(clearIntervalSpy).toHaveBeenCalled();
            done();
        }, 1000);
    });
    // test skipTurnValidUSer()
    it('test skipTurnValidUser, expect true when time=59 ', () => {
        userService.time = 59;

        expect(userService.skipTurnValidUser()).toBeTrue();
    });
    it('test skipTurnValidUser, expect false when time=20 ', () => {
        userService.time = 20;

        expect(userService.skipTurnValidUser()).toBeFalse();
    });
    it('test skipTurnValidUser, expect false when time!=20 and time!=59 ', () => {
        userService.time = 0;

        expect(userService.skipTurnValidUser()).toBeFalse();
    });
});
