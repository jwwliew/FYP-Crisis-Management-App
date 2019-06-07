import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlanPage } from './new-plan.page';

describe('NewPlanPage', () => {
  let component: NewPlanPage;
  let fixture: ComponentFixture<NewPlanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPlanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPlanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
