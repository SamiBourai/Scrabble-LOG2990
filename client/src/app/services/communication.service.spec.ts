import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Message } from '@app/classes/message';
import { CommunicationService } from '@app/services/communication.service';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        // eslint-disable-next-line dot-notation -- baseUrl is private and we need access for the test
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return expected message (HttpClient called once)', () => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };

        // check the content of the mocked call
        service.basicGet().subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title);
            expect(response.body).toEqual(expectedMessage.body);
        }, fail);

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        // actually send the request
        req.flush(expectedMessage);
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- We explicitly need an empty function
        service.basicPost(sentMessage).subscribe(() => {}, fail);
        const req = httpMock.expectOne(`${baseUrl}/example/send`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(sentMessage);
    });

    it('should handle http error safely', () => {
        service.basicGet().subscribe((response: Message) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occurred'));
    });
});
