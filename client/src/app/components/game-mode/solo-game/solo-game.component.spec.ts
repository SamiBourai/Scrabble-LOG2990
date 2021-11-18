import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloGameComponent } from './solo-game.component';

describe('SoloGameComponent', () => {
  let component: SoloGameComponent;
  let fixture: ComponentFixture<SoloGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoloGameComponent ]
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
});
