// /* eslint-disable prettier/prettier */
// /* eslint-disable max-len */
// /* eslint-disable max-lines */
// /* eslint-disable @typescript-eslint/no-magic-numbers */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable dot-notation */
// import { HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';
// import { EaselObject } from '@app/classes/easel-object';
// import { Letter } from '@app/classes/letter';
// import { A, D, E, I, J, L, M, N, NB_TILES, NOT_A_LETTER, P, R, S, T, V, X } from '@app/constants/constants';
// import { ValidWordService } from '@app/services/valid-word.service';
// import { LettersService } from './letters.service';
// import { ReserveService } from './reserve.service';
// import { VirtualPlayerService } from './virtual-player.service';
// import SpyObj = jasmine.SpyObj;

// describe('VirtualPlayerService', () => {
//     let service: VirtualPlayerService;
//     let validWordServiceSpy: SpyObj<ValidWordService>;
//     let letterServiceSpy: SpyObj<LettersService>;
//     let reserveServiceSpy: SpyObj<ReserveService>;
//     let easelObjSpy: SpyObj<EaselObject>;

//     beforeEach(() => {
//         validWordServiceSpy = jasmine.createSpyObj('validWordServiceSpy', [
//             'generateAllWordsPossible',
//             'readWordsAndGivePointsIfValid',
//             'generateRegEx',
//         ]);
//         letterServiceSpy = jasmine.createSpyObj('letterServiceSpy', [
//             'placeLetter',
//             'getTheLetter',
//             'fromWordToLetters',
//             'wordIsPlacable',
//             'placeLettersInScrable',
//             'tiles',
//         ]);
//         easelObjSpy = jasmine.createSpyObj('easelObjSpy', ['contains', 'refillEasel', 'resetVariables']);
//         reserveServiceSpy = jasmine.createSpyObj('reserveService ', ['getRandomLetter', 'isReserveEmpty', 'reFillReserve']);

//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//             providers: [
//                 { provide: ValidWordService, useValue: validWordServiceSpy },
//                 { provide: LettersService, useValue: letterServiceSpy },
//                 { provide: ReserveService, useValue: reserveServiceSpy },
//             ],
//         }).compileComponents();
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(VirtualPlayerService);
//     });
//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });
//     it('should test the first case of the switch', (done) => {
//         service.first = true;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         service.easel = new EaselObject(false);
//         for (let i = 0; i < 7; i++) {
//             if (i % 3 === 0) {
//                 service.easel.add(J, i);
//             } else service.easel.add(E, i);
//         }

