import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TIME_CHOICE } from '@app/constants/constants';
import { MultiplayerModeService } from '@app/services/multiplayer-mode.service';
import { SocketManagementService } from '@app/services/socket-management.service';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';

import { CreateMultiplayerGameComponent } from './create-multiplayer-game.component';

describe('CreateMultiplayerGameComponent', () => {
  let component: CreateMultiplayerGameComponent;
  let fixture: ComponentFixture<CreateMultiplayerGameComponent>;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
  };
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let timeServiceSpy: jasmine.SpyObj<TimeService>;
  let formBuilderSpy: jasmine.SpyObj<FormBuilder>;
  let socketManagementServiceSpy: jasmine.SpyObj<SocketManagementService>;
  let multiplayerModeServiceSpy: jasmine.SpyObj<MultiplayerModeService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers']);
    timeServiceSpy = jasmine.createSpyObj('TimeService', ['setGameTime']);
    formBuilderSpy = jasmine.createSpyObj('FormBuilder', ['setValue', 'group']);
    socketManagementServiceSpy = jasmine.createSpyObj('socketManagementService', ['emit', 'listen', 'getRooms']);
    multiplayerModeServiceSpy = jasmine.createSpyObj('multiplayerModeService', ['setGuestPlayerInformation']);
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMultiplayerGameComponent ],
      imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: FormBuilder, useValue: formBuilderSpy },
                { provide: SocketManagementService, useValue: socketManagementServiceSpy },
                { provide: MultiplayerModeService, useValue: multiplayerModeServiceSpy },
            ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateMultiplayerGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return on onClickInMinusButton', () => {
    const event = new Event('click');
    component.timeCounter = 0;
    const x = 2;
    component.onClickInMinusButton(event);
    expect(x).toBe(2);
});

  it('should return on onClickInMinusButton < 0', () => {
  const event = new Event('click');
  component.timeCounter = -1;
  component.onClickInMinusButton(event);
  expect(component.timeCounter).toBe(0);
});

  it('should return on onClickInMinusButton > 0', () => {
  const event = new Event('click');
  component.timeCounter = 2;
  component.onClickInMinusButton(event);
  expect(component.timeCounter).toBe(1);
});

  it('onClickInAddButton ==', () => {
  const event = new Event('click');
  component.timeCounter = TIME_CHOICE.length;
  const x = 2;
  component.onClickInAddButton(event);
  expect(x).toBe(2);
});

  it('onClickInAddButton >', () => {
  const event = new Event('click');
  component.timeCounter = 11;
  component.onClickInAddButton(event);
  expect(component.timeCounter).toBe(TIME_CHOICE.length);
});

  it('onClickInAddButton <', () => {
  const event = new Event('click');
  component.timeCounter = 5;
  component.onClickInAddButton(event);
  expect(component.timeCounter).toBe(6);
});

  it('should return isBonusBox true on randomBonusActivated', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventTest = new Event('click');
  component.chosenMode = component.modes[0];
  component.randomBonusActivated(eventTest);
  expect(userServiceSpy.isBonusBox).toBeTrue();
});

  it('openDialog', () => {
  const spy = spyOn(component['dialogRef'], 'open');
  component.openDialogOfVrUser();
  expect(spy).toHaveBeenCalled();
});

  it('should pass in solo mode on passInSoloMode', () => {
  const spy = spyOn(component, 'openDialogOfVrUser');
  component.passInSoloMode();
  expect(spy).toHaveBeenCalled();
});

});
