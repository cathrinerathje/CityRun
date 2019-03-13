import { TestBed } from '@angular/core/testing';

import { SygicPlacesService } from './sygic-places.service';

describe('SygicPlacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SygicPlacesService = TestBed.get(SygicPlacesService);
    expect(service).toBeTruthy();
  });
});
