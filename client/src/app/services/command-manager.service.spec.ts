import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CommandManagerService } from './command-manager.service';

describe('CommandManagerService', () => {
    let service: CommandManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(CommandManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
