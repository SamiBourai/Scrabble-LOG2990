/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */

import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerService } from './virtual-player.service';

fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    // let validWordService: ValidWordService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should test the first case of the switch', (done) => {
        service.isDicFille = false;
        service.first = true;
        spyOn(Math, 'random').and.returnValue(0);
        const generateVrPlayerSpy = spyOn<any>(service, 'generateVrPlayerEasel').and.callThrough();
        // spyOn(validWordService, 'generateAllWordsPossible').and.callThrough();
        service.manageVrPlayerActions();
        setTimeout(() => {
            expect(generateVrPlayerSpy).toHaveBeenCalled();
            done();
        }, 3000);
    });
});
