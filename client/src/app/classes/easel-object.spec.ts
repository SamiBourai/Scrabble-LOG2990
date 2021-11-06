/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { A, B, EASEL_LENGTH, NOT_A_LETTER } from '@app/constants/constants';
import { EaselObject } from './easel-object';
import { Letter } from './letter';

describe('Object: Easel', () => {
    let object: EaselObject;

    beforeEach(() => {
        object = new EaselObject(true);
    });

    it('should return 7 easelSize on getEaselSize', () => {
        object.easelLetters = [A, A, A, A, A, A, A];
        const size: number = object.getEaselSize();

        expect(size).toEqual(7);
    });

    it('should return 0 easelSize on getEaselSize', () => {
        object.easelLetters = [NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER];
        const size: number = object.getEaselSize();

        expect(size).toEqual(0);
    });

    it('should return easelSize on getEaselSize', () => {
        object.easelLetters = [A, A, A, A, A, NOT_A_LETTER, NOT_A_LETTER];
        const size: number = object.getEaselSize();

        expect(size).toEqual(5);
    });

    it('should add letter on add', () => {
        const letter: Letter = A;
        const index = 1;
        object.add(letter, index);
        expect(object.easelLetters[index]).toBe(A);
    });

    it('should reset variables on resetVariables', () => {
        let foundLetterTest = new Array<boolean>(EASEL_LENGTH);
        foundLetterTest = [false, false, false, false, false, false, false];
        object.resetVariables();
        expect(object.foundLetter).toEqual(foundLetterTest);
        expect(object.indexTempLetters).toEqual([]);
    });

    it('should reset TempIndex on resetTempIndex', () => {
        let posTempLettersTest = new Array<boolean>(EASEL_LENGTH);
        posTempLettersTest = [false, false, false, false, false, false, false];
        object.resetTempIndex();
        expect(object.posTempLetters).toEqual(posTempLettersTest);
        expect(object.indexTempLetters).toEqual([]);
    });

    it('should return string of easel on toString', () => {
        const letter: Letter = A;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            object.add(letter, j);
        }
        object.toString();
        const stringTest = '[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]';
        expect(object.easelLetters.toString()).toEqual(stringTest);
    });

    it('should return string2 of easel on toString', () => {
        const letter: Letter = NOT_A_LETTER;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            object.add(letter, j);
        }
        object.toString();
        const stringTest = '[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]';
        expect(object.easelLetters.toString()).toEqual(stringTest);
    });

    it('should return points on pointInEasel', () => {
        const letter: Letter = A;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            object.add(letter, j);
        }
        const pointsReturn = 7;
        const pointsTest = object.pointInEasel();
        expect(pointsTest).toEqual(pointsReturn);
    });

    // it('should return true on contains', () => {
    //     object.foundLetter = [false, false, false, false, false, false, false];
    //     const word = 'aaaaaaa';
    //     object.easelLetters = [A, A, A, A, A, A, A];
    //     const boleanTest: boolean = object.contains(word);
    //     expect(boleanTest).toBeTrue();
    // });

    // it('should return true on foundLetter contains', () => {
    //     object.foundLetter = [false, false, false, false, false, false, false];
    //     const word = 'aaaaaaa';
    //     object.easelLetters = [A, A, A, A, A, A, A];
    //     object.contains(word);
    //     expect(object.foundLetter).toEqual([true, true, true, true, true, true, true]);
    // });

    it('should return false on contains', () => {
        object.foundLetter = [true, true, true, true, true, true, true];
        const word = 'aaaSaaaa';
        object.easelLetters = [B, B, B, B, B, B, B];
        const boleanTest: boolean = object.contains(word);
        expect(boleanTest).toBeFalse();
    });
});
