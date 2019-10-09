import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportModalPage } from './import-modal.page';

describe('ImportModalPage', () => {
  let component: ImportModalPage;
  let fixture: ComponentFixture<ImportModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
