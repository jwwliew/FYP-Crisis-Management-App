import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Text3Page } from './text3.page';

describe('Text3Page', () => {
  let component: Text3Page;
  let fixture: ComponentFixture<Text3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Text3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Text3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