//         const generateAllWordsPossibleSpy = validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         easelObjSpy.contains.and.returnValue(true);
//         reserveServiceSpy.isReserveEmpty.and.returnValue(false);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(service['wordPlacedInScrable']).toBeFalsy();
//             expect(generateAllWordsPossibleSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('should pass on place the word', (done) => {
//         service.first = true;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         const letter: Letter = A;
//         spyOn(Math, 'random').and.returnValue(0);
//         validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(20);
//         easelObjSpy.contains.and.returnValue(false);
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         letterServiceSpy.getTheLetter.and.returnValue(letter);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(easelObjSpy.resetVariables).not.toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('should go to gettLettersForRange', (done) => {
//         service.first = false;
//         letterServiceSpy.tiles = new Array<Letter[]>(NB_TILES);
//         for (let i = 0; i < letterServiceSpy.tiles.length; ++i) {
//             letterServiceSpy.tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
//         }
//         spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
//         letterServiceSpy.tiles[7][7] = E;
//         letterServiceSpy.tiles[7][8] = T;
//         letterServiceSpy.tiles[7][9] = E;
//         const getLettersForRangeSpy = spyOn<any>(service, 'getLetterForRange').and.callThrough();
//         const findPlacementSpy = spyOn<any>(service, 'findPlacement').and.returnValue(true);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(getLettersForRangeSpy).toHaveBeenCalled();
//             expect(findPlacementSpy).toHaveBeenCalled();
//             expect(service['wordPlacedInScrable']).toBeFalsy();
//             done();
//         }, 3000);
//     });
//     it('should calculate word score', () => {
//         letterServiceSpy.fromWordToLetters.and.returnValue([A, A, A, A]);
//         const score = service['caclculateGeneratedWordPoints']('aaaa');
//         expect(score).toEqual(4);
//     });
//     it('should calculate word score', () => {
//         letterServiceSpy.fromWordToLetters.and.returnValue([A, A, A, A]);
//         const score = service['caclculateGeneratedWordPoints']('aaaa');
//         expect(score).toEqual(4);
//     });
//     it('should pass on findPlacement', () => {
//         const letter: Letter[] = [];
//         for (let i = 0; i < 15; i++) {
//             if (i === 5) letter.push(A);
//             else letter.push(S);
//         }
//         const letInGrid = [A, A, A, A];
//         service.vrPoints = 0;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
//         service['findPlacement'](letter, letInGrid, 'v', 7, 8);
//         expect(service['wordPlacedInScrable']).toBeFalsy();
//     });
//     it('should pass on findPlacement second if with vertical', () => {
//         const letter: Letter[] = [];
//         for (let i = 0; i < 15; i++) {
//             if (i === 9) letter.push(L);
//             else letter.push(NOT_A_LETTER);
//         }
//         const letInGrid = [A, A, A, A];
//         service.vrPoints = 0;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         const findPlacementSpy = spyOn<any>(service, 'findPlacement').and.callThrough();
//         spyOn<any>(service, 'generateWords').and.returnValue(words);
//         spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
//         letterServiceSpy.wordIsPlacable.and.returnValue(true);
//         validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
//         validWordServiceSpy.generateRegEx.and.returnValue(
//             '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
//         );
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
//         service['findPlacement'](letter, letInGrid, 'v', 7, 8);
//         expect(findPlacementSpy).toBeTruthy();
//     });
//     it('should pass on findPlacement second if with horizontal', () => {
//         const letter: Letter[] = [];
//         for (let i = 0; i < 15; i++) {
//             if (i === 9) letter.push(L);
//             else letter.push(NOT_A_LETTER);
//         }
//         const letInGrid = [A, A, A, A];
//         service.vrPoints = 0;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         const findPlacementSpy = spyOn<any>(service, 'findPlacement').and.callThrough();
//         spyOn<any>(service, 'generateWords').and.returnValue(words);
//         spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
//         letterServiceSpy.wordIsPlacable.and.returnValue(true);
//         validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
//         validWordServiceSpy.generateRegEx.and.returnValue(
//             '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
//         );
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);

//         service['findPlacement'](letter, letInGrid, 'h', 7, 8);
//         expect(findPlacementSpy).toBeTruthy();
//     });
//     it('should generateProb {0,6} ', () => {
//         spyOn(Math, 'floor').and.returnValue(0);
//         service['generateProb']();
//         expect(service['probWordScore']).toEqual('{0,6}');
//     });
//     it('should fitTheProb {0,6} true ', () => {
//         const letters = [A, A, A];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{0,6}';
//         const fits = service['fitsTheProb']('aaa');
//         expect(fits).toEqual(true);
//     });
//     it('should fitTheProb {0,6} false ', () => {
//         const letters = [X, X, X, X, X, X, X];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{0,6}';
//         const fits = service['fitsTheProb']('xxxxxxx');
//         expect(fits).toEqual(false);
//     });
//     it('should fitTheProb {7,12} false ', () => {
//         const letters = [X, A, A];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{7,12}';
//         const fits = service['fitsTheProb']('xaa');
//         expect(fits).toEqual(true);
//     });
//     it('should fitTheProb {7,12} false ', () => {
//         const letters = [X, X, X, X, X, X, X];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{7,12}';
//         const fits = service['fitsTheProb']('xxxxxxx');
//         expect(fits).toEqual(false);
//     });
//     it('should fitTheProb {13,18} true ', () => {
//         const letters = [X, A, A, A, A, A];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{13,18}';
//         const fits = service['fitsTheProb']('xaaaaa');
//         expect(fits).toEqual(true);
//     });
//     it('should fitTheProb {13,18} false ', () => {
//         const letters = [X, X, X, X, X, X, X];
//         letterServiceSpy.fromWordToLetters.and.returnValue(letters);
//         service['probWordScore'] = '{13,18}';
//         const fits = service['fitsTheProb']('xxxxxxx');
//         expect(fits).toEqual(false);
//     });
//     it('should find position when word fits', () => {
//         const word = 'mounib';
//         const testTab: Letter[] = [
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             M,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             N,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//         ];
//         const posInit = service['placeVrLettersInScrable'](word, testTab);
//         expect(posInit).toEqual(8);
//     });
//     it('should be not be able to place a word next to a letter', () => {
//         const word = 'mounib';
//         const testTab: Letter[] = [
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             NOT_A_LETTER,
//             I,
//             NOT_A_LETTER,
//             P,
//         ];
//         const posInit = service['placeVrLettersInScrable'](word, testTab);
//         expect(posInit).toEqual(-1);
//     });
//     it('should pass on getLetterForRange ', () => {
//         const tiles = new Array<Letter[]>(NB_TILES);
//         for (let i = 0; i < tiles.length; ++i) {
//             tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
//         }
//         const findPlacementSpy = spyOn<any>(service, 'findPlacement').and.returnValue(true);
//         service['getLetterForRange']('v', tiles);
//         expect(findPlacementSpy).not.toHaveBeenCalled();
//     });
//     it('should pass on getLetterForRange ', () => {
//         const tiles = new Array<Letter[]>(NB_TILES);
//         for (let i = 0; i < tiles.length; ++i) {
//             tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
//         }
//         tiles[2][7] = A;
//         tiles[2][6] = V;
//         const findPlacementSpy = spyOn<any>(service, 'findPlacement').and.returnValue(true);
//         service['getLetterForRange']('h', tiles);
//         expect(findPlacementSpy).toHaveBeenCalled();
//     });
//     it('shouldCall exchangeLettersInEasel', (done) => {
//         spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
//         const exchangeLettersInEaselSpy = spyOn<any>(service, 'exchangeLettersInEasel').and.returnValue(true);
//         reserveServiceSpy.reserveSize = 9;
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(exchangeLettersInEaselSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('shouldCall passTurnSteps', (done) => {
//         spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
//         const passTurnStepsSpy = spyOn<any>(service, 'passTurnSteps').and.callThrough();
//         reserveServiceSpy.reserveSize = 5;
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(passTurnStepsSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('shouldCall passTurn in the switch case', (done) => {
//         spyOn<any>(service, 'playProbabilty').and.returnValue('passTurn');
//         const passTurnStepsSpy = spyOn<any>(service, 'passTurnSteps').and.callThrough();
//         reserveServiceSpy.reserveSize = 5;
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(passTurnStepsSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('shouldCall refillEasel in the switch case', () => {
//         service['exchangeLettersInEasel']();
//         expect(reserveServiceSpy.reFillReserve).toHaveBeenCalled();
//         expect(service.easel).toBeDefined();
//     });
// });
