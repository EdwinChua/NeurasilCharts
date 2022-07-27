import { NEURASIL_CHART_TYPE } from './models';
import * as i0 from "@angular/core";
export declare class NeurasilChartsService {
    constructor();
    parseDataFromDatasource(chartType: NEURASIL_CHART_TYPE, incomingData: Array<any>, swapLabelsAndDatasets: boolean): {
        _cornerstone: string;
        _formatObject: {
            prefix: string;
            suffix: string;
        };
        data: Array<any>;
    };
    chartObjectBuilder(chartType: any, chartData: any, useAltAxis: any, title: any, yAxisLabelText: any, yAxisLabelText_Alt: any, xAxisLabelText: any, cornerstone: any, swapLabelsAndDatasets: any, formatObject: any): {
        plugins: any[];
        type: any;
        data: {
            labels: any;
            datasets: any[];
        };
        options: any;
    };
    dataParser(chartData: any, useAltAxis: any, chartType: any, cornerstone: any, swapLabelsAndDatasets: any): {
        labels: any;
        datasets: any[];
    };
    performParetoAnalysis(props: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NeurasilChartsService>;
}
