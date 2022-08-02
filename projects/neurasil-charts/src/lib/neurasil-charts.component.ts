import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
// import Chart from 'chart.js/auto';
import { HostListener } from '@angular/core';

import ChartDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'neurasil-charts',
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
  /** Show right axis for shits and giggles */
  @Input() useAltAxis: boolean = true; // not sure if needed
  /** Set a chart title */
  @Input() chartTitle: string = "";
  /** X-Axis text */
  @Input() xAxisLabelText: string = "";
  /** Y-Axis text */
  @Input() yAxisLabelText: string = "";
  /** Alt-Y-Axis text   */
  @Input() yAxisLabelText_Alt: string = "";
  /** Swap Dataset and Labels 
   * @
   */
  @Input() swapLabelsAndDatasets: boolean;
  /** Filter data */
  @Input() globalFilter: string = "";
  /** Show data labels 
   * @param showDataLabels default: false
  */
  @Input() showDataLabels: boolean = false;

  @Input() noDataMessage: string = "No data to display. Check your filters.";

  @Input() additionalPluginOpts = {};

  /** Emits event from changing Chart type from toolbar (I think, forgot what else this does) */
  @Output() chartTypeChange = new EventEmitter();
  /** Forgot what this does */
  @Output() showToolbarChange = new EventEmitter();
  /** Emits event from toggling the swap label/data switch from toolbar (I think, forgot what else this does) */
  @Output() swapLabelsAndDatasetsChange = new EventEmitter();
  /** Emits data from clicked chart item */
  @Output() dataOnClick = new EventEmitter();

  /** default toolbar props */
  toolbarProps = {
    chartType: this.chartType ? this.chartType : NEURASIL_CHART_TYPE.BAR,
    _datasetFilter: "",
    swapLabelsAndDatasets: false
  };

  public _canvas: any;
  hasData: boolean; // for the purpose of checking length in html template


  constructor(public neurasilChartsService: NeurasilChartsService, public neurasilDataFilter: NeurasilDataFilter) { }

  ngOnInit() {
    if (this.chartType) {
      this.toolbarProps.chartType = this.chartType;
    }

    if (this.swapLabelsAndDatasets) {
      this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets
    }

    this.hasData = (this.data && this.data.length > 0);
  }
  ngAfterViewInit() {
    this.drawChart();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      // console.log(changes)
      this.drawChart();
    }
  }
  @HostListener('window:beforeprint', ['$event'])
  onBeforePrint(event) {
    // this.drawChart(true)

  }
  @HostListener('window:afterprint', ['$event'])
  onAfterPrint(event) {
    // this.drawChart(false);
  }
  updateToolbarProps(ev) {

    this.chartTypeChange.emit(this.toolbarProps.chartType);
    this.showToolbarChange.emit(this.showToolbar);
    this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets)
    this.drawChart();
  }


  drawChart(isPrinting: boolean = false) {
    if (this._canvas) {
      this._canvas.destroy();
    }
    if (this.canvas) {
      var ctx = this.canvas.nativeElement.getContext('2d');
      let filterString = ""
      if (this.globalFilter.length > 0) {
        filterString += this.globalFilter + ","
      }
      filterString += this.toolbarProps._datasetFilter;
      let filteredData = this.neurasilDataFilter.transform(this.data, filterString);
      this.hasData = (filteredData && filteredData.length > 0);
      if (this.hasData) {
        let o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
        // console.log("o",o)
        let props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject);

        if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
          this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
        }

        let THIS = this;
        //Cant put this in service, idk why
        props.options.onClick = function (ev, element, chartObj) {
          if (element[0]) {
            let clickData = element[0];
            let xAxisVal = props.data.labels[clickData.index];
            let dataset = props.data.datasets[clickData.datasetIndex];
            let datasetLabel = dataset.label;
            let datasetVal = dataset.data[clickData.index];
            let customDataObj = {
              val: datasetVal,
              dataLabel: THIS.swapLabelsAndDatasets ? datasetLabel : xAxisVal,
              datasetLabel: THIS.swapLabelsAndDatasets ? xAxisVal : datasetLabel
            }
            let data = {
              event: ev,
              element: element,
              chartInstance: chartObj,
              data: customDataObj
            }
            THIS.dataOnClick.emit(data)
          }
        }
        if (this.showDataLabels || isPrinting) {
          props.plugins.push(ChartDataLabels);
        }
        if (!props.options.plugins) {
          props.options.plugins = {}
        }
        if (this.additionalPluginOpts){
          props.options.plugins = this.additionalPluginOpts;
        }
        props.options.plugins.datalabels = {
          formatter: function (value, context) {
            //return Math.round(value*100) + '%';
            if ((value > 0 && value >= 0.001) || (value < 0 && value < -0.001)) {
              return Math.round(value * 1000) / 1000;
            } else if (value > 0 && value < 0.001) {
              return "< 0.001";
            } else {
              return "> -0.001";
            }
          }
        }
        if (this.chartType == NEURASIL_CHART_TYPE.DONUT || this.chartType == NEURASIL_CHART_TYPE.PIE) {
          props.options.plugins.tooltip = {
            callbacks: {
              title: function(tooltipItem) {
                // TODO: could be an issue with multiple datasets
                return tooltipItem[0].label;
              },
              label: function(tooltipItem) {
                let label = tooltipItem.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (tooltipItem.parsed.y !== null) {
                  label += `${tooltipItem.parsed}`;
                }
                return label;
              },
              
            }
          }
        } else {
          props.options.plugins.tooltip = {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y}`;
                }
                return label;
              }
            }
          }
        }


        // console.log("ctx",ctx)
        // console.log("props",props)
        this._canvas = new Chart(ctx, props);
      }
    }
  }
}
