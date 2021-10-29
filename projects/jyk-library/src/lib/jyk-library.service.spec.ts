import { TestBed } from '@angular/core/testing';

import { JykLibraryService } from './jyk-library.service';

describe('JykLibraryService', () => {
  let service: JykLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JykLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
