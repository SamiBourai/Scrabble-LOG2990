import { TestBed } from '@angular/core/testing';

import { SocketManagementService } from './socket-management.service';

describe('SocketManagementService', () => {
  let service: SocketManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocketManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
