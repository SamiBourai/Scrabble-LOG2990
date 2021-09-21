import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { A, B, E, G, I, J, L, N, O, R, U } from '@app/constants/constants';
import { decode as b64_decode } from 'base64-arraybuffer';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidWordService } from './valid-world.service';

fdescribe('ValidWorldService', () => {
    let service: ValidWordService;

    const json_zst_b64_str =
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

    it('get_compressed_words should return an observable of type arraybuffer', async () => {
        const ab = new ArrayBuffer(8);
        spyOn<unknown>(service.http, 'get').and.returnValue(of(ab));
        const ab2 = await service.get_compressed_words().toPromise();
        expect(ab).toBe(ab2);
    });

    it('get_words should return multiple words', async () => {
        const json_zst_buf_obs = of(json_zst_b64_str).pipe(map((b64_str) => b64_decode(b64_str)));
        spyOn<unknown>(service, 'get_compressed_words').and.returnValue(json_zst_buf_obs);

        const words = await service.get_words().toPromise();
        expect(words.length).not.toBeUndefined();
        expect(words.length).toBeGreaterThan(0);
    });

    it('load_dictionary should set dictionary to non empty', async () => {
        const words = ['pomme', 'punaise', 'banane'];
        spyOn<unknown>(service, 'get_words').and.returnValue(of(words));

        await service.load_dictionary();
        const dict = service.dictionary;
        expect(dict?.length).toEqual(2);
    });

    it('test_getDictionary', () => {
        expect(service.verify_word([B, O, N, J, O, U, R])).toBeUndefined();
    });

    it('test_verifyWord', () => {
        expect(service.verify_word([B, O, N, J, O, U, R])).toBeUndefined();
    });

    it('test_verifyWord EMPTY WORD', () => {
        service.dictionary = [new Set(['amende'])];
        expect(service.verify_word([])).toBeUndefined();
    });

    it('test_verifyWord 2 WORDS THAT MATCH', () => {
        service.dictionary = [new Set(['arbre'])];
        expect(service.verify_word([A, R, B, R, E])).toBeTrue();
    });

    it('test_verifyWord 2 WORDS THAT DOESNT MATCH', () => {
        service.dictionary = [new Set(['bonjour'])];
        expect(service.verify_word([A, R, G, I, L, E])).toBeFalse();
    });
});
