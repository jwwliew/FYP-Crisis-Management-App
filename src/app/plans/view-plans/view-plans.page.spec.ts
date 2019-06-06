import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPlansPage } from './view-plans.page';

describe('ViewPlansPage', () => {
  let component: ViewPlansPage;
  let fixture: ComponentFixture<ViewPlansPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPlansPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPlansPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
