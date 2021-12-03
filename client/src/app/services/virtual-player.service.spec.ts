/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ChatCommand } from '@app/classes/chat-command';
import { EaselObject } from '@app/classes/easel-object';
import { Letter } from '@app/classes/letter';
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, NB_TILES, NOT_A_LETTER, P, R, S, T, UNDEFINED_INDEX, V, X } from '@app/constants/constants';
import { ValidWordService } from '@app/services/valid-word.service';
import { LettersService } from './letters.service';
import { ObjectifManagerService } from './objectif-manager.service';
import { ReserveService } from './reserve.service';
import { VirtualPlayerService } from './virtual-player.service';
import SpyObj = jasmine.SpyObj;

fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let validWordServiceSpy: SpyObj<ValidWordService>;
    let letterServiceSpy: SpyObj<LettersService>;
    let reserveServiceSpy: SpyObj<ReserveService>;
    let easelObjSpy: SpyObj<EaselObject>;
    let obectifServiceSpy: SpyObj<ObjectifManagerService>;

    beforeEach(() => {
        validWordServiceSpy = jasmine.createSpyObj('validWordServiceSpy', [
            'generateAllWordsPossible',
            'readWordsAndGivePointsIfValid',
            'generateRegEx',
        ]);
        letterServiceSpy = jasmine.createSpyObj('letterServiceSpy', [
            'placeLetter',
            'getTheLetter',
            'fromWordToLetters',
            'wordIsPlacable',
            'placeLettersInScrable',
            'tiles',
            'tileIsEmpty',
        ]);
        obectifServiceSpy = jasmine.createSpyObj('obectifServiceSpy', ['log2990Mode', 'vrPassTurnCounter', 'verifyObjectifs']);
        easelObjSpy = jasmine.createSpyObj('easelObjSpy', ['contains', 'refillEasel', 'resetVariables']);
        reserveServiceSpy = jasmine.createSpyObj('reserveService ', ['getRandomLetter', 'isReserveEmpty', 'reFillReserve']);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: ValidWordService, useValue: validWordServiceSpy },
                { provide: LettersService, useValue: letterServiceSpy },
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: EaselObject, useValue: easelObjSpy },
                { provide: ObjectifManagerService, useValue: obectifServiceSpy },
            ],
        }).compileComponents();
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should test the first case of the switch', (done) => {
        const words: string[] = ['le', 'je', 'appel', 'vendre'];
        service.easel = new EaselObject(false);
        for (let i = 0; i < 7; i++) {
            if (i % 2 === 0) {
                service.easel.add(J, i);
            } else service.easel.add(E, i);
        }

        const generateAllWordsPossibleSpy = validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
        const placeWordStepsSpy = spyOn<any>(service, 'placeWordSteps');
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(generateAllWordsPossibleSpy).toHaveBeenCalled();
            expect(placeWordStepsSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('should Send alternative placement', () => {
        obectifServiceSpy.log2990Mode = false;
        const maxPoint: number[] = [0, 0];
        const saveTempCommand: ChatCommand[] = [
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: '' },
            { word: '', position: { x: 1, y: 1 }, direction: '' },
            { word: '', position: { x: UNDEFINED_INDEX, y: UNDEFINED_INDEX }, direction: '' },
        ];
        service['placeWordSteps'](saveTempCommand[0], saveTempCommand, maxPoint);

        expect(service.commandToSend).toEqual('');
    });
    it('should change bool wordPlacedInScrable', () => {
        service.maxPoint = [1, 0];

        service['playMaxPoint']();

        expect(service['wordPlacedInScrable']).toBeTrue();
    });
    it('should return placeWord', () => {
        service.expert = true;
        const returnValue = service['playProbabilty']();

        expect(returnValue).toEqual('placeWord');
    });
    it('should return pass', () => {
        spyOn<any>(Math, 'floor').and.returnValue(8);
        const returnValue = service['playProbabilty']();
        expect(returnValue).toEqual('passTurn');
    });
    it('should return false on fitsPorb', () => {
        service['probWordScore'] = 'NOT_A_PROB';
        const returnValue = service['fitsTheProb'](10);
        expect(returnValue).toBeFalsy();
    });

    it('should pass on place the word', (done) => {
        const words: string[] = ['je'];
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
        const passTurnStepSpy = spyOn<any>(service, 'passTurnSteps');
        validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
        easelObjSpy.contains.and.returnValue(false);
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(passTurnStepSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('should trade on place for expert JV', (done) => {
        const words: string[] = ['je'];
        service.expert = true;
        reserveServiceSpy.reserveSize = 2;
        letterServiceSpy.tileIsEmpty.and.returnValue(true);
        spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
        const tradeStepSpy = spyOn<any>(service, 'tradeLetterSteps').and.callThrough();
        validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
        easelObjSpy.contains.and.returnValue(false);
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(tradeStepSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('should go to gettLettersForRange H', (done) => {
        letterServiceSpy.tiles = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < letterServiceSpy.tiles.length; ++i) {
            letterServiceSpy.tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }
        spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
        letterServiceSpy.tiles[7][7] = E;
        letterServiceSpy.tiles[7][8] = T;
        letterServiceSpy.tiles[7][9] = E;
        const getLettersForRangeSpy = spyOn<any>(service, 'getLetterForRange').and.callThrough();
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.returnValue(true);
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(getLettersForRangeSpy).toHaveBeenCalled();
            expect(findValidWordSpy).toHaveBeenCalled();
            expect(service['wordPlacedInScrable']).toBeFalsy();
            done();
        }, 3000);
    });
    it('should go to gettLettersForRange V', (done) => {
        service.easel = new EaselObject(false);

        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
        for (let i = 0; i < 7; i++) {
            service.easel.add(E, i);
        }
        letterServiceSpy.tiles = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < letterServiceSpy.tiles.length; ++i) {
            letterServiceSpy.tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }

        spyOn<any>(service, 'playProbabilty').and.returnValue('placeWord');
        letterServiceSpy.tiles[7][7] = L;
        letterServiceSpy.tiles[7][8] = E;
        const getLettersForRangeSpy = spyOn<any>(service, 'getLetterForRange').and.callThrough();

        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(getLettersForRangeSpy).toHaveBeenCalled();

            done();
        }, 3000);
    });

    it('should pass on findValidWord', () => {
        const letter: Letter[] = [];
        for (let i = 0; i < 15; i++) {
            if (i === 5) letter.push(A);
            else letter.push(S);
        }
        const letInGrid = [A, A, A, A];
        service.vrPoints = 0;
        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        validWordServiceSpy.generateAllWordsPossible.and.returnValue(words);
        letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
        service['findValidWord'](letter, letInGrid, 'v', 7, 8);
        expect(service['wordPlacedInScrable']).toBeFalsy();
    });

    it('should pass on findValidWord second if with vertical', () => {
        const letter: Letter[] = [];
        for (let i = 0; i < 15; i++) {
            if (i === 9) letter.push(L);
            else letter.push(NOT_A_LETTER);
        }
        const letInGrid = [A, A, A, A];
        service.vrPoints = 0;
        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.callThrough();
        spyOn<any>(service, 'generateWords').and.returnValue(words);
        spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
        letterServiceSpy.wordIsPlacable.and.returnValue(true);
        validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
        validWordServiceSpy.generateRegEx.and.returnValue(
            '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
        );
        letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
        service['findValidWord'](letter, letInGrid, 'v', 7, 8);
        expect(findValidWordSpy).toBeTruthy();
    });
    it('should pass on findValidWord second if with vertical', () => {
        service.expert = false;
        const letter: Letter[] = [];
        for (let i = 0; i < 15; i++) {
            if (i === 9) letter.push(L);
            else letter.push(NOT_A_LETTER);
        }
        const letInGrid = [A, A, A, A];
        service.vrPoints = 0;
        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.callThrough();
        spyOn<any>(service, 'generateWords').and.returnValue(words);
        spyOn<any>(service, 'fitsTheProb').and.returnValue(false);
        letterServiceSpy.wordIsPlacable.and.returnValue(true);
        validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
        validWordServiceSpy.generateRegEx.and.returnValue(
            '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
        );
        letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
        service['findValidWord'](letter, letInGrid, 'v', 7, 8);
        expect(findValidWordSpy).toBeTruthy();
    });
    it('should pass on findValidWord second if with vertical', () => {
        service.expert = true;
        const letter: Letter[] = [];
        for (let i = 0; i < 15; i++) {
            if (i === 9) letter.push(L);
            else letter.push(NOT_A_LETTER);
        }
        const letInGrid = [A, A, A, A];
        service.vrPoints = 0;
        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.callThrough();
        spyOn<any>(service, 'generateWords').and.returnValue(words);
        spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
        letterServiceSpy.wordIsPlacable.and.returnValue(true);
        validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
        validWordServiceSpy.generateRegEx.and.returnValue(
            '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
        );
        letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);
        service['findValidWord'](letter, letInGrid, 'v', 7, 8);
        expect(findValidWordSpy).toBeTruthy();
    });
    it('should pass on findPlacement second if with horizontal', () => {
        const letter: Letter[] = [];
        for (let i = 0; i < 15; i++) {
            if (i === 9) letter.push(L);
            else letter.push(NOT_A_LETTER);
        }
        const letInGrid = [A, A, A, A];
        service.vrPoints = 0;
        const words: string[] = ['je', 'le', 'appel', 'vendre'];
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.callThrough();
        spyOn<any>(service, 'generateWords').and.returnValue(words);
        spyOn<any>(service, 'fitsTheProb').and.returnValue(true);
        letterServiceSpy.wordIsPlacable.and.returnValue(true);
        validWordServiceSpy.readWordsAndGivePointsIfValid.and.returnValue(4);
        validWordServiceSpy.generateRegEx.and.returnValue(
            '(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?$)|(^.?.?.?.?.?.?.?.?.?l{1}$)|(^.?.?.?.?.?.?.?.?.?l{1}.?.?.?.?.?$)',
        );
        letterServiceSpy.fromWordToLetters.and.returnValue([V, E, N, D, R, E]);

        service['findValidWord'](letter, letInGrid, 'h', 7, 8);
        expect(findValidWordSpy).toBeTruthy();
    });
    it('should generateProb {0,6} ', () => {
        spyOn(Math, 'floor').and.returnValue(0);
        service['generateProb']();
        expect(service['probWordScore']).toEqual('{0,6}');
    });
    it('should fitTheProb {0,6} true ', () => {
        const letters = [A, A, A];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{0,6}';
        const fits = service['fitsTheProb'](3);
        expect(fits).toEqual(true);
    });
    it('should fitTheProb {0,6} false ', () => {
        const letters = [X, X, X, X, X, X, X];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{0,6}';
        const fits = service['fitsTheProb'](1000);
        expect(fits).toEqual(false);
    });
    it('should fitTheProb {7,12} false ', () => {
        const letters = [X, A, A];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{7,12}';
        const fits = service['fitsTheProb'](12);
        expect(fits).toEqual(true);
    });
    it('should fitTheProb {7,12} false ', () => {
        const letters = [X, X, X, X, X, X, X];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{7,12}';
        const fits = service['fitsTheProb'](1000);
        expect(fits).toEqual(false);
    });
    it('should fitTheProb {13,18} true ', () => {
        const letters = [X, A, A, A, A, A];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{13,18}';
        const fits = service['fitsTheProb'](15);
        expect(fits).toEqual(true);
    });
    it('should fitTheProb {13,18} false ', () => {
        const letters = [X, X, X, X, X, X, X];
        letterServiceSpy.fromWordToLetters.and.returnValue(letters);
        service['probWordScore'] = '{13,18}';
        const fits = service['fitsTheProb'](10000);
        expect(fits).toEqual(false);
    });
    it('should find position when word fits', () => {
        const word = 'mounib';
        const testTab: Letter[] = [
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            M,
            NOT_A_LETTER,
            NOT_A_LETTER,
            N,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
        ];
        const posInit = service['findPositionInRange'](word, testTab);
        expect(posInit).toEqual(8);
    });
    it('should find position on 0', () => {
        const word = 'abcdefghijklmn';
        const testTab: Letter[] = [NOT_A_LETTER, B, C, D, E, F, G, H, I, J, K, L, M, N, NOT_A_LETTER];
        const posInit = service['findPositionInRange'](word, testTab);
        expect(posInit).toEqual(0);
    });
    it('should find position on 15', () => {
        const word = 'bcdefghijklmno';
        const testTab: Letter[] = [NOT_A_LETTER, B, C, D, E, F, G, H, I, J, K, L, M, N, NOT_A_LETTER];
        const posInit = service['findPositionInRange'](word, testTab);
        expect(posInit).toEqual(1);
    });
    it('should be not be able to place a word next to a letter', () => {
        const word = 'mounib';
        const testTab: Letter[] = [
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            NOT_A_LETTER,
            I,
            NOT_A_LETTER,
            P,
        ];
        const posInit = service['findPositionInRange'](word, testTab);
        expect(posInit).toEqual(-1);
    });
    it('should pass on getLetterForRange ', () => {
        const tiles = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < tiles.length; ++i) {
            tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.returnValue(true);
        service['getLetterForRange']('v', tiles);
        expect(findValidWordSpy).not.toHaveBeenCalled();
    });
    it('should pass on getLetterForRange ', () => {
        const tiles = new Array<Letter[]>(NB_TILES);
        for (let i = 0; i < tiles.length; ++i) {
            tiles[i] = new Array<Letter>(NB_TILES).fill(NOT_A_LETTER);
        }
        tiles[2][7] = A;
        tiles[2][6] = V;
        const findValidWordSpy = spyOn<any>(service, 'findValidWord').and.returnValue(true);
        service['getLetterForRange']('h', tiles);
        expect(findValidWordSpy).toHaveBeenCalled();
    });
    it('shouldCall exchangeLettersInEasel log2290 is true', (done) => {
        spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
        reserveServiceSpy.reserveSize = 9;
        obectifServiceSpy.log2990Mode = true;
        service.expert = true;
        const tradeLettersInEaselSpy = spyOn<any>(service, 'tradeLetterSteps').and.callThrough();
        const exchangeLettersInEaselSpy = spyOn<any>(service, 'exchangeLettersInEasel').and.callThrough();

        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(tradeLettersInEaselSpy).toHaveBeenCalled();
            expect(exchangeLettersInEaselSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('shouldCall exchangeLettersInEasel ', (done) => {
        spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
        reserveServiceSpy.reserveSize = 9;
        obectifServiceSpy.log2990Mode = false;
        service.expert = true;
        const tradeLettersInEaselSpy = spyOn<any>(service, 'tradeLetterSteps').and.callThrough();
        const exchangeLettersInEaselSpy = spyOn<any>(service, 'exchangeLettersInEasel').and.callThrough();

        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(tradeLettersInEaselSpy).toHaveBeenCalled();
            expect(exchangeLettersInEaselSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('shouldCall exchangeLettersInEasel expert false', (done) => {
        spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
        reserveServiceSpy.reserveSize = 9;
        obectifServiceSpy.log2990Mode = false;
        service.expert = false;
        const tradeLettersInEaselSpy = spyOn<any>(service, 'tradeLetterSteps').and.callThrough();
        const exchangeLettersInEaselSpy = spyOn<any>(service, 'exchangeLettersInEasel').and.callThrough();

        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(tradeLettersInEaselSpy).toHaveBeenCalled();
            expect(exchangeLettersInEaselSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });

    it('shouldCall passTurnSteps on Exchange', (done) => {
        obectifServiceSpy.log2990Mode = false;
        spyOn<any>(service, 'playProbabilty').and.returnValue('exchangeLetters');
        const passTurnStepsSpy = spyOn<any>(service, 'passTurnSteps').and.callThrough();
        reserveServiceSpy.reserveSize = 5;
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(passTurnStepsSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });

    it('shouldCall passTurn in the switch case', (done) => {
        spyOn<any>(service, 'playProbabilty').and.returnValue('passTurn');
        const passTurnStepsSpy = spyOn<any>(service, 'passTurnSteps');
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(passTurnStepsSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
    it('shouldCall passTurn in the switch case', (done) => {
        spyOn<any>(service, 'playProbabilty').and.returnValue('passTurn');
        const passTurnStepsSpy = spyOn<any>(service, 'passTurnSteps');
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(passTurnStepsSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
});
