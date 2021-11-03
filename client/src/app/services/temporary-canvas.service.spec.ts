import { TestBed } from '@angular/core/testing';

import { TemporaryCanvasService } from './temporary-canvas.service';

describe('TemporaryCanvasService', () => {
  let service: TemporaryCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
