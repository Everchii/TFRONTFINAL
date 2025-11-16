import { TestBed } from '@angular/core/testing';

import { Restaurants } from './restaurants';

describe('Restaurants', () => {
  let service: Restaurants;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Restaurants);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
