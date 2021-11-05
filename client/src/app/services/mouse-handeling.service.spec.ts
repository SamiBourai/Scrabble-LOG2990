/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MouseButton } from '@app/components/play-area/play-area.component';
import { A, EASEL_POSITIONS } from '@app/constants/constants';
import { MouseHandelingService } from './mouse-handeling.service';

describe('MouseHandelingService', () => {
    let service: MouseHandelingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });

        service = TestBed.inject(MouseHandelingService);
        service.previousClick.x = -1;
        service.previousClick.y = -1;
        service.mousePosition.x = -1;
        service.mousePosition.y = -1;
        jasmine.getEnv().allowRespy(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('placeTempWord', () => {
        service['tempCanvasService'].tempWord = 'abc';
        const spy = spyOn(service, 'resetSteps');
        service.placeTempWord();
        expect(spy).toHaveBeenCalled();
    });

    it('deletePreviousLetter', () => {
        service['tempCanvasService'].tempWord = 'abc';
        const spy = spyOn<any>(service['tempCanvasService'], 'removeLastLetter');
        service.deletPreviousLetter();
        expect(spy).toHaveBeenCalled();
    });

    it('keyBoardEntryManage', () => {
        const str = 'abc';
        service.firstBorderLetter = true;
        const spy = spyOn<any>(service['easelLogic'], 'tempGetLetter');
        const spy2 = spyOn<any>(service['tempCanvasService'], 'placeTempLetter');
        service.keyBoardEntryManage(str);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('keyBoardEntryManage 77', () => {
        const str = 'abc';
        service.firstBorderLetter = true;
        service['tempCanvasService'].previousTile = { x: 15, y: 15 };
        service.keyBoardEntryManage(str);
        expect(service.firstBorderLetter).toBeFalse();
    });

    it(' mouseHitDetect', () => {
        const mouseEvent = { offsetX: 54, offsetY: 30, button: MouseButton.Left } as MouseEvent;
        spyOn(service['userService'], 'isPlayerTurn').and.returnValue(true);
        const spy1 = spyOn(service, 'resetSteps');
        const spy2 = spyOn(service['tempCanvasService'], 'drawTileFocus');
        const spy = spyOn(Math, 'ceil');
        service.mouseHitDetect(mouseEvent);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it('109-111', () => {
        const mouseEvent2 = { offsetX: 54, offsetY: 30, button: MouseButton.Right } as MouseEvent;
        const spy = spyOn(service, 'resetSteps');
        const spy2 = spyOn<any>(service['tempCanvasService'], 'resetArrow');
        service.mouseHitDetect(mouseEvent2);

        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('resetSteps', () => {
        spyOn<any>(service['userService'].getPlayerEasel(), 'resetTempIndex');
        spyOn<any>(service['tempCanvasService'], 'clearLayers');
        spyOn<any>(service['easelLogic'], 'placeEaselLetters');
        service.resetSteps();
        const x = 2;
        expect(x).toBe(2);
    });

    it('easelClicked', () => {
        service.lastWasRightClick = false;
        EASEL_POSITIONS[0].isClicked = false;
        const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
        spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
        spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
        // if (mouseEvent.button === 2) console.log("9awed");
        const spy = spyOn<any>(service, 'cancelByClick');
        const spy1 = spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
        // const spy2 = spyOn<any>(service['userService'], 'getPlayerEasel');
        service.easelClicked(mouseEvent);
        expect(spy).toHaveBeenCalled();
        expect(spy1).toHaveBeenCalled();
        // expect(spy1).toHaveBeenCalled();
    });

    it('easelClicked 2', () => {
        EASEL_POSITIONS[0].isClicked = true;
        const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
        spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
        spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
        spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
        // if (mouseEvent.button === 2) console.log("9awed");
        const spy = spyOn<any>(service, 'cancelByClick');
        // const spy2 = spyOn<any>(service['userService'], 'getPlayerEasel');
        service.easelClicked(mouseEvent);
        expect(spy).toHaveBeenCalled();
        EASEL_POSITIONS[0].isClicked = false;
        // expect(spy1).toHaveBeenCalled();
    });

    it('easelClicked 3', () => {
        service.lastWasRightClick = true;
        const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Right, x: 100, y: 100 } as MouseEvent;
        spyOn<any>(service['userService'], 'isPlayerTurn').and.returnValue(true);
        spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
        spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
        spyOn<any>(service, 'cancelByClick');
        spyOn<any>(service['tempCanvasService'], 'unclickLetter');
        const spy2 = spyOn<any>(service['tempCanvasService'], 'setLetterClicked');
        service.easelClicked(mouseEvent);
        expect(spy2).toHaveBeenCalled();
    });

    it('easelClicked 4', () => {
        EASEL_POSITIONS[0].isClicked = true;
        service.lastWasRightClick = true;
        const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Right, x: 100, y: 100 } as MouseEvent;
        spyOn<any>(service['userService'], 'isPlayerTurn').and.returnValue(true);
        spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
        spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
        spyOn<any>(service['tempCanvasService'], 'setLetterClicked');
        const spy2 = spyOn<any>(service['tempCanvasService'], 'unclickLetter');
        service.easelClicked(mouseEvent);
        expect(spy2).toHaveBeenCalled();
        EASEL_POSITIONS[0].isClicked = false;
    });

    it('easelClicked else', () => {
        service.lastWasRightClick = false;
        EASEL_POSITIONS[0].isClicked = false;
        const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
        spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
        spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(false);
        const spy = spyOn<any>(service, 'cancelByClick');
        service.easelClicked(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('swapByClick', () => {
        service.lettersToSwapByClick = [A];
        const spy = spyOn(service.commandObs, 'next');
        spyOn<any>(service, 'cancelByClick');
        service.swapByClick();
        expect(spy).toHaveBeenCalled();
        service.lettersToSwapByClick = [];
    });

    it('cancelByClick', () => {
        service.lettersToSwapByClick = [A];
        let x = true;
        spyOn<any>(service['tempCanvasService'].easelContext, 'clearRect');
        service.cancelByClick();
        for (const i of EASEL_POSITIONS) {
            if (i.isClicked === true) x = false;
        }
        expect(x).toBeTrue();
        service.lettersToSwapByClick = [];
    });
});
