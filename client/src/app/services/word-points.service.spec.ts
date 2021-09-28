/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { A, B, S } from '@app/constants/constants';
import { WordPointsService } from './word-points.service';

describe('WordPointsService', () => {
    let service: WordPointsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordPointsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should give 21 points for BASS in position from top left edge of board', () => {
        const test = service.pointsWord(
            [B, A, S, S],
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 3, y: 0 },
            ],
        );
        expect(test).toEqual(21);
    });
});
