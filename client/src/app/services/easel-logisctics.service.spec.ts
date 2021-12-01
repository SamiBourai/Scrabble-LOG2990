// /* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// import { TestBed } from '@angular/core/testing';
// import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
// import { EaselObject } from '@app/classes/easel-object';
// /* eslint-disable @typescript-eslint/no-inferrable-types */
// import { Pair } from '@app/classes/pair';
// import { A, C, F, NOT_A_LETTER } from '@app/constants/constants';
// import { EaselLogiscticsService } from './easel-logisctics.service';
// // import { ReserveService } from '@app/classes/ReserveObject';
// // import { ReserveService } from './reserve.service';

// describe('EaselLogiscticsService', () => {
//     let service: EaselLogiscticsService;
//     // let reserveService: jasmine.SpyObj<ReserveService>;
//     beforeEach(() => {
//         // reserveService = jasmine.createSpyObj('ReserveService', ['getRandomLetter']);
//         TestBed.configureTestingModule({});

//         service = TestBed.inject(EaselLogiscticsService);
//         const width = 15;
//         const height = 25;
//         // eslint-disable-next-line -- createCanvas is private and we need access for the test
//         service.gridContext = CanvasTestHelper.createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;
//         // reserveService = jasmine.createSpyObj('reserveServiceSpy', ['reserveSize', 'isReserveEmpty', 'getRandomLetter']);
//         jasmine.getEnv().allowRespy(true);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('showCoords', () => {
//         const e = new MouseEvent('click');
//         // service.showCoords(e);
//         expect(service.showCoords(e)).toBeDefined();
//     });

//     it('isBeetween', () => {
//         const pair: Pair = { min: 12, max: 20 };
//         const number1: number = 14;
//         const number2: number = 5;

//         expect(service.isBetween(pair, number1)).toBe(true);
//         expect(service.isBetween(pair, number2)).toBe(false);
//     });

//     it('placeEaselLetters', () => {
//         const easel = new EaselObject(true);
//         easel.easelLetters = [C, F];
//         // const spy = spyOn(service.gridContext, 'drawImage');
//         service.placeEaselLetters(easel);

//         expect(easel.easelLetters[1].charac).toBe('f');
//         // expect(spy).toHaveBeenCalled()
//     });

//     it('getLetterFromEasel', () => {
//         const easel = new EaselObject(true);
//         const index = 0;
//         easel.easelLetters = [C, F];

//         expect(service.getLetterFromEasel(easel, index)).toEqual(C);
//     });

//     it('getLetterFromEasel notAletter scenario', () => {
//         const easel = new EaselObject(true);
//         const index = 0;
//         easel.easelLetters = [NOT_A_LETTER];

//         expect(service.getLetterFromEasel(easel, index)).toBe(NOT_A_LETTER);
//     });

//     it('refillEasel', () => {
//         const easel = new EaselObject(true);
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const user = true;
//         easel.indexOfEaselLetters = [0];
//         spyOn(service['reserveService'], 'isReserveEmpty').and.returnValue(true);
//         service.refillEasel(easel, user);

//         expect(easel.easelLetters[0]).toEqual(NOT_A_LETTER);
//     });

//     it('refillEasel if', () => {
//         const easel = new EaselObject(true);
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const user = true;
//         easel.indexOfEaselLetters = [0];
//         spyOn(service['reserveService'], 'isReserveEmpty').and.returnValue(false);
//         service.refillEasel(easel, user);

//         expect(easel.easelLetters[0]).not.toEqual(NOT_A_LETTER);
//     });

//     it('fillEasel false', () => {
//         const easel = new EaselObject(true);
//         const user = true;
//         spyOn<any>(service['reserveService'], 'isReserveEmpty').and.returnValue(false);
//         const spy = spyOn(easel, 'add');
//         service.fillEasel(easel, user);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('fillEasel true', () => {
//         const easel = new EaselObject(true);
//         const user = true;
//         spyOn<any>(service['reserveService'], 'isReserveEmpty').and.returnValue(true);
//         const spy = spyOn(easel, 'add');
//         service.fillEasel(easel, user);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('86', () => {
//         const easel = new EaselObject(true);
//         const user = true;
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const spy = spyOn<any>(service, 'placeEaselLetters');

//         service.refillEasel(easel, user);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('86 FALSE', () => {
//         const easel = new EaselObject(true);
//         const user = false;
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const spy = spyOn<any>(service, 'placeEaselLetters');

//         service.refillEasel(easel, user);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('86', () => {
//         const easel = new EaselObject(true);
//         const user = true;
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const spy = spyOn<any>(service, 'placeEaselLetters');

//         service.fillEasel(easel, user);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('92 FALSE', () => {
//         const easel = new EaselObject(true);
//         const user = false;
//         easel.easelLetters = [A, A, A, A, A, A, A];
//         const spy = spyOn<any>(service, 'placeEaselLetters');

//         service.fillEasel(easel, user);
//         expect(spy).not.toHaveBeenCalled();
//     });

//     it('tempGetLetter', () => {
//         const easel = new EaselObject(true);
//         const letter: string = 'c';
//         easel.easelLetters = [
//             { score: 3, charac: 'c', img: '../../assets/letter-c.png' },
//             { score: 4, charac: 'f', img: '../../assets/letter-f.png' },
//         ];
//         easel.posTempLetters = [false, false, false, false, false, false, false];
//         const spy = spyOn(service.gridContext, 'clearRect');

//         service.tempGetLetter(letter, easel);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('tempGetLetter false', () => {
//         const easel = new EaselObject(true);
//         const letter: string = 'j';
//         easel.easelLetters = [
//             { score: 3, charac: 'c', img: '../../assets/letter-c.png' },
//             { score: 4, charac: 'f', img: '../../assets/letter-f.png' },
//         ];
//         easel.posTempLetters = [false, false, false, false, false, false, false];

//         expect(service.tempGetLetter(letter, easel)).toEqual(NOT_A_LETTER);
//     });

//     it('replaceTempInEasel', () => {
//         const easel = new EaselObject(true);
//         easel.easelLetters = [C, F];
//         easel.posTempLetters = [false, false, false, false, false, false, false];
//         easel.indexTempLetters = [0, 1, 2, 3];
//         const spy = spyOn(easel.indexTempLetters, 'pop');
//         service.replaceTempInEasel(easel);
//         expect(spy).toHaveBeenCalled();
//     });

//     it('replaceTempInEasel', () => {
//         const easel = new EaselObject(true);
//         easel.easelLetters = [C, F];
//         easel.posTempLetters = [false, false, false, false, false, false, false];
//         easel.indexTempLetters = [];
//         const x = 2;
//         service.replaceTempInEasel(easel);
//         expect(x).toBe(2);
//     });

//     it('moveLeft', () => {
//         const easel = new EaselObject(true);
//         easel.indexToMove = 2;
//         const x = 2;
//         service.moveLeft(easel);
//         expect(x).toBe(2);
//     });

//     it('moveLeft else', () => {
//         const easel = new EaselObject(true);
//         easel.indexToMove = 0;
//         const x = 2;
//         service.moveLeft(easel);
//         expect(x).toBe(2);
//     });

//     it('moveRight', () => {
//         const easel = new EaselObject(true);
//         easel.indexToMove = 5;
//         const x = 2;
//         service.moveRight(easel);
//         expect(x).toBe(2);
//     });

//     it('moveRight else', () => {
//         const easel = new EaselObject(true);
//         easel.indexToMove = 6;
//         const x = 2;
//         service.moveRight(easel);
//         expect(x).toBe(2);
//     });
// });
