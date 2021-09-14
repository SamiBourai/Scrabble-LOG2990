import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUserNameComponent } from './modal-user-name.component';

describe('ModalUserNameComponent', () => {
  let component: ModalUserNameComponent;
  let fixture: ComponentFixture<ModalUserNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalUserNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUserNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
