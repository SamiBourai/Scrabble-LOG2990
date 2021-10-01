/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { A, B, C, D, E, G, I, J, L, N, O, R, S, U, usedBonus, Z } from '@app/constants/constants';
import { decode as b64_decode } from 'base64-arraybuffer';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidWordService } from './valid-world.service';
describe('ValidWorldService', () => {
    let service: ValidWordService;

    const jsonZstB64Str =
        'KLUv/QRYdQUAMs0iG4CnSQf/MS6x+3+yiRBSt962HSaZkJOZokkYAQEjtIMDQgjIHAz3Q0cZ3BNa' +
        'wf3ynhSE6Z4IliSnkkR4N0yVhZKGcIXojgXd3Ug7QwIN69xLcWnuiTDRcUWQNXC3o065p5LI3a4U' +
        'Hnczppwy7unKOLsbDCGuTinuhrTiXrhC3NOIKyNwt5TspDE1QAwAYxshjF3hmCa4wsGzEywiCRJc' +
        '7rsyQnTe3qXhE4odMnaRDQ==';

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(ValidWordService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getCompressedWords should return an observable of type arraybuffer', async () => {
        const ab = new ArrayBuffer(8);
        spyOn<any>(service['http'], 'get').and.returnValue(of(ab));
        const ab2 = await service['getCompressedWords']().toPromise();
        expect(ab).toBe(ab2);
    });

    it('get_words should return multiple words', async () => {
        const jsonZstBufObs = of(jsonZstB64Str).pipe(map((b64Str) => b64_decode(b64Str)));
        spyOn<any>(service, 'getCompressedWords').and.returnValue(jsonZstBufObs);

        const words = await service['getWords']().toPromise();
        expect(words.length).not.toBeUndefined();
        expect(words.length).toBeGreaterThan(0);
    });

    it('loadDictionary should set dictionary to non empty', async () => {
        const words = ['pomme', 'punaise', 'banane'];
        spyOn<any>(service, 'getWords').and.returnValue(of(words));

        await service.loadDictionary();
        const dict = service['dictionary'];
        expect(dict?.length).toEqual(2);
    });

    it('test_getDictionary', () => {
        expect(service.verifyWord([B, O, N, J, O, U, R])).toBeUndefined();
    });

    it('test_verifyWord', () => {
        expect(service.verifyWord([B, O, N, J, O, U, R])).toBeUndefined();
    });

    it('test_verifyWord EMPTY WORD', () => {
        service['dictionary'] = [new Set(['amende'])];
        expect(service.verifyWord([])).toBeUndefined();
    });

    it('test_verifyWord 2 WORDS THAT MATCH', () => {
        service['dictionary'] = [new Set(['arbre'])];
        expect(service.verifyWord([A, R, B, R, E])).toBeTrue();
    });

    it('test_verifyWord 2 WORDS THAT DOESNT MATCH', () => {
        service['dictionary'] = [new Set(['bonjour'])];
        expect(service.verifyWord([A, R, G, I, L, E])).toBeFalse();
    });

    it('checkIfWordIsUsed undefined positions', () => {
        const letters = service['letterService'].fromWordToLetters('azzz');

        const lettersPositionsAlt = [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
        ];

        const exists = service['checkIfWordIsUsed'](letters, lettersPositionsAlt);
        expect(exists).toBeFalse();
    });

    it('checkIfWordIsUsed true', () => {
        const letters = service['letterService'].fromWordToLetters('azzz');
        const lettersPositions = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ];

        service['usedWords'].set('azzz', lettersPositions);

        const exists = service['checkIfWordIsUsed'](letters, lettersPositions);
        expect(exists).toBeTrue();
    });

    it('checkIfWordIsUsed false', () => {
        const letters = service['letterService'].fromWordToLetters('azzz');
        const lettersPositions = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ];

        service['usedWords'].set('azzz', lettersPositions);

        const lettersPositionsAlt = [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 3, y: 1 },
        ];

        const exists = service['checkIfWordIsUsed'](letters, lettersPositionsAlt);
        expect(exists).toBeFalse();
    });

    it('adding word points of AIE should give 3 and doesnt AZZZ recount an existing word', () => {
        service['dictionary'] = [new Set(['azzz', 'aie'])];
        usedBonus.push({ x: 0, y: 0 });
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        service['usedWords'].set('azzz', [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ]);
        /* A Z Z Z *
         * I - - - *
         * E - - - */
        usedPositions[0][0] = A;
        usedPositions[0][1] = Z;
        usedPositions[0][2] = Z;
        usedPositions[0][3] = Z;
        usedPositions[1][0] = I;
        usedPositions[2][0] = E;
        const command: ChatCommand = {
            word: 'aie',
            direction: 'v',
            position: { x: 1, y: 1 },
        };
        const number = service.readWordsAndGivePointsIfValid(usedPositions, command);
        expect(number).toEqual(3);
    });

    it('adding word points of AZZZ should give 42 because it doesnt count AZZZ an existing word', () => {
        service['dictionary'] = [new Set(['azzz', 'azzzs'])];
        usedBonus.push({ x: 0, y: 0 }, { x: 3, y: 0 });
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        service['usedWords'].set('azzz', [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ]);
        /* A Z Z Z *
         * I - - - *
         * E - - - */
        usedPositions[0][0] = A;
        usedPositions[0][1] = Z;
        usedPositions[0][2] = Z;
        usedPositions[0][3] = Z;
        usedPositions[0][4] = S;

        const command: ChatCommand = {
            word: 'azzzs',
            direction: 'h',
            position: { x: 1, y: 1 },
        };
        const number = service.readWordsAndGivePointsIfValid(usedPositions, command);
        expect(number).toEqual(32);
    });

    it('if a horizontal word is placed, we check vertical words formed in same time', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        const command: ChatCommand = {
            word: 'aie',
            direction: 'h',
            position: { x: 1, y: 1 },
        };
        const spyOnChekBottomTopSide = spyOn<any>(service, 'checkBottomTopSide');
        service.readWordsAndGivePointsIfValid(usedPositions, command);
        expect(spyOnChekBottomTopSide).toHaveBeenCalled();
    });

    it('expect set in the map to have been called when the word havent been used', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        usedPositions[0][0] = A;
        usedPositions[0][1] = Z;
        usedPositions[0][2] = Z;
        usedPositions[0][3] = Z;
        usedPositions[1][0] = I;
        usedPositions[2][0] = E;
        const command: ChatCommand = {
            word: 'aie',
            direction: 'v',
            position: { x: 1, y: 1 },
        };
        spyOn<any>(service, 'verifyWord').and.callFake(() => {
            return true;
        });
        spyOn<any>(service, 'checkIfWordIsUsed').and.callFake(() => {
            return false;
        });
        const spy = spyOn<any>(service['usedWords'], 'set');
        service.readWordsAndGivePointsIfValid(usedPositions, command);
        expect(spy).toHaveBeenCalled();
    });

    it('return 0 points if the word isnt valid', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        usedPositions[0][0] = A;
        usedPositions[1][0] = I;
        usedPositions[2][0] = E;
        const command: ChatCommand = {
            word: 'aie',
            direction: 'v',
            position: { x: 1, y: 1 },
        };
        spyOn<any>(service['letterService'], 'fromWordToLetters').and.callFake(() => {
            return [A, I, E];
        });
        spyOn<any>(service, 'verifyWord').and.returnValue(false);
        const num = service.readWordsAndGivePointsIfValid(usedPositions, command);
        expect(num).toEqual(0);
    });

    it('expect unshift in the array to have been called when can iterate to the left letter', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        const position: Vec2[] = [{ x: 1, y: 0 }];
        usedPositions[0][0] = D;
        usedPositions[0][1] = A;
        usedPositions[0][2] = B;
        usedPositions[0][3] = C;
        const array: Letter[] = [];
        const arrayPosition: Vec2[] = [];

        service['checkSides'](position, array, arrayPosition, 0, usedPositions);
        // const word: string = service['fromLettersToString'](array);

        expect(array).toEqual([D, A, B, C]);
        expect(arrayPosition).toEqual([
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
        ]);
    });

    it('expect no unshift in the array to have been called when there is no letter in left side', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        const position: Vec2[] = [{ x: 1, y: 0 }];
        usedPositions[0][1] = D;
        usedPositions[0][2] = A;
        usedPositions[0][3] = B;
        usedPositions[0][4] = C;
        const array: Letter[] = [];
        const arrayPosition: Vec2[] = [];

        service['checkSides'](position, array, arrayPosition, 0, usedPositions);
        // const word: string = service['fromLettersToString'](array);

        expect(array).toEqual([D, A, B, C]);
        expect(arrayPosition).toEqual([
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 4, y: 0 },
        ]);
    });

    it('expect unshift in the array to have been called when can iterate to the top letter', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        const position: Vec2[] = [{ x: 0, y: 1 }];
        usedPositions[0][0] = D;
        usedPositions[1][0] = A;
        usedPositions[2][0] = B;
        usedPositions[3][0] = C;
        const array: Letter[] = [];
        const arrayPosition: Vec2[] = [];

        service['checkBottomTopSide'](position, array, arrayPosition, 0, usedPositions);
        // const word: string = service['fromLettersToString'](array);

        expect(array).toEqual([D, A, B, C]);
        expect(arrayPosition).toEqual([
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
        ]);
    });

    it('expect no unshift in the array to have been called when there is no letter in top side', () => {
        const usedPositions = new Array<Letter[]>(15);
        for (let i = 0; i < usedPositions.length; ++i) {
            usedPositions[i] = new Array<Letter>(15);
        }
        const position: Vec2[] = [{ x: 0, y: 1 }];
        usedPositions[1][0] = D;
        usedPositions[2][0] = A;
        usedPositions[3][0] = B;
        usedPositions[4][0] = C;
        const array: Letter[] = [];
        const arrayPosition: Vec2[] = [];

        service['checkBottomTopSide'](position, array, arrayPosition, 0, usedPositions);
        // const word: string = service['fromLettersToString'](array);

        expect(array).toEqual([D, A, B, C]);
        expect(arrayPosition).toEqual([
            { x: 0, y: 1 },
            { x: 0, y: 2 },
            { x: 0, y: 3 },
            { x: 0, y: 4 },
        ]);
    });
});
