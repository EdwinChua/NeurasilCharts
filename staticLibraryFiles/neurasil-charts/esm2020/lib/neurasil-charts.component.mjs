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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhELHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7SUNQcEQsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLFlBQ0o7SUFBQSxpQkFBTSxFQUFBOzs7SUFERixlQUNKO0lBREkscURBQ0o7O0FETFosS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBY2hDLE1BQU0sT0FBTyx1QkFBdUI7SUFpRWxDLFlBQW1CLHFCQUE0QyxFQUFTLGtCQUFzQztRQUEzRiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQVMsdUJBQWtCLEdBQWxCLGtC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Ozt1RkRZL0IsdUJBQXVCO2NBTm5DLFNBQVM7MkJBQ0UsaUJBQWlCLGFBR2hCLENBQUMsa0JBQWtCLENBQUM7eUdBSXNCLE1BQU07a0JBQTFELFNBQVM7bUJBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBRzFDLElBQUk7a0JBQVosS0FBSztZQUVHLFdBQVc7a0JBQW5CLEtBQUs7WUFFRyxTQUFTO2tCQUFqQixLQUFLO1lBRUcsVUFBVTtrQkFBbEIsS0FBSztZQUVHLFVBQVU7a0JBQWxCLEtBQUs7WUFFRyxjQUFjO2tCQUF0QixLQUFLO1lBRUcsY0FBYztrQkFBdEIsS0FBSztZQUVHLGtCQUFrQjtrQkFBMUIsS0FBSztZQUVHLFlBQVk7a0JBQXBCLEtBQUs7WUFDRyxZQUFZO2tCQUFwQixLQUFLO1lBQ0csY0FBYztrQkFBdEIsS0FBSztZQUNHLG1CQUFtQjtrQkFBM0IsS0FBSztZQUNHLHFCQUFxQjtrQkFBN0IsS0FBSztZQUlHLHFCQUFxQjtrQkFBN0IsS0FBSztZQUVHLFlBQVk7a0JBQXBCLEtBQUs7WUFJRyxjQUFjO2tCQUF0QixLQUFLO1lBRUcsYUFBYTtrQkFBckIsS0FBSztZQUVHLHNCQUFzQjtrQkFBOUIsS0FBSztZQUVHLHVCQUF1QjtrQkFBL0IsS0FBSztZQUVHLFdBQVc7a0JBQW5CLEtBQUs7WUFHSSxlQUFlO2tCQUF4QixNQUFNO1lBRUcsaUJBQWlCO2tCQUExQixNQUFNO1lBRUcsMkJBQTJCO2tCQUFwQyxNQUFNO1lBRUcsV0FBVztrQkFBcEIsTUFBTTtZQW9DUCxhQUFhO2tCQURaLFlBQVk7bUJBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFNOUMsWUFBWTtrQkFEWCxZQUFZO21CQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNTZXJ2aWNlIH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7IE5ldXJhc2lsRGF0YUZpbHRlciB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBDaGFydCwgcmVnaXN0ZXJhYmxlcyB9IGZyb20gJ2NoYXJ0LmpzJztcclxuQ2hhcnQucmVnaXN0ZXIoLi4ucmVnaXN0ZXJhYmxlcylcclxuLy8gaW1wb3J0IENoYXJ0IGZyb20gJ2NoYXJ0LmpzL2F1dG8nO1xyXG5pbXBvcnQgeyBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCBDaGFydERhdGFMYWJlbHMgZnJvbSAnY2hhcnRqcy1wbHVnaW4tZGF0YWxhYmVscyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnNhc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XHJcblxyXG4gIC8qKiBEYXRhIHRvIHBsb3QgKi9cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxhbnk+O1xyXG4gIC8qKiBTaG93IGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICAvKiogVXNlci1kZWZpbmVkIGRlZmF1bHQgY2hhcnQgdHlwZSAqL1xyXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSA9IG51bGw7XHJcbiAgLyoqIFNob3cgcmlnaHQgYXhpcyBmb3Igc2hpdHMgYW5kIGdpZ2dsZXMgKi9cclxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXHJcbiAgLyoqIFNldCBhIGNoYXJ0IHRpdGxlICovXHJcbiAgQElucHV0KCkgY2hhcnRUaXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWC1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB4QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWS1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogQWx0LVktQXhpcyB0ZXh0ICAgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dCgpIGNvbG9yUGFsZXR0ZTpBcnJheTxzdHJpbmc+O1xyXG4gIEBJbnB1dCgpIGhvdmVyT3BhY2l0eTogbnVtYmVyID0gMC45O1xyXG4gIEBJbnB1dCgpIGRlZmF1bHRPcGFjaXR5OiBudW1iZXIgPSAwLjU7XHJcbiAgQElucHV0KCkgaG92ZXJPcGFjaXR5X2JvcmRlcjogbnVtYmVyID0gMTtcclxuICBASW5wdXQoKSBkZWZhdWx0T3BhY2l0eV9ib3JkZXI6IG51bWJlciA9IDE7XHJcbiAgLyoqIFN3YXAgRGF0YXNldCBhbmQgTGFiZWxzIFxyXG4gICAqIEBcclxuICAgKi9cclxuICBASW5wdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGJvb2xlYW47XHJcbiAgLyoqIEZpbHRlciBkYXRhICovXHJcbiAgQElucHV0KCkgZ2xvYmFsRmlsdGVyOiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBTaG93IGRhdGEgbGFiZWxzIFxyXG4gICAqIEBwYXJhbSBzaG93RGF0YUxhYmVscyBkZWZhdWx0OiBmYWxzZVxyXG4gICovXHJcbiAgQElucHV0KCkgc2hvd0RhdGFMYWJlbHM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgbm9EYXRhTWVzc2FnZTogc3RyaW5nID0gXCJObyBkYXRhIHRvIGRpc3BsYXkuIENoZWNrIHlvdXIgZmlsdGVycy5cIjtcclxuXHJcbiAgQElucHV0KCkgYWRkaXRpb25hbE9wdHNfUGx1Z2lucyA9IHt9O1xyXG5cclxuICBASW5wdXQoKSBhZGRpdGlvbmFsT3B0c19FbGVtZW50cyA9IHt9O1xyXG5cclxuICBASW5wdXQoKSB1c2VMb2dTY2FsZTpib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBFbWl0cyBldmVudCBmcm9tIGNoYW5naW5nIENoYXJ0IHR5cGUgZnJvbSB0b29sYmFyIChJIHRoaW5rLCBmb3Jnb3Qgd2hhdCBlbHNlIHRoaXMgZG9lcykgKi9cclxuICBAT3V0cHV0KCkgY2hhcnRUeXBlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIC8qKiBGb3Jnb3Qgd2hhdCB0aGlzIGRvZXMgKi9cclxuICBAT3V0cHV0KCkgc2hvd1Rvb2xiYXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEVtaXRzIGV2ZW50IGZyb20gdG9nZ2xpbmcgdGhlIHN3YXAgbGFiZWwvZGF0YSBzd2l0Y2ggZnJvbSB0b29sYmFyIChJIHRoaW5rLCBmb3Jnb3Qgd2hhdCBlbHNlIHRoaXMgZG9lcykgKi9cclxuICBAT3V0cHV0KCkgc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIC8qKiBFbWl0cyBkYXRhIGZyb20gY2xpY2tlZCBjaGFydCBpdGVtICovXHJcbiAgQE91dHB1dCgpIGRhdGFPbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvKiogZGVmYXVsdCB0b29sYmFyIHByb3BzICovXHJcbiAgdG9vbGJhclByb3BzID0ge1xyXG4gICAgY2hhcnRUeXBlOiB0aGlzLmNoYXJ0VHlwZSA/IHRoaXMuY2hhcnRUeXBlIDogTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIsXHJcbiAgICBfZGF0YXNldEZpbHRlcjogXCJcIixcclxuICAgIHN3YXBMYWJlbHNBbmREYXRhc2V0czogZmFsc2VcclxuICB9O1xyXG5cclxuICBwdWJsaWMgX2NhbnZhczogYW55O1xyXG4gIGhhc0RhdGE6IGJvb2xlYW47IC8vIGZvciB0aGUgcHVycG9zZSBvZiBjaGVja2luZyBsZW5ndGggaW4gaHRtbCB0ZW1wbGF0ZVxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG5ldXJhc2lsQ2hhcnRzU2VydmljZTogTmV1cmFzaWxDaGFydHNTZXJ2aWNlLCBwdWJsaWMgbmV1cmFzaWxEYXRhRmlsdGVyOiBOZXVyYXNpbERhdGFGaWx0ZXIpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmNoYXJ0VHlwZSkge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPSB0aGlzLmNoYXJ0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzID0gdGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHNcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhhc0RhdGEgPSAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggPiAwKTtcclxuICB9XHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coY2hhbmdlcylcclxuICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICAgIH1cclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmJlZm9yZXByaW50JywgWyckZXZlbnQnXSlcclxuICBvbkJlZm9yZVByaW50KGV2ZW50KSB7XHJcbiAgICAvLyB0aGlzLmRyYXdDaGFydCh0cnVlKVxyXG5cclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmFmdGVycHJpbnQnLCBbJyRldmVudCddKVxyXG4gIG9uQWZ0ZXJQcmludChldmVudCkge1xyXG4gICAgLy8gdGhpcy5kcmF3Q2hhcnQoZmFsc2UpO1xyXG4gIH1cclxuICB1cGRhdGVUb29sYmFyUHJvcHMoZXYpIHtcclxuXHJcbiAgICB0aGlzLmNoYXJ0VHlwZUNoYW5nZS5lbWl0KHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSk7XHJcbiAgICB0aGlzLnNob3dUb29sYmFyQ2hhbmdlLmVtaXQodGhpcy5zaG93VG9vbGJhcik7XHJcbiAgICB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZS5lbWl0KHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cylcclxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZHJhd0NoYXJ0KGlzUHJpbnRpbmc6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgaWYgKHRoaXMuX2NhbnZhcykge1xyXG4gICAgICB0aGlzLl9jYW52YXMuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY2FudmFzKSB7XHJcbiAgICAgIHZhciBjdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGxldCBmaWx0ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICAgIGlmICh0aGlzLmdsb2JhbEZpbHRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZmlsdGVyU3RyaW5nICs9IHRoaXMuZ2xvYmFsRmlsdGVyICsgXCIsXCJcclxuICAgICAgfVxyXG4gICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy50b29sYmFyUHJvcHMuX2RhdGFzZXRGaWx0ZXI7XHJcbiAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLm5ldXJhc2lsRGF0YUZpbHRlci50cmFuc2Zvcm0odGhpcy5kYXRhLCBmaWx0ZXJTdHJpbmcpO1xyXG4gICAgICB0aGlzLmhhc0RhdGEgPSAoZmlsdGVyZWREYXRhICYmIGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKTtcclxuICAgICAgaWYgKHRoaXMuaGFzRGF0YSkge1xyXG4gICAgICAgIGxldCBvID0gdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UucGFyc2VEYXRhRnJvbURhdGFzb3VyY2UodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlLCBmaWx0ZXJlZERhdGEsIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJvXCIsbylcclxuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5jaGFydE9iamVjdEJ1aWxkZXIoXHJcbiAgICAgICAgICB0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIFxyXG4gICAgICAgICAgby5kYXRhLCB0aGlzLnVzZUFsdEF4aXMsIFxyXG4gICAgICAgICAgdGhpcy5jaGFydFRpdGxlLCBcclxuICAgICAgICAgIHRoaXMueUF4aXNMYWJlbFRleHQsIFxyXG4gICAgICAgICAgdGhpcy55QXhpc0xhYmVsVGV4dF9BbHQsIFxyXG4gICAgICAgICAgdGhpcy54QXhpc0xhYmVsVGV4dCwgXHJcbiAgICAgICAgICBvLl9jb3JuZXJzdG9uZSxcclxuICAgICAgICAgIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cywgXHJcbiAgICAgICAgICBvLl9mb3JtYXRPYmplY3QsXHJcbiAgICAgICAgICB0aGlzLnVzZUxvZ1NjYWxlLFxyXG4gICAgICAgICAgdGhpcy5jb2xvclBhbGV0dGUsXHJcbiAgICAgICAgICB0aGlzLmhvdmVyT3BhY2l0eSxcclxuICAgICAgICAgIHRoaXMuZGVmYXVsdE9wYWNpdHksXHJcbiAgICAgICAgICB0aGlzLmhvdmVyT3BhY2l0eV9ib3JkZXIsXHJcbiAgICAgICAgICB0aGlzLmRlZmF1bHRPcGFjaXR5X2JvcmRlcixcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UucGVyZm9ybVBhcmV0b0FuYWx5c2lzKHByb3BzKTsgLy8gbW9kaWZ5IGNoYXJ0IHByb3BzIG9iamVjdFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IFRISVMgPSB0aGlzO1xyXG4gICAgICAgIC8vQ2FudCBwdXQgdGhpcyBpbiBzZXJ2aWNlLCBpZGsgd2h5XHJcbiAgICAgICAgLy8jcmVnaW9uIGVtaXQgb25jbGljayBldmVudCBkYXRhXHJcbiAgICAgICAgcHJvcHMub3B0aW9ucy5vbkNsaWNrID0gZnVuY3Rpb24gKGV2LCBlbGVtZW50LCBjaGFydE9iaikge1xyXG4gICAgICAgICAgaWYgKGVsZW1lbnRbMF0pIHtcclxuICAgICAgICAgICAgbGV0IGNsaWNrRGF0YSA9IGVsZW1lbnRbMF07XHJcbiAgICAgICAgICAgIGxldCB4QXhpc1ZhbCA9IHByb3BzLmRhdGEubGFiZWxzW2NsaWNrRGF0YS5pbmRleF07XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0ID0gcHJvcHMuZGF0YS5kYXRhc2V0c1tjbGlja0RhdGEuZGF0YXNldEluZGV4XTtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXRMYWJlbCA9IGRhdGFzZXQubGFiZWw7XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0VmFsID0gZGF0YXNldC5kYXRhW2NsaWNrRGF0YS5pbmRleF07XHJcbiAgICAgICAgICAgIGxldCBjdXN0b21EYXRhT2JqID0ge1xyXG4gICAgICAgICAgICAgIHZhbDogZGF0YXNldFZhbCxcclxuICAgICAgICAgICAgICBkYXRhTGFiZWw6IFRISVMuc3dhcExhYmVsc0FuZERhdGFzZXRzID8gZGF0YXNldExhYmVsIDogeEF4aXNWYWwsXHJcbiAgICAgICAgICAgICAgZGF0YXNldExhYmVsOiBUSElTLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA/IHhBeGlzVmFsIDogZGF0YXNldExhYmVsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgY2hhcnRJbnN0YW5jZTogY2hhcnRPYmosXHJcbiAgICAgICAgICAgICAgZGF0YTogY3VzdG9tRGF0YU9ialxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFRISVMuZGF0YU9uQ2xpY2suZW1pdChkYXRhKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuXHJcbiAgICAgICAgLy8jcmVnaW9uIHNob3cgZGF0YSBsYWJlbHNcclxuICAgICAgICBpZiAodGhpcy5zaG93RGF0YUxhYmVscyB8fCBpc1ByaW50aW5nKSB7XHJcbiAgICAgICAgICBwcm9wcy5wbHVnaW5zLnB1c2goQ2hhcnREYXRhTGFiZWxzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgLy8jcmVnaW9uIGFkZCBhZGRpdGlvbmFsIG9wdGlvbnMucGx1Z2lucyBkYXRhXHJcbiAgICAgICAgaWYgKCFwcm9wcy5vcHRpb25zLnBsdWdpbnMpIHtcclxuICAgICAgICAgIHByb3BzLm9wdGlvbnMucGx1Z2lucyA9IHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmFkZGl0aW9uYWxPcHRzX1BsdWdpbnMpe1xyXG4gICAgICAgICAgcHJvcHMub3B0aW9ucy5wbHVnaW5zID0gdGhpcy5hZGRpdGlvbmFsT3B0c19QbHVnaW5zO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuICAgICAgICAvLyNyZWdpb24gYWRkIGFkZGl0aW9uYWwgb3B0aW9ucy5lbGVtZW50cyBkYXRhXHJcbiAgICAgICAgaWYgKCFwcm9wcy5vcHRpb25zLmVsZW1lbnRzKSB7XHJcbiAgICAgICAgICBwcm9wcy5vcHRpb25zLmVsZW1lbnRzID0ge31cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvcHMub3B0aW9ucy5lbGVtZW50cyA9IHsgLi4ucHJvcHMub3B0aW9ucy5lbGVtZW50cywgLi4udGhpcy5hZGRpdGlvbmFsT3B0c19FbGVtZW50cyB9O1xyXG4gICAgICAgIC8vI2VuZHJlZ2lvblxyXG4gICAgICAgIC8vI3JlZ2lvbiBmb3JtYXQgZGF0YWxhYmVscyB0byAzIGRlY2ltYWwgcGxhY2VzXHJcbiAgICAgICAgcHJvcHMub3B0aW9ucy5wbHVnaW5zLmRhdGFsYWJlbHMgPSB7XHJcbiAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgY29udGV4dCkge1xyXG4gICAgICAgICAgICAvL3JldHVybiBNYXRoLnJvdW5kKHZhbHVlKjEwMCkgKyAnJSc7XHJcbiAgICAgICAgICAgIGlmICgodmFsdWUgPiAwICYmIHZhbHVlID49IDAuMDAxKSB8fCAodmFsdWUgPCAwICYmIHZhbHVlIDwgLTAuMDAxKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogMTAwMCkgLyAxMDAwO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHZhbHVlID4gMCAmJiB2YWx1ZSA8IDAuMDAxKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIFwiPCAwLjAwMVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJldHVybiBcIj4gLTAuMDAxXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgLy8jcmVnaW9uIGN1c3RvbWl6ZSB0b29sdGlwXHJcbiAgICAgICAgaWYgKHRoaXMuY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQgfHwgdGhpcy5jaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUpIHtcclxuICAgICAgICAgIHByb3BzLm9wdGlvbnMucGx1Z2lucy50b29sdGlwID0ge1xyXG4gICAgICAgICAgICBjYWxsYmFja3M6IHtcclxuICAgICAgICAgICAgICB0aXRsZTogZnVuY3Rpb24odG9vbHRpcEl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IGNvdWxkIGJlIGFuIGlzc3VlIHdpdGggbXVsdGlwbGUgZGF0YXNldHNcclxuICAgICAgICAgICAgICAgIHJldHVybiB0b29sdGlwSXRlbVswXS5sYWJlbDtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbih0b29sdGlwSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gdG9vbHRpcEl0ZW0uZGF0YXNldC5sYWJlbCB8fCAnJztcclxuICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRvb2x0aXBJdGVtLnBhcnNlZC55ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxhYmVsICs9IGAke3Rvb2x0aXBJdGVtLnBhcnNlZH1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcHJvcHMub3B0aW9ucy5wbHVnaW5zLnRvb2x0aXAgPSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrczoge1xyXG4gICAgICAgICAgICAgIGxhYmVsOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gY29udGV4dC5kYXRhc2V0LmxhYmVsIHx8ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQucGFyc2VkLnkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgbGFiZWwgKz0gYCR7Y29udGV4dC5wYXJzZWQueX1gO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyNlbmRyZWdpb25cclxuXHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IG5ldyBDaGFydChjdHgsIHByb3BzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJcclxuPGRpdiBjbGFzcz1cImNvbXBvbmVudC13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwidG9vbGJhci13cmFwcGVyXCIgKm5nSWY9XCJzaG93VG9vbGJhclwiPlxyXG4gICAgICAgIDxuZXVyYXNpbC1jaGFydHMtdG9vbGJhciBbKHRvb2xiYXJQcm9wcyldPVwidG9vbGJhclByb3BzXCIgKHRvb2xiYXJQcm9wc0NoYW5nZSk9XCJ1cGRhdGVUb29sYmFyUHJvcHMoJGV2ZW50KVwiPjwvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXI+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjYW52YXMtd3JhcHBlclwiPlxyXG4gICAgICAgIDxjYW52YXMgW25nQ2xhc3NdPVwiaGFzRGF0YSA/ICcnIDogJ2NhbnZhcy1oaWRkZW4nXCIgI25ldXJhc2lsQ2hhcnRDYW52YXMgaWQ9XCJuZXVyYXNpbENoYXJ0Q2FudmFzXCI+PC9jYW52YXM+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXlcIiAqbmdJZj1cIiFoYXNEYXRhXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5LWNvbnRlbnRzXCI+XHJcbiAgICAgICAgICAgICAgICB7e25vRGF0YU1lc3NhZ2V9fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19