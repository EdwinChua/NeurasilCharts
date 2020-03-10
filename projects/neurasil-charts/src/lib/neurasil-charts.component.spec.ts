import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeurasilChartsComponent } from './neurasil-charts.component';

describe('NeurasilChartsComponent', () => {
  let component: NeurasilChartsComponent;
  let fixture: ComponentFixture<NeurasilChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeurasilChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurasilChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
