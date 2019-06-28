import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditplanPage } from './editplan.page';

describe('EditplanPage', () => {
  let component: EditplanPage;
  let fixture: ComponentFixture<EditplanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditplanPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
