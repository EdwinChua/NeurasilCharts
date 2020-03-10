import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeurasilChartsToolbarComponent } from './neurasil-charts-toolbar.component';

describe('NeurasilChartsComponent', () => {
  let component: NeurasilChartsToolbarComponent;
  let fixture: ComponentFixture<NeurasilChartsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeurasilChartsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurasilChartsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
