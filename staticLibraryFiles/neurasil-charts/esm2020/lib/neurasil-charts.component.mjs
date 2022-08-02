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
        /** Filter data */
        this.globalFilter = "";
        /** Show data labels
         * @param showDataLabels default: false
        */
        this.showDataLabels = false;
        this.noDataMessage = "No data to display. Check your filters.";
        this.additionalPluginOpts = {};
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
                if (this.showDataLabels || isPrinting) {
                    props.plugins.push(ChartDataLabels);
                }
                if (!props.options.plugins) {
                    props.options.plugins = {};
                }
                if (this.additionalPluginOpts) {
                    props.options.plugins = this.additionalPluginOpts;
                }
                props.options.plugins.datalabels = {
                    formatter: function (value, context) {
                        //return Math.round(value*100) + '%';
                        if ((value > 0 && value >= 0.001) || (value < 0 && value < -0.001)) {
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
                // console.log("ctx",ctx)
                // console.log("props",props)
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
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter", showDataLabels: "showDataLabels", noDataMessage: "noDataMessage", additionalPluginOpts: "additionalPluginOpts" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
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
        }], swapLabelsAndDatasets: [{
            type: Input
        }], globalFilter: [{
            type: Input
        }], showDataLabels: [{
            type: Input
        }], noDataMessage: [{
            type: Input
        }], additionalPluginOpts: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhELHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7SUNQcEQsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLFlBQ0o7SUFBQSxpQkFBTSxFQUFBOzs7SUFERixlQUNKO0lBREkscURBQ0o7O0FETFosS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBY2hDLE1BQU0sT0FBTyx1QkFBdUI7SUF1RGxDLFlBQW1CLHFCQUE0QyxFQUFTLGtCQUFzQztRQUEzRiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQVMsdUJBQWtCLEdBQWxCLGtC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c0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNTZXJ2aWNlIH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7IE5ldXJhc2lsRGF0YUZpbHRlciB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBDaGFydCwgcmVnaXN0ZXJhYmxlcyB9IGZyb20gJ2NoYXJ0LmpzJztcclxuQ2hhcnQucmVnaXN0ZXIoLi4ucmVnaXN0ZXJhYmxlcylcclxuLy8gaW1wb3J0IENoYXJ0IGZyb20gJ2NoYXJ0LmpzL2F1dG8nO1xyXG5pbXBvcnQgeyBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCBDaGFydERhdGFMYWJlbHMgZnJvbSAnY2hhcnRqcy1wbHVnaW4tZGF0YWxhYmVscyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnNhc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XHJcblxyXG4gIC8qKiBEYXRhIHRvIHBsb3QgKi9cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxhbnk+O1xyXG4gIC8qKiBTaG93IGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICAvKiogVXNlci1kZWZpbmVkIGRlZmF1bHQgY2hhcnQgdHlwZSAqL1xyXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSA9IG51bGw7XHJcbiAgLyoqIFNob3cgcmlnaHQgYXhpcyBmb3Igc2hpdHMgYW5kIGdpZ2dsZXMgKi9cclxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXHJcbiAgLyoqIFNldCBhIGNoYXJ0IHRpdGxlICovXHJcbiAgQElucHV0KCkgY2hhcnRUaXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWC1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB4QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWS1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogQWx0LVktQXhpcyB0ZXh0ICAgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgLyoqIFN3YXAgRGF0YXNldCBhbmQgTGFiZWxzIFxyXG4gICAqIEBcclxuICAgKi9cclxuICBASW5wdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGJvb2xlYW47XHJcbiAgLyoqIEZpbHRlciBkYXRhICovXHJcbiAgQElucHV0KCkgZ2xvYmFsRmlsdGVyOiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBTaG93IGRhdGEgbGFiZWxzIFxyXG4gICAqIEBwYXJhbSBzaG93RGF0YUxhYmVscyBkZWZhdWx0OiBmYWxzZVxyXG4gICovXHJcbiAgQElucHV0KCkgc2hvd0RhdGFMYWJlbHM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgbm9EYXRhTWVzc2FnZTogc3RyaW5nID0gXCJObyBkYXRhIHRvIGRpc3BsYXkuIENoZWNrIHlvdXIgZmlsdGVycy5cIjtcclxuXHJcbiAgQElucHV0KCkgYWRkaXRpb25hbFBsdWdpbk9wdHMgPSB7fTtcclxuXHJcbiAgLyoqIEVtaXRzIGV2ZW50IGZyb20gY2hhbmdpbmcgQ2hhcnQgdHlwZSBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBjaGFydFR5cGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEZvcmdvdCB3aGF0IHRoaXMgZG9lcyAqL1xyXG4gIEBPdXRwdXQoKSBzaG93VG9vbGJhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvKiogRW1pdHMgZXZlbnQgZnJvbSB0b2dnbGluZyB0aGUgc3dhcCBsYWJlbC9kYXRhIHN3aXRjaCBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEVtaXRzIGRhdGEgZnJvbSBjbGlja2VkIGNoYXJ0IGl0ZW0gKi9cclxuICBAT3V0cHV0KCkgZGF0YU9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8qKiBkZWZhdWx0IHRvb2xiYXIgcHJvcHMgKi9cclxuICB0b29sYmFyUHJvcHMgPSB7XHJcbiAgICBjaGFydFR5cGU6IHRoaXMuY2hhcnRUeXBlID8gdGhpcy5jaGFydFR5cGUgOiBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUixcclxuICAgIF9kYXRhc2V0RmlsdGVyOiBcIlwiLFxyXG4gICAgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBfY2FudmFzOiBhbnk7XHJcbiAgaGFzRGF0YTogYm9vbGVhbjsgLy8gZm9yIHRoZSBwdXJwb3NlIG9mIGNoZWNraW5nIGxlbmd0aCBpbiBodG1sIHRlbXBsYXRlXHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmV1cmFzaWxDaGFydHNTZXJ2aWNlOiBOZXVyYXNpbENoYXJ0c1NlcnZpY2UsIHB1YmxpYyBuZXVyYXNpbERhdGFGaWx0ZXI6IE5ldXJhc2lsRGF0YUZpbHRlcikgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuY2hhcnRUeXBlKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9IHRoaXMuY2hhcnRUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPSB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGFzRGF0YSA9ICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCA+IDApO1xyXG4gIH1cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcykge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjaGFuZ2VzKVxyXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JlcHJpbnQnLCBbJyRldmVudCddKVxyXG4gIG9uQmVmb3JlUHJpbnQoZXZlbnQpIHtcclxuICAgIC8vIHRoaXMuZHJhd0NoYXJ0KHRydWUpXHJcblxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YWZ0ZXJwcmludCcsIFsnJGV2ZW50J10pXHJcbiAgb25BZnRlclByaW50KGV2ZW50KSB7XHJcbiAgICAvLyB0aGlzLmRyYXdDaGFydChmYWxzZSk7XHJcbiAgfVxyXG4gIHVwZGF0ZVRvb2xiYXJQcm9wcyhldikge1xyXG5cclxuICAgIHRoaXMuY2hhcnRUeXBlQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlKTtcclxuICAgIHRoaXMuc2hvd1Rvb2xiYXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dUb29sYmFyKTtcclxuICAgIHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKVxyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcblxyXG5cclxuICBkcmF3Q2hhcnQoaXNQcmludGluZzogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICBpZiAodGhpcy5fY2FudmFzKSB7XHJcbiAgICAgIHRoaXMuX2NhbnZhcy5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jYW52YXMpIHtcclxuICAgICAgdmFyIGN0eCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgbGV0IGZpbHRlclN0cmluZyA9IFwiXCJcclxuICAgICAgaWYgKHRoaXMuZ2xvYmFsRmlsdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy5nbG9iYWxGaWx0ZXIgKyBcIixcIlxyXG4gICAgICB9XHJcbiAgICAgIGZpbHRlclN0cmluZyArPSB0aGlzLnRvb2xiYXJQcm9wcy5fZGF0YXNldEZpbHRlcjtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IHRoaXMubmV1cmFzaWxEYXRhRmlsdGVyLnRyYW5zZm9ybSh0aGlzLmRhdGEsIGZpbHRlclN0cmluZyk7XHJcbiAgICAgIHRoaXMuaGFzRGF0YSA9IChmaWx0ZXJlZERhdGEgJiYgZmlsdGVyZWREYXRhLmxlbmd0aCA+IDApO1xyXG4gICAgICBpZiAodGhpcy5oYXNEYXRhKSB7XHJcbiAgICAgICAgbGV0IG8gPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wYXJzZURhdGFGcm9tRGF0YXNvdXJjZSh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIGZpbHRlcmVkRGF0YSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm9cIixvKVxyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLmNoYXJ0T2JqZWN0QnVpbGRlcih0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIG8uZGF0YSwgdGhpcy51c2VBbHRBeGlzLCB0aGlzLmNoYXJ0VGl0bGUsIHRoaXMueUF4aXNMYWJlbFRleHQsIHRoaXMueUF4aXNMYWJlbFRleHRfQWx0LCB0aGlzLnhBeGlzTGFiZWxUZXh0LCBvLl9jb3JuZXJzdG9uZSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzLCBvLl9mb3JtYXRPYmplY3QpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLnBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcyk7IC8vIG1vZGlmeSBjaGFydCBwcm9wcyBvYmplY3RcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBUSElTID0gdGhpcztcclxuICAgICAgICAvL0NhbnQgcHV0IHRoaXMgaW4gc2VydmljZSwgaWRrIHdoeVxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMub25DbGljayA9IGZ1bmN0aW9uIChldiwgZWxlbWVudCwgY2hhcnRPYmopIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50WzBdKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGlja0RhdGEgPSBlbGVtZW50WzBdO1xyXG4gICAgICAgICAgICBsZXQgeEF4aXNWYWwgPSBwcm9wcy5kYXRhLmxhYmVsc1tjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldCA9IHByb3BzLmRhdGEuZGF0YXNldHNbY2xpY2tEYXRhLmRhdGFzZXRJbmRleF07XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0TGFiZWwgPSBkYXRhc2V0LmxhYmVsO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldFZhbCA9IGRhdGFzZXQuZGF0YVtjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgY3VzdG9tRGF0YU9iaiA9IHtcclxuICAgICAgICAgICAgICB2YWw6IGRhdGFzZXRWYWwsXHJcbiAgICAgICAgICAgICAgZGF0YUxhYmVsOiBUSElTLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA/IGRhdGFzZXRMYWJlbCA6IHhBeGlzVmFsLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRMYWJlbDogVEhJUy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPyB4QXhpc1ZhbCA6IGRhdGFzZXRMYWJlbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgIGV2ZW50OiBldixcclxuICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2U6IGNoYXJ0T2JqLFxyXG4gICAgICAgICAgICAgIGRhdGE6IGN1c3RvbURhdGFPYmpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBUSElTLmRhdGFPbkNsaWNrLmVtaXQoZGF0YSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd0RhdGFMYWJlbHMgfHwgaXNQcmludGluZykge1xyXG4gICAgICAgICAgcHJvcHMucGx1Z2lucy5wdXNoKENoYXJ0RGF0YUxhYmVscyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcHJvcHMub3B0aW9ucy5wbHVnaW5zKSB7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMgPSB7fVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hZGRpdGlvbmFsUGx1Z2luT3B0cyl7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMgPSB0aGlzLmFkZGl0aW9uYWxQbHVnaW5PcHRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMuZGF0YWxhYmVscyA9IHtcclxuICAgICAgICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKHZhbHVlLCBjb250ZXh0KSB7XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIE1hdGgucm91bmQodmFsdWUqMTAwKSArICclJztcclxuICAgICAgICAgICAgaWYgKCh2YWx1ZSA+IDAgJiYgdmFsdWUgPj0gMC4wMDEpIHx8ICh2YWx1ZSA8IDAgJiYgdmFsdWUgPCAtMC4wMDEpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiAxMDAwKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiAwICYmIHZhbHVlIDwgMC4wMDEpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gXCI8IDAuMDAxXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiPiAtMC4wMDFcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCB8fCB0aGlzLmNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSkge1xyXG4gICAgICAgICAgcHJvcHMub3B0aW9ucy5wbHVnaW5zLnRvb2x0aXAgPSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgIHRpdGxlOiBmdW5jdGlvbih0b29sdGlwSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogY291bGQgYmUgYW4gaXNzdWUgd2l0aCBtdWx0aXBsZSBkYXRhc2V0c1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvb2x0aXBJdGVtWzBdLmxhYmVsO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uKHRvb2x0aXBJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSB0b29sdGlwSXRlbS5kYXRhc2V0LmxhYmVsIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodG9vbHRpcEl0ZW0ucGFyc2VkLnkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgbGFiZWwgKz0gYCR7dG9vbHRpcEl0ZW0ucGFyc2VkfWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLnBsdWdpbnMudG9vbHRpcCA9IHtcclxuICAgICAgICAgICAgY2FsbGJhY2tzOiB7XHJcbiAgICAgICAgICAgICAgbGFiZWw6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSBjb250ZXh0LmRhdGFzZXQubGFiZWwgfHwgJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY29udGV4dC5wYXJzZWQueSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICBsYWJlbCArPSBgJHtjb250ZXh0LnBhcnNlZC55fWA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjdHhcIixjdHgpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9wc1wiLHByb3BzKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IG5ldyBDaGFydChjdHgsIHByb3BzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJcclxuPGRpdiBjbGFzcz1cImNvbXBvbmVudC13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwidG9vbGJhci13cmFwcGVyXCIgKm5nSWY9XCJzaG93VG9vbGJhclwiPlxyXG4gICAgICAgIDxuZXVyYXNpbC1jaGFydHMtdG9vbGJhciBbKHRvb2xiYXJQcm9wcyldPVwidG9vbGJhclByb3BzXCIgKHRvb2xiYXJQcm9wc0NoYW5nZSk9XCJ1cGRhdGVUb29sYmFyUHJvcHMoJGV2ZW50KVwiPjwvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXI+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjYW52YXMtd3JhcHBlclwiPlxyXG4gICAgICAgIDxjYW52YXMgW25nQ2xhc3NdPVwiaGFzRGF0YSA/ICcnIDogJ2NhbnZhcy1oaWRkZW4nXCIgI25ldXJhc2lsQ2hhcnRDYW52YXMgaWQ9XCJuZXVyYXNpbENoYXJ0Q2FudmFzXCI+PC9jYW52YXM+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXlcIiAqbmdJZj1cIiFoYXNEYXRhXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5LWNvbnRlbnRzXCI+XHJcbiAgICAgICAgICAgICAgICB7e25vRGF0YU1lc3NhZ2V9fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19