/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

import { ChatCommand } from '@app/classes/chat-command';
import { Letter } from '@app/classes/letter';
import { A, B, E, G, I, J, L, N, O, R, U, Z } from '@app/constants/constants';
import { decode as b64_decode } from 'base64-arraybuffer';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

// describe('ValidWorldService', () => {
//     let service: ValidWordService;

    const jsonZstB64Str =
        'KLUv/QRYdQUAMs0iG4CnSQf/MS6x+3+yiRBSt962HSaZkJOZokkYAQEjtIMDQgjIHAz3Q0cZ3BNa' +
        'wf3ynhSE6Z4IliSnkkR4N0yVhZKGcIXojgXd3Ug7QwIN69xLcWnuiTDRcUWQNXC3o065p5LI3a4U' +
        'Hnczppwy7unKOLsbDCGuTinuhrTiXrhC3NOIKyNwt5TspDE1QAwAYxshjF3hmCa4wsGzEywiCRJc' +
        '7rsyQnTe3qXhE4odMnaRDQ==';

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpClientModule],
//         });
//         service = TestBed.inject(ValidWordService);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

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

    it('adding word points of AIE should give 3 and doesnt recount an existing word', () => {
        service['dictionary'] = [new Set(['azzz', 'aie'])];

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

    it('test_verifyWord 2 WORDS THAT DOESNT MATCH', () => {
        service['dictionary'] = [new Set(['bonjour'])];
        expect(service.verifyWord([A, R, G, I, L, E])).toBeFalse();
    });
});
