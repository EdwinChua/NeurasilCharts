import * as i0 from '@angular/core';
import { PipeTransform, OnInit, AfterViewInit, OnChanges, ElementRef, EventEmitter, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import * as i1 from '@angular/common';
import * as i2 from '@angular/forms';

declare enum NEURASIL_CHART_TYPE {
    BAR = 0,
    BAR_LINE = 1,
    STACKED = 2,
    LINE = 3,
    PIE = 4,
    DONUT = 5,
    GRID = 6,
    HORIZONTAL_BAR = 7,
    STACKED_PARETO = 9
}

declare class NeurasilChartsService {
    constructor();
    parseDataFromDatasource(chartType: NEURASIL_CHART_TYPE, incomingData: Array<any>, swapLabelsAndDatasets: boolean): {
        _cornerstone: string;
        _formatObject: {
            prefix: string;
            suffix: string;
        };
        data: Array<any>;
    };
    chartObjectBuilder(chartType: any, chartData: any, useAltAxis: any, title: any, yAxisLabelText: any, yAxisLabelText_Alt: any, xAxisLabelText: any, cornerstone: any, swapLabelsAndDatasets: any, formatObject: any, useLogScale: any, colorPalette: any, hoverOpacity: any, defaultOpacity: any, hoverOpacity_border: any, defaultOpacity_border: any): {
        plugins: any[];
        type: any;
        data: {
            labels: any;
            datasets: any[];
        };
        options: any;
    };
    dataParser(chartData: any, useAltAxis: boolean, chartType: NEURASIL_CHART_TYPE, cornerstone: any, swapLabelsAndDatasets: any, colorPaletteToUse: Array<string>, hoverOpacity: any, defaultOpacity: any, hoverOpacity_border: any, defaultOpacity_border: any): {
        labels: any;
        datasets: any[];
    };
    performParetoAnalysis(props: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NeurasilChartsService>;
}

declare class NeurasilDataFilter implements PipeTransform {
    transform(data: any[], filterText: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilDataFilter, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<NeurasilDataFilter, "neurasilDataFilter", true>;
}

declare class NeurasilChartsComponent implements OnInit, AfterViewInit, OnChanges {
    neurasilChartsService: NeurasilChartsService;
    neurasilDataFilter: NeurasilDataFilter;
    private cdr;
    canvas: ElementRef;
    /** Data to plot */
    data: Array<any>;
    /** Show hide toolbar */
    showToolbar: boolean;
    /** User-defined default chart type */
    chartType: NEURASIL_CHART_TYPE;
    /** Show data on a secondary Y-axis */
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
    /** Swap Dataset and Labels */
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
    /** Emits event from changing Chart type from toolbar */
    chartTypeChange: EventEmitter<any>;
    showToolbarChange: EventEmitter<any>;
    /** Emits event from toggling the swap label/data switch from toolbar */
    swapLabelsAndDatasetsChange: EventEmitter<any>;
    /** Emits data from clicked chart item */
    dataOnClick: EventEmitter<any>;
    /** default toolbar props */
    toolbarProps: {
        chartType: NEURASIL_CHART_TYPE;
        _datasetFilter: string;
        swapLabelsAndDatasets: boolean;
    };
    NEURASIL_CHART_TYPE: typeof NEURASIL_CHART_TYPE;
    _canvas: any;
    hasData: boolean;
    canvasVisible: boolean;
    gridData: Array<any>;
    gridColumns: string[];
    constructor(neurasilChartsService: NeurasilChartsService, neurasilDataFilter: NeurasilDataFilter, cdr: ChangeDetectorRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(_changes: SimpleChanges): void;
    updateToolbarProps(_ev: any): void;
    drawChart(isPrinting?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NeurasilChartsComponent, "neurasil-charts", never, { "data": { "alias": "data"; "required": false; }; "showToolbar": { "alias": "showToolbar"; "required": false; }; "chartType": { "alias": "chartType"; "required": false; }; "useAltAxis": { "alias": "useAltAxis"; "required": false; }; "chartTitle": { "alias": "chartTitle"; "required": false; }; "xAxisLabelText": { "alias": "xAxisLabelText"; "required": false; }; "yAxisLabelText": { "alias": "yAxisLabelText"; "required": false; }; "yAxisLabelText_Alt": { "alias": "yAxisLabelText_Alt"; "required": false; }; "colorPalette": { "alias": "colorPalette"; "required": false; }; "hoverOpacity": { "alias": "hoverOpacity"; "required": false; }; "defaultOpacity": { "alias": "defaultOpacity"; "required": false; }; "hoverOpacity_border": { "alias": "hoverOpacity_border"; "required": false; }; "defaultOpacity_border": { "alias": "defaultOpacity_border"; "required": false; }; "swapLabelsAndDatasets": { "alias": "swapLabelsAndDatasets"; "required": false; }; "globalFilter": { "alias": "globalFilter"; "required": false; }; "showDataLabels": { "alias": "showDataLabels"; "required": false; }; "noDataMessage": { "alias": "noDataMessage"; "required": false; }; "additionalOpts_Plugins": { "alias": "additionalOpts_Plugins"; "required": false; }; "additionalOpts_Elements": { "alias": "additionalOpts_Elements"; "required": false; }; "useLogScale": { "alias": "useLogScale"; "required": false; }; }, { "chartTypeChange": "chartTypeChange"; "showToolbarChange": "showToolbarChange"; "swapLabelsAndDatasetsChange": "swapLabelsAndDatasetsChange"; "dataOnClick": "dataOnClick"; }, never, never, true, never>;
}

declare class NeurasilChartsToolbarComponent {
    toolbarProps: any;
    toolbarPropsChange: EventEmitter<any>;
    NEURASIL_CHART_TYPE: typeof NEURASIL_CHART_TYPE;
    toolbarPropsChanged(_ev: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NeurasilChartsToolbarComponent, "neurasil-charts-toolbar", never, { "toolbarProps": { "alias": "toolbarProps"; "required": false; }; }, { "toolbarPropsChange": "toolbarPropsChange"; }, never, never, true, never>;
}

declare class NeurasilChartsModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NeurasilChartsModule, never, [typeof i1.CommonModule, typeof i2.FormsModule, typeof NeurasilChartsComponent, typeof NeurasilChartsToolbarComponent, typeof NeurasilDataFilter], [typeof NeurasilChartsComponent, typeof NeurasilDataFilter]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NeurasilChartsModule>;
}

declare const BUILD_TIMESTAMP = "2026-03-24T10:39:11.441Z";

export { BUILD_TIMESTAMP, NEURASIL_CHART_TYPE, NeurasilChartsComponent, NeurasilChartsModule, NeurasilChartsService, NeurasilDataFilter };
