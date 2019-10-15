import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Text1Component } from './text1.component';

describe('Text1Component', () => {
  let component: Text1Component;
  let fixture: ComponentFixture<Text1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Text1Component ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Text1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
