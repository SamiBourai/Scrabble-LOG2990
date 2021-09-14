import { TestBed } from '@angular/core/testing';

import { ValidWorldService } from './valid-world.service';

describe('ValidWorldService', () => {
    let service: ValidWorldService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ValidWorldService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
