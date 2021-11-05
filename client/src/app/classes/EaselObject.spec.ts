import { A, B, EASEL_LENGTH, NOT_A_LETTER } from '@app/constants/constants';
import { EaselObject } from './EaselObject';
import { Letter } from './letter';

describe('Object: Easel', () => {
    let Object: EaselObject;

    beforeEach(() => {
        Object = new EaselObject(true);
    });

    it('should return 7 easelSize on getEaselSize', () => {
        Object.easelLetters = [A, A, A, A, A, A, A];
        const size: number = Object.getEaselSize();
        // console.log(size);
        expect(size).toEqual(7);
    });

    it('should return 0 easelSize on getEaselSize', () => {
        Object.easelLetters = [NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER];
        const size: number = Object.getEaselSize();
        console.log(size);
        expect(size).toEqual(0);
    });

    it('should return easelSize on getEaselSize', () => {
        Object.easelLetters = [A, A, A, A, A, NOT_A_LETTER, NOT_A_LETTER];
        const size: number = Object.getEaselSize();
        // console.log(size);
        expect(size).toEqual(5);
    });

    it('should add letter on add', () => {
        const letter: Letter = A;
        const index = 1;
        Object.add(letter, index);
        expect(Object.easelLetters[index]).toBe(A);
    });

    it('should reset variables on resetVariables', () => {
        let foundLetterTest = new Array<boolean>(EASEL_LENGTH);
        foundLetterTest = [false, false, false, false, false, false, false];
        Object.resetVariables();
        expect(Object.foundLetter).toEqual(foundLetterTest);
        expect(Object.indexTempLetters).toEqual([]);
    });

    it('should reset TempIndex on resetTempIndex', () => {
        let posTempLettersTest = new Array<boolean>(EASEL_LENGTH);
        posTempLettersTest = [false, false, false, false, false, false, false];
        Object.resetTempIndex();
        expect(Object.posTempLetters).toEqual(posTempLettersTest);
        expect(Object.indexTempLetters).toEqual([]);
    });

    it('should return string of easel on toString', () => {
        const letter: Letter = A;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            Object.add(letter, j);
        }
        Object.toString();
        const stringTest = '[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]';
        expect(Object.easelLetters.toString()).toEqual(stringTest);
    });

    it('should return string2 of easel on toString', () => {
        const letter: Letter = NOT_A_LETTER;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            Object.add(letter, j);
        }
        Object.toString();
        const stringTest = '[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]';
        expect(Object.easelLetters.toString()).toEqual(stringTest);
    });

    // it('should return string - | of easel on toString', () => {
    //     Object.easelLetters = [NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER, NOT_A_LETTER];
    //     Object.toString();
    //     const stringTest = '- | - | - | - | - | - | - | ';
    //     expect(Object.easelLetters.toString()).toBe(stringTest);
    // });

    // it('should return string | of easel on toString', () => {
    //     Object.easelLetters = [A, A, A, A, A, A, A];
    //     Object.toString();
    //     const stringTest = 'a | a | a | a | a | a | a | ';
    //     expect(Object.easelLetters.toString()).toBe(stringTest);
    // });

    it('should return points on pointInEasel', () => {
        const letter: Letter = A;
        for (let j = 0; j < EASEL_LENGTH; j++) {
            Object.add(letter, j);
        }
        const pointsReturn = 7;
        const pointsTest = Object.pointInEasel();
        expect(pointsTest).toEqual(pointsReturn);
    });

    it('should return true on contains', () => {
        Object.foundLetter = [false, false, false, false, false, false, false];
        const word = 'aaaaaaa';
        Object.easelLetters = [A, A, A, A, A, A, A];
        const boleanTest: boolean = Object.contains(word);
        expect(boleanTest).toBeTrue();
    });

    it('should return true on foundLetter contains', () => {
        Object.foundLetter = [false, false, false, false, false, false, false];
        const word = 'aaaaaaa';
        Object.easelLetters = [A, A, A, A, A, A, A];
        Object.contains(word);
        expect(Object.foundLetter).toEqual([true, true, true, true, true, true, true]);
    });

    it('should return false on contains', () => {
        Object.foundLetter = [true, true, true, true, true, true, true];
        const word = 'aaaSaaaa';
        Object.easelLetters = [B, B, B, B, B, B, B];
        const boleanTest: boolean = Object.contains(word);
        expect(boleanTest).toBeFalse();
    });
});
