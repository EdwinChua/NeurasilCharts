import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import { Chart, registerables } from 'chart.js';
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
    i0.ɵɵtext(2, " No data to display. Check your filters. ");
    i0.ɵɵelementEnd()();
} }
Chart.register(...registerables);
// import * as Chart from 'chart.js';
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
        /** Fliter data */
        this.globalFilter = "";
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
    updateToolbarProps(ev) {
        // console.log(">>>", ev)
        // console.log(this.toolbarProps)
        this.chartTypeChange.emit(this.toolbarProps.chartType);
        this.showToolbarChange.emit(this.showToolbar);
        this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
        this.drawChart();
    }
    drawChart() {
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
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵtemplate(1, NeurasilChartsComponent_div_1_Template, 2, 1, "div", 1);
        i0.ɵɵelementStart(2, "div", 2);
        i0.ɵɵelement(3, "canvas", 3, 4);
        i0.ɵɵtemplate(5, NeurasilChartsComponent_div_5_Template, 3, 0, "div", 5);
        i0.ɵɵelementEnd()();
    } if (rf & 2) {
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("ngIf", ctx.showToolbar);
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngClass", ctx.hasData ? "" : "canvas-hidden");
        i0.ɵɵadvance(2);
        i0.ɵɵproperty("ngIf", !ctx.hasData);
    } }, dependencies: [i3.NgClass, i3.NgIf, i4.NeurasilChartsToolbarComponent], styles: [".canvas-wrapper[_ngcontent-%COMP%], neurasil-charts-toolbar[_ngcontent-%COMP%]{display:block}.component-wrapper[_ngcontent-%COMP%]{width:100%;height:100%}.component-wrapper[_ngcontent-%COMP%]{display:flex;flex-flow:column;height:100%}.canvas-wrapper[_ngcontent-%COMP%]{flex-grow:1}.canvas-hidden[_ngcontent-%COMP%]{display:none}.overlay[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#0000001a}.overlay-contents[_ngcontent-%COMP%]{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsComponent, [{
        type: Component,
        args: [{ selector: 'neurasil-charts', providers: [NeurasilDataFilter], template: "\r\n<div class=\"component-wrapper\">\r\n    <div class=\"toolbar-wrapper\" *ngIf=\"showToolbar\">\r\n        <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\r\n    </div>\r\n    <div class=\"canvas-wrapper\">\r\n        <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\r\n        <div class=\"overlay\" *ngIf=\"!hasData\">\r\n            <div class=\"overlay-contents\">\r\n                No data to display. Check your filters.\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n", styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;height:100%}.component-wrapper{display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex-grow:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:#0000001a}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}\n"] }]
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
        }], chartTypeChange: [{
            type: Output
        }], showToolbarChange: [{
            type: Output
        }], swapLabelsAndDatasetsChange: [{
            type: Output
        }], dataOnClick: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7SUNGNUMsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLHlEQUNKO0lBQUEsaUJBQU0sRUFBQTs7QURMbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLHFDQUFxQztBQVFyQyxNQUFNLE9BQU8sdUJBQXVCO0lBNkNsQyxZQUFtQixxQkFBNEMsRUFBUyxrQkFBc0M7UUFBM0YsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUF2QzlHLHdCQUF3QjtRQUNmLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBQ3JDLHNDQUFzQztRQUM3QixjQUFTLEdBQXdCLElBQUksQ0FBQztRQUMv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QWlCO1FBQWpCLHNDQUFpQjtRQUluQyxlQUEwQztRQUExQyw0REFBMEM7UUFDNUIsZUFBYztRQUFkLG1DQUFjOzt1RkRPL0IsdUJBQXVCO2NBTm5DLFNBQVM7MkJBQ0UsaUJBQWlCLGFBR2hCLENBQUMsa0JBQWtCLENBQUM7eUdBSXNCLE1BQU07a0JBQTFELFNBQVM7bUJBQUMscUJBQXFCLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBRzFDLElBQUk7a0JBQVosS0FBSztZQUVHLFdBQVc7a0JBQW5CLEtBQUs7WUFFRyxTQUFTO2tCQUFqQixLQUFLO1lBRUcsVUFBVTtrQkFBbEIsS0FBSztZQUVHLFVBQVU7a0JBQWxCLEtBQUs7WUFFRyxjQUFjO2tCQUF0QixLQUFLO1lBRUcsY0FBYztrQkFBdEIsS0FBSztZQUVHLGtCQUFrQjtrQkFBMUIsS0FBSztZQUVHLHFCQUFxQjtrQkFBN0IsS0FBSztZQUVHLFlBQVk7a0JBQXBCLEtBQUs7WUFHSSxlQUFlO2tCQUF4QixNQUFNO1lBRUcsaUJBQWlCO2tCQUExQixNQUFNO1lBRUcsMkJBQTJCO2tCQUFwQyxNQUFNO1lBRUcsV0FBVztrQkFBcEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5ldXJhc2lsQ2hhcnRzU2VydmljZSB9IGZyb20gJy4vbmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBORVVSQVNJTF9DSEFSVF9UWVBFIH0gZnJvbSAnLi9tb2RlbHMnO1xyXG5pbXBvcnQgeyBOZXVyYXNpbERhdGFGaWx0ZXIgfSBmcm9tICcuL3BpcGVzJztcclxuaW1wb3J0IHsgQ2hhcnQsIHJlZ2lzdGVyYWJsZXMgfSBmcm9tICdjaGFydC5qcyc7XHJcbkNoYXJ0LnJlZ2lzdGVyKC4uLnJlZ2lzdGVyYWJsZXMpXHJcbi8vIGltcG9ydCAqIGFzIENoYXJ0IGZyb20gJ2NoYXJ0LmpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnNhc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XHJcblxyXG4gIC8qKiBEYXRhIHRvIHBsb3QgKi9cclxuICBASW5wdXQoKSBkYXRhOiBBcnJheTxhbnk+O1xyXG4gIC8qKiBTaG93IGhpZGUgdG9vbGJhciAqL1xyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICAvKiogVXNlci1kZWZpbmVkIGRlZmF1bHQgY2hhcnQgdHlwZSAqL1xyXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSA9IG51bGw7XHJcbiAgLyoqIFNob3cgcmlnaHQgYXhpcyBmb3Igc2hpdHMgYW5kIGdpZ2dsZXMgKi9cclxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXHJcbiAgLyoqIFNldCBhIGNoYXJ0IHRpdGxlICovXHJcbiAgQElucHV0KCkgY2hhcnRUaXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWC1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB4QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogWS1BeGlzIHRleHQgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICAvKiogQWx0LVktQXhpcyB0ZXh0ICAgKi9cclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgLyoqIFN3YXAgRGF0YXNldCBhbmQgTGFiZWxzIChUT0RPOiBmaW5kIGEgYmV0dGVyIHdheSB0byBkZXNjcmliZSB0aGlzKSAqL1xyXG4gIEBJbnB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0czogYm9vbGVhbjtcclxuICAvKiogRmxpdGVyIGRhdGEgKi9cclxuICBASW5wdXQoKSBnbG9iYWxGaWx0ZXI6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIC8qKiBFbWl0cyBldmVudCBmcm9tIGNoYW5naW5nIENoYXJ0IHR5cGUgZnJvbSB0b29sYmFyIChJIHRoaW5rLCBmb3Jnb3Qgd2hhdCBlbHNlIHRoaXMgZG9lcykgKi9cclxuICBAT3V0cHV0KCkgY2hhcnRUeXBlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAvKiogRm9yZ290IHdoYXQgdGhpcyBkb2VzICovXHJcbiAgQE91dHB1dCgpIHNob3dUb29sYmFyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIC8qKiBFbWl0cyBldmVudCBmcm9tIHRvZ2dsaW5nIHRoZSBzd2FwIGxhYmVsL2RhdGEgc3dpdGNoIGZyb20gdG9vbGJhciAoSSB0aGluaywgZm9yZ290IHdoYXQgZWxzZSB0aGlzIGRvZXMpICovXHJcbiAgQE91dHB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvKiogRW1pdHMgZGF0YSBmcm9tIGNsaWNrZWQgY2hhcnQgaXRlbSAqL1xyXG4gIEBPdXRwdXQoKSBkYXRhT25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgLyoqIGRlZmF1bHQgdG9vbGJhciBwcm9wcyAqL1xyXG4gIHRvb2xiYXJQcm9wcyA9IHtcclxuICAgIGNoYXJ0VHlwZTogdGhpcy5jaGFydFR5cGUgPyB0aGlzLmNoYXJ0VHlwZSA6IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSLFxyXG4gICAgX2RhdGFzZXRGaWx0ZXI6IFwiXCIsXHJcbiAgICBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgX2NhbnZhczogYW55O1xyXG4gIGhhc0RhdGE6IGJvb2xlYW47IC8vIGZvciB0aGUgcHVycG9zZSBvZiBjaGVja2luZyBsZW5ndGggaW4gaHRtbCB0ZW1wbGF0ZVxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG5ldXJhc2lsQ2hhcnRzU2VydmljZTogTmV1cmFzaWxDaGFydHNTZXJ2aWNlLCBwdWJsaWMgbmV1cmFzaWxEYXRhRmlsdGVyOiBOZXVyYXNpbERhdGFGaWx0ZXIpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmNoYXJ0VHlwZSkge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPSB0aGlzLmNoYXJ0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzID0gdGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHNcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhhc0RhdGEgPSAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggPiAwKTtcclxuICB9XHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coY2hhbmdlcylcclxuICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHVwZGF0ZVRvb2xiYXJQcm9wcyhldikge1xyXG4gICAgLy8gY29uc29sZS5sb2coXCI+Pj5cIiwgZXYpXHJcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRvb2xiYXJQcm9wcylcclxuICAgIHRoaXMuY2hhcnRUeXBlQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlKTtcclxuICAgIHRoaXMuc2hvd1Rvb2xiYXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dUb29sYmFyKTtcclxuICAgIHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKVxyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcblxyXG5cclxuICBkcmF3Q2hhcnQoKSB7XHJcbiAgICBpZiAodGhpcy5fY2FudmFzKSB7XHJcbiAgICAgIHRoaXMuX2NhbnZhcy5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jYW52YXMpIHtcclxuICAgICAgdmFyIGN0eCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgbGV0IGZpbHRlclN0cmluZyA9IFwiXCJcclxuICAgICAgaWYgKHRoaXMuZ2xvYmFsRmlsdGVyLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy5nbG9iYWxGaWx0ZXIgKyBcIixcIlxyXG4gICAgICB9XHJcbiAgICAgIGZpbHRlclN0cmluZyArPSB0aGlzLnRvb2xiYXJQcm9wcy5fZGF0YXNldEZpbHRlcjtcclxuICAgICAgbGV0IGZpbHRlcmVkRGF0YSA9IHRoaXMubmV1cmFzaWxEYXRhRmlsdGVyLnRyYW5zZm9ybSh0aGlzLmRhdGEsIGZpbHRlclN0cmluZyk7XHJcbiAgICAgIHRoaXMuaGFzRGF0YSA9IChmaWx0ZXJlZERhdGEgJiYgZmlsdGVyZWREYXRhLmxlbmd0aCA+IDApO1xyXG4gICAgICBpZiAodGhpcy5oYXNEYXRhKSB7XHJcbiAgICAgICAgbGV0IG8gPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wYXJzZURhdGFGcm9tRGF0YXNvdXJjZSh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIGZpbHRlcmVkRGF0YSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKTtcclxuICAgICAgICBsZXQgcHJvcHMgPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5jaGFydE9iamVjdEJ1aWxkZXIodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlLCBvLmRhdGEsIHRoaXMudXNlQWx0QXhpcywgdGhpcy5jaGFydFRpdGxlLCB0aGlzLnlBeGlzTGFiZWxUZXh0LCB0aGlzLnlBeGlzTGFiZWxUZXh0X0FsdCwgdGhpcy54QXhpc0xhYmVsVGV4dCwgby5fY29ybmVyc3RvbmUsIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cywgby5fZm9ybWF0T2JqZWN0KTtcclxuICAgICAgICBpZiAodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLnBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcyk7IC8vIG1vZGlmeSBjaGFydCBwcm9wcyBvYmplY3RcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBUSElTID0gdGhpcztcclxuICAgICAgICAvL0NhbnQgcHV0IHRoaXMgaW4gc2VydmljZSwgaWRrIHdoeVxyXG4gICAgICAgIHByb3BzLm9wdGlvbnMub25DbGljayA9IGZ1bmN0aW9uIChldiwgZWxlbWVudCwgY2hhcnRPYmopIHtcclxuICAgICAgICAgIGlmIChlbGVtZW50WzBdKSB7XHJcbiAgICAgICAgICAgIGxldCBjbGlja0RhdGEgPSBlbGVtZW50WzBdO1xyXG4gICAgICAgICAgICBsZXQgeEF4aXNWYWwgPSBwcm9wcy5kYXRhLmxhYmVsc1tjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldCA9IHByb3BzLmRhdGEuZGF0YXNldHNbY2xpY2tEYXRhLmRhdGFzZXRJbmRleF07XHJcbiAgICAgICAgICAgIGxldCBkYXRhc2V0TGFiZWwgPSBkYXRhc2V0LmxhYmVsO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldFZhbCA9IGRhdGFzZXQuZGF0YVtjbGlja0RhdGEuaW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgY3VzdG9tRGF0YU9iaiA9IHtcclxuICAgICAgICAgICAgICB2YWw6IGRhdGFzZXRWYWwsXHJcbiAgICAgICAgICAgICAgZGF0YUxhYmVsOiBUSElTLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA/IGRhdGFzZXRMYWJlbCA6IHhBeGlzVmFsLFxyXG4gICAgICAgICAgICAgIGRhdGFzZXRMYWJlbDpUSElTLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA/IHhBeGlzVmFsIDogZGF0YXNldExhYmVsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XHJcbiAgICAgICAgICAgICAgZXZlbnQ6IGV2LFxyXG4gICAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXHJcbiAgICAgICAgICAgICAgY2hhcnRJbnN0YW5jZTogY2hhcnRPYmosXHJcbiAgICAgICAgICAgICAgZGF0YTogY3VzdG9tRGF0YU9ialxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFRISVMuZGF0YU9uQ2xpY2suZW1pdChkYXRhKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBuZXcgQ2hhcnQoY3R4LCBwcm9wcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiXHJcbjxkaXYgY2xhc3M9XCJjb21wb25lbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInRvb2xiYXItd3JhcHBlclwiICpuZ0lmPVwic2hvd1Rvb2xiYXJcIj5cclxuICAgICAgICA8bmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIgWyh0b29sYmFyUHJvcHMpXT1cInRvb2xiYXJQcm9wc1wiICh0b29sYmFyUHJvcHNDaGFuZ2UpPVwidXBkYXRlVG9vbGJhclByb3BzKCRldmVudClcIj48L25ldXJhc2lsLWNoYXJ0cy10b29sYmFyPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY2FudmFzLXdyYXBwZXJcIj5cclxuICAgICAgICA8Y2FudmFzIFtuZ0NsYXNzXT1cImhhc0RhdGEgPyAnJyA6ICdjYW52YXMtaGlkZGVuJ1wiICNuZXVyYXNpbENoYXJ0Q2FudmFzIGlkPVwibmV1cmFzaWxDaGFydENhbnZhc1wiPjwvY2FudmFzPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgKm5nSWY9XCIhaGFzRGF0YVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS1jb250ZW50c1wiPlxyXG4gICAgICAgICAgICAgICAgTm8gZGF0YSB0byBkaXNwbGF5LiBDaGVjayB5b3VyIGZpbHRlcnMuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=