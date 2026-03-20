import { TestBed } from '@angular/core/testing';

import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';

describe('NeurasilChartsService', () => {
  let service: NeurasilChartsService;

  // ─── Shared fixtures ──────────────────────────────────────────────────────────

  const basicData = [
    { Category: 'A', Value1: 10, Value2: 20 },
    { Category: 'B', Value1: 30, Value2: 40 },
    { Category: 'C', Value1: 50, Value2: 60 },
  ];

  /** Call chartObjectBuilder with sensible defaults for most tests. */
  function buildChart(
    chartType: NEURASIL_CHART_TYPE,
    chartData: Record<string, any[]>,
    overrides: Partial<{
      useAltAxis: boolean;
      title: string;
      yAxisLabelText: string;
      yAxisLabelText_Alt: string;
      xAxisLabelText: string;
      cornerstone: string;
      swapLabelsAndDatasets: boolean;
      useLogScale: boolean;
      colorPalette: string[];
    }> = {}
  ) {
    const o = service.parseDataFromDatasource(chartType, basicData, overrides.swapLabelsAndDatasets ?? false);
    return service.chartObjectBuilder(
      chartType,
      chartData ?? o.data,
      overrides.useAltAxis ?? false,
      overrides.title ?? '',
      overrides.yAxisLabelText ?? '',
      overrides.yAxisLabelText_Alt ?? '',
      overrides.xAxisLabelText ?? '',
      o._cornerstone,
      overrides.swapLabelsAndDatasets ?? false,
      o._formatObject,
      overrides.useLogScale ?? false,
      overrides.colorPalette ?? null,
      0.9, 0.5, 1, 1
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeurasilChartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── parseDataFromDatasource ──────────────────────────────────────────────────

  describe('parseDataFromDatasource', () => {
    it('should identify the first key as the cornerstone', () => {
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, basicData, false);
      expect(result._cornerstone).toBe('Category');
    });

    it('should transpose row-based data into column arrays', () => {
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, basicData, false);
      expect(result.data['Category']).toEqual(['A', 'B', 'C']);
      expect(result.data['Value1']).toEqual([10, 30, 50]);
    });

    it('should detect a $ prefix and strip it from values', () => {
      const dollarData = [
        { Label: 'X', Revenue: '$100' },
        { Label: 'Y', Revenue: '$200' },
      ];
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, dollarData, false);
      expect(result._formatObject['Revenue'].prefix).toBe('$');
      expect(result.data['Revenue']).toEqual(['100', '200']);
    });

    it('should detect a % suffix and strip it from values', () => {
      const pctData = [
        { Label: 'X', Rate: '50%' },
        { Label: 'Y', Rate: '80%' },
      ];
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, pctData, false);
      expect(result._formatObject['Rate'].suffix).toBe('%');
      expect(result.data['Rate']).toEqual(['50', '80']);
    });

    it('should record no prefix or suffix for plain numeric values', () => {
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, basicData, false);
      expect(result._formatObject['Value1'].prefix).toBe('');
      expect(result._formatObject['Value1'].suffix).toBe('');
    });

    it('should swap labels and datasets when swapLabelsAndDatasets is true', () => {
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, basicData, true);
      // After swap the cornerstone values become dataset keys
      expect(Object.keys(result.data)).toContain('A');
      expect(Object.keys(result.data)).toContain('B');
    });

    it('should add Pareto format entries for STACKED_PARETO chart type', () => {
      const result = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.STACKED_PARETO, basicData, false);
      expect(result._formatObject['Pareto']).toEqual({ prefix: '', suffix: '%' });
      expect(result._formatObject['80% line']).toEqual({ prefix: '', suffix: '%' });
    });

    it('should not mutate the original input array', () => {
      const original = JSON.parse(JSON.stringify(basicData));
      service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR, basicData, false);
      expect(basicData).toEqual(original);
    });
  });

  // ─── chartObjectBuilder ───────────────────────────────────────────────────────

  describe('chartObjectBuilder', () => {
    it('should map BAR to Chart.js type "bar"', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      expect(result.type).toBe('bar');
    });

    it('should map LINE to Chart.js type "line"', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.LINE, null);
      expect(result.type).toBe('line');
    });

    it('should map PIE to Chart.js type "pie"', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.PIE, null);
      expect(result.type).toBe('pie');
    });

    it('should map DONUT to Chart.js type "doughnut"', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.DONUT, null);
      expect(result.type).toBe('doughnut');
    });

    it('should map HORIZONTAL_BAR to "bar" with indexAxis "y"', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.HORIZONTAL_BAR, null);
      expect(result.type).toBe('bar');
      expect(result.options.indexAxis).toBe('y');
    });

    it('should include a plugins.title when a title is provided', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null, { title: 'My Chart' });
      expect(result.options.plugins.title.display).toBeTrue();
      expect(result.options.plugins.title.text).toBe('My Chart');
    });

    it('should not include a title plugin when title is empty', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null, { title: '' });
      expect(result.options.plugins).toBeUndefined();
    });

    it('should add scales for non-pie/donut chart types', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      expect(result.options.scales).toBeDefined();
      expect(result.options.scales.yAxis).toBeDefined();
    });

    it('should not add scales for PIE chart type', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.PIE, null);
      expect(result.options.scales).toBeUndefined();
    });

    it('should not add scales for DONUT chart type', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.DONUT, null);
      expect(result.options.scales).toBeUndefined();
    });

    it('should set y-axis type to "logarithmic" when useLogScale is true', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null, { useLogScale: true });
      expect(result.options.scales.yAxis.type).toBe('logarithmic');
    });

    it('should set y-axis type to "linear" by default', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      expect(result.options.scales.yAxis.type).toBe('linear');
    });

    it('should stack x and y axes for STACKED chart type', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.STACKED, null);
      expect(result.options.scales.x.stacked).toBeTrue();
      expect(result.options.scales.yAxis.stacked).toBeTrue();
    });

    it('should warn and disable useAltAxis for unsupported types (BAR)', () => {
      spyOn(console, 'warn');
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null, { useAltAxis: true });
      expect(console.warn).toHaveBeenCalled();
      expect(result.options.scales.yAxis_alt).toBeUndefined();
    });

    it('should add a secondary yAxis_alt for BAR_LINE when useAltAxis is allowed', () => {
      // BAR_LINE is not in the unsupported list
      const o = service.parseDataFromDatasource(NEURASIL_CHART_TYPE.BAR_LINE, basicData, false);
      const result = service.chartObjectBuilder(
        NEURASIL_CHART_TYPE.BAR_LINE, o.data, true,
        '', '', 'Right label', '', o._cornerstone, false, o._formatObject,
        false, null, 0.9, 0.5, 1, 1
      );
      expect(result.options.scales.yAxis_alt).toBeDefined();
    });

    it('should force useAltAxis and add yAxis_pareto for STACKED_PARETO', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.STACKED_PARETO, null);
      expect(result.options.scales.yAxis_pareto).toBeDefined();
      expect(result.options.scales.yAxis_pareto.max).toBe(100);
    });

    it('should return a plugins array', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      expect(Array.isArray(result.plugins)).toBeTrue();
    });

    it('should build a dataset for each data column', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      // basicData has 2 value columns (Value1, Value2)
      expect(result.data.datasets.length).toBe(2);
    });

    it('should use labels from the cornerstone column', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null);
      expect(result.data.labels).toEqual(['A', 'B', 'C']);
    });

    it('should apply a custom hex color palette', () => {
      const result = buildChart(NEURASIL_CHART_TYPE.BAR, null, { colorPalette: ['#ff0000', '#00ff00'] });
      const bg = result.data.datasets[0].backgroundColor;
      expect(bg).toContain('rgba(255, 0, 0');
    });
  });

  // ─── performParetoAnalysis ────────────────────────────────────────────────────

  describe('performParetoAnalysis', () => {
    function makeParetoProps(labels: string[], ...dataArrays: number[][]) {
      const datasets = dataArrays.map((data, i) => ({
        label: `Series${i}`,
        data: [...data],
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        yAxisID: 'yAxis'
      }));
      return { data: { labels: [...labels], datasets } };
    }

    it('should sort rows in descending order by their dataset sum', () => {
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30]);
      service.performParetoAnalysis(props);
      expect(props.data.labels[0]).toBe('B');
      expect(props.data.labels[1]).toBe('C');
      expect(props.data.labels[2]).toBe('A');
    });

    it('should add exactly 2 new datasets (Pareto curve and 80% line)', () => {
      const originalCount = 1;
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30]);
      service.performParetoAnalysis(props);
      expect(props.data.datasets.length).toBe(originalCount + 2);
    });

    it('should label the new datasets "Pareto" and "80% line"', () => {
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30]);
      service.performParetoAnalysis(props);
      const labels = props.data.datasets.map((d: any) => d.label);
      expect(labels).toContain('Pareto');
      expect(labels).toContain('80% line');
    });

    it('should set the last Pareto value to 100 (cumulative)', () => {
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30]);
      service.performParetoAnalysis(props);
      const pareto = props.data.datasets.find((d: any) => d.label === 'Pareto');
      const last = (pareto as any).data[2];
      expect(last).toBe(100);
    });

    it('should fill the 80% line dataset with 80 for every data point', () => {
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30]);
      service.performParetoAnalysis(props);
      const line = props.data.datasets.find((d: any) => d.label === '80% line') as any;
      expect(line.data.every((v: number) => v === 80)).toBeTrue();
    });

    it('should handle multiple input datasets by summing across them', () => {
      // A: 10+5=15, B: 50+20=70, C: 30+10=40 → sorted B, C, A
      const props = makeParetoProps(['A', 'B', 'C'], [10, 50, 30], [5, 20, 10]);
      service.performParetoAnalysis(props);
      expect(props.data.labels[0]).toBe('B');
    });
  });

});
