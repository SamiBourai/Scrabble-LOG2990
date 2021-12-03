/* eslint-disable prettier/prettier */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EaselObject } from '@app/classes/easel-object';
import { A, C } from '@app/constants/constants';
import { ShowEaselEndGameService } from './show-easel-end-game.service';

const mockCanvas = {
    getContext: jasmine.createSpy('getContext'),
};
describe('ShowEaselEndGameService', () => {
    let service: ShowEaselEndGameService;
    let ctxStub: CanvasRenderingContext2D;
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 600;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: HTMLCanvasElement, useValue: mockCanvas }],
        });
        service = TestBed.inject(ShowEaselEndGameService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        // eslint-disable-next-line @typescript-eslint/semi
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('drawHand', () => {
        const c = ctxStub;
        const spy = spyOn<any>(c, 'beginPath');
        service['drawHand'](c);
        expect(spy).toHaveBeenCalled();
    });

    it('drawEasel', () => {
        const c = ctxStub;
        const e = new EaselObject(true);
        const img = new Image();
        e.easelLetters = [A, C, C, A, C, A, A];
        img.src = e.easelLetters[0].img;
        const spy1 = spyOn<any>(img, 'onload');
        const spy = spyOn<any>(c, 'drawImage');
        service.drawEasel(e, c);
        expect(spy).not.toHaveBeenCalled();
        expect(spy1).not.toHaveBeenCalled();
    });

    it('drawHands', () => {
        const spy = spyOn<any>(service, 'drawHand');
        service.drawHands();
        expect(spy).toHaveBeenCalled();
    });
});
