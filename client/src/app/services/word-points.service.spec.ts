import { TestBed } from '@angular/core/testing';

import { WordPointsService } from './word-points.service';

describe('WordPointsService', () => {
  let service: WordPointsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordPointsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
