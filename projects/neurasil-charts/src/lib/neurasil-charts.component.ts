import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

import ChartDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'neurasil-charts',
  standalone: false,
  templateUrl: './neurasil-charts.component.html',
  styleUrls: ['./neurasil-charts.component.sass'],
  providers: [NeurasilDataFilter]
})
export class NeurasilChartsComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('neurasilChartCanvas', { static: false }) canvas: ElementRef;

  /** Data to plot */
  @Input() data: Array<any>;
  /** Show hide toolbar */
  @Input() showToolbar: boolean = true;
  /** User-defined default chart type */
  @Input() chartType: NEURASIL_CHART_TYPE = null;
  /** Show data on a secondary Y-axis */
  @Input() useAltAxis: boolean = true;
  /** Set a chart title */
  @Input() chartTitle: string = "";
  /** X-Axis text */
  @Input() xAxisLabelText: string = "";
  /** Y-Axis text */
  @Input() yAxisLabelText: string = "";
  /** Alt-Y-Axis text   */
  @Input() yAxisLabelText_Alt: string = "";

  @Input() colorPalette: Array<string>;
  @Input() hoverOpacity: number = 0.9;
  @Input() defaultOpacity: number = 0.5;
  @Input() hoverOpacity_border: number = 1;
  @Input() defaultOpacity_border: number = 1;
  /** Swap Dataset and Labels */
  @Input() swapLabelsAndDatasets: boolean;
  /** Filter data */
  @Input() globalFilter: string = "";
  /** Show data labels
   * @param showDataLabels default: false
  */
  @Input() showDataLabels: boolean = false;

  @Input() noDataMessage: string = "No data to display. Check your filters.";

  @Input() additionalOpts_Plugins = {};

  @Input() additionalOpts_Elements = {};

  @Input() useLogScale: boolean = false;

  /** Emits event from changing Chart type from toolbar */
  @Output() chartTypeChange = new EventEmitter();
  @Output() showToolbarChange = new EventEmitter();
  /** Emits event from toggling the swap label/data switch from toolbar */
  @Output() swapLabelsAndDatasetsChange = new EventEmitter();
  /** Emits data from clicked chart item */
  @Output() dataOnClick = new EventEmitter();

  /** default toolbar props */
  toolbarProps = {
    chartType: this.chartType ?? NEURASIL_CHART_TYPE.BAR,
    _datasetFilter: "",
    swapLabelsAndDatasets: false
  };

  public _canvas: any;
  hasData: boolean;


  constructor(public neurasilChartsService: NeurasilChartsService, public neurasilDataFilter: NeurasilDataFilter) { }

  ngOnInit() {
    if (this.chartType) {
      this.toolbarProps.chartType = this.chartType;
    }

    if (this.swapLabelsAndDatasets) {
      this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets;
    }

    this.hasData = !!(this.data && this.data.length > 0);
  }

  ngAfterViewInit() {
    this.drawChart();
  }

  ngOnChanges(_changes: SimpleChanges) {
    this.drawChart();
  }

  updateToolbarProps(_ev) {
    this.chartTypeChange.emit(this.toolbarProps.chartType);
    this.showToolbarChange.emit(this.showToolbar);
    this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
    this.drawChart();
  }


  drawChart(isPrinting: boolean = false) {
    if (this._canvas) {
      this._canvas.destroy();
    }
    if (!this.canvas) {
      return;
    }

    const ctx = this.canvas.nativeElement.getContext('2d');
    const filterString = [this.globalFilter, this.toolbarProps._datasetFilter]
      .filter(Boolean)
      .join(',');

    const filteredData = this.neurasilDataFilter.transform(this.data, filterString);
    this.hasData = (filteredData && filteredData.length > 0);

    if (!this.hasData) {
      return;
    }

    const o = this.neurasilChartsService.parseDataFromDatasource(
      this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);

    const props = this.neurasilChartsService.chartObjectBuilder(
      this.toolbarProps.chartType,
      o.data,
      this.useAltAxis,
      this.chartTitle,
      this.yAxisLabelText,
      this.yAxisLabelText_Alt,
      this.xAxisLabelText,
      o._cornerstone,
      this.toolbarProps.swapLabelsAndDatasets,
      o._formatObject,
      this.useLogScale,
      this.colorPalette,
      this.hoverOpacity,
      this.defaultOpacity,
      this.hoverOpacity_border,
      this.defaultOpacity_border,
    );

    if (this.toolbarProps.chartType === NEURASIL_CHART_TYPE.STACKED_PARETO) {
      this.neurasilChartsService.performParetoAnalysis(props);
    }

    // emit onclick event data
    const swapped = this.swapLabelsAndDatasets;
    props.options.onClick = function (_ev, element, chartObj) {
      if (element[0]) {
        const clickData = element[0];
        const xAxisVal = props.data.labels[clickData.index];
        const dataset = props.data.datasets[clickData.datasetIndex];
        const datasetLabel = dataset.label;
        const datasetVal = dataset.data[clickData.index];
        const customDataObj = {
          val: datasetVal,
          dataLabel: swapped ? datasetLabel : xAxisVal,
          datasetLabel: swapped ? xAxisVal : datasetLabel
        };
        this.dataOnClick?.emit({
          event: _ev,
          element,
          chartInstance: chartObj,
          data: customDataObj
        });
      }
    }.bind(this);

    if (this.showDataLabels || isPrinting) {
      props.plugins.push(ChartDataLabels);
    }

    if (!props.options.plugins) {
      props.options.plugins = {};
    }
    if (this.additionalOpts_Plugins) {
      props.options.plugins = { ...props.options.plugins, ...this.additionalOpts_Plugins };
    }

    if (!props.options.elements) {
      props.options.elements = {};
    }
    props.options.elements = { ...props.options.elements, ...this.additionalOpts_Elements };

    props.options.plugins.datalabels = {
      formatter: function (value) {
        if (value == null) {
          return "";
        }
        const absVal = Math.abs(value);
        if (absVal === 0) {
          return value;
        }
        if (absVal >= 0.001) {
          return Math.round(value * 1000) / 1000;
        }
        return value > 0 ? "< 0.001" : "> -0.001";
      }
    };

    const isPieOrDonut = this.toolbarProps.chartType === NEURASIL_CHART_TYPE.DONUT || this.toolbarProps.chartType === NEURASIL_CHART_TYPE.PIE;
    if (isPieOrDonut) {
      props.options.plugins.tooltip = {
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (tooltipItem) => {
            const label = tooltipItem.dataset.label ? tooltipItem.dataset.label + ': ' : '';
            return label + `${tooltipItem.parsed}`;
          }
        }
      };
    } else {
      props.options.plugins.tooltip = {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label ? context.dataset.label + ': ' : '';
            return context.parsed.y !== null ? label + `${context.parsed.y}` : label;
          }
        }
      };
    }

    this._canvas = new Chart(ctx, props);
  }
}
