import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ValidWorldService } from './valid-world.service';

describe('ValidWorldService', () => {
    let service: ValidWorldService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(ValidWorldService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('test_getDictionary', () => {
        expect(service.verify_word('bonjour')).toBeUndefined();
    });

    it('test_loadDictionary', async () => {
        const words = ['pomme', 'punaise', 'banane'];
        spyOn<any>(service, 'get_dictionary').and.returnValue(of(words));
        await service.load_dictionary();
        const dict = service['dictionary'];
        expect(dict?.length).toEqual(2);
    });

    it('test_verifyWord', () => {
        expect(service.verify_word('bonjour')).toBeUndefined();
    });

    it('test_verifyWord', () => {
        service['dictionary'] = [new Set(['amende'])];
        expect(service.verify_word('')).toBeUndefined();
    });

    it('test_verifyWord', () => {
        service['dictionary'] = [new Set(['amende'])];
        expect(service.verify_word('amende')).toBeTrue();
    });

    it('test_verifyWord', () => {
        service['dictionary'] = [new Set(['amende'])];
        expect(service.verify_word('allemand')).toBeFalse();
    });
});
