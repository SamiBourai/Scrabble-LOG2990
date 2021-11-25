/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MessageServer } from '@app/classes/message-server';
import { SocketMock } from '@app/classes/socket-mock';
import { Socket } from 'ngx-socket-io';
import { SocketManagementService } from './socket-management.service';

fdescribe('SocketManagementService', () => {
    let service: SocketManagementService;
    let socketMock: SocketMock;
    beforeEach(() => {
        socketMock = new SocketMock();
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(SocketManagementService);
        service['socket'] = socketMock as unknown as Socket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should pass on emit',() => {
        const socketEmitSpy = spyOn(service['socket'], 'emit');
        service.emit('createGame', {gameName : 'test1'});
        expect(socketEmitSpy).toHaveBeenCalled();
    });

    it('should so something if something', async (done) => {
        jasmine.clock().install();
        const event = 'event';
        const message: MessageServer = {} as MessageServer;
        const obs = service.listen(event);
        obs.subscribe((res) =>{
            expect((res as unknown as MessageServer[])[0]).toBe(message);
            done();
        });
        socketMock.peerSideEmit(event, message);
        jasmine.clock().tick(1);
        jasmine.clock().uninstall();
    });
});
