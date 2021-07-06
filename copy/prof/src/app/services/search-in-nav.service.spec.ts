import { TestBed } from '@angular/core/testing';

import { SearchInNavService } from './search-in-nav.service';

describe('SearchInNavService', () => {
  let service: SearchInNavService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchInNavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
