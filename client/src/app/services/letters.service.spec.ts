import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Letter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z } from '@app/constants/constants';
import { LettersService } from './letters.service';

describe('LettersService', () => {
    let service: LettersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LettersService);

        const width = 15;
        const height = 25;
        // eslint-disable-next-line -- createCanvas is private and we need access for the test
        service.gridContext = CanvasTestHelper.createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    //test placeLetter() method
    it('place letter should add latter to tile and call drawImag()', (done) => {
        let vector: Vec2 = { x: 1, y: 1 };
        const drawImageSpy = spyOn(service.gridContext, 'drawImage');

        service.placeLetter(A, vector);
        expect(service.tiles[0][0]).toEqual(A);
        setTimeout(() => {
            expect(drawImageSpy).toHaveBeenCalled();
            done();
        }, 1000);
    });

    //test boxIsEmpty() method
    it('boxIsEmpty should return true because the box is empty', () => {
        let vector: Vec2 = { x: 1, y: 1 };
        expect(service.boxIsEmpty(vector)).toEqual(true);
    });

    it('boxIsEmpty should return false because the box is not empty', () => {
        let vector1: Vec2 = { x: 1, y: 2 };
        let vector2: Vec2 = { x: 2, y: 2 };
        let vector3: Vec2 = { x: 3, y: 2 };
        let letterArray: Letter[] = [A, B, C, C, C, C, C, C, C, C, C, C, C, C, C];
        service.tiles[1] = letterArray;

        expect(service.boxIsEmpty(vector1)).toEqual(false);
        expect(service.boxIsEmpty(vector2)).toEqual(false);
        expect(service.boxIsEmpty(vector3)).toEqual(false);
    });

    //test wordIsPlaced()
    it('should return true', () => {});

    // test fromWordToLetter() method
    it('should return an array of caractere of the word passed in parametters', () => {
        const word: string = 'Manger';

        //  const wordArray:Letter[]=[M,A,N,G,E,R];
        const getTheLetterSpyOn = spyOn(service, 'getTheLetter');
        // let wordArray:Letter[];
        service.fromWordToLetters(word);
        // console.log("word to array of letter : "+wordArray[1]);
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
        expect(service.getTheLetter('9')).toBe(A);
    });
});
