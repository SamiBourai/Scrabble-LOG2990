import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScoresComponent } from './modal-scores.component';

describe('ModalScoresComponent', () => {
  let component: ModalScoresComponent;
  let fixture: ComponentFixture<ModalScoresComponent>;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalScoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
