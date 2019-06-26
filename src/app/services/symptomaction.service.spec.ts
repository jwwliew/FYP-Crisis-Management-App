import { TestBed } from '@angular/core/testing';

import { SymptomActionService } from './symptomaction.service';

describe('SettingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SymptomActionService = TestBed.get(SymptomActionService);
    expect(service).toBeTruthy();
  });
});
