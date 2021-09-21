import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';


fdescribe('MessageService', () => {
    let service: MessageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MessageService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('it should confirm that string possess an !', () => {
        const text = '!bonjour';
        expect(service.comOrChat(text)).toBeTrue();
    });

    it('it should confirm that string dont possess an !', () => {
        const text = 'bonjour';
        expect(service.comOrChat(text)).toBeFalse();
    });

    it('it should confirm that string dont possess an !', () => {
        const text = 'bonjour!';
        expect(service.comOrChat(text)).toBeFalse();
    });
});
