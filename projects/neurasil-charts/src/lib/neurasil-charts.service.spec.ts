import { TestBed } from '@angular/core/testing';

import { NeurasilChartsService } from './neurasil-charts.service';

describe('NeurasilChartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeurasilChartsService = TestBed.get(NeurasilChartsService);
    expect(service).toBeTruthy();
  });
});
