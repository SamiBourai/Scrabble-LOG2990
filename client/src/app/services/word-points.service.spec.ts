// /* eslint-disable dot-notation */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { A, B, S } from '@app/constants/constants';
import { WordPointsService } from './word-points.service';

describe('WordPointsService', () => {
    let service: WordPointsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordPointsService);
        service.usedBonus = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('we detect a REDBOX', () => {
        const test = service.pointsWord(
            [B, A, S],
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
            ],
            false,
        );

        expect(test).toEqual(15);
     });

    it('we detect a PINKBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
            ],
            false,
        );
        expect(test).toEqual(12);
    });

    it('we detect a AZURBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 0, y: 3 },
                { x: 1, y: 3 },
                { x: 2, y: 3 },
                { x: 3, y: 3 },
            ],
            false,
        );
        expect(test).toEqual(18);
    });

    it('we detect a BLUEBOX', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 5, y: 1 },
                { x: 6, y: 1 },
                { x: 7, y: 1 },
                { x: 8, y: 1 },
            ],
            false,
        );
        expect(test).toEqual(12);
    });

//     it('a bonus is used', () => {
//         service.usedBonus.push({ x: 0, y: 0 });
//         const test = { x: 0, y: 0 };

//         const isUsed = service['isUsedBonus'](test);
//         expect(isUsed).toBeTrue();
//     });
 });
