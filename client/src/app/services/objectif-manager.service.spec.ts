import { TestBed } from '@angular/core/testing';
import { ObjectifManagerService } from './objectif-manager.service';


describe('ObjectifManagerService', () => {
    let service: ObjectifManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ObjectifManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
