import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrUserComponent } from './vr-user.component';

describe('VrUserComponent', () => {
  let component: VrUserComponent;
  let fixture: ComponentFixture<VrUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
