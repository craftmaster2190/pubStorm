import { TestBed } from '@angular/core/testing';

import { StormService } from './storm.service';

describe('StormService', () => {
  let service: StormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
