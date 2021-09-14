import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameSoloComponent } from './name-solo.component';

describe('NameSoloComponent', () => {
  let component: NameSoloComponent;
  let fixture: ComponentFixture<NameSoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameSoloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
