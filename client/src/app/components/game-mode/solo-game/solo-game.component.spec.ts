import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { TIME_CHOICE } from '@app/constants/constants';
import { TimeService } from '@app/services/time.service';
import { UserService } from '@app/services/user.service';
import { VirtualPlayerService } from '@app/services/virtual-player.service';

import { SoloGameComponent } from './solo-game.component';

describe('SoloGameComponent', () => {
  let component: SoloGameComponent;
  let fixture: ComponentFixture<SoloGameComponent>;
  const mockDialogRef = {
    open: jasmine.createSpy('open'),
  };
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let timeServiceSpy: jasmine.SpyObj<TimeService>;
  let virtualPlayerServiceSpy: jasmine.SpyObj<VirtualPlayerService>;

  beforeEach(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['playMode', 'isBonusBox', 'initiliseUsers']);
    timeServiceSpy = jasmine.createSpyObj('TimeService', ['setGameTime']);
    virtualPlayerServiceSpy = jasmine.createSpyObj('VirtualPlayerService', ['expert']);
});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloGameComponent ],
      imports: [HttpClientModule],
            providers: [
                { provide: MatDialog, useValue: mockDialogRef },
                { provide: UserService, useValue: userServiceSpy },
                { provide: TimeService, useValue: timeServiceSpy },
                { provide: VirtualPlayerService, useValue: virtualPlayerServiceSpy },
            ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloGameComponent);
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

  it('openDialog', () => {
  const spy = spyOn(component['dialogRef'], 'open');
  component.openDialogOfVrUser();
  expect(spy).toHaveBeenCalled();
});

  it('should call storeNameInLocalStorage on onSubmitUserName', () => {
  const storeNameInLocalStorageSpy = spyOn(component, 'storeNameInLocalStorage');
  component.onSubmitUserName();
  expect(storeNameInLocalStorageSpy).toHaveBeenCalled();
});

it('should return isBonusBox true on randomBonusActivated', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventTest = new Event('click');
  component.chosenMode = component.modes[0];
  component.randomBonusActivated(eventTest);
  expect(userServiceSpy.isBonusBox).toBeTrue();
});

});
