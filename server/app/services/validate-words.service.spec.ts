/* eslint-disable import/no-named-as-default */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { A, B, E, R } from '@app/classes/constants';
import { Letter } from '@app/classes/letters';
import { expect } from 'chai';
import { promises as fs } from 'fs';
import Container from 'typedi';
import { ValidWordService } from './validate-words.service';
import Sinon = require('sinon');

// eslint-disable-next-line no-restricted-imports

describe('ValidWordService', () => {
    let validateWordService: ValidWordService;
    const letter: Letter[] = [A, R, B, R, E];
    const jsonZstB64Str =
        'KLUv/QRYdQUAMs0iG4CnSQf/MS6x+3+yiRBSt962HSaZkJOZokkYAQEjtIMDQgjIHAz3Q0cZ3BNa' +
        'wf3ynhSE6Z4IliSnkkR4N0yVhZKGcIXojgXd3Ug7QwIN69xLcWnuiTDRcUWQNXC3o065p5LI3a4U' +
        'Hnczppwy7unKOLsbDCGuTinuhrTiXrhC3NOIKyNwt5TspDE1QAwAYxshjF3hmCa4wsGzEywiCRJc' +
        '7rsyQnTe3qXhE4odMnaRDQ==';
    beforeEach(() => {
        validateWordService = Container.get(ValidWordService);
    });
    afterEach(async () => {});

    it('1verifyWord does not exist dhould return false', () => {
        const verigyword: boolean = validateWordService.verifyWord(letter);
        expect(verigyword).to.be.false;
    });
    it('3verifyWord does not exist dhould return false', () => {
        validateWordService['dictionary'] = [];
        const verigyword: boolean = validateWordService.verifyWord([]);
        expect(verigyword).to.be.false;
    });

    it('4verifyWord does not exist dhould return false', () => {
        validateWordService['dictionary'] = [new Set()];
        const verigyword: boolean = validateWordService.verifyWord(letter);
        expect(verigyword).to.be.false;
    });
    it('5verifyWord dhould return true', () => {
        validateWordService['dictionary'] = [new Set(['arbre'])];
        const verigyword: boolean = validateWordService.verifyWord(letter);
        expect(verigyword).to.be.true;
    });

    it('get compressed should be true after dictionary compression', async () => {
        const stub = Sinon.stub(fs, 'readFile');

        await validateWordService.getCompressedWords();
        expect(stub.calledOnce).to.be.true;
    });

    it('get words sould return allumette', async () => {
        Sinon.replace(validateWordService, 'getCompressedWords', async () => Promise.resolve(Buffer.from(jsonZstB64Str, 'base64')));
        const getW = await validateWordService.getWords();
        expect(getW[0]).to.equal('allumette');
    });

    it('loadDictionary should set dictionary to non empty', async () => {
        const words = ['pomme', 'punaise', 'banane'];
        Sinon.replace(validateWordService, 'getWords', async () => Promise.resolve(words));
        await validateWordService.loadDictionary();
        const dict = validateWordService['dictionary'];
        expect(dict?.length).to.equal(2);
    });
});
