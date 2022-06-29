import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)
// import * as Chart from 'chart.js';

@Component({
  selector: 'neurasil-charts',
  templateUrl: './neurasil-charts.component.html',
  styleUrls: ['./neurasil-charts.component.sass'],
  providers: [NeurasilDataFilter]
})
export class NeurasilChartsComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('neurasilChartCanvas', { static: false }) canvas: ElementRef;

  /**
   * Data to plot
   */
  @Input() data: Array<any>;

  @Input() showToolbar: boolean = true;
  @Output() showToolbarChange = new EventEmitter();
  /**
   * User-defined default chart type
   */
  @Input() chartType: NEURASIL_CHART_TYPE = null;
  @Output() chartTypeChange = new EventEmitter();

  @Input() useAltAxis: boolean = true; // not sure if needed
  @Input() chartTitle: string = "";
  @Input() xAxisLabelText: string = "";
  @Input() yAxisLabelText_Alt: string = "";
  @Input() yAxisLabelText: string = "";

  @Input() swapLabelsAndDatasets: boolean;
  @Output() swapLabelsAndDatasetsChange = new EventEmitter();
  @Input() globalFilter: string = "";

  @Output() dataOnClick = new EventEmitter();

  toolbarProps = {
    chartType: this.chartType ? this.chartType : NEURASIL_CHART_TYPE.BAR,
    _datasetFilter: "",
    swapLabelsAndDatasets: false
  };

  _canvas: any;
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

  updateToolbarProps(ev) {
    // console.log(">>>", ev)
    // console.log(this.toolbarProps)
    this.chartTypeChange.emit(this.toolbarProps.chartType);
    this.showToolbarChange.emit(this.showToolbar);
    this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets)
    this.drawChart();
  }


  drawChart() {
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
              datasetLabel:THIS.swapLabelsAndDatasets ? xAxisVal : datasetLabel
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
        this._canvas = new Chart(ctx, props);
      }
    }
  }
}
