import { TestBed } from '@angular/core/testing';

import { PlayerPositionService } from './player-position.service';

describe('PlayerPositionService', () => {
  let service: PlayerPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
