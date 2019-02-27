import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SightsPage } from './sights.page';

describe('SightsPage', () => {
  let component: SightsPage;
  let fixture: ComponentFixture<SightsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SightsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
