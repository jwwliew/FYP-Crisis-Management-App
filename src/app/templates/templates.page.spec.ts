import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesPage } from './templates.page';

describe('TemplatesPage', () => {
  let component: TemplatesPage;
  let fixture: ComponentFixture<TemplatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
