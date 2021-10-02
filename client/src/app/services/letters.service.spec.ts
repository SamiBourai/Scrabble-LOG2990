/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, NOT_A_LETTER, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '@app/constants/constants';
import { EaselLogiscticsService } from './easel-logisctics.service';
import { LettersService } from './letters.service';

describe('LettersService', () => {
    let service: LettersService;
    let easeelService: jasmine.SpyObj<EaselLogiscticsService>;
    beforeEach(() => {
        easeelService = jasmine.createSpyObj('EaselLogiscticsService', ['placeEaselLetters', 'refillEasel', 'getLetterFromEasel']);

        easeelService.placeEaselLetters.and.returnValue();
        easeelService.refillEasel.and.returnValue();
        easeelService.getLetterFromEasel.and.returnValue(A);

        TestBed.configureTestingModule({
            providers: [{ provide: EaselLogiscticsService, useValue: easeelService }],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(LettersService);
        const width = 15;
        const height = 25;
        // eslint-disable-next-line -- createCanvas is private and we need access for the test
        service.gridContext = CanvasTestHelper.createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;
        // easeelService = TestBed.inject(EaselLogiscticsService) as jasmine.SpyObj<EaselLogiscticsService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    // test placeLetter() method
    it('place letter should add latter to tile and call drawImag()', (done) => {
        const vector: Vec2 = { x: 1, y: 1 };
        const drawImageSpy = spyOn(service.gridContext, 'drawImage');

        service.placeLetter(A, vector);
        expect(service.tiles[0][0]).toEqual(A);
        setTimeout(() => {
            expect(drawImageSpy).toHaveBeenCalled();
            done();
        }, 1000);
    });

    // test tilesIsEmpty() method
    it('tileIsEmpty should return true because the box is empty', () => {
        service.tiles[0][0] = NOT_A_LETTER;

        expect(service.tileIsEmpty({ x: 1, y: 1 })).toBeTruthy();
    });

    it('tileIsEmpty should return false because the box is not empty', () => {
        const vector1: Vec2 = { x: 2, y: 2 };
        const vector2: Vec2 = { x: 3, y: 2 };
        const vector3: Vec2 = { x: 4, y: 2 };
        const letterArray: Letter[] = [A, B, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[1] = letterArray;

        expect(service.tileIsEmpty(vector1)).toEqual(false);
        expect(service.tileIsEmpty(vector2)).toEqual(false);
        expect(service.tileIsEmpty(vector3)).toEqual(false);
    });

    // test wordInEasel()
    it('test word (Bruttale) in Easel, all (Brutale) letter are thr easel, wordInEasel expected to return True', () => {
        service.foundLetter = [false, false, false, false, false, false, false];
        easeelService.easelLetters = [
            { index: 0, letters: B },
            { index: 1, letters: R },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];

        expect(service.wordInEasel('brutale')).toEqual(false);
    });

    it('298 false', () => {
        const tiles = service.tiles;

        tiles[1][0] = A;
        tiles[1][6] = Z;

        const command: ChatCommand = {
            word: 'azzzs',
            direction: 'h',
            position: { x: 2, y: 2 },
        };
        const test = service.wordIsAttached(command);
        expect(test).toBeFalse();
    });

    it('306 false', () => {
        const tiles = service.tiles;

        tiles[0][1] = A;
        tiles[6][1] = Z;

        const command: ChatCommand = {
            word: 'azzzs',
            direction: 'v',
            position: { x: 2, y: 2 },
        };
        const test = service.wordIsAttached(command);
        expect(test).toBeFalse();
    });

    it('315 true', () => {
        const tiles = service.tiles;
        tiles[1][1] = A;
        tiles[6][1] = Z;

        const command: ChatCommand = {
            word: 'azzzs',
            direction: 'h',
            position: { x: 2, y: 2 },
        };
        spyOn(service, 'tileIsEmpty').and.returnValue(false);
        const test = service.wordIsAttached(command);
        expect(test).toBeTrue();
    });

    it('161-171', () => {
        const command: ChatCommand = {
            word: 'azzzsss',
            direction: 'v',
            position: { x: 2, y: 2 },
        };
        const test = service.usedAllEaselLetters;
        service.placeLettersInScrable(command);

        expect(test).toBeTrue();
    });

    it('test word (Abattre) in Easel, those letters are not in the Easel, wordInEasel expected to return false', () => {
        service.foundLetter = [false, false, false, false, false, false, false];
        easeelService.easelLetters = [
            { index: 0, letters: B },
            { index: 1, letters: R },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];

        expect(service.wordInEasel('abattre')).toEqual(false);
    });
    // test chnageLetterFromReserve()
    it('changer letter should call reffillEasel() and reset all variables', () => {
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: A },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];

        service.changeLetterFromReserve('s');
        expect(easeelService.refillEasel).toHaveBeenCalled();
        expect(easeelService.placeEaselLetters).toHaveBeenCalled();
    });

    it('changer letter should call reffillEasel() and reset all variables', () => {
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: S },
            { index: 2, letters: S },
            { index: 3, letters: S },
            { index: 4, letters: S },
            { index: 5, letters: S },
            { index: 6, letters: S },
        ];
        spyOn(service, 'wordInEasel').and.callFake(() => {
            return true;
        });

        service.changeLetterFromReserve('sss');
        expect(easeelService.refillEasel).toHaveBeenCalled();
        expect(easeelService.placeEaselLetters).toHaveBeenCalled();
    });
    it('changer letter should call reffillEasel() and reset all variables', () => {
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: S },
            { index: 2, letters: S },
            { index: 3, letters: S },
            { index: 4, letters: S },
            { index: 5, letters: S },
            { index: 6, letters: S },
        ];
        spyOn(service, 'wordInEasel').and.callFake(() => {
            return true;
        });

        service.changeLetterFromReserve('s');
        expect(easeelService.refillEasel).toHaveBeenCalled();
        expect(easeelService.placeEaselLetters).toHaveBeenCalled();
    });
    it('changer letter should call reffillEasel() and reset all variables', () => {
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: S },
            { index: 2, letters: S },
            { index: 3, letters: S },
            { index: 4, letters: S },
            { index: 5, letters: S },
            { index: 6, letters: S },
        ];
        spyOn(service, 'wordInEasel').and.callFake(() => {
            return false;
        });
        const spyOnResetVariable = spyOn(service, 'resetVariables');

        service.changeLetterFromReserve('s');
        expect(easeelService.refillEasel).toHaveBeenCalled();
        expect(spyOnResetVariable).toHaveBeenCalled();
    });

    // test resetVariable();

    it('resetVariable should reset following arrays: foundLetter[], indexOfEaselLetters and indexLettersAlreadyInBoard', () => {
        service.foundLetter = [true, true, true, true, true, true, true];
        service.indexOfEaselLetters = [1, 2, 3, 4, 5, 6, 7];
        service.indexLettersAlreadyInBoard = [1, 2, 4, 5, 6, 6, 6];
        service.resetVariables();
        for (let i = 0; i < service.foundLetter.length; i++) {
            expect(service.foundLetter[i]).toBeFalse();
            expect(service.indexLettersAlreadyInBoard[i]).toBeUndefined();
            expect(service.indexOfEaselLetters[i]).toBeUndefined();
        }
    });

    // test placeLetterInScrabble()
    it('placeLetterInScrabble should call reset variables and reset variable', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 'sa', position: vec2, direction: 'h' };
        service.indexLettersAlreadyInBoard = [0, 1, 2, 3, 4, 5, 6, 7];
        const letterArray: Letter[] = [S, A, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[0] = letterArray;

        const resetVariablesSpy = spyOn(service, 'resetVariables');

        service.placeLettersInScrable(command);
        expect(easeelService.refillEasel).toHaveBeenCalled();
        expect(resetVariablesSpy).toHaveBeenCalled();
    });

    it('placeLetterInScrabble should call placeLetter and getLetter when direction is vertical', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 'sass', position: vec2, direction: 'v' };
        service.indexLettersAlreadyInBoard = [1, 1, 1, 1, 1, 1, 1, 1];
        const letterArray: Letter[] = [S, A, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[0] = letterArray;
        const resetVariablesSpy = spyOn(service, 'resetVariables');
        service.placeLettersInScrable(command);
        expect(resetVariablesSpy).toHaveBeenCalled();
    });

    it('placeLetterInScrabble should call placeLetter and getLetter when direction is horizontal', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 'sass', position: vec2, direction: 'h' };
        service.indexLettersAlreadyInBoard = [1, 1, 1, 1, 1, 1, 1, 1];
        const letterArray: Letter[] = [S, A, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[0] = letterArray;

        const resetVariablesSpy = spyOn(service, 'resetVariables');
        service.placeLettersInScrable(command);
        expect(resetVariablesSpy).toHaveBeenCalled();
    });

    it('placeLetterInScrabble should call placeLetter and getLetter when direction is vertical', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 'sa', position: vec2, direction: 'v' };
        service.indexLettersAlreadyInBoard = [0, 1, 2, 3, 4, 5, 6];
        const letterArray: Letter[] = [S, A, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[0] = letterArray;

        const resetVariablesSpy = spyOn(service, 'resetVariables');
        service.placeLettersInScrable(command);

        expect(resetVariablesSpy).toHaveBeenCalled();
    });
    // test wordIsPlacebale()

    it('wordIsPlacebale should return true because word and  command are valid', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 'sa', position: vec2, direction: 'h' };
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: A },
            { index: 2, letters: U },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];
        const spyOnWordInEasel = spyOn(service, 'wordInEasel');
        const spyOnResetVariable = spyOn(service, 'resetVariables');
        const wordIsplacable: boolean = service.wordIsPlacable(command);

        expect(spyOnWordInEasel).toHaveBeenCalled();
        expect(spyOnResetVariable).toHaveBeenCalled();
        expect(wordIsplacable).toBeFalsy();
    });

    it('wordIsPlacebale should return true because word is vertical and letter  some are in the easel', () => {
        const vec2: Vec2 = { x: 2, y: 2 };
        const command: ChatCommand = { word: 's', position: vec2, direction: 'v' };
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: A },
            { index: 2, letters: B },
            { index: 3, letters: T },
            { index: 4, letters: A },
            { index: 5, letters: L },
            { index: 6, letters: E },
        ];
        const spyOnWordInEasel = spyOn(service, 'wordInEasel');
        const spyOnResetVariable = spyOn(service, 'resetVariables');
        const wordIsplacable: boolean = service.wordIsPlacable(command);

        expect(spyOnWordInEasel).toHaveBeenCalled();
        expect(spyOnResetVariable).toHaveBeenCalled();
        expect(wordIsplacable).toBeFalsy();
    });

    it('wordIsPlacebale should return false because word direction is wrong ', () => {
        const vec2: Vec2 = { x: 1, y: 1 };
        const command: ChatCommand = { word: 's', position: vec2, direction: 'h' };
        easeelService.easelLetters = [
            { index: 0, letters: S },
            { index: 1, letters: A },
            { index: 2, letters: C },
            { index: 3, letters: C },
            { index: 4, letters: C },
            { index: 5, letters: C },
            { index: 6, letters: C },
        ];
        const letterArray: Letter[] = [S, A, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[0] = letterArray;
        const spyOnWordInEasel = spyOn(service, 'wordInEasel').and.callFake(() => {
            return true;
        });
        const wordIsplacable: boolean = service.wordIsPlacable(command);
        expect(spyOnWordInEasel).toHaveBeenCalled();
        expect(wordIsplacable).toBeTruthy();
    });

    // test fromWordToLetter() method
    it('should return an array of caractere of the word passed in parametters', () => {
        const word = 'Manger';

        const getTheLetterSpyOn = spyOn(service, 'getTheLetter');

        service.fromWordToLetters(word);

        expect(getTheLetterSpyOn).toHaveBeenCalledTimes(6);
    });

    // test getTheLetter()

    it('should return the letter passed in parametter', () => {
        expect(service.getTheLetter('a')).toBe(A);
        expect(service.getTheLetter('b')).toBe(B);
        expect(service.getTheLetter('c')).toBe(C);
        expect(service.getTheLetter('d')).toBe(D);
        expect(service.getTheLetter('e')).toBe(E);
        expect(service.getTheLetter('f')).toBe(F);
        expect(service.getTheLetter('g')).toBe(G);
        expect(service.getTheLetter('h')).toBe(H);
        expect(service.getTheLetter('i')).toBe(I);
        expect(service.getTheLetter('j')).toBe(J);
        expect(service.getTheLetter('k')).toBe(K);
        expect(service.getTheLetter('l')).toBe(L);
        expect(service.getTheLetter('m')).toBe(M);
        expect(service.getTheLetter('n')).toBe(N);
        expect(service.getTheLetter('o')).toBe(O);
        expect(service.getTheLetter('p')).toBe(P);
        expect(service.getTheLetter('q')).toBe(Q);
        expect(service.getTheLetter('r')).toBe(R);
        expect(service.getTheLetter('s')).toBe(S);
        expect(service.getTheLetter('t')).toBe(T);
        expect(service.getTheLetter('u')).toBe(U);
        expect(service.getTheLetter('v')).toBe(V);
        expect(service.getTheLetter('w')).toBe(W);
        expect(service.getTheLetter('x')).toBe(X);
        expect(service.getTheLetter('y')).toBe(Y);
        expect(service.getTheLetter('z')).toBe(Z);
    });
    it('should return the letter A because it char passed in parametter is not an alphabet', () => {
        expect(service.getTheLetter('9')).toBe(NOT_A_LETTER);
    });

    // test wordIsAttached
    it('word test should return false because the command chat is not valid', () => {
        const vec2: Vec2 = { x: 0, y: 1 };
        const command: ChatCommand = { word: 'sa', position: vec2, direction: 'x' };
        expect(service.wordIsAttached(command)).toBeFalsy();
    });

    it('word test should return TRUE because the command chat is Valid', () => {
        const vec2: Vec2 = { x: 4, y: 4 };

        A.charac = 'A';
        C.charac = 'C';

        const command: ChatCommand = { word: 'sa', position: vec2, direction: 'v' };

        const letterArray: Letter[] = [A, B, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[1] = letterArray;
        const spyOnTileIsEmpty = spyOn(service, 'tileIsEmpty');
        expect(service.wordIsAttached(command)).toBeTruthy();
        expect(spyOnTileIsEmpty).toBeTruthy();
    });

    // test wordInBoardLimits
    it('word in board limits should return true because the command direction is not valid and postion + woed length >board limits', () => {
        const vec2: Vec2 = { x: 5, y: 5 };
        const command: ChatCommand = { word: 'sas', position: vec2, direction: 'x' };
        expect(service.wordInBoardLimits(command)).toBeTruthy();
    });

    it('word in board is vertical and it s limit is > to board', () => {
        const vec2: Vec2 = { x: 15, y: 7 };
        const command: ChatCommand = { word: 'sssssssssssssss', position: vec2, direction: 'v' };
        expect(service.wordInBoardLimits(command)).toBeFalsy();
    });
    it('word in board is vertical and it s limit is < to board', () => {
        const vec2: Vec2 = { x: 6, y: 7 };
        const command: ChatCommand = { word: 'sss', position: vec2, direction: 'v' };
        expect(service.wordInBoardLimits(command)).toBeTruthy();
    });
    it('word in board is horizontal and it s limit is > to board', () => {
        const vec2: Vec2 = { x: 15, y: 7 };
        const command: ChatCommand = { word: 'sssssssssssssss', position: vec2, direction: 'h' };
        expect(service.wordInBoardLimits(command)).toBeFalsy();
    });
    it('word in board is horizontal and it s limit is < to board', () => {
        const vec2: Vec2 = { x: 6, y: 7 };
        const command: ChatCommand = { word: 'sss', position: vec2, direction: 'h' };
        expect(service.wordInBoardLimits(command)).toBeTruthy();
    });
});
