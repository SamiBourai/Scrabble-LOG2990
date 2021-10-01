import { TestBed } from '@angular/core/testing';
// import { Letter } from '@app/classes/letter';
// import { A } from '@app/constants/constants';
import { ReserveService } from './reserve.service';

describe('ReserveService', () => {
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
        //expect(letter.charac).toBe(A.charac);
    });
});
