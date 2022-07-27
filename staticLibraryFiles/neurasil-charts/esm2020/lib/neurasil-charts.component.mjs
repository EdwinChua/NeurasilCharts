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
                props.options.plugins.datalabels = {
                    formatter: function (value, context) {
                        //return Math.round(value*100) + '%';
                        if ((value > 0 && value > 0.001) || (value < 0 && value < -0.001)) {
                            return Math.round(value * 1000) / 1000;
                        }
                        else {
                            return value;
                        }
                    }
                };
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
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter", showDataLabels: "showDataLabels", noDataMessage: "noDataMessage" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWhELHFDQUFxQztBQUNyQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTdDLE9BQU8sZUFBZSxNQUFNLDJCQUEyQixDQUFDOzs7Ozs7Ozs7SUNQcEQsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLFlBQ0o7SUFBQSxpQkFBTSxFQUFBOzs7SUFERixlQUNKO0lBREkscURBQ0o7O0FETFosS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBY2hDLE1BQU0sT0FBTyx1QkFBdUI7SUFxRGxDLFlBQW1CLHFCQUE0QyxFQUFTLGtCQUFzQztRQUEzRiwwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQVMsdUJBQWtCLEdBQWxCLGtC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QzVCLGVBQWM7UUFBZCxtQ0FBYzs7dUZEWS9CLHVCQUF1QjtjQU5uQyxTQUFTOzJCQUNFLGlCQUFpQixhQUdoQixDQUFDLGtCQUFrQixDQUFDO3lHQUlzQixNQUFNO2tCQUExRCxTQUFTO21CQUFDLHFCQUFxQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUcxQyxJQUFJO2tCQUFaLEtBQUs7WUFFRyxXQUFXO2tCQUFuQixLQUFLO1lBRUcsU0FBUztrQkFBakIsS0FBSztZQUVHLFVBQVU7a0JBQWxCLEtBQUs7WUFFRyxVQUFVO2tCQUFsQixLQUFLO1lBRUcsY0FBYztrQkFBdEIsS0FBSztZQUVHLGNBQWM7a0JBQXRCLEtBQUs7WUFFRyxrQkFBa0I7a0JBQTFCLEtBQUs7WUFJRyxxQkFBcUI7a0JBQTdCLEtBQUs7WUFFRyxZQUFZO2tCQUFwQixLQUFLO1lBSUcsY0FBYztrQkFBdEIsS0FBSztZQUVHLGFBQWE7a0JBQXJCLEtBQUs7WUFHSSxlQUFlO2tCQUF4QixNQUFNO1lBRUcsaUJBQWlCO2tCQUExQixNQUFNO1lBRUcsMkJBQTJCO2tCQUFwQyxNQUFNO1lBRUcsV0FBVztrQkFBcEIsTUFBTTtZQW9DUCxhQUFhO2tCQURaLFlBQVk7bUJBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFNOUMsWUFBWTtrQkFEWCxZQUFZO21CQUFDLG1CQUFtQixFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNTZXJ2aWNlIH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7IE5ldXJhc2lsRGF0YUZpbHRlciB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBDaGFydCwgcmVnaXN0ZXJhYmxlcyB9IGZyb20gJ2NoYXJ0LmpzJztcclxuQ2hhcnQucmVnaXN0ZXIoLi4ucmVnaXN0ZXJhYmxlcylcclxuLy8gaW1wb3J0IENoYXJ0IGZyb20gJ2NoYXJ0LmpzL2F1dG8nO1xyXG5pbXBvcnQgeyBIb3N0TGlzdGVuZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCBDaGFydERhdGFMYWJlbHMgZnJvbSAnY2hhcnRqcy1wbHVnaW4tZGF0YWxhYmVscyc7XHJcblxyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnNhc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XHJcblxyXG4gIC8qKiBEYXRhIHRvIHBsb3QgKi9cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxhbnk+O1xyXG4gIC8qKiBTaG93IGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICAvKiogVXNlci1kZWZpbmVkIGRlZmF1bHQgY2hhcnQgdHlwZSAqL1xyXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSA9IG51bGw7XHJcbiAgLyoqIFNob3cgcmlnaHQgYXhpcyBmb3Igc2hpdHMgYW5kIGdpZ2dsZXMgKi9cclxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXHJcbiAgLyoqIFNldCBhIGNoYXJ0IHRpdGxlICovXHJcbiAgQElucHV0KCkgY2hhcnRUaXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWC1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB4QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWS1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogQWx0LVktQXhpcyB0ZXh0ICAgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgLyoqIFN3YXAgRGF0YXNldCBhbmQgTGFiZWxzIFxyXG4gICAqIEBcclxuICAgKi9cclxuICBASW5wdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGJvb2xlYW47XHJcbiAgLyoqIEZpbHRlciBkYXRhICovXHJcbiAgQElucHV0KCkgZ2xvYmFsRmlsdGVyOiBzdHJpbmcgPSBcIlwiO1xyXG4gIC8qKiBTaG93IGRhdGEgbGFiZWxzIFxyXG4gICAqIEBwYXJhbSBzaG93RGF0YUxhYmVscyBkZWZhdWx0OiBmYWxzZVxyXG4gICovXHJcbiAgQElucHV0KCkgc2hvd0RhdGFMYWJlbHM6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KCkgbm9EYXRhTWVzc2FnZTogc3RyaW5nID0gXCJObyBkYXRhIHRvIGRpc3BsYXkuIENoZWNrIHlvdXIgZmlsdGVycy5cIjtcclxuXHJcbiAgLyoqIEVtaXRzIGV2ZW50IGZyb20gY2hhbmdpbmcgQ2hhcnQgdHlwZSBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBjaGFydFR5cGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEZvcmdvdCB3aGF0IHRoaXMgZG9lcyAqL1xyXG4gIEBPdXRwdXQoKSBzaG93VG9vbGJhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvKiogRW1pdHMgZXZlbnQgZnJvbSB0b2dnbGluZyB0aGUgc3dhcCBsYWJlbC9kYXRhIHN3aXRjaCBmcm9tIHRvb2xiYXIgKEkgdGhpbmssIGZvcmdvdCB3aGF0IGVsc2UgdGhpcyBkb2VzKSAqL1xyXG4gIEBPdXRwdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHNDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqIEVtaXRzIGRhdGEgZnJvbSBjbGlja2VkIGNoYXJ0IGl0ZW0gKi9cclxuICBAT3V0cHV0KCkgZGF0YU9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8qKiBkZWZhdWx0IHRvb2xiYXIgcHJvcHMgKi9cclxuICB0b29sYmFyUHJvcHMgPSB7XHJcbiAgICBjaGFydFR5cGU6IHRoaXMuY2hhcnRUeXBlID8gdGhpcy5jaGFydFR5cGUgOiBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUixcclxuICAgIF9kYXRhc2V0RmlsdGVyOiBcIlwiLFxyXG4gICAgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBfY2FudmFzOiBhbnk7XHJcbiAgaGFzRGF0YTogYm9vbGVhbjsgLy8gZm9yIHRoZSBwdXJwb3NlIG9mIGNoZWNraW5nIGxlbmd0aCBpbiBodG1sIHRlbXBsYXRlXHJcblxyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbmV1cmFzaWxDaGFydHNTZXJ2aWNlOiBOZXVyYXNpbENoYXJ0c1NlcnZpY2UsIHB1YmxpYyBuZXVyYXNpbERhdGFGaWx0ZXI6IE5ldXJhc2lsRGF0YUZpbHRlcikgeyB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuY2hhcnRUeXBlKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9IHRoaXMuY2hhcnRUeXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPSB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGFzRGF0YSA9ICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCA+IDApO1xyXG4gIH1cclxuICBuZ0FmdGVyVmlld0luaXQoKSB7XHJcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gIH1cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcykge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhjaGFuZ2VzKVxyXG4gICAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YmVmb3JlcHJpbnQnLCBbJyRldmVudCddKVxyXG4gIG9uQmVmb3JlUHJpbnQoZXZlbnQpIHtcclxuICAgIC8vIHRoaXMuZHJhd0NoYXJ0KHRydWUpXHJcblxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6YWZ0ZXJwcmludCcsIFsnJGV2ZW50J10pXHJcbiAgb25BZnRlclByaW50KGV2ZW50KSB7XHJcbiAgICAvLyB0aGlzLmRyYXdDaGFydChmYWxzZSk7XHJcbiAgfVxyXG4gIHVwZGF0ZVRvb2xiYXJQcm9wcyhldikge1xyXG5cclxuICAgIHRoaXMuY2hhcnRUeXBlQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlKTtcclxuICAgIHRoaXMuc2hvd1Rvb2xiYXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dUb29sYmFyKTtcclxuICAgIHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKVxyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcblxyXG5cclxuICBkcmF3Q2hhcnQoaXNQcmludGluZzpib29sZWFuID1mYWxzZSkge1xyXG4gICAgaWYgKHRoaXMuX2NhbnZhcykge1xyXG4gICAgICB0aGlzLl9jYW52YXMuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY2FudmFzKSB7XHJcbiAgICAgIHZhciBjdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGxldCBmaWx0ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICAgIGlmICh0aGlzLmdsb2JhbEZpbHRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZmlsdGVyU3RyaW5nICs9IHRoaXMuZ2xvYmFsRmlsdGVyICsgXCIsXCJcclxuICAgICAgfVxyXG4gICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy50b29sYmFyUHJvcHMuX2RhdGFzZXRGaWx0ZXI7XHJcbiAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLm5ldXJhc2lsRGF0YUZpbHRlci50cmFuc2Zvcm0odGhpcy5kYXRhLCBmaWx0ZXJTdHJpbmcpO1xyXG4gICAgICB0aGlzLmhhc0RhdGEgPSAoZmlsdGVyZWREYXRhICYmIGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKTtcclxuICAgICAgaWYgKHRoaXMuaGFzRGF0YSkge1xyXG4gICAgICAgIGxldCBvID0gdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UucGFyc2VEYXRhRnJvbURhdGFzb3VyY2UodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlLCBmaWx0ZXJlZERhdGEsIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJvXCIsbylcclxuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5jaGFydE9iamVjdEJ1aWxkZXIodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlLCBvLmRhdGEsIHRoaXMudXNlQWx0QXhpcywgdGhpcy5jaGFydFRpdGxlLCB0aGlzLnlBeGlzTGFiZWxUZXh0LCB0aGlzLnlBeGlzTGFiZWxUZXh0X0FsdCwgdGhpcy54QXhpc0xhYmVsVGV4dCwgby5fY29ybmVyc3RvbmUsIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cywgby5fZm9ybWF0T2JqZWN0KTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLnBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcyk7IC8vIG1vZGlmeSBjaGFydCBwcm9wcyBvYmplY3RcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBUSElTID0gdGhpcztcclxuICAgICAgICAvL0NhbnQgcHV0IHRoaXMgaW4gc2VydmljZSwgaWRrIHdoeVxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMub25DbGljayA9IGZ1bmN0aW9uIChldiwgZWxlbWVudCwgY2hhcnRPYmopIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50WzBdKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGlja0RhdGEgPSBlbGVtZW50WzBdO1xyXG4gICAgICAgICAgICBsZXQgeEF4aXNWYWwgPSBwcm9wcy5kYXRhLmxhYmVsc1tjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldCA9IHByb3BzLmRhdGEuZGF0YXNldHNbY2xpY2tEYXRhLmRhdGFzZXRJbmRleF07XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0TGFiZWwgPSBkYXRhc2V0LmxhYmVsO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldFZhbCA9IGRhdGFzZXQuZGF0YVtjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgY3VzdG9tRGF0YU9iaiA9IHtcclxuICAgICAgICAgICAgICB2YWw6IGRhdGFzZXRWYWwsXHJcbiAgICAgICAgICAgICAgZGF0YUxhYmVsOiBUSElTLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA/IGRhdGFzZXRMYWJlbCA6IHhBeGlzVmFsLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRMYWJlbDogVEhJUy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPyB4QXhpc1ZhbCA6IGRhdGFzZXRMYWJlbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgIGV2ZW50OiBldixcclxuICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2U6IGNoYXJ0T2JqLFxyXG4gICAgICAgICAgICAgIGRhdGE6IGN1c3RvbURhdGFPYmpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBUSElTLmRhdGFPbkNsaWNrLmVtaXQoZGF0YSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd0RhdGFMYWJlbHMgfHwgaXNQcmludGluZyl7XHJcbiAgICAgICAgICBwcm9wcy5wbHVnaW5zLnB1c2goQ2hhcnREYXRhTGFiZWxzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFwcm9wcy5vcHRpb25zLnBsdWdpbnMpIHtcclxuICAgICAgICAgIHByb3BzLm9wdGlvbnMucGx1Z2lucyA9IHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMucGx1Z2lucy5kYXRhbGFiZWxzID0ge1xyXG4gICAgICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCkge1xyXG4gICAgICAgICAgICAvL3JldHVybiBNYXRoLnJvdW5kKHZhbHVlKjEwMCkgKyAnJSc7XHJcbiAgICAgICAgICAgIGlmICgodmFsdWUgPiAwICYmIHZhbHVlID4gMC4wMDEpIHx8ICh2YWx1ZSA8IDAgJiYgdmFsdWUgPCAtMC4wMDEpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiAxMDAwKSAvIDEwMDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJjdHhcIixjdHgpXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJwcm9wc1wiLHByb3BzKVxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IG5ldyBDaGFydChjdHgsIHByb3BzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJcclxuPGRpdiBjbGFzcz1cImNvbXBvbmVudC13cmFwcGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwidG9vbGJhci13cmFwcGVyXCIgKm5nSWY9XCJzaG93VG9vbGJhclwiPlxyXG4gICAgICAgIDxuZXVyYXNpbC1jaGFydHMtdG9vbGJhciBbKHRvb2xiYXJQcm9wcyldPVwidG9vbGJhclByb3BzXCIgKHRvb2xiYXJQcm9wc0NoYW5nZSk9XCJ1cGRhdGVUb29sYmFyUHJvcHMoJGV2ZW50KVwiPjwvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXI+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJjYW52YXMtd3JhcHBlclwiPlxyXG4gICAgICAgIDxjYW52YXMgW25nQ2xhc3NdPVwiaGFzRGF0YSA/ICcnIDogJ2NhbnZhcy1oaWRkZW4nXCIgI25ldXJhc2lsQ2hhcnRDYW52YXMgaWQ9XCJuZXVyYXNpbENoYXJ0Q2FudmFzXCI+PC9jYW52YXM+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXlcIiAqbmdJZj1cIiFoYXNEYXRhXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5LWNvbnRlbnRzXCI+XHJcbiAgICAgICAgICAgICAgICB7e25vRGF0YU1lc3NhZ2V9fVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19