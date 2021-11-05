/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { C, H_ARROW, V_ARROW } from '@app/constants/constants';
import { TemporaryCanvasService } from './temporary-canvas.service';

describe('TemporaryCanvasService', () => {
    let service: TemporaryCanvasService;
    let ctxStub: CanvasRenderingContext2D;
    const CANVAS_WIDTH = 600;
    const CANVAS_HEIGHT = 600;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TemporaryCanvasService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.tempContext = ctxStub;
        service.focusContext = ctxStub;
        service.easelContext = ctxStub;
        jasmine.getEnv().allowRespy(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('decrementDirection', () => {
        service['direction'] = H_ARROW;
        service.previousTile.x = 13;
        service.decrementDirection();
        expect(service.previousTile.x).toBe(12);
    });

    it('decrementDirection else', () => {
        service['direction'] = V_ARROW;
        // service.previousTile.x = 18;
        service.previousTile.y = 13;
        service.decrementDirection();
        expect(service.previousTile.y).toBe(12);
    });

    it('decrementDirection null', () => {
        service['direction'] = 'abx';
        service.previousTile.x = 18;
        service.previousTile.y = 13;
        service.decrementDirection();
        expect(service.previousTile).toEqual({ x: 18, y: 13 });
    });

    it('incrementDiretion', () => {
        service['direction'] = H_ARROW;
        service.previousTile.x = 13;
        service.incrementDirection();
        expect(service.previousTile.x).toBe(14);
    });

    it('incrementDiretion else', () => {
        service['direction'] = V_ARROW;
        service.previousTile.y = 13;
        service.incrementDirection();
        expect(service.previousTile.y).toBe(14);
    });

    it('incrementDirection null', () => {
        service['direction'] = 'abx';
        service.previousTile.x = 18;
        service.previousTile.y = 18;
        service.incrementDirection();
        expect(service.previousTile).toEqual({ x: 18, y: 18 });
    });

    it('resetArrow', () => {
        service['direction'] = 'k';
        service.resetArrow();
        expect(service['direction']).toBe(H_ARROW);
    });

    it('switchArrow', () => {
        service['direction'] = H_ARROW;
        service.switchArrow();
        expect(service['direction']).toBe(V_ARROW);
    });
    it('switchArrow false', () => {
        service['direction'] = 'g';
        service.switchArrow();
        expect(service['direction']).toBe(H_ARROW);
    });

    it('getcommandDirection', () => {
        service['direction'] = H_ARROW;
        expect(service.getCommandDirection()).toBe('h');
    });

    it('getcommandDirection else', () => {
        service['direction'] = 'f';
        expect(service.getCommandDirection()).toBe('v');
    });

    it('letterEaselToMove', () => {
        const index = 5;
        const spy = spyOn<any>(service.easelContext, 'beginPath').and.callThrough();
        service.letterEaselToMove(index);
        expect(spy).toHaveBeenCalled();
    });

    it('setLetterClicked', () => {
        const index = 3;
        const spy = spyOn(service.easelContext, 'beginPath').and.callThrough();
        service.setLetterClicked(index);
        expect(spy).toHaveBeenCalled();
    });

    it('clearLayers', () => {
        const spy = spyOn(service.focusContext, 'clearRect').and.callThrough();
        service.clearLayers();
        expect(spy).toHaveBeenCalled();
    });

    it('drawTileFocus', () => {
        const pos: Vec2 = { x: 2, y: 4 };
        const s = 'bold 40px system-ui';
        service.focusContext.font = s;
        spyOn<any>(service, 'findNextEmptyTile').and.returnValue(true);
        const spy = spyOn<any>(service, 'drawArrow');
        service.drawTileFocus(pos);
        expect(spy).toHaveBeenCalled();
    });

    it('drawTileFocus if', () => {
        const pos: Vec2 = { x: 2, y: 4 };
        const s = 'bold 40px system-ui';
        service.focusContext.font = s;
        spyOn<any>(service, 'findNextEmptyTile').and.returnValue(false);
        const spy = spyOn<any>(service, 'drawArrow');
        service.drawTileFocus(pos);
        expect(spy).not.toHaveBeenCalled();
    });

    it('removeLastLetter', () => {
        // spyOn(service.tempContext, 'clearRect').and.callThrough();
        service.previousTile = { x: 10, y: 10 };
        const spy1 = spyOn<any>(service.tempContext, 'clearRect');
        service.removeLastLetter();
        expect(spy1).toHaveBeenCalled();
        service.previousTile = { x: -1, y: -1 };
    });

    it('removeLastLetter while', () => {
        spyOn(service['letterService'], 'tileIsEmpty').and.returnValue(false);
        const spy = spyOn(service, 'drawTileFocus');
        service.removeLastLetter();
        expect(spy).toHaveBeenCalled();
    });

    it('findNextEmptyTile', () => {
        spyOn(service['letterService'], 'tileIsEmpty').and.returnValue(false);
        service.previousTile = { x: 15, y: 15 };
        const a = service.findNextEmptyTile();
        expect(a).toBe(false);
    });

    it('findNextEmptyTile', () => {
        spyOn(service['letterService'], 'tileIsEmpty').and.returnValue(false);
        service.previousTile = { x: 12, y: 11 };
        const x = 2;
        service.findNextEmptyTile();
        expect(x).toBe(2);
    });
    it('findNextEmptyTile if', () => {
        spyOn(service['letterService'], 'tileIsEmpty').and.returnValue(true);
        service.previousTile.x = 15;
        const s = service.findNextEmptyTile();
        expect(s).toBeTrue();
    });

    it('addletterFromGrid', () => {
        const letter = 'c';
        const pos: Vec2 = { x: 2, y: 4 };
        service.previousTile = pos;
        const spy = spyOn<any>(service, 'drawRedFocus');
        const spy1 = spyOn(service, 'incrementDirection');
        service.addLetterFromGrid(letter);
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
    });

    it('placetempLetter', () => {
        const letter: Letter = C;
        const pos: Vec2 = { x: 2, y: 4 };
        service.previousTile = pos;
        const spy = spyOn<any>(service, 'drawRedFocus');
        service.placeTempLetter(letter);
        expect(spy).toHaveBeenCalled();
    });

    it('placetempLetter if', () => {
        const letter: Letter = C;
        const pos: Vec2 = { x: 2, y: 4 };
        service.previousTile = pos;
        spyOn<any>(service, 'findNextEmptyTile').and.returnValue(false);
        const spy = spyOn<any>(service.tempContext, 'drawImage');
        service.placeTempLetter(letter);
        expect(spy).not.toHaveBeenCalled();
    });

    it('previousTile', () => {
        const letter: Letter = C;
        service.previousTile.x = 5;
        service.previousTile.y = 5;

        const spy = spyOn<any>(service, 'drawTileFocus');
        service.placeTempLetter(letter);
        expect(spy).toHaveBeenCalled();
    });

    it('unclickLetter', () => {
        const index = 4;

        const spy = spyOn(service.easelContext, 'clearRect').and.callThrough();
        service.unclickLetter(index);
        expect(spy).toHaveBeenCalled();
    });

    it('drawArrow false', () => {
        service['direction'] = 'abc';
        const pos: Vec2 = { x: 2, y: 4 };
        const spy = spyOn<any>(service.focusContext, 'fillText');
        service['drawArrow'](pos);
        expect(spy).toHaveBeenCalled();
    });
});
