/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
// import { TestBed } from '@angular/core/testing';
// import { A } from '@app/constants/constants';
// import { ReserveService } from './reserve.service';

// describe('ReserveService', () => {
//     let service: ReserveService;

//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(ReserveService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('should return a letter randomly, and decrement reserve size', () => {
//         spyOn(Math, 'random').and.returnValue(1);
//         service.getRandomLetter();
//         expect(service.reserveSize).toEqual(114);
//     });

//     it('response of the observable should return 100 (the size of the reserve)', () => {
//         service.sizeObs.next(100);
//         service.reserveSize = 100;
//         service.size.subscribe((number) => {
//             expect(service.reserveSize).toBe(number);
//         });
//     });
//     it('reFillReserve should push letter passed in parametter in array of letter, and increment reserveSize', () => {
//         service.reFillReserve(A);

//         expect(service.reserveSize).toBe(116);
//     });

//     it('should return true, because reserve is empty', () => {
//         // eslint-disable-next-line @typescript-eslint/prefer-for-of
//         for (let i = 0; i < service.letters.length; i++) {
//             service.letters.pop();
//         }
//         service.isReserveEmpty();
//         expect(service.reserveSize).not.toEqual(0);
//     });
// });
