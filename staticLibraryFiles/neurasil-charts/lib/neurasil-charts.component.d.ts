import { OnInit, ElementRef, AfterViewInit, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import * as i0 from "@angular/core";
export declare class NeurasilChartsComponent implements OnInit, AfterViewInit, OnChanges {
    neurasilChartsService: NeurasilChartsService;
    neurasilDataFilter: NeurasilDataFilter;
    canvas: ElementRef;
    /** Data to plot */
    data: Array<any>;
    /** Show hide toolbar */
    showToolbar: boolean;
    /** User-defined default chart type */
    chartType: NEURASIL_CHART_TYPE;
    /** Show right axis for shits and giggles */
    useAltAxis: boolean;
    /** Set a chart title */
    chartTitle: string;
    /** X-Axis text */
    xAxisLabelText: string;
    /** Y-Axis text */
    yAxisLabelText: string;
    /** Alt-Y-Axis text   */
    yAxisLabelText_Alt: string;
    /** Swap Dataset and Labels (TODO: find a better way to describe this) */
    swapLabelsAndDatasets: boolean;
    /** Fliter data */
    globalFilter: string;
    /** Emits event from changing Chart type from toolbar (I think, forgot what else this does) */
    chartTypeChange: EventEmitter<any>;
    /** Forgot what this does */
    showToolbarChange: EventEmitter<any>;
    /** Emits event from toggling the swap label/data switch from toolbar (I think, forgot what else this does) */
    swapLabelsAndDatasetsChange: EventEmitter<any>;
    /** Emits data from clicked chart item */
    dataOnClick: EventEmitter<any>;
    /** default toolbar props */
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
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NeurasilChartsComponent, "neurasil-charts", never, { "data": "data"; "showToolbar": "showToolbar"; "chartType": "chartType"; "useAltAxis": "useAltAxis"; "chartTitle": "chartTitle"; "xAxisLabelText": "xAxisLabelText"; "yAxisLabelText": "yAxisLabelText"; "yAxisLabelText_Alt": "yAxisLabelText_Alt"; "swapLabelsAndDatasets": "swapLabelsAndDatasets"; "globalFilter": "globalFilter"; }, { "chartTypeChange": "chartTypeChange"; "showToolbarChange": "showToolbarChange"; "swapLabelsAndDatasetsChange": "swapLabelsAndDatasetsChange"; "dataOnClick": "dataOnClick"; }, never, never, false>;
}
