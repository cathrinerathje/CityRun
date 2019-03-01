import { TestBed } from '@angular/core/testing';

import { NavProviderService } from './nav-provider.service';

describe('NavProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavProviderService = TestBed.get(NavProviderService);
    expect(service).toBeTruthy();
  });
});
