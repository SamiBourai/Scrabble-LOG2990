// /* eslint-disable dot-notation */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { MouseButton } from '@app/components/play-area/play-area.component';
// import { EASEL_POSITIONS } from '@app/constants/array-constant';
// import { A } from '@app/constants/constants';
// import { MouseHandelingService } from './mouse-handeling.service';
// describe('MouseHandelingService', () => {
//     let service: MouseHandelingService;
//     let ctxStub: CanvasRenderingContext2D;
//     const CANVAS_WIDTH = 600;
//     const CANVAS_HEIGHT = 600;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//         });

//         service = TestBed.inject(MouseHandelingService);
//         service.previousClick.x = -1;
//         service.previousClick.y = -1;
//         service.mousePosition.x = -1;
//         service.mousePosition.y = -1;
//         service.lettersToSwapByClick = [];

//         EASEL_POSITIONS[0].isClicked = false;
//         jasmine.getEnv().allowRespy(true);
//         ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
//         service['tempCanvasService'].easelContext = ctxStub;
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('placeTempWord', () => {
//         service['tempCanvasService'].tempWord = 'abc';
//         const spy = spyOn(service, 'resetSteps');
//         service.placeTempWord();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('deletePreviousLetter', () => {
//         service['tempCanvasService'].tempWord = 'abc';
//         const spy = spyOn<any>(service['tempCanvasService'], 'removeLastLetter');
//         service.deletPreviousLetter();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('keyBoardEntryManage', () => {
//         const str = 'abc';
//         service.firstBorderLetter = true;
//         const spy = spyOn<any>(service['easelLogic'], 'tempGetLetter');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'placeTempLetter');
//         service.keyBoardEntryManage(str);
//         expect(spy).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('keyBoardEntryManage 77', () => {
//         const str = 'abc';
//         service.firstBorderLetter = true;
//         service['tempCanvasService'].previousTile = { x: 15, y: 15 };
//         service.keyBoardEntryManage(str);
//         expect(service.firstBorderLetter).toBeFalse();
//     });

//     it(' mouseHitDetect', () => {
//         const mouseEvent = { offsetX: 54, offsetY: 30, button: MouseButton.Left } as MouseEvent;
//         spyOn(service['userService'], 'isPlayerTurn').and.returnValue(true);
//         const spy1 = spyOn(service, 'resetSteps');
//         const spy2 = spyOn(service['tempCanvasService'], 'drawTileFocus');
//         const spy = spyOn(Math, 'ceil');
//         service.mouseHitDetect(mouseEvent);
//         expect(spy1).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//         expect(spy).toHaveBeenCalled();
//     });

//     it(' mouseHitDetect', () => {
//         service.mousePosition.x = 1;
//         service.previousClick.y = 1;
//         service.mousePosition.y = 1;
//         service.previousClick.y = 1;
//         const mouseEvent = { offsetX: 54, offsetY: 30, button: MouseButton.Left } as MouseEvent;
//         spyOn(service['userService'], 'isPlayerTurn').and.returnValue(true);
//         const spy1 = spyOn(service, 'resetSteps');
//         const spy2 = spyOn(service['tempCanvasService'], 'drawTileFocus');
//         const spy = spyOn(Math, 'ceil');
//         service.mouseHitDetect(mouseEvent);
//         expect(spy1).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('mouseHitDetect else', () => {
//         const mouseEvent2 = { offsetX: 54, offsetY: 30, button: MouseButton.Right } as MouseEvent;
//         const spy = spyOn(service, 'resetSteps');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'resetArrow');
//         service.mouseHitDetect(mouseEvent2);

//         expect(spy).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('resetSteps', () => {
//         spyOn<any>(service['userService'].getPlayerEasel(), 'resetTempIndex');
//         spyOn<any>(service['tempCanvasService'], 'clearLayers');
//         spyOn<any>(service['easelLogic'], 'placeEaselLetters');
//         service.resetSteps();
//         const x = 2;
//         expect(x).toBe(2);
//     });

//     it('easelClicked', () => {
//         service.lastWasRightClick = false;
//         EASEL_POSITIONS[0].isClicked = false;
//         const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
//         spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//         spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
//         spyOn<any>(service, 'resetSteps');
//         spyOn<any>(service['tempCanvasService'], 'clearLayers');
//         // spyOn<any>(service['easelLogic'], 'placeEaselLetters ');

//         const spy = spyOn<any>(service, 'cancelByClick');
//         const spy1 = spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
//         service.easelClicked(mouseEvent);
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//     });

//     it('easelClicked 2', () => {
//         EASEL_POSITIONS[0].isClicked = true;
//         const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
//         spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//         spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
//         spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
//         spyOn<any>(service, 'resetSteps');
//         spyOn<any>(service['tempCanvasService'], 'clearLayers');
//         const spy = spyOn<any>(service, 'cancelByClick');
//         service.easelClicked(mouseEvent);
//         expect(spy).toHaveBeenCalled();
//         EASEL_POSITIONS[0].isClicked = false;
//     });

//     it('easelClicked 3', () => {
//         service.lastWasRightClick = true;
//         const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Right, x: 100, y: 100 } as MouseEvent;
//         spyOn<any>(service['userService'], 'isPlayerTurn').and.returnValue(true);
//         spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//         spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
//         spyOn<any>(service, 'cancelByClick');
//         spyOn<any>(service['tempCanvasService'], 'unclickLetter');
//         spyOn<any>(service, 'resetSteps');
//         spyOn<any>(service['tempCanvasService'], 'clearLayers');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'setLetterClicked');
//         service.easelClicked(mouseEvent);
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('easelClicked 4', () => {
//         EASEL_POSITIONS[0].isClicked = true;
//         service.lastWasRightClick = true;
//         const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Right, x: 100, y: 100 } as MouseEvent;
//         spyOn<any>(service['userService'], 'isPlayerTurn').and.returnValue(true);
//         spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//         spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
//         spyOn<any>(service['tempCanvasService'], 'setLetterClicked');
//         spyOn<any>(service, 'resetSteps');
//         spyOn<any>(service['tempCanvasService'], 'clearLayers');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'unclickLetter');
//         service.easelClicked(mouseEvent);
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('easelClicked else', () => {
//         service.lastWasRightClick = false;
//         EASEL_POSITIONS[0].isClicked = false;
//         const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Left, x: 100, y: 100 } as MouseEvent;
//         spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//         spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(false);
//         const spy = spyOn<any>(service, 'cancelByClick');
//         service.easelClicked(mouseEvent);
//         expect(spy).toHaveBeenCalled();
//     });

//     // it('easelClicked else if', () => {
//     //     service.lastWasRightClick = false;
//     //     EASEL_POSITIONS[0].isClicked = false;
//     //     const mouseEvent = { offsetX: 100, offsetY: 300, button: MouseButton.Right, x: 100, y: 100 } as MouseEvent;
//     //     spyOn<any>(service['easelLogic'], 'showCoords').and.returnValue({ x: 300, y: 800 });
//     //     spyOn<any>(service['easelLogic'], 'isBetween').and.returnValue(true);
//     //     spyOn<any>(service['userService'], 'isPlayerTurn').and.returnValue(true);
//     //     spyOn<any>(service, 'resetSteps');
//     //     spyOn<any>(service['tempCanvasService'], 'clearLayers');
//     //     const spy = spyOn<any>(service, 'cancelByClick');
//     //     const spy2 = spyOn<any>(service['userService'], 'getPlayerEasel');
//     //     service.easelClicked(mouseEvent);
//     //     expect(spy).toHaveBeenCalled();
//     //     expect(spy2).toHaveBeenCalled();
//     // });

//     it('swapByClick', () => {
//         service.lettersToSwapByClick = [A];
//         const spy = spyOn(service.commandObs, 'next');
//         spyOn<any>(service, 'cancelByClick');
//         service.swapByClick();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('cancelByClick', () => {
//         service.lettersToSwapByClick = [A];
//         // let x = true;
//         const spy = spyOn<any>(service, 'allIsClickedToFalse');
//         spyOn<any>(service['tempCanvasService'].easelContext, 'clearRect');
//         service.cancelByClick();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('isLettersArrayEmpty', () => {
//         service.lettersToSwapByClick = [A];

//         expect(service.isLettersArrayEmpty()).toBe(false);
//     });

//     it('isLettersArrayEmpty length = 0', () => {
//         service.lettersToSwapByClick = [];

//         expect(service.isLettersArrayEmpty()).toBe(true);
//     });

//     it('moveLeft', () => {
//         service.lastWasRightClick = false;
//         const spy = spyOn<any>(service['easelLogic'], 'moveLeft');
//         const spy1 = spyOn<any>(service, 'cancelByClick');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
//         service.moveLeft();
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('moveRight', () => {
//         service.lastWasRightClick = false;
//         const spy = spyOn<any>(service['easelLogic'], 'moveRight');
//         const spy1 = spyOn<any>(service, 'cancelByClick');
//         const spy2 = spyOn<any>(service['tempCanvasService'], 'letterEaselToMove');
//         service.moveRight();
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//     });

//     it('clearAll', () => {
//         const spy = spyOn<any>(service, 'resetSteps');
//         const spy1 = spyOn<any>(service, 'cancelByClick');
//         const spy3 = spyOn(service['tempCanvasService'].easelContext, 'clearRect');
//         service.clearAll();
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//         expect(spy3).toHaveBeenCalled();
//     });

//     it('allIsClickedToFalse', () => {
//         let x = false;
//         service['allIsClickedToFalse']();
//         for (const i of EASEL_POSITIONS) {
//             if (i.isClicked === true) x = true;
//         }
//         expect(x).toBeFalse();
//     });
// });
