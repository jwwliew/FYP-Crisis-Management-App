import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomActionPage } from './symptom-action.page';

describe('SymptomActionPage', () => {
  let component: SymptomActionPage;
  let fixture: ComponentFixture<SymptomActionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SymptomActionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SymptomActionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
