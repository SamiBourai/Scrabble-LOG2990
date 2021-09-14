import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidMotComponent } from './valid-mot.component';

describe('ValidMotComponent', () => {
  let component: ValidMotComponent;
  let fixture: ComponentFixture<ValidMotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidMotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidMotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
