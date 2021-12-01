// /* eslint-disable prettier/prettier */
// /* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// import { HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { MessageServer } from '@app/classes/message-server';
// import { GridService } from '@app/services/grid.service';
// import { of } from 'rxjs';
// describe('GridService', () => {
//     let service: GridService;
//     let ctxStub: CanvasRenderingContext2D;
//     const CANVAS_WIDTH = 600;
//     const CANVAS_HEIGHT = 600;
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//         });
//         service = TestBed.inject(GridService);
//         ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
//         service.gridContext = ctxStub;
//     });
//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });
//     it(' width should return the width of the grid canvas', () => {
//         expect(service.width).toEqual(800);
//     });
//     it(' height should return the height of the grid canvas', () => {
//         expect(service.height).toEqual(800);
//     });

//     it(' drawGrid should color pixels on the canvas', () => {
//         let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const beforeSize = imageData.filter((x) => x !== 0).length;
//         service.drawGrid();
//         imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
//         const afterSize = imageData.filter((x) => x !== 0).length;
//         expect(afterSize).toBeGreaterThan(beforeSize);
//     });

//     it(' drawHand', () => {
//         const spy = spyOn(service.gridContext, 'beginPath');
//         service.drawHand();

//         expect(spy).toHaveBeenCalled();
//     });

//     it(' drawCoor', () => {
//         const spy = spyOn(service.gridContext, 'fillText');
//         service.drawCoor();

//         expect(spy).toHaveBeenCalled();
//     });

//     it(' drawBonus', () => {
//         const spy = spyOn(service.gridContext, 'fillRect');
//         service['drawBonusBox']();

//         expect(spy).toHaveBeenCalled();
//     });

//     it(' drawCentralTile', () => {
//         const spy = spyOn(service.gridContext, 'drawImage');
//         const img = service.drawCentralTile();
//         if (img.onload !== null) img.onload({} as unknown as Event);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('randomizeBonuses', () => {
//         const spy = spyOn<any>(Math, 'random');
//         service.randomizeBonuses();
//         expect(spy).toHaveBeenCalled();
//         service.resetBonusesToDefault();
//     });
//     it('drawBox', () => {
//         const data: MessageServer = {
//             gameName: 'game000111',
//             gameStarted: false,
//             arrayOfBonusBox: [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]],
//         };
//         const isBonusBox = true;
//         const mode = 'joinMultiplayerGame';
//         const gameM = 'game1';
//         spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(gameM);
//         const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
//         const spy1 = spyOn<any>(service, 'drawBonusBox');
//         service.drawBox(isBonusBox, mode, gameM);
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//         expect(service.arrayOfBonusBox).toEqual(service.arrayOfBonusBox);
//     });

//     it('drawBox', () => {
//         const data: MessageServer = {
//             gameName: 'game000111',
//             gameStarted: false,
//         };
//         const isBonusBox = true;
//         const mode = 'joinMultiplayerGame';
//         const gameM = 'game1';
//         spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(gameM);
//         const spy = spyOn<any>(service['socketManagementService'], 'listen').and.returnValue(of(data));
//         const spy1 = spyOn<any>(service, 'drawBonusBox');
//         service.drawBox(isBonusBox, mode, gameM);
//         expect(spy).toHaveBeenCalled();
//         expect(spy1).toHaveBeenCalled();
//         expect(service.arrayOfBonusBox).toEqual(service.arrayOfBonusBox);
//     });

//     it('drawBox else', () => {
//         const b = true;
//         const mode = 'solo';
//         const gameM = 'game1';
//         const spy = spyOn(service, 'randomizeBonuses');
//         spyOn<any>(service, 'drawBonusBox');
//         service.drawBox(b, mode, gameM);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('drawBox else if', () => {
//         const data: MessageServer = {
//             gameName: 'game000111',
//             gameStarted: false,
//             arrayOfBonusBox: [[{ x: 0, y: 0 }], [{ x: 1, y: 1 }]],
//         };
//         const b = true;
//         const mode = 'createMultiplayerGame';
//         const gameM = 'game1';
//         const spy = spyOn(service, 'randomizeBonuses');
//         const spy2 = spyOn<any>(service, 'drawBonusBox');
//         const spy3 = spyOn<any>(service['socketManagementService'], 'emit').and.returnValue(of(data));

//         service.drawBox(b, mode, gameM);
//         expect(spy).toHaveBeenCalled();
//         expect(spy2).toHaveBeenCalled();
//         expect(spy3).toHaveBeenCalled();
//     });

//     it('drawBox else 2', () => {
//         const b = false;
//         const mode = 'solo';
//         const gameM = 'game1';
//         const spy = spyOn<any>(service, 'drawBonusBox');
//         service.drawBox(b, mode, gameM);
//         expect(spy).toHaveBeenCalled();
//     });

//     // it('drawBonus real',()=>{
//     //     const v = {x:2,y:2};
//     //     const str = 'abc';
//     //     const spy = spyOn(service.gridContext,'fillRect');

//     //     service['drawBonus'](v,str);
//     //     expect(spy).toHaveBeenCalled();
//     // });
// });
