import { TestBed } from '@angular/core/testing';
import { MultiplayerModeService } from './multiplayer-mode.service';

describe('MultiplayerModeService', () => {
    let service: MultiplayerModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MultiplayerModeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
