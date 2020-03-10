import { EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType';
export declare class NeurasilChartsToolbarComponent {
    toolbarProps: any;
    toolbarPropsChange: EventEmitter<any>;
    NEURASIL_CHART_TYPE: typeof NEURASIL_CHART_TYPE;
    toolbarPropsChanged(ev: any): void;
}
