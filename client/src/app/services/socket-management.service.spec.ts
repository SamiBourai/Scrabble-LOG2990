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
import { EaselLogiscticsService } from './easel-logisctics.service';
import { ReserveService } from './reserve.service';
import { SocketManagementService } from './socket-management.service';
import SpyObj = jasmine.SpyObj;

describe('SocketManagementService', () => {
    let service: SocketManagementService;
    let socketMock: SocketMock;
    let reserveServiceSpy: SpyObj<ReserveService>;
    let easelLogicSpy : SpyObj<EaselLogiscticsService>;
    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('reserveService ', ['getRandomLetter', 'isReserveEmpty', 'reFillReserve', 'redefineReserve']);
        easelLogicSpy = jasmine.createSpyObj('easelLogic', ['fillEasel']);
        socketMock = new SocketMock();
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
            { provide: ReserveService, useValue: reserveServiceSpy },
            {provide: EaselLogiscticsService, useValue: easelLogicSpy},
        ]
        }).compileComponents();
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
    it('should call listen', async (done) => {
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
    it('should call getRooms', async (done) => {
        jasmine.clock().install();
        const event = 'createdGames';
        const message: MessageServer = {gameName: 'test'} as MessageServer;
        const obs = service.getRooms();
        obs.subscribe((res) =>{
            expect(res[0].gameName).toEqual('test');
            done();
        });
        socketMock.peerSideEmit(event, message);
        jasmine.clock().tick(1);
        jasmine.clock().uninstall();
    });
    it('should call reserveToServer', () => {
        const socketEmitSpy = spyOn(service['socket'], 'emit');
        service.reserveToServer('createGame', 'test1', new Map(), 1,[] );
        expect(socketEmitSpy).toHaveBeenCalled();
    });
    it('should call reserveToClient', () => {
        const socketOnSpy = spyOn(service['socket'], 'on');
        reserveServiceSpy.redefineReserve.and.callThrough();
        const event = 'reserveToClient';
        socketMock.peerSideEmit(event, new Map, 0, []);
        service.reserveToClient();
        expect(socketOnSpy).toHaveBeenCalled();
    });
    it('should call reserveToJoinOnfirstTurn with first = true ', ()=> {
        const socketEmitSpy = spyOn(service['socket'], 'emit');
        const socketOnSpy = spyOn(service['socket'], 'on').and.callThrough();
        const spyReserveToserver = spyOn(service, 'reserveToServer');
        const event = 'updateReserveInClient'; 
        service['first'] = true;
        service.reserveToJoinOnfirstTurn('test');
        socketMock.peerSideEmit(event, new Map(), 0, []);
        expect(socketEmitSpy).toHaveBeenCalled();
        expect(socketOnSpy).toHaveBeenCalled();
        expect(spyReserveToserver).toHaveBeenCalled();
    });
    it('should call reserveToJoinOnfirstTurn with first = false ', ()=> {
        const socketEmitSpy = spyOn(service['socket'], 'emit');
        const socketOnSpy = spyOn(service['socket'], 'on').and.callThrough();
        const spyReserveToserver = spyOn(service, 'reserveToServer');
        const event = 'updateReserveInClient'; 
        service['first'] = false;
        service.reserveToJoinOnfirstTurn('test');
        socketMock.peerSideEmit(event, new Map(), 0, []);
        expect(socketEmitSpy).toHaveBeenCalled();
        expect(socketOnSpy).toHaveBeenCalled();
        expect(spyReserveToserver).not.toHaveBeenCalled();
    });
    it('should call reserveClient', ()=> {
        const socketOnSpy = spyOn(service['socket'], 'on').and.callThrough();
        const event = 'updateReserveInClient'; 
        service.reserveToClient();
        socketMock.peerSideEmit(event, '', 0, []);
        expect(socketOnSpy).toHaveBeenCalled();
    });

});
