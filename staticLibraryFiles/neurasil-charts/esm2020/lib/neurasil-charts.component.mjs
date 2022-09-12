import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import { Chart, registerables } from 'chart.js';
// import Chart from 'chart.js/auto';
import { HostListener } from '@angular/core';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as i0 from "@angular/core";
import * as i1 from "./neurasil-charts.service";
import * as i2 from "./pipes";
import * as i3 from "@angular/common";
import * as i4 from "./neurasil-charts-toolbar/neurasil-charts-toolbar.component";
const _c0 = ["neurasilChartCanvas"];
function NeurasilChartsComponent_div_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 6)(1, "neurasil-charts-toolbar", 7);
    i0.ɵɵlistener("toolbarPropsChange", function NeurasilChartsComponent_div_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.toolbarProps = $event); })("toolbarPropsChange", function NeurasilChartsComponent_div_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r5 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r5.updateToolbarProps($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(1);
    i0.ɵɵproperty("toolbarProps", ctx_r0.toolbarProps);
} }
function NeurasilChartsComponent_div_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 9);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r2.noDataMessage, " ");
} }
Chart.register(...registerables);
export class NeurasilChartsComponent {
    constructor(neurasilChartsService, neurasilDataFilter) {
        this.neurasilChartsService = neurasilChartsService;
        this.neurasilDataFilter = neurasilDataFilter;
        /** Show hide toolbar */
        this.showToolbar = true;
        /** User-defined default chart type */
        this.chartType = null;
        /** Show right axis for shits and giggles */
        this.useAltAxis = true; // not sure if needed
        /** Set a chart title */
        this.chartTitle = "";
        /** X-Axis text */
        this.xAxisLabelText = "";
        /** Y-Axis text */
        this.yAxisLabelText = "";
        /** Alt-Y-Axis text   */
        this.yAxisLabelText_Alt = "";
        this.hoverOpacity = 0.9;
        this.defaultOpacity = 0.5;
        this.hoverOpacity_border = 1;
        this.defaultOpacity_border = 1;
        /** Filter data */
        this.globalFilter = "";
        /** Show data labels
         * @param showDataLabels default: false
        */
        this.showDataLabels = false;
        this.noDataMessage = "No data to display. Check your filters.";
        this.additionalOpts_Plugins = {};
        this.additionalOpts_Elements = {};
        this.useLogScale = false;
        /** Emits event from changing Chart type from toolbar (I think, forgot what else this does) */
        this.chartTypeChange = new EventEmitter();
        /** Forgot what this does */
        this.showToolbarChange = new EventEmitter();
        /** Emits event from toggling the swap label/data switch from toolbar (I think, forgot what else this does) */
        this.swapLabelsAndDatasetsChange = new EventEmitter();
        /** Emits data from clicked chart item */
        this.dataOnClick = new EventEmitter();
        /** default toolbar props */
        this.toolbarProps = {
            chartType: this.chartType ? this.chartType : NEURASIL_CHART_TYPE.BAR,
            _datasetFilter: "",
            swapLabelsAndDatasets: false
        };
    }
    ngOnInit() {
        if (this.chartType) {
            this.toolbarProps.chartType = this.chartType;
        }
        if (this.swapLabelsAndDatasets) {
            this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets;
        }
        this.hasData = (this.data && this.data.length > 0);
    }
    ngAfterViewInit() {
        this.drawChart();
    }
    ngOnChanges(changes) {
        if (changes) {
            // console.log(changes)
            this.drawChart();
        }
    }
    onBeforePrint(event) {
        // this.drawChart(true)
    }
    onAfterPrint(event) {
        // this.drawChart(false);
    }
    updateToolbarProps(ev) {
        this.chartTypeChange.emit(this.toolbarProps.chartType);
        this.showToolbarChange.emit(this.showToolbar);
        this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
        this.drawChart();
    }
    drawChart(isPrinting = false) {
        if (this._canvas) {
            this._canvas.destroy();
        }
        if (this.canvas) {
            var ctx = this.canvas.nativeElement.getContext('2d');
            let filterString = "";
            if (this.globalFilter.length > 0) {
                filterString += this.globalFilter + ",";
            }
            filterString += this.toolbarProps._datasetFilter;
            let filteredData = this.neurasilDataFilter.transform(this.data, filterString);
            this.hasData = (filteredData && filteredData.length > 0);
            if (this.hasData) {
                let o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
                // console.log("o",o)
                let props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject, this.useLogScale, this.colorPalette, this.hoverOpacity, this.defaultOpacity, this.hoverOpacity_border, this.defaultOpacity_border);
                if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
                }
                let THIS = this;
                //Cant put this in service, idk why
                //#region emit onclick event data
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
                        };
                        let data = {
                            event: ev,
                            element: element,
                            chartInstance: chartObj,
                            data: customDataObj
                        };
                        THIS.dataOnClick.emit(data);
                    }
                };
                //#endregion
                //#region show data labels
                if (this.showDataLabels || isPrinting) {
                    props.plugins.push(ChartDataLabels);
                }
                //#endregion
                //#region add additional options.plugins data
                if (!props.options.plugins) {
                    props.options.plugins = {};
                }
                if (this.additionalOpts_Plugins) {
                    props.options.plugins = this.additionalOpts_Plugins;
                }
                //#endregion
                //#region add additional options.elements data
                if (!props.options.elements) {
                    props.options.elements = {};
                }
                props.options.elements = { ...props.options.elements, ...this.additionalOpts_Elements };
                //#endregion
                //#region format datalabels to 3 decimal places
                props.options.plugins.datalabels = {
                    formatter: function (value, context) {
                        if (value == null || value == undefined) {
                            return "";
                        }
                        else if ((value > 0 && value >= 0.001) || (value < 0 && value < -0.001)) {
                            return Math.round(value * 1000) / 1000;
                        }
                        else if (value > 0 && value < 0.001) {
                            return "< 0.001";
                        }
                        else {
                            return "> -0.001";
                        }
                    }
                };
                //#endregion
                //#region customize tooltip
                if (this.chartType == NEURASIL_CHART_TYPE.DONUT || this.chartType == NEURASIL_CHART_TYPE.PIE) {
                    props.options.plugins.tooltip = {
                        callbacks: {
                            title: function (tooltipItem) {
                                // TODO: could be an issue with multiple datasets
                                return tooltipItem[0].label;
                            },
                            label: function (tooltipItem) {
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
                    };
                }
                else {
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
                    };
                }
                //#endregion
                this._canvas = new Chart(ctx, props);
            }
        }
    }
}
/** @nocollapse */ NeurasilChartsComponent.ɵfac = function NeurasilChartsComponent_Factory(t) { return new (t || NeurasilChartsComponent)(i0.ɵɵdirectiveInject(i1.NeurasilChartsService), i0.ɵɵdirectiveInject(i2.NeurasilDataFilter)); };
/** @nocollapse */ NeurasilChartsComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NeurasilChartsComponent, selectors: [["neurasil-charts"]], viewQuery: function NeurasilChartsComponent_Query(rf, ctx) { if (rf & 1) {
        i0.ɵɵviewQuery(_c0, 5);
    } if (rf & 2) {
        let _t;
        i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
    } }, hostBindings: function NeurasilChartsComponent_HostBindings(rf, ctx) { if (rf & 1) {
        i0.ɵɵlistener("beforeprint", function NeurasilChartsComponent_beforeprint_HostBindingHandler($event) { return ctx.onBeforePrint($event); }, false, i0.ɵɵresolveWindow)("afterprint", function NeurasilChartsComponent_afterprint_HostBindingHandler($event) { return ctx.onAfterPrint($event); }, false, i0.ɵɵresolveWindow);
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", colorPalette: "colorPalette", hoverOpacity: "hoverOpacity", defaultOpacity: "defaultOpacity", hoverOpacity_border: "hoverOpacity_border", defaultOpacity_border: "defaultOpacity_border", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter", showDataLabels: "showDataLabels", noDataMessage: "noDataMessage", additionalOpts_Plugins: "additionalOpts_Plugins", additionalOpts_Elements: "additionalOpts_Elements", useLogScale: "useLogScale" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵtemplate(1, NeurasilChartsComponent_div_1_Template, 2, 1, "div", 1);
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵelement(3, "canvas", 3, 4);
        i0.ɵɵtemplate(5, NeurasilChartsComponent_div_5_Template, 3, 1, "div", 5);
        i0.ɵɵelementEnd()();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.showToolbar);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngClass", ctx.hasData ? "" : "canvas-hidden");
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngIf", !ctx.hasData);
    } }, dependencies: [i3.NgClass, i3.NgIf, i4.NeurasilChartsToolbarComponent], styles: [".canvas-wrapper[_ngcontent-%COMP%], neurasil-charts-toolbar[_ngcontent-%COMP%]{display:block}.component-wrapper[_ngcontent-%COMP%]{width:100%;height:100%}.toolbar-wrapper[_ngcontent-%COMP%]{display:block;height:50px}.component-wrapper[_ngcontent-%COMP%]{display:flex;flex-flow:column;height:100%}.canvas-wrapper[_ngcontent-%COMP%]{flex:1}.canvas-hidden[_ngcontent-%COMP%]{display:none}.overlay[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#0000001a}.overlay-contents[_ngcontent-%COMP%]{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsComponent, [{
        type: Component,
        args: [{ selector: 'neurasil-charts', providers: [NeurasilDataFilter], template: "\r\n<div class=\"component-wrapper\">\r\n    <div class=\"toolbar-wrapper\" *ngIf=\"showToolbar\">\r\n        <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\r\n    </div>\r\n    <div class=\"canvas-wrapper\">\r\n        <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\r\n        <div class=\"overlay\" *ngIf=\"!hasData\">\r\n            <div class=\"overlay-contents\">\r\n                {{noDataMessage}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n", styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;height:100%}.toolbar-wrapper{display:block;height:50px}.component-wrapper{display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:#0000001a}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}\n"] }]
    }], function () { return [{ type: i1.NeurasilChartsService }, { type: i2.NeurasilDataFilter }]; }, { canvas: [{
            type: ViewChild,
            args: ['neurasilChartCanvas', { static: false }]
        }], data: [{
            type: Input
        }], showToolbar: [{
            type: Input
        }], chartType: [{
            type: Input
        }], useAltAxis: [{
            type: Input
        }], chartTitle: [{
            type: Input
        }], xAxisLabelText: [{
            type: Input
        }], yAxisLabelText: [{
            type: Input
        }], yAxisLabelText_Alt: [{
            type: Input
        }], colorPalette: [{
            type: Input
        }], hoverOpacity: [{
            type: Input
        }], defaultOpacity: [{
            type: Input
        }], hoverOpacity_border: [{
            type: Input
        }], defaultOpacity_border: [{
            type: Input
        }], swapLabelsAndDatasets: [{
            type: Input
        }], globalFilter: [{
            type: Input
        }], showDataLabels: [{
            type: Input
        }], noDataMessage: [{
            type: Input
        }], additionalOpts_Plugins: [{
            type: Input
        }], additionalOpts_Elements: [{
            type: Input
        }], useLogScale: [{
            type: Input
        }], chartTypeChange: [{
            type: Output
        }], showToolbarChange: [{
            type: Output
        }], swapLabelsAndDatasetsChange: [{
            type: Output
        }], dataOnClick: [{
            type: Output
        }], onBeforePrint: [{
            type: HostListener,
            args: ['window:beforeprint', ['$event']]
        }], onAfterPrint: [{
            type: HostListener,
            args: ['window:afterprint', ['$event']]
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhELHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7SUNQcEQsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLFlBQ0o7SUFBQSxpQkFBTSxFQUFBOzs7SUFERixlQUNKO0lBREkscURBQ0o7O0FETFosS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBY2hDLE1BQU0sT0FBTyx1QkFBdUI7SUFpRWxDLFlBQW1CLHFCQUE0QyxFQUFTLGtCQUFzQztRQUEzRiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQVMsdUJBQWtCLEdBQWxCLGtC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d0NoaWxkLCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBOZXVyYXNpbENoYXJ0c1NlcnZpY2UgfSBmcm9tICcuL25ldXJhc2lsLWNoYXJ0cy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHsgTmV1cmFzaWxEYXRhRmlsdGVyIH0gZnJvbSAnLi9waXBlcyc7XHJcbmltcG9ydCB7IENoYXJ0LCByZWdpc3RlcmFibGVzIH0gZnJvbSAnY2hhcnQuanMnO1xyXG5DaGFydC5yZWdpc3RlciguLi5yZWdpc3RlcmFibGVzKVxyXG4vLyBpbXBvcnQgQ2hhcnQgZnJvbSAnY2hhcnQuanMvYXV0byc7XHJcbmltcG9ydCB7IEhvc3RMaXN0ZW5lciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IENoYXJ0RGF0YUxhYmVscyBmcm9tICdjaGFydGpzLXBsdWdpbi1kYXRhbGFiZWxzJztcclxuXHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZXVyYXNpbC1jaGFydHMnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQuc2FzcyddLFxyXG4gIHByb3ZpZGVyczogW05ldXJhc2lsRGF0YUZpbHRlcl1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBAVmlld0NoaWxkKCduZXVyYXNpbENoYXJ0Q2FudmFzJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNhbnZhczogRWxlbWVudFJlZjtcclxuXHJcbiAgLyoqIERhdGEgdG8gcGxvdCAqL1xyXG4gIEBJbnB1dCgpIGRhdGE6IEFycmF5PGFueT47XHJcbiAgLyoqIFNob3cgaGlkZSB0b29sYmFyICovXHJcbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIC8qKiBVc2VyLWRlZmluZWQgZGVmYXVsdCBjaGFydCB0eXBlICovXHJcbiAgQElucHV0KCkgY2hhcnRUeXBlOiBORVVSQVNJTF9DSEFSVF9UWVBFID0gbnVsbDtcclxuICAvKiogU2hvdyByaWdodCBheGlzIGZvciBzaGl0cyBhbmQgZ2lnZ2xlcyAqL1xyXG4gIEBJbnB1dCgpIHVzZUFsdEF4aXM6IGJvb2xlYW4gPSB0cnVlOyAvLyBub3Qgc3VyZSBpZiBuZWVkZWRcclxuICAvKiogU2V0IGEgY2hhcnQgdGl0bGUgKi9cclxuICBASW5wdXQoKSBjaGFydFRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBYLUF4aXMgdGV4dCAqL1xyXG4gIEBJbnB1dCgpIHhBeGlzTGFiZWxUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBZLUF4aXMgdGV4dCAqL1xyXG4gIEBJbnB1dCgpIHlBeGlzTGFiZWxUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBBbHQtWS1BeGlzIHRleHQgICAqL1xyXG4gIEBJbnB1dCgpIHlBeGlzTGFiZWxUZXh0X0FsdDogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgQElucHV0KCkgY29sb3JQYWxldHRlOkFycmF5PHN0cmluZz47XHJcbiAgQElucHV0KCkgaG92ZXJPcGFjaXR5OiBudW1iZXIgPSAwLjk7XHJcbiAgQElucHV0KCkgZGVmYXVsdE9wYWNpdHk6IG51bWJlciA9IDAuNTtcclxuICBASW5wdXQoKSBob3Zlck9wYWNpdHlfYm9yZGVyOiBudW1iZXIgPSAxO1xyXG4gIEBJbnB1dCgpIGRlZmF1bHRPcGFjaXR5X2JvcmRlcjogbnVtYmVyID0gMTtcclxuICAvKiogU3dhcCBEYXRhc2V0IGFuZCBMYWJlbHMgXHJcbiAgICogQFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0czogYm9vbGVhbjtcclxuICAvKiogRmlsdGVyIGRhdGEgKi9cclxuICBASW5wdXQoKSBnbG9iYWxGaWx0ZXI6IHN0cmluZyA9IFwiXCI7XHJcbiAgLyoqIFNob3cgZGF0YSBsYWJlbHMgXHJcbiAgICogQHBhcmFtIHNob3dEYXRhTGFiZWxzIGRlZmF1bHQ6IGZhbHNlXHJcbiAgKi9cclxuICBASW5wdXQoKSBzaG93RGF0YUxhYmVsczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoKSBub0RhdGFNZXNzYWdlOiBzdHJpbmcgPSBcIk5vIGRhdGEgdG8gZGlzcGxheS4gQ2hlY2sgeW91ciBmaWx0ZXJzLlwiO1xyXG5cclxuICBASW5wdXQoKSBhZGRpdGlvbmFsT3B0c19QbHVnaW5zID0ge307XHJcblxyXG4gIEBJbnB1dCgpIGFkZGl0aW9uYWxPcHRzX0VsZW1lbnRzID0ge307XHJcblxyXG4gIEBJbnB1dCgpIHVzZUxvZ1NjYWxlOmJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIEVtaXRzIGV2ZW50IGZyb20gY2hhbmdpbmcgQ2hhcnQgdHlwZSBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBjaGFydFR5cGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEZvcmdvdCB3aGF0IHRoaXMgZG9lcyAqL1xyXG4gIEBPdXRwdXQoKSBzaG93VG9vbGJhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvKiogRW1pdHMgZXZlbnQgZnJvbSB0b2dnbGluZyB0aGUgc3dhcCBsYWJlbC9kYXRhIHN3aXRjaCBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEVtaXRzIGRhdGEgZnJvbSBjbGlja2VkIGNoYXJ0IGl0ZW0gKi9cclxuICBAT3V0cHV0KCkgZGF0YU9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8qKiBkZWZhdWx0IHRvb2xiYXIgcHJvcHMgKi9cclxuICB0b29sYmFyUHJvcHMgPSB7XHJcbiAgICBjaGFydFR5cGU6IHRoaXMuY2hhcnRUeXBlID8gdGhpcy5jaGFydFR5cGUgOiBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUixcclxuICAgIF9kYXRhc2V0RmlsdGVyOiBcIlwiLFxyXG4gICAgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBfY2FudmFzOiBhbnk7XHJcbiAgaGFzRGF0YTogYm9vbGVhbjsgLy8gZm9yIHRoZSBwdXJwb3NlIG9mIGNoZWNraW5nIGxlbmd0aCBpbiBodG1sIHRlbXBsYXRlXHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmV1cmFzaWxDaGFydHNTZXJ2aWNlOiBOZXVyYXNpbENoYXJ0c1NlcnZpY2UsIHB1YmxpYyBuZXVyYXNpbERhdGFGaWx0ZXI6IE5ldXJhc2lsRGF0YUZpbHRlcikgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuY2hhcnRUeXBlKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9IHRoaXMuY2hhcnRUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPSB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGFzRGF0YSA9ICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCA+IDApO1xyXG4gIH1cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcykge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjaGFuZ2VzKVxyXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JlcHJpbnQnLCBbJyRldmVudCddKVxyXG4gIG9uQmVmb3JlUHJpbnQoZXZlbnQpIHtcclxuICAgIC8vIHRoaXMuZHJhd0NoYXJ0KHRydWUpXHJcblxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YWZ0ZXJwcmludCcsIFsnJGV2ZW50J10pXHJcbiAgb25BZnRlclByaW50KGV2ZW50KSB7XHJcbiAgICAvLyB0aGlzLmRyYXdDaGFydChmYWxzZSk7XHJcbiAgfVxyXG4gIHVwZGF0ZVRvb2xiYXJQcm9wcyhldikge1xyXG5cclxuICAgIHRoaXMuY2hhcnRUeXBlQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlKTtcclxuICAgIHRoaXMuc2hvd1Rvb2xiYXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dUb29sYmFyKTtcclxuICAgIHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKVxyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcblxyXG5cclxuICBkcmF3Q2hhcnQoaXNQcmludGluZzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBpZiAodGhpcy5fY2FudmFzKSB7XHJcbiAgICAgIHRoaXMuX2NhbnZhcy5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jYW52YXMpIHtcclxuICAgICAgdmFyIGN0eCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgbGV0IGZpbHRlclN0cmluZyA9IFwiXCJcclxuICAgICAgaWYgKHRoaXMuZ2xvYmFsRmlsdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy5nbG9iYWxGaWx0ZXIgKyBcIixcIlxyXG4gICAgICB9XHJcbiAgICAgIGZpbHRlclN0cmluZyArPSB0aGlzLnRvb2xiYXJQcm9wcy5fZGF0YXNldEZpbHRlcjtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IHRoaXMubmV1cmFzaWxEYXRhRmlsdGVyLnRyYW5zZm9ybSh0aGlzLmRhdGEsIGZpbHRlclN0cmluZyk7XHJcbiAgICAgIHRoaXMuaGFzRGF0YSA9IChmaWx0ZXJlZERhdGEgJiYgZmlsdGVyZWREYXRhLmxlbmd0aCA+IDApO1xyXG4gICAgICBpZiAodGhpcy5oYXNEYXRhKSB7XHJcbiAgICAgICAgbGV0IG8gPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wYXJzZURhdGFGcm9tRGF0YXNvdXJjZSh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIGZpbHRlcmVkRGF0YSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm9cIixvKVxyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLmNoYXJ0T2JqZWN0QnVpbGRlcihcclxuICAgICAgICAgIHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSwgXHJcbiAgICAgICAgICBvLmRhdGEsIHRoaXMudXNlQWx0QXhpcywgXHJcbiAgICAgICAgICB0aGlzLmNoYXJ0VGl0bGUsIFxyXG4gICAgICAgICAgdGhpcy55QXhpc0xhYmVsVGV4dCwgXHJcbiAgICAgICAgICB0aGlzLnlBeGlzTGFiZWxUZXh0X0FsdCwgXHJcbiAgICAgICAgICB0aGlzLnhBeGlzTGFiZWxUZXh0LCBcclxuICAgICAgICAgIG8uX2Nvcm5lcnN0b25lLFxyXG4gICAgICAgICAgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzLCBcclxuICAgICAgICAgIG8uX2Zvcm1hdE9iamVjdCxcclxuICAgICAgICAgIHRoaXMudXNlTG9nU2NhbGUsXHJcbiAgICAgICAgICB0aGlzLmNvbG9yUGFsZXR0ZSxcclxuICAgICAgICAgIHRoaXMuaG92ZXJPcGFjaXR5LFxyXG4gICAgICAgICAgdGhpcy5kZWZhdWx0T3BhY2l0eSxcclxuICAgICAgICAgIHRoaXMuaG92ZXJPcGFjaXR5X2JvcmRlcixcclxuICAgICAgICAgIHRoaXMuZGVmYXVsdE9wYWNpdHlfYm9yZGVyLFxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgICAgICB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpOyAvLyBtb2RpZnkgY2hhcnQgcHJvcHMgb2JqZWN0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgVEhJUyA9IHRoaXM7XHJcbiAgICAgICAgLy9DYW50IHB1dCB0aGlzIGluIHNlcnZpY2UsIGlkayB3aHlcclxuICAgICAgICAvLyNyZWdpb24gZW1pdCBvbmNsaWNrIGV2ZW50IGRhdGFcclxuICAgICAgICBwcm9wcy5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZXYsIGVsZW1lbnQsIGNoYXJ0T2JqKSB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudFswXSkge1xyXG4gICAgICAgICAgICBsZXQgY2xpY2tEYXRhID0gZWxlbWVudFswXTtcclxuICAgICAgICAgICAgbGV0IHhBeGlzVmFsID0gcHJvcHMuZGF0YS5sYWJlbHNbY2xpY2tEYXRhLmluZGV4XTtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXQgPSBwcm9wcy5kYXRhLmRhdGFzZXRzW2NsaWNrRGF0YS5kYXRhc2V0SW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldExhYmVsID0gZGF0YXNldC5sYWJlbDtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXRWYWwgPSBkYXRhc2V0LmRhdGFbY2xpY2tEYXRhLmluZGV4XTtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbURhdGFPYmogPSB7XHJcbiAgICAgICAgICAgICAgdmFsOiBkYXRhc2V0VmFsLFxyXG4gICAgICAgICAgICAgIGRhdGFMYWJlbDogVEhJUy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPyBkYXRhc2V0TGFiZWwgOiB4QXhpc1ZhbCxcclxuICAgICAgICAgICAgICBkYXRhc2V0TGFiZWw6IFRISVMuc3dhcExhYmVsc0FuZERhdGFzZXRzID8geEF4aXNWYWwgOiBkYXRhc2V0TGFiZWxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHtcclxuICAgICAgICAgICAgICBldmVudDogZXYsXHJcbiAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcclxuICAgICAgICAgICAgICBjaGFydEluc3RhbmNlOiBjaGFydE9iaixcclxuICAgICAgICAgICAgICBkYXRhOiBjdXN0b21EYXRhT2JqXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVEhJUy5kYXRhT25DbGljay5lbWl0KGRhdGEpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG5cclxuICAgICAgICAvLyNyZWdpb24gc2hvdyBkYXRhIGxhYmVsc1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dEYXRhTGFiZWxzIHx8IGlzUHJpbnRpbmcpIHtcclxuICAgICAgICAgIHByb3BzLnBsdWdpbnMucHVzaChDaGFydERhdGFMYWJlbHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgICAgICAvLyNyZWdpb24gYWRkIGFkZGl0aW9uYWwgb3B0aW9ucy5wbHVnaW5zIGRhdGFcclxuICAgICAgICBpZiAoIXByb3BzLm9wdGlvbnMucGx1Z2lucykge1xyXG4gICAgICAgICAgcHJvcHMub3B0aW9ucy5wbHVnaW5zID0ge31cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWRkaXRpb25hbE9wdHNfUGx1Z2lucyl7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMgPSB0aGlzLmFkZGl0aW9uYWxPcHRzX1BsdWdpbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgICAgIC8vI3JlZ2lvbiBhZGQgYWRkaXRpb25hbCBvcHRpb25zLmVsZW1lbnRzIGRhdGFcclxuICAgICAgICBpZiAoIXByb3BzLm9wdGlvbnMuZWxlbWVudHMpIHtcclxuICAgICAgICAgIHByb3BzLm9wdGlvbnMuZWxlbWVudHMgPSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9wcy5vcHRpb25zLmVsZW1lbnRzID0geyAuLi5wcm9wcy5vcHRpb25zLmVsZW1lbnRzLCAuLi50aGlzLmFkZGl0aW9uYWxPcHRzX0VsZW1lbnRzIH07XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgLy8jcmVnaW9uIGZvcm1hdCBkYXRhbGFiZWxzIHRvIDMgZGVjaW1hbCBwbGFjZXNcclxuICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMuZGF0YWxhYmVscyA9IHtcclxuICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlID09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKHZhbHVlID4gMCAmJiB2YWx1ZSA+PSAwLjAwMSkgfHwgKHZhbHVlIDwgMCAmJiB2YWx1ZSA8IC0wLjAwMSkpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSAqIDEwMDApIC8gMTAwMDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IDAgJiYgdmFsdWUgPCAwLjAwMSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBcIjwgMC4wMDFcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZXR1cm4gXCI+IC0wLjAwMVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgICAgIC8vI3JlZ2lvbiBjdXN0b21pemUgdG9vbHRpcFxyXG4gICAgICAgIGlmICh0aGlzLmNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUIHx8IHRoaXMuY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFKSB7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMudG9vbHRpcCA9IHtcclxuICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgdGl0bGU6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBjb3VsZCBiZSBhbiBpc3N1ZSB3aXRoIG11bHRpcGxlIGRhdGFzZXRzXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW1bMF0ubGFiZWw7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24odG9vbHRpcEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IHRvb2x0aXBJdGVtLmRhdGFzZXQubGFiZWwgfHwgJyc7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0b29sdGlwSXRlbS5wYXJzZWQueSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICBsYWJlbCArPSBgJHt0b29sdGlwSXRlbS5wYXJzZWR9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHByb3BzLm9wdGlvbnMucGx1Z2lucy50b29sdGlwID0ge1xyXG4gICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICBsYWJlbDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IGNvbnRleHQuZGF0YXNldC5sYWJlbCB8fCAnJztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LnBhcnNlZC55ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsICs9IGAke2NvbnRleHQucGFyc2VkLnl9YDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcblxyXG5cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBuZXcgQ2hhcnQoY3R4LCBwcm9wcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiXHJcbjxkaXYgY2xhc3M9XCJjb21wb25lbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInRvb2xiYXItd3JhcHBlclwiICpuZ0lmPVwic2hvd1Rvb2xiYXJcIj5cclxuICAgICAgICA8bmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIgWyh0b29sYmFyUHJvcHMpXT1cInRvb2xiYXJQcm9wc1wiICh0b29sYmFyUHJvcHNDaGFuZ2UpPVwidXBkYXRlVG9vbGJhclByb3BzKCRldmVudClcIj48L25ldXJhc2lsLWNoYXJ0cy10b29sYmFyPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY2FudmFzLXdyYXBwZXJcIj5cclxuICAgICAgICA8Y2FudmFzIFtuZ0NsYXNzXT1cImhhc0RhdGEgPyAnJyA6ICdjYW52YXMtaGlkZGVuJ1wiICNuZXVyYXNpbENoYXJ0Q2FudmFzIGlkPVwibmV1cmFzaWxDaGFydENhbnZhc1wiPjwvY2FudmFzPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgKm5nSWY9XCIhaGFzRGF0YVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS1jb250ZW50c1wiPlxyXG4gICAgICAgICAgICAgICAge3tub0RhdGFNZXNzYWdlfX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbiJdfQ==