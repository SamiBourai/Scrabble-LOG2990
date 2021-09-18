import { TestBed } from '@angular/core/testing';

import { MouseHandelingService } from './mouse-handeling.service';

describe('MouseHandelingService', () => {
  let service: MouseHandelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseHandelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
