import { TestBed } from '@angular/core/testing';

import { EaselLogiscticsService } from './easel-logisctics.service';

describe('EaselLogiscticsService', () => {
    let service: EaselLogiscticsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EaselLogiscticsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
