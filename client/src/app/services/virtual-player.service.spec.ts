/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

// import { HttpClientModule } from '@angular/common/http';
// import { TestBed } from '@angular/core/testing';
// import { Letter } from '@app/classes/letter';
// import { A, D, E, I, L, M, N, NB_TILES, NOT_A_LETTER, P, R, S, V, X } from '@app/constants/constants';
// import { ValidWordService } from '@app/services/valid-world.service';
// import { LettersService } from './letters.service';
// import { ReserveService } from './reserve.service';
// import { VirtualPlayerService } from './virtual-player.service';
// import SpyObj = jasmine.SpyObj;

// describe('VirtualPlayerService', () => {
//     let service: VirtualPlayerService;
//     let validWordServiceSpy: SpyObj<ValidWordService>;
//     let letterServiceSpy: SpyObj<LettersService>;
//     let reserveServiceSpy: SpyObj<ReserveService>;

//     beforeEach(() => {
//         validWordServiceSpy = jasmine.createSpyObj('validWordServiceSpy', [
//             'generateAllWordsPossible',
//             'readWordsAndGivePointsIfValid',
//             'generateRegEx',
//         ]);
//         letterServiceSpy = jasmine.createSpyObj('letterServiceSpy', ['placeLetter', 'getTheLetter', 'fromWordToLetters']);
//         reserveServiceSpy = jasmine.createSpyObj('reserveService ', ['getRandomLetter']);
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
//         service.isDicFille = false;
//         service.first = true;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         spyOn(Math, 'random').and.returnValue(0);
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         const generateVrPlayerSpy = spyOn<any>(service, 'generateVrPlayerEasel').and.callThrough();
//         const generateAllWordsPossibleSpy = validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(generateVrPlayerSpy).toHaveBeenCalled();
//             expect(generateAllWordsPossibleSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('should pass on place the word', (done) => {
//         service.isDicFille = false;
//         service.first = true;
//         const words: string[] = ['je', 'le', 'appel', 'vendre'];
//         const letter: Letter = A;
//         spyOn(Math, 'random').and.returnValue(0);
//         validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(20);
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         const wordInEaselSpy = spyOn<any>(service, 'wordInEasel').and.returnValue(true);
//         letterServiceSpy.placeLetter.and.stub();
//         letterServiceSpy.getTheLetter.and.returnValue(letter);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(wordInEaselSpy).toHaveBeenCalled();
//             done();
//         }, 3000);
//     });
//     it('should pass not generateVrPlayer and go to gettLettersForRange', (done) => {
//         service.isDicFille = true;
//         service.first = false;
//         const getLettersForRangeSpy = spyOn<any>(service, 'getLetterForRange').and.returnValue(true);
//         service.manageVrPlayerActions();
//         setTimeout(() => {
//             expect(getLettersForRangeSpy).toHaveBeenCalled();
//             expect(service.played).toBeTruthy();
//             done();
//         }, 3000);
//     });
//     it('should updateVrEasel', () => {
//         service['foundLetter'] = [true, false, true, false, true, true, true];
//         service['vrPlayerEaselLetters'] = [A, I, N, M, P, P, A];
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         reserveServiceSpy.reserveSize = 50;
//         service['updateVrEasel']();

//         expect(reserveServiceSpy.getRandomLetter).toHaveBeenCalled();
//     });
//     it('should updateVrEasel and decremente vrEazelSize', () => {
//         service['foundLetter'] = [true, false, true, false, true, true, true];
//         service['vrPlayerEaselLetters'] = [A, I, N, M, P, P, A];
//         service['vrEaselSize'] = 7;
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         reserveServiceSpy.reserveSize = 0;
//         service['updateVrEasel']();

//         expect(service['vrEaselSize']).toEqual(2);
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
//         const updateVrEaselSpy = spyOn<any>(service, 'updateVrEasel').and.callThrough();
//         validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
//         service['findPlacement'](letter, letInGrid, 'v', 7, 8);
//         expect(updateVrEaselSpy).not.toHaveBeenCalled();
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
//         const updateVrEaselSpy = spyOn<any>(service, 'updateVrEasel').and.callThrough();
//         spyOn<any>(service, 'generateWords').and.returnValue(words);
//         spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
//         spyOn<any>(service, 'isWordPlacable').and.returnValue(true);
//         validWordServiceSpy.generateRegEx.and.returnValue(
//             // eslint-disable-next-line max-len
//             '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
//         );
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
//         // spyOn<any>(validWordServiceSpy, 'generateRegEx').and.callThrough();
//         service['findPlacement'](letter, letInGrid, 'v', 7, 8);
//         expect(updateVrEaselSpy).toHaveBeenCalled();
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
//         const updateVrEaselSpy = spyOn<any>(service, 'updateVrEasel').and.callThrough();
//         spyOn<any>(service, 'generateWords').and.returnValue(words);
//         spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
//         spyOn<any>(service, 'isWordPlacable').and.returnValue(true);
//         validWordServiceSpy.generateRegEx.and.returnValue(
//             // eslint-disable-next-line max-len
//             '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
//         );
//         letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);

//         service['findPlacement'](letter, letInGrid, 'h', 7, 8);
//         expect(updateVrEaselSpy).toHaveBeenCalled();
//     });
//     it('should exchange letters', (done) => {
//         spyOn(Math, 'floor').and.returnValue(0);
//         reserveServiceSpy.getRandomLetter.and.returnValue(A);
//         service['vrPlayerEaselLetters'] = [A, I];
//         service['exchangeLettersInEasel']();
//         expect(service.commandToSend).toBe('');
//         done();
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
//     it('should isWordPlacable be true ', () => {
//         const letters = [X, X, X];
//         spyOn<any>(service, 'wordInEasel').and.returnValue(true);
//         const valid = service['isWordPlacable']('xxx', letters);

//         expect(valid).toEqual(true);
//     });
//     it('should generateWords ', () => {
//         const letters = [X, E];
//         const words = ['ex'];
//         service.vrPlayerEaselLetters = [A, D, X, D, A, A, E];
//         validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
//         service['generateWords'](letters);

//         expect(validWordServiceSpy.generateAllWordsPossible).toHaveBeenCalled();
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
// });
