import { TestBed } from '@angular/core/testing';

import { GooglePlacesProviderService } from './google-places-provider.service';

describe('GooglePlacesProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GooglePlacesProviderService = TestBed.get(GooglePlacesProviderService);
    expect(service).toBeTruthy();
  });
});
