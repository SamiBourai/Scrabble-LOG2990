import { TestBed } from '@angular/core/testing';
// import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { ReserveService } from './reserve.service';

fdescribe('ReserveService', () => {
    let service: ReserveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReserveService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a letter randomly, and decrement reserve size', () => {
        spyOn(Math, 'random').and.returnValue(1);
        service.getRandomLetter();
        expect(service.reserveSize).toEqual(114);
    });

    it('response of the observable should return 100 (the size of the reserve)', () => {
        service.sizeObs.next(100);
        service.reserveSize = 100;
        service.size.subscribe((number) => {
            expect(service.reserveSize).toBe(number);
        });
    });
});
