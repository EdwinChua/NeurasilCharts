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
    colorPalette: Array<string>;
    hoverOpacity: number;
    defaultOpacity: number;
    hoverOpacity_border: number;
    defaultOpacity_border: number;
    /** Swap Dataset and Labels
     * @
     */
    swapLabelsAndDatasets: boolean;
    /** Filter data */
    globalFilter: string;
    /** Show data labels
     * @param showDataLabels default: false
    */
    showDataLabels: boolean;
    noDataMessage: string;
    additionalOpts_Plugins: {};
    additionalOpts_Elements: {};
    useLogScale: boolean;
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
    onBeforePrint(event: any): void;
    onAfterPrint(event: any): void;
    updateToolbarProps(ev: any): void;
    drawChart(isPrinting?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NeurasilChartsComponent, "neurasil-charts", never, { "data": "data"; "showToolbar": "showToolbar"; "chartType": "chartType"; "useAltAxis": "useAltAxis"; "chartTitle": "chartTitle"; "xAxisLabelText": "xAxisLabelText"; "yAxisLabelText": "yAxisLabelText"; "yAxisLabelText_Alt": "yAxisLabelText_Alt"; "colorPalette": "colorPalette"; "hoverOpacity": "hoverOpacity"; "defaultOpacity": "defaultOpacity"; "hoverOpacity_border": "hoverOpacity_border"; "defaultOpacity_border": "defaultOpacity_border"; "swapLabelsAndDatasets": "swapLabelsAndDatasets"; "globalFilter": "globalFilter"; "showDataLabels": "showDataLabels"; "noDataMessage": "noDataMessage"; "additionalOpts_Plugins": "additionalOpts_Plugins"; "additionalOpts_Elements": "additionalOpts_Elements"; "useLogScale": "useLogScale"; }, { "chartTypeChange": "chartTypeChange"; "showToolbarChange": "showToolbarChange"; "swapLabelsAndDatasetsChange": "swapLabelsAndDatasetsChange"; "dataOnClick": "dataOnClick"; }, never, never, false>;
}
