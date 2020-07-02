import { TestBed } from '@angular/core/testing';

import { DiscardChangeGuard } from './discard-change.guard';

describe('DiscardChangeGuard', () => {
  let guard: DiscardChangeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DiscardChangeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
