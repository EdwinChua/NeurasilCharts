import { OnInit, ElementRef, AfterViewInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
export declare class NeurasilChartsComponent implements OnInit, AfterViewInit, OnChanges {
    neurasilChartsService: NeurasilChartsService;
    neurasilDataFilter: NeurasilDataFilter;
    canvas: ElementRef;
    /**
     * Data to plot
     */
    data: Array<any>;
    showToolbar: boolean;
    showToolbarChange: EventEmitter<any>;
    /**
     * User-defined default chart type
     */
    chartType: NEURASIL_CHART_TYPE;
    chartTypeChange: EventEmitter<any>;
    useAltAxis: boolean;
    chartTitle: string;
    xAxisLabelText: string;
    yAxisLabelText_Alt: string;
    yAxisLabelText: string;
    swapLabelsAndDatasets: boolean;
    swapLabelsAndDatasetsChange: EventEmitter<any>;
    globalFilter: string;
    toolbarProps: {
        chartType: NEURASIL_CHART_TYPE;
        _datasetFilter: string;
        swapLabelsAndDatasets: boolean;
    };
    _canvas: any;
    hasData: boolean;
    constructor(neurasilChartsService: NeurasilChartsService, neurasilDataFilter: NeurasilDataFilter);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateToolbarProps(ev: any): void;
    drawChart(): void;
}
