/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { A, B, E, L, NOT_A_LETTER, R, T, U } from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';

describe('EaselLogiscticsService', () => {
    let service: EaselLogiscticsService;
    let reserveService: jasmine.SpyObj<ReserveService>;
    beforeEach(() => {
        reserveService = jasmine.createSpyObj('ReserveService', ['getRandomLetter']);
        TestBed.configureTestingModule({});

        service = TestBed.inject(EaselLogiscticsService);
        const width = 15;
        const height = 25;
        // eslint-disable-next-line -- createCanvas is private and we need access for the test
        service.gridContext = CanvasTestHelper.createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;
        reserveService = TestBed.inject(ReserveService) as jasmine.SpyObj<ReserveService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    // test placeEaselLetters
    it('test place letter, Should set all the element of occupiedPos to true', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];
        service.placeEaselLetters();
        for (let i = 0; i < 6; i++) {
            expect(service.occupiedPos[i]).toEqual(false);
        }
    });
    // placeEaselLetter()
    it('place letter in Easel should call drawImag() n time, where n=sizeOfEaselLetter n=7', (done) => {
        const drawImageSpy = spyOn(service.gridContext, 'drawImage');
        service.easelLetters = [
            { index: 0, letters: B },
            { index: 1, letters: R },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];

        service.placeEaselLetters();
        setTimeout(() => {
            expect(drawImageSpy).toHaveBeenCalledTimes(7);
            done();
        }, 1000);
    });

    // test getLetterFromEasel
    it('should return NOT_A_LATTEE, because easel is all empty', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];
        expect(service.getLetterFromEasel(0)).toEqual(NOT_A_LETTER);
    });

    it('should return letter from easel and call clearRect', () => {
        service.occupiedPos = [true, true, true, true, true, true, true];
        service.easelLetters = [
            { index: 0, letters: B },
            { index: 1, letters: R },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];
        const clearRectSpy = spyOn(service.gridContext, 'clearRect').and.callThrough();
        service.getLetterFromEasel(0);
        expect(service.occupiedPos[0]).toBeFalse();
        expect(clearRectSpy).toHaveBeenCalled();
    });

    // test wordOnEasel()

    it('test word (Abattre) in Easel, those letters are not in the Easel, wordInEasel expected to return false', () => {
        service.foundLetter = [false, false, false, false, false, false, false];
        service.easelLetters = [
            { index: 0, letters: B },
            { index: 1, letters: R },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];
        expect(service.wordInEasel('abattre')).toEqual(false);
    });

    it('refillEasel should place Letter in the Easel and Call plceEaselLetter()', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];

        reserveService.reserveSize = 115;

        const spyGetRandomLetter = spyOn<any>(reserveService, 'getRandomLetter').and.callFake(() => {
            return A;
        });
        const spyOnPlaceEaselLetter = spyOn<any>(service, 'placeEaselLetters');
        service.refillEasel();

        expect(spyGetRandomLetter).toHaveBeenCalledTimes(7);

        expect(service.easelLetters[0].letters.charac).toEqual(A.charac);
        expect(spyOnPlaceEaselLetter).toHaveBeenCalled();
    });

    it('refillEasel should return and set EaselSize 0', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];

        service.easelLetters = [
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
        ];
        reserveService.reserveSize = 0;

        service.refillEasel();

        expect(service.easelSize).toEqual(0);
    });
    it('refillEasel should return and set EaselSize 0 because reserveSize is under 0', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];

        service.easelLetters = [
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
            { index: 0, letters: A },
        ];
        reserveService.reserveSize = -5;

        service.refillEasel();

        expect(service.easelSize).toEqual(0);
    });

    it('refillEasel should call placeEaselLetters()', () => {
        service.occupiedPos = [true, true, true, true, true, true, true];

        const spyOnPlaceEaselLetter = spyOn<any>(service, 'placeEaselLetters');
        service.refillEasel();

        expect(service.easelSize).toEqual(0);
        expect(spyOnPlaceEaselLetter).toHaveBeenCalled();
    });

    it('Should return false on isEaselEmpty', () => {
        service.occupiedPos = [true, true, true, true, true, true, true];
        expect(service.isEaselEmpty()).toBeFalse();
    });

    it('Should return true on isEaselEmpty', () => {
        service.occupiedPos = [false, false, false, false, false, false, false];
        expect(service.isEaselEmpty()).toBeTrue();
    });
});
