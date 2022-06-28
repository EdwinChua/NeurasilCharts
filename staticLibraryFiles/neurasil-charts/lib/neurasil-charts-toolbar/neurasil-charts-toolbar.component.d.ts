import { EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType';
import * as i0 from "@angular/core";
export declare class NeurasilChartsToolbarComponent {
    toolbarProps: any;
    toolbarPropsChange: EventEmitter<any>;
    NEURASIL_CHART_TYPE: typeof NEURASIL_CHART_TYPE;
    toolbarPropsChanged(ev: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NeurasilChartsToolbarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NeurasilChartsToolbarComponent, "neurasil-charts-toolbar", never, { "toolbarProps": "toolbarProps"; }, { "toolbarPropsChange": "toolbarPropsChange"; }, never, never, false>;
}
