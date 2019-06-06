import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplatesPage } from './view-templates.page';

describe('ViewTemplatesPage', () => {
  let component: ViewTemplatesPage;
  let fixture: ComponentFixture<ViewTemplatesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTemplatesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTemplatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
