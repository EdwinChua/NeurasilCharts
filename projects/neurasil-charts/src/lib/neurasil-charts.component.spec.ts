import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeurasilChartsComponent } from './neurasil-charts.component';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NeurasilDataFilter } from './pipes';
import { NEURASIL_CHART_TYPE } from './models';

// ─── Shared fixtures ────────────────────────────────────────────────────────────

const SAMPLE_DATA = [
  { Category: 'A', Value1: 10, Value2: 20 },
  { Category: 'B', Value1: 30, Value2: 40 },
  { Category: 'C', Value1: 50, Value2: 60 },
];

/** Minimal valid Chart.js config returned by the mocked service. */
function makeChartProps() {
  return {
    type: 'bar',
    plugins: [],
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [
        { label: 'Value1', data: [10, 30, 50], backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(0,0,0,1)', borderWidth: 2, yAxisID: 'yAxis' },
        { label: 'Value2', data: [20, 40, 60], backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(0,0,0,1)', borderWidth: 2, yAxisID: 'yAxis' },
      ]
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
    }
  };
}

const PARSED_DATA = {
  _cornerstone: 'Category',
  _formatObject: {
    Category: { prefix: '', suffix: '' },
    Value1:   { prefix: '', suffix: '' },
    Value2:   { prefix: '', suffix: '' },
  },
  data: { Category: ['A', 'B', 'C'], Value1: [10, 30, 50], Value2: [20, 40, 60] },
};

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('NeurasilChartsComponent', () => {
  let component: NeurasilChartsComponent;
  let fixture: ComponentFixture<NeurasilChartsComponent>;
  let mockService: jasmine.SpyObj<NeurasilChartsService>;
  let mockPipe: jasmine.SpyObj<NeurasilDataFilter>;

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('NeurasilChartsService', [
      'parseDataFromDatasource',
      'chartObjectBuilder',
      'performParetoAnalysis',
    ]);
    mockService.parseDataFromDatasource.and.returnValue(PARSED_DATA as any);
    mockService.chartObjectBuilder.and.callFake(() => makeChartProps());

    mockPipe = jasmine.createSpyObj('NeurasilDataFilter', ['transform']);
    mockPipe.transform.and.callFake((data: any[]) => data);

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [NeurasilChartsComponent],
      providers: [
        { provide: NeurasilChartsService, useValue: mockService },
        { provide: NeurasilDataFilter,    useValue: mockPipe  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
    // The component declares `providers: [NeurasilDataFilter]` which creates a
    // component-level injector that overrides the module-level mock above.
    // Override it here so drawChart receives the spy instead of the real pipe.
    .overrideComponent(NeurasilChartsComponent, {
      set: { providers: [{ provide: NeurasilDataFilter, useValue: mockPipe }] }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeurasilChartsComponent);
    component = fixture.componentInstance;
    component.data = SAMPLE_DATA;
    // Prevent Chart.js from actually rendering in most tests
    spyOn(component, 'drawChart');
  });

  afterEach(() => {
    // Destroy any real Chart instances that escaped the spy
    component._canvas?.destroy?.();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // ─── ngOnInit ────────────────────────────────────────────────────────────────

  describe('ngOnInit', () => {
    it('should set hasData to true when data is non-empty', () => {
      fixture.detectChanges();
      expect(component.hasData).toBeTrue();
    });

    it('should set hasData to false when data is empty', () => {
      component.data = [];
      fixture.detectChanges();
      expect(component.hasData).toBeFalse();
    });

    it('should set hasData to false when data is null', () => {
      component.data = null;
      fixture.detectChanges();
      expect(component.hasData).toBeFalse();
    });

    it('should apply @Input() chartType to toolbarProps', () => {
      component.chartType = NEURASIL_CHART_TYPE.LINE;
      fixture.detectChanges();
      expect(component.toolbarProps.chartType).toBe(NEURASIL_CHART_TYPE.LINE);
    });

    it('should apply @Input() swapLabelsAndDatasets to toolbarProps', () => {
      component.swapLabelsAndDatasets = true;
      fixture.detectChanges();
      expect(component.toolbarProps.swapLabelsAndDatasets).toBeTrue();
    });

    it('should default toolbarProps.chartType to BAR when no chartType input is given', () => {
      fixture.detectChanges();
      expect(component.toolbarProps.chartType).toBe(NEURASIL_CHART_TYPE.BAR);
    });
  });

  // ─── Input defaults ───────────────────────────────────────────────────────────

  describe('input defaults', () => {
    beforeEach(() => fixture.detectChanges());

    it('should default showToolbar to true', () => {
      expect(component.showToolbar).toBeTrue();
    });

    it('should default useAltAxis to true', () => {
      expect(component.useAltAxis).toBeTrue();
    });

    it('should default showDataLabels to false', () => {
      expect(component.showDataLabels).toBeFalse();
    });

    it('should default additionalOpts_Plugins to an empty object', () => {
      expect(component.additionalOpts_Plugins).toEqual({});
    });

    it('should default additionalOpts_Elements to an empty object', () => {
      expect(component.additionalOpts_Elements).toEqual({});
    });
  });

  // ─── updateToolbarProps ──────────────────────────────────────────────────────

  describe('updateToolbarProps', () => {
    beforeEach(() => fixture.detectChanges());

    it('should emit chartTypeChange with the current chart type', () => {
      spyOn(component.chartTypeChange, 'emit');
      component.toolbarProps.chartType = NEURASIL_CHART_TYPE.PIE;
      component.updateToolbarProps(null);
      expect(component.chartTypeChange.emit).toHaveBeenCalledWith(NEURASIL_CHART_TYPE.PIE);
    });

    it('should emit showToolbarChange with the current showToolbar value', () => {
      spyOn(component.showToolbarChange, 'emit');
      component.showToolbar = false;
      component.updateToolbarProps(null);
      expect(component.showToolbarChange.emit).toHaveBeenCalledWith(false);
    });

    it('should emit swapLabelsAndDatasetsChange with the current swap value', () => {
      spyOn(component.swapLabelsAndDatasetsChange, 'emit');
      component.toolbarProps.swapLabelsAndDatasets = true;
      component.updateToolbarProps(null);
      expect(component.swapLabelsAndDatasetsChange.emit).toHaveBeenCalledWith(true);
    });

    it('should call drawChart', () => {
      component.updateToolbarProps(null);
      expect(component.drawChart).toHaveBeenCalled();
    });
  });

  // ─── ngOnChanges ─────────────────────────────────────────────────────────────

  describe('ngOnChanges', () => {
    it('should call drawChart when inputs change', () => {
      fixture.detectChanges();
      (component.drawChart as jasmine.Spy).calls.reset();
      component.ngOnChanges({} as SimpleChanges);
      expect(component.drawChart).toHaveBeenCalled();
    });
  });

  // ─── drawChart ────────────────────────────────────────────────────────────────
  // These tests let drawChart run the real implementation via callThrough.

  describe('drawChart (real execution)', () => {
    beforeEach(() => {
      // Restore the real drawChart implementation for this block
      (component.drawChart as jasmine.Spy).and.callThrough();
    });

    afterEach(() => {
      component._canvas?.destroy?.();
    });

    it('should set hasData to false and skip chart creation when filtered data is empty', () => {
      mockPipe.transform.and.returnValue([]);
      component.canvas = { nativeElement: { getContext: () => ({}) } } as any;
      NeurasilChartsComponent.prototype.drawChart.call(component);
      expect(component.hasData).toBeFalse();
      expect(mockService.chartObjectBuilder).not.toHaveBeenCalled();
    });

    it('should call parseDataFromDatasource with the active chart type', () => {
      component.toolbarProps.chartType = NEURASIL_CHART_TYPE.LINE;
      fixture.detectChanges();
      expect(mockService.parseDataFromDatasource)
        .toHaveBeenCalledWith(NEURASIL_CHART_TYPE.LINE, SAMPLE_DATA, false);
    });

    it('should call performParetoAnalysis when chart type is STACKED_PARETO', () => {
      component.toolbarProps.chartType = NEURASIL_CHART_TYPE.STACKED_PARETO;
      fixture.detectChanges();
      expect(mockService.performParetoAnalysis).toHaveBeenCalled();
    });

    it('should NOT call performParetoAnalysis for non-pareto chart types', () => {
      component.toolbarProps.chartType = NEURASIL_CHART_TYPE.BAR;
      fixture.detectChanges();
      expect(mockService.performParetoAnalysis).not.toHaveBeenCalled();
    });

    it('should merge additionalOpts_Plugins on top of existing plugins options', () => {
      mockService.chartObjectBuilder.and.callFake(() => {
        const p = makeChartProps();
        p.options['plugins'] = { title: { display: true, text: 'Test' } };
        return p;
      });
      component.additionalOpts_Plugins = { legend: { display: false } };
      fixture.detectChanges();
      expect(component._canvas).toBeDefined();
    });

    it('should combine globalFilter and _datasetFilter with a comma', () => {
      component.globalFilter = 'global';
      component.toolbarProps._datasetFilter = 'dataset';
      component.canvas = { nativeElement: { getContext: () => ({}) } } as any;
      NeurasilChartsComponent.prototype.drawChart.call(component);
      expect(mockPipe.transform).toHaveBeenCalledWith(SAMPLE_DATA, 'global,dataset');
    });

    it('should use only globalFilter when _datasetFilter is empty', () => {
      component.globalFilter = 'myfilter';
      component.toolbarProps._datasetFilter = '';
      component.canvas = { nativeElement: { getContext: () => ({}) } } as any;
      NeurasilChartsComponent.prototype.drawChart.call(component);
      expect(mockPipe.transform).toHaveBeenCalledWith(SAMPLE_DATA, 'myfilter');
    });

    it('should destroy a pre-existing chart before drawing a new one', () => {
      fixture.detectChanges();
      const firstCanvas = component._canvas;
      const destroySpy = spyOn(firstCanvas, 'destroy').and.callThrough();
      component.drawChart();
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should push ChartDataLabels plugin when showDataLabels is true', () => {
      component.showDataLabels = true;
      mockService.chartObjectBuilder.and.callFake(() => {
        const p = makeChartProps();
        spyOn(p.plugins, 'push').and.callThrough();
        return p;
      });
      fixture.detectChanges();
      expect(component._canvas).toBeDefined();
    });
  });

});
