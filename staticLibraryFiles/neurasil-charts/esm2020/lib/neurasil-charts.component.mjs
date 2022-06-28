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
        this.showToolbar = true;
        this.showToolbarChange = new EventEmitter();
        /**
         * User-defined default chart type
         */
        this.chartType = null;
        this.chartTypeChange = new EventEmitter();
        this.useAltAxis = true; // not sure if needed
        this.chartTitle = "";
        this.xAxisLabelText = "";
        this.yAxisLabelText_Alt = "";
        this.yAxisLabelText = "";
        this.swapLabelsAndDatasetsChange = new EventEmitter();
        this.globalFilter = "";
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
            console.log(changes);
            this.drawChart();
        }
    }
    updateToolbarProps(ev) {
        console.log(">>>", ev);
        console.log(this.toolbarProps);
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
            console.log(filteredData);
            this.hasData = (filteredData && filteredData.length > 0);
            if (this.hasData) {
                let o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
                let props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject);
                if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
                }
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
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", yAxisLabelText: "yAxisLabelText", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter" }, outputs: { showToolbarChange: "showToolbarChange", chartTypeChange: "chartTypeChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
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
        }], showToolbarChange: [{
            type: Output
        }], chartType: [{
            type: Input
        }], chartTypeChange: [{
            type: Output
        }], useAltAxis: [{
            type: Input
        }], chartTitle: [{
            type: Input
        }], xAxisLabelText: [{
            type: Input
        }], yAxisLabelText_Alt: [{
            type: Input
        }], yAxisLabelText: [{
            type: Input
        }], swapLabelsAndDatasets: [{
            type: Input
        }], swapLabelsAndDatasetsChange: [{
            type: Output
        }], globalFilter: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7SUNGNUMsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLHlEQUNKO0lBQUEsaUJBQU0sRUFBQTs7QURMbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLHFDQUFxQztBQVFyQyxNQUFNLE9BQU8sdUJBQXVCO0lBcUNsQyxZQUFtQixxQkFBNEMsRUFBUyxrQkFBc0M7UUFBM0YsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUE1QnJHLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBQzNCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakQ7O1dBRUc7UUFDTSxj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QUFpQjtRQUFqQixzQ0FBaUI7UUFJbkMsZUFBMEM7UUFBMUMsNERBQTBDO1FBQzVCLGVBQWM7UUFBZCxtQ0FBYzs7dUZETy9CLHVCQUF1QjtjQU5uQyxTQUFTOzJCQUNFLGlCQUFpQixhQUdoQixDQUFDLGtCQUFrQixDQUFDO3lHQUlzQixNQUFNO2tCQUExRCxTQUFTO21CQUFDLHFCQUFxQixFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUsxQyxJQUFJO2tCQUFaLEtBQUs7WUFFRyxXQUFXO2tCQUFuQixLQUFLO1lBQ0ksaUJBQWlCO2tCQUExQixNQUFNO1lBSUUsU0FBUztrQkFBakIsS0FBSztZQUNJLGVBQWU7a0JBQXhCLE1BQU07WUFFRSxVQUFVO2tCQUFsQixLQUFLO1lBQ0csVUFBVTtrQkFBbEIsS0FBSztZQUNHLGNBQWM7a0JBQXRCLEtBQUs7WUFDRyxrQkFBa0I7a0JBQTFCLEtBQUs7WUFDRyxjQUFjO2tCQUF0QixLQUFLO1lBRUcscUJBQXFCO2tCQUE3QixLQUFLO1lBQ0ksMkJBQTJCO2tCQUFwQyxNQUFNO1lBQ0UsWUFBWTtrQkFBcEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5ldXJhc2lsQ2hhcnRzU2VydmljZSB9IGZyb20gJy4vbmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBORVVSQVNJTF9DSEFSVF9UWVBFIH0gZnJvbSAnLi9tb2RlbHMnO1xyXG5pbXBvcnQgeyBOZXVyYXNpbERhdGFGaWx0ZXIgfSBmcm9tICcuL3BpcGVzJztcclxuaW1wb3J0IHsgQ2hhcnQsIHJlZ2lzdGVyYWJsZXMgfSBmcm9tICdjaGFydC5qcyc7XHJcbkNoYXJ0LnJlZ2lzdGVyKC4uLnJlZ2lzdGVyYWJsZXMpXHJcbi8vIGltcG9ydCAqIGFzIENoYXJ0IGZyb20gJ2NoYXJ0LmpzJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnNhc3MnXSxcclxuICBwcm92aWRlcnM6IFtOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XHJcblxyXG4gIC8qKlxyXG4gICAqIERhdGEgdG8gcGxvdFxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGRhdGE6IEFycmF5PGFueT47XHJcblxyXG4gIEBJbnB1dCgpIHNob3dUb29sYmFyOiBib29sZWFuID0gdHJ1ZTtcclxuICBAT3V0cHV0KCkgc2hvd1Rvb2xiYXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgLyoqXHJcbiAgICogVXNlci1kZWZpbmVkIGRlZmF1bHQgY2hhcnQgdHlwZVxyXG4gICAqL1xyXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSA9IG51bGw7XHJcbiAgQE91dHB1dCgpIGNoYXJ0VHlwZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQElucHV0KCkgdXNlQWx0QXhpczogYm9vbGVhbiA9IHRydWU7IC8vIG5vdCBzdXJlIGlmIG5lZWRlZFxyXG4gIEBJbnB1dCgpIGNoYXJ0VGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgeEF4aXNMYWJlbFRleHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgeUF4aXNMYWJlbFRleHRfQWx0OiBzdHJpbmcgPSBcIlwiO1xyXG4gIEBJbnB1dCgpIHlBeGlzTGFiZWxUZXh0OiBzdHJpbmcgPSBcIlwiO1xyXG5cclxuICBASW5wdXQoKSBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGJvb2xlYW47XHJcbiAgQE91dHB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICBASW5wdXQoKSBnbG9iYWxGaWx0ZXI6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIHRvb2xiYXJQcm9wcyA9IHtcclxuICAgIGNoYXJ0VHlwZTogdGhpcy5jaGFydFR5cGUgPyB0aGlzLmNoYXJ0VHlwZSA6IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSLFxyXG4gICAgX2RhdGFzZXRGaWx0ZXI6IFwiXCIsXHJcbiAgICBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgX2NhbnZhczogYW55O1xyXG4gIGhhc0RhdGE6IGJvb2xlYW47IC8vIGZvciB0aGUgcHVycG9zZSBvZiBjaGVja2luZyBsZW5ndGggaW4gaHRtbCB0ZW1wbGF0ZVxyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIG5ldXJhc2lsQ2hhcnRzU2VydmljZTogTmV1cmFzaWxDaGFydHNTZXJ2aWNlLCBwdWJsaWMgbmV1cmFzaWxEYXRhRmlsdGVyOiBOZXVyYXNpbERhdGFGaWx0ZXIpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmNoYXJ0VHlwZSkge1xyXG4gICAgICB0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPSB0aGlzLmNoYXJ0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzID0gdGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHNcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhhc0RhdGEgPSAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggPiAwKTtcclxuICB9XHJcbiAgbmdBZnRlclZpZXdJbml0KCkge1xyXG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcclxuICB9XHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMpIHtcclxuICAgICAgY29uc29sZS5sb2coY2hhbmdlcykgXHJcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUb29sYmFyUHJvcHMoZXYpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiPj4+XCIgLCBldilcclxuICAgIGNvbnNvbGUubG9nKHRoaXMudG9vbGJhclByb3BzKVxyXG4gICAgdGhpcy5jaGFydFR5cGVDaGFuZ2UuZW1pdCh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUpO1xyXG4gICAgdGhpcy5zaG93VG9vbGJhckNoYW5nZS5lbWl0KHRoaXMuc2hvd1Rvb2xiYXIpO1xyXG4gICAgdGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHNDaGFuZ2UuZW1pdCh0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMpXHJcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIGRyYXdDaGFydCgpIHtcclxuICAgIGlmICh0aGlzLl9jYW52YXMpIHtcclxuICAgICAgdGhpcy5fY2FudmFzLmRlc3Ryb3koKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmNhbnZhcykge1xyXG4gICAgICB2YXIgY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICBsZXQgZmlsdGVyU3RyaW5nID0gXCJcIlxyXG4gICAgICBpZiAodGhpcy5nbG9iYWxGaWx0ZXIubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGZpbHRlclN0cmluZyArPSB0aGlzLmdsb2JhbEZpbHRlciArIFwiLFwiXHJcbiAgICAgIH1cclxuICAgICAgZmlsdGVyU3RyaW5nICs9IHRoaXMudG9vbGJhclByb3BzLl9kYXRhc2V0RmlsdGVyO1xyXG4gICAgICBsZXQgZmlsdGVyZWREYXRhID0gdGhpcy5uZXVyYXNpbERhdGFGaWx0ZXIudHJhbnNmb3JtKHRoaXMuZGF0YSwgZmlsdGVyU3RyaW5nKTtcclxuICAgICAgY29uc29sZS5sb2coZmlsdGVyZWREYXRhKTtcclxuICAgICAgdGhpcy5oYXNEYXRhID0gKGZpbHRlcmVkRGF0YSAmJiBmaWx0ZXJlZERhdGEubGVuZ3RoID4gMCk7XHJcbiAgICAgIGlmICh0aGlzLmhhc0RhdGEpIHtcclxuICAgICAgICBsZXQgbyA9IHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLnBhcnNlRGF0YUZyb21EYXRhc291cmNlKHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSwgZmlsdGVyZWREYXRhLCB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMpO1xyXG4gICAgICAgIGxldCBwcm9wcyA9IHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLmNoYXJ0T2JqZWN0QnVpbGRlcih0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIG8uZGF0YSwgdGhpcy51c2VBbHRBeGlzLCB0aGlzLmNoYXJ0VGl0bGUsIHRoaXMueUF4aXNMYWJlbFRleHQsIHRoaXMueUF4aXNMYWJlbFRleHRfQWx0LCB0aGlzLnhBeGlzTGFiZWxUZXh0LCBvLl9jb3JuZXJzdG9uZSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzLCBvLl9mb3JtYXRPYmplY3QpO1xyXG4gICAgICAgIGlmICh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UucGVyZm9ybVBhcmV0b0FuYWx5c2lzKHByb3BzKTsgLy8gbW9kaWZ5IGNoYXJ0IHByb3BzIG9iamVjdFxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jYW52YXMgPSBuZXcgQ2hhcnQoY3R4LCBwcm9wcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiXHJcbjxkaXYgY2xhc3M9XCJjb21wb25lbnQtd3JhcHBlclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInRvb2xiYXItd3JhcHBlclwiICpuZ0lmPVwic2hvd1Rvb2xiYXJcIj5cclxuICAgICAgICA8bmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIgWyh0b29sYmFyUHJvcHMpXT1cInRvb2xiYXJQcm9wc1wiICh0b29sYmFyUHJvcHNDaGFuZ2UpPVwidXBkYXRlVG9vbGJhclByb3BzKCRldmVudClcIj48L25ldXJhc2lsLWNoYXJ0cy10b29sYmFyPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY2FudmFzLXdyYXBwZXJcIj5cclxuICAgICAgICA8Y2FudmFzIFtuZ0NsYXNzXT1cImhhc0RhdGEgPyAnJyA6ICdjYW52YXMtaGlkZGVuJ1wiICNuZXVyYXNpbENoYXJ0Q2FudmFzIGlkPVwibmV1cmFzaWxDaGFydENhbnZhc1wiPjwvY2FudmFzPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJvdmVybGF5XCIgKm5nSWY9XCIhaGFzRGF0YVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheS1jb250ZW50c1wiPlxyXG4gICAgICAgICAgICAgICAgTm8gZGF0YSB0byBkaXNwbGF5LiBDaGVjayB5b3VyIGZpbHRlcnMuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4iXX0=