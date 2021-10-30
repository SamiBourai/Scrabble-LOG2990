/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { GridService } from '@app/services/grid.service';
// describe('GridService', () => {
//     let service: GridService;
//     let ctxStub: CanvasRenderingContext2D;
//     const CANVAS_WIDTH = 600;
//     const CANVAS_HEIGHT = 600;
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
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
//         service.drawBonusBox();

//         expect(spy).toHaveBeenCalled();
//     });

//     it(' drawCentralTile', () => {
//         const spy = spyOn(service.gridContext, 'drawImage');
//         const img = service.drawCentralTile();
//         if (img.onload !== null) img.onload({} as unknown as Event);
//         expect(spy).toHaveBeenCalled();
//     });
// });
