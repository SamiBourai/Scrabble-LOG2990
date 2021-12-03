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
        stub.restore();
    });

    it('get words sould return allumette', async () => {
        Sinon.replace(validateWordService, 'getCompressedWords', async () => Promise.resolve(Buffer.from(jsonZstB64Str, 'base64')));
        const getW = await validateWordService.getWords();
        expect(getW[0]).to.equal('allumette');
    });

    it('getNotCompresseWord() should return an array buffer', async () => {
        const loadableDictionary = { word: 'allumette' };
        const strifiedWord = JSON.stringify(loadableDictionary);
        await fs.writeFile('./assets/Dictionaries/sami.json', strifiedWord);
        const stub = Sinon.stub(fs, 'readFile');
        await validateWordService.getNotCompressedWords('sami');
        expect(stub.calledOnce).to.be.true;
        await fs.unlink('./assets/Dictionaries/sami.json');
        stub.restore();
    });

    it('getWordsNotDefault() should return a stringfied word', async () => {
        const loadableDictionary = { word: 'allumette' };
        const strifiedWord = JSON.stringify(loadableDictionary);
        await fs.writeFile('./assets/Dictionaries/file1.json', strifiedWord);
        Sinon.replace(validateWordService, 'getNotCompressedWords', async () => Promise.resolve(Buffer.from(jsonZstB64Str, 'base64')));
        await validateWordService.getWordsNotDefault('file1').then(async (wordX) => {
            return expect(wordX).to.equal('allumette');
        });
        // expect().to.equal('allumette');
        await fs.unlink('./assets/Dictionaries/file1.json');
    });

    // it('loadDictionary should set dictionary to non empty', async () => {
    //     const words = ['pomme', 'punaise', 'banane'];
    //     Sinon.replace(validateWordService, 'getWords', async () => Promise.resolve(words));
    //     await validateWordService.loadDictionary(['dictionnaire', 'ditionnaire2']);
    //     const dict = validateWordService['dictionary'];
    //     expect(dict?.length).to.equal(2);
    // });
});
