import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MockMatchMediaProvider } from '@angular/flex-layout/core/typings/match-media';
import { FormBuilder } from '@angular/forms';
import { MessageServer } from '@app/classes/message-server';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { JoinMultiplayerGameComponent } from './join-multiplayer-game.component';

describe('JoinMultiplayerGameComponent', () => {
    let component: JoinMultiplayerGameComponent;
    let fixture: ComponentFixture<JoinMultiplayerGameComponent>;
    // let userServiceSpy: UserService;
    let userServiceSpy: jasmine.SpyObj<UserService>;
    let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
    // let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
    // let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
    // let multiplayerModeServiceSpy: jasmine.SpyObj<MultiplayerModeService>;
    const mockSocketManagementService = {
        listen: (name: string) => {
            return new BehaviorSubject(name).asObservable();
        },
        getRooms: () => '',
        emit: () => '',
    };
    const mockMultiplayerModeService = {
        // listen: (name: string) => {
        //     return new BehaviorSubject(name).asObservable()
        // },

        setGameInformations: () => '',
        // emit: () => ''
    };

    beforeEach(() => {
        userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers']);
        objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', ['setGameTime', 'generateObjectifs', 'choosedObjectifs']);
        // formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['setValue', 'group']);
        // socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms']);
        // multiplayerModeServiceSpy = jasmine.createSpyObj('multiplayerModeService', ['setGuestPlayerInformation', 'setGameInformations']);
        jasmine.getEnv().allowRespy(true);
        // userServiceSpy = TestBed.inject(UserService);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinMultiplayerGameComponent],
            imports: [HttpClientModule],
            providers: [
                FormBuilder,
                { provide: UserService, useValue: userServiceSpy },
                { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
                { provide: SocketManagementService, useValue: mockSocketManagementService },
                { provide: MultiplayerModeService, useValue: mockMultiplayerModeService },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinMultiplayerGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('randomGame', () => {
        component.rooms = [];
        // const randomGame = component.rooms[Math.floor(Math.random() * component.rooms.length)];
        const joinGameSpy = spyOn(component, 'joinGame');
        component.randomGame();
        expect(joinGameSpy).toHaveBeenCalled();
        expect(component.disableBtn).toBeTrue();
    });

    it('joinGame dans if', () => {
        const pseudoRoom = {
            room: '',
        } as unknown as MessageServer;
        // objectifManagerServiceSpy.log2990Mode = true;
        component.objectifManagerService.log2990Mode = true;
        const spy = spyOn(component.objectifManagerService, 'generateObjectifs');
        component.joinGame(pseudoRoom);
        expect(spy).toHaveBeenCalled();
        // expect(component.objectifManagerService.generateObjectifs(userServiceSpy.playMode)).toHaveBeenCalled();
    });

    it('joinGame else', () => {
        const pseudoRoom = {
            room: '',
        } as unknown as MessageServer;
        // objectifManagerServiceSpy.log2990Mode = true;
        component.objectifManagerService.log2990Mode = false;
        component.joinGame(pseudoRoom);
        expect(component.roomJoined).toBeTrue();
    });

    // it('generateRooms if', () => {
    //     component.roomJoined = true;
    //     component.generateRooms();
    //     expect()
    // });

    // it('generateRooms else', () => {
    //     component.roomJoined = false;
    //     const spy = spyOn(component['socketManagementService'], 'emit');
    //     const spy2 = spyOn(component['socketManagementService'], 'getRooms')
    //     component.generateRooms();
    //     expect(spy).toHaveBeenCalled();
    //     expect(spy2).toHaveBeenCalled();
    // });
});
