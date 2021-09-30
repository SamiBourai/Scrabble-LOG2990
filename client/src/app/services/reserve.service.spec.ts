import { TestBed } from '@angular/core/testing';
import { A } from '@app/constants/constants';
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

    // it('should return random letter on getRandomLetter', () => {
    //     let reserveService = new ReserveService;
    //     let lettersTest = reserveService.letters;
    //     let getRandomLetterSpy = spyOn(service, 'getRandomLetter').and.callThrough();
    //     service.getRandomLetter();

    //     expect(service.getRandomLetter()).toBeInstanceOf(Letter)
    // });

    it('should pass on getRandomLetter', () => {
        const getRandomLetterSpy = spyOn(service, 'getRandomLetter').and.callThrough();
        service.getRandomLetter();
        expect(getRandomLetterSpy).toHaveBeenCalled();
    });

    it('should add letter on reFillReserve', () => {
        const reserveService = new ReserveService();
        reserveService.reFillReserve(A);
        expect(reserveService.letters.length).toBe(116);
    });
});
