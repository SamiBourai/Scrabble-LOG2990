import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { ObjectifManagerService } from '@app/services/objectif-manager.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { UserService } from '@app/services/user.service';
import { MessageServer } from '@app/classes/message-server';

import { JoinMultiplayerGameComponent } from './join-multiplayer-game.component';

describe('JoinMultiplayerGameComponent', () => {
  let component: JoinMultiplayerGameComponent;
  let fixture: ComponentFixture<JoinMultiplayerGameComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let objectifManagerServiceSpy: jasmine.SpyObj<ObjectifManagerService>;
  let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
  let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
  let multiplayerModeServiceSpy: jasmine.SpyObj<MultiplayerModeService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers']);
    objectifManagerServiceSpy = jasmine.createSpyObj('ObjectifManagerService', ['setGameTime']);
    formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['setValue', 'group']);
    socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms']);
    multiplayerModeServiceSpy = jasmine.createSpyObj('multiplayerModeService', ['setGuestPlayerInformation']);
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinMultiplayerGameComponent ],
      imports: [HttpClientModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ObjectifManagerService, useValue: objectifManagerServiceSpy },
        { provide: FormBuilder, useValue: formBuilderSpy },
        { provide: SocketManagementService, useValue: socketManagementServiceSpy },
        { provide: MultiplayerModeService, useValue: multiplayerModeServiceSpy },
    ],
    })
    .compileComponents();
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
    //const randomGame = component.rooms[Math.floor(Math.random() * component.rooms.length)];
    let joinGameSpy = spyOn(component, 'joinGame');
    component.randomGame();
    expect(joinGameSpy).toHaveBeenCalled();
    expect(component.disableBtn).toBeTrue();
  });

  it('joinGame dans if', () => {
    const pseudoRoom = {
      room: ''
    } as unknown as MessageServer;
    //objectifManagerServiceSpy.log2990Mode = true;
    component['objectifManagerService'].log2990Mode = true;
    component.joinGame(pseudoRoom);
    expect(component['objectifManagerService'].generateObjectifs(userServiceSpy.playMode)).toHaveBeenCalled();
  });

  it('joinGame else', () => {
    const pseudoRoom = {
      room: ''
    } as unknown as MessageServer;
    //objectifManagerServiceSpy.log2990Mode = true;
    component['objectifManagerService'].log2990Mode = false;
    component.joinGame(pseudoRoom);
    expect(component.roomJoined).toBeTrue();
  });
});
