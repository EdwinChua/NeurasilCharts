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
        this.dataOnClick = new EventEmitter();
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
                        // if (){
                        //   customDataObj.dataLabel= datasetLabel;
                        //   customDataObj.datasetLabel= xAxisVal;
                        // }
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
    } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", yAxisLabelText: "yAxisLabelText", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter" }, outputs: { showToolbarChange: "showToolbarChange", chartTypeChange: "chartTypeChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
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
        }], dataOnClick: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQTZCLEtBQUssRUFBNEIsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUvSSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDL0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzdDLE9BQU8sRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE1BQU0sVUFBVSxDQUFDOzs7Ozs7Ozs7SUNGNUMsOEJBQWlELGlDQUFBO0lBQ3BCLHFRQUErQix3TUFBdUIsZUFBQSxpQ0FBMEIsQ0FBQSxJQUFqRDtJQUFtRCxpQkFBMEIsRUFBQTs7O0lBQTVHLGVBQStCO0lBQS9CLGtEQUErQjs7O0lBSXhELDhCQUFzQyxhQUFBO0lBRTlCLHlEQUNKO0lBQUEsaUJBQU0sRUFBQTs7QURMbEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxDQUFBO0FBQ2hDLHFDQUFxQztBQVFyQyxNQUFNLE9BQU8sdUJBQXVCO0lBdUNsQyxZQUFtQixxQkFBNEMsRUFBUyxrQkFBc0M7UUFBM0YsMEJBQXFCLEdBQXJCLHFCQUFxQixDQUF1QjtRQUFTLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBb0I7UUE5QnJHLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBQzNCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDakQ7O1dBRUc7UUFDTSxj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ZUFBaUI7UUFBakIsc0NBQWlCO1FBSW5DLGVBQTBDO1FBQTFDLDREQUEwQztRQUM1QixlQUFjO1FBQWQsbUNBQWM7O3VGRE8vQix1QkFBdUI7Y0FObkMsU0FBUzsyQkFDRSxpQkFBaUIsYUFHaEIsQ0FBQyxrQkFBa0IsQ0FBQzt5R0FJc0IsTUFBTTtrQkFBMUQsU0FBUzttQkFBQyxxQkFBcUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFLMUMsSUFBSTtrQkFBWixLQUFLO1lBRUcsV0FBVztrQkFBbkIsS0FBSztZQUNJLGlCQUFpQjtrQkFBMUIsTUFBTTtZQUlFLFNBQVM7a0JBQWpCLEtBQUs7WUFDSSxlQUFlO2tCQUF4QixNQUFNO1lBRUUsVUFBVTtrQkFBbEIsS0FBSztZQUNHLFVBQVU7a0JBQWxCLEtBQUs7WUFDRyxjQUFjO2tCQUF0QixLQUFLO1lBQ0csa0JBQWtCO2tCQUExQixLQUFLO1lBQ0csY0FBYztrQkFBdEIsS0FBSztZQUVHLHFCQUFxQjtrQkFBN0IsS0FBSztZQUNJLDJCQUEyQjtrQkFBcEMsTUFBTTtZQUNFLFlBQVk7a0JBQXBCLEtBQUs7WUFFSSxXQUFXO2tCQUFwQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCwgRWxlbWVudFJlZiwgQWZ0ZXJWaWV3SW5pdCwgSW5wdXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgT3V0cHV0LCBFdmVudEVtaXR0ZXIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNTZXJ2aWNlIH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMuc2VydmljZSc7XHJcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7IE5ldXJhc2lsRGF0YUZpbHRlciB9IGZyb20gJy4vcGlwZXMnO1xyXG5pbXBvcnQgeyBDaGFydCwgcmVnaXN0ZXJhYmxlcyB9IGZyb20gJ2NoYXJ0LmpzJztcclxuQ2hhcnQucmVnaXN0ZXIoLi4ucmVnaXN0ZXJhYmxlcylcclxuLy8gaW1wb3J0ICogYXMgQ2hhcnQgZnJvbSAnY2hhcnQuanMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZXVyYXNpbC1jaGFydHMnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQuc2FzcyddLFxyXG4gIHByb3ZpZGVyczogW05ldXJhc2lsRGF0YUZpbHRlcl1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBAVmlld0NoaWxkKCduZXVyYXNpbENoYXJ0Q2FudmFzJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNhbnZhczogRWxlbWVudFJlZjtcclxuXHJcbiAgLyoqXHJcbiAgICogRGF0YSB0byBwbG90XHJcbiAgICovXHJcbiAgQElucHV0KCkgZGF0YTogQXJyYXk8YW55PjtcclxuXHJcbiAgQElucHV0KCkgc2hvd1Rvb2xiYXI6IGJvb2xlYW4gPSB0cnVlO1xyXG4gIEBPdXRwdXQoKSBzaG93VG9vbGJhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAvKipcclxuICAgKiBVc2VyLWRlZmluZWQgZGVmYXVsdCBjaGFydCB0eXBlXHJcbiAgICovXHJcbiAgQElucHV0KCkgY2hhcnRUeXBlOiBORVVSQVNJTF9DSEFSVF9UWVBFID0gbnVsbDtcclxuICBAT3V0cHV0KCkgY2hhcnRUeXBlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXHJcbiAgQElucHV0KCkgY2hhcnRUaXRsZTogc3RyaW5nID0gXCJcIjtcclxuICBASW5wdXQoKSB4QXhpc0xhYmVsVGV4dDogc3RyaW5nID0gXCJcIjtcclxuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgQElucHV0KCkgeUF4aXNMYWJlbFRleHQ6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gIEBJbnB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0czogYm9vbGVhbjtcclxuICBAT3V0cHV0KCkgc3dhcExhYmVsc0FuZERhdGFzZXRzQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIEBJbnB1dCgpIGdsb2JhbEZpbHRlcjogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgQE91dHB1dCgpIGRhdGFPbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICB0b29sYmFyUHJvcHMgPSB7XHJcbiAgICBjaGFydFR5cGU6IHRoaXMuY2hhcnRUeXBlID8gdGhpcy5jaGFydFR5cGUgOiBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUixcclxuICAgIF9kYXRhc2V0RmlsdGVyOiBcIlwiLFxyXG4gICAgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBmYWxzZVxyXG4gIH07XHJcblxyXG4gIF9jYW52YXM6IGFueTtcclxuICBoYXNEYXRhOiBib29sZWFuOyAvLyBmb3IgdGhlIHB1cnBvc2Ugb2YgY2hlY2tpbmcgbGVuZ3RoIGluIGh0bWwgdGVtcGxhdGVcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXVyYXNpbENoYXJ0c1NlcnZpY2U6IE5ldXJhc2lsQ2hhcnRzU2VydmljZSwgcHVibGljIG5ldXJhc2lsRGF0YUZpbHRlcjogTmV1cmFzaWxEYXRhRmlsdGVyKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5jaGFydFR5cGUpIHtcclxuICAgICAgdGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlID0gdGhpcy5jaGFydFR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cyA9IHRoaXMuc3dhcExhYmVsc0FuZERhdGFzZXRzXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oYXNEYXRhID0gKHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEubGVuZ3RoID4gMCk7XHJcbiAgfVxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgfVxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChjaGFuZ2VzKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGNoYW5nZXMpXHJcbiAgICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGVUb29sYmFyUHJvcHMoZXYpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiPj4+XCIsIGV2KVxyXG4gICAgY29uc29sZS5sb2codGhpcy50b29sYmFyUHJvcHMpXHJcbiAgICB0aGlzLmNoYXJ0VHlwZUNoYW5nZS5lbWl0KHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSk7XHJcbiAgICB0aGlzLnNob3dUb29sYmFyQ2hhbmdlLmVtaXQodGhpcy5zaG93VG9vbGJhcik7XHJcbiAgICB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZS5lbWl0KHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cylcclxuICAgIHRoaXMuZHJhd0NoYXJ0KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZHJhd0NoYXJ0KCkge1xyXG4gICAgaWYgKHRoaXMuX2NhbnZhcykge1xyXG4gICAgICB0aGlzLl9jYW52YXMuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuY2FudmFzKSB7XHJcbiAgICAgIHZhciBjdHggPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgIGxldCBmaWx0ZXJTdHJpbmcgPSBcIlwiXHJcbiAgICAgIGlmICh0aGlzLmdsb2JhbEZpbHRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZmlsdGVyU3RyaW5nICs9IHRoaXMuZ2xvYmFsRmlsdGVyICsgXCIsXCJcclxuICAgICAgfVxyXG4gICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy50b29sYmFyUHJvcHMuX2RhdGFzZXRGaWx0ZXI7XHJcbiAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLm5ldXJhc2lsRGF0YUZpbHRlci50cmFuc2Zvcm0odGhpcy5kYXRhLCBmaWx0ZXJTdHJpbmcpO1xyXG4gICAgICB0aGlzLmhhc0RhdGEgPSAoZmlsdGVyZWREYXRhICYmIGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKTtcclxuICAgICAgaWYgKHRoaXMuaGFzRGF0YSkge1xyXG4gICAgICAgIGxldCBvID0gdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UucGFyc2VEYXRhRnJvbURhdGFzb3VyY2UodGhpcy50b29sYmFyUHJvcHMuY2hhcnRUeXBlLCBmaWx0ZXJlZERhdGEsIHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cyk7XHJcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UuY2hhcnRPYmplY3RCdWlsZGVyKHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSwgby5kYXRhLCB0aGlzLnVzZUFsdEF4aXMsIHRoaXMuY2hhcnRUaXRsZSwgdGhpcy55QXhpc0xhYmVsVGV4dCwgdGhpcy55QXhpc0xhYmVsVGV4dF9BbHQsIHRoaXMueEF4aXNMYWJlbFRleHQsIG8uX2Nvcm5lcnN0b25lLCB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMsIG8uX2Zvcm1hdE9iamVjdCk7XHJcbiAgICAgICAgaWYgKHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgICAgICB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpOyAvLyBtb2RpZnkgY2hhcnQgcHJvcHMgb2JqZWN0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgVEhJUyA9IHRoaXM7XHJcbiAgICAgICAgLy9DYW50IHB1dCB0aGlzIGluIHNlcnZpY2UsIGlkayB3aHlcclxuICAgICAgICBwcm9wcy5vcHRpb25zLm9uQ2xpY2sgPSBmdW5jdGlvbiAoZXYsIGVsZW1lbnQsIGNoYXJ0T2JqKSB7XHJcbiAgICAgICAgICBpZiAoZWxlbWVudFswXSkge1xyXG4gICAgICAgICAgICBsZXQgY2xpY2tEYXRhID0gZWxlbWVudFswXTtcclxuICAgICAgICAgICAgbGV0IHhBeGlzVmFsID0gcHJvcHMuZGF0YS5sYWJlbHNbY2xpY2tEYXRhLmluZGV4XTtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXQgPSBwcm9wcy5kYXRhLmRhdGFzZXRzW2NsaWNrRGF0YS5kYXRhc2V0SW5kZXhdO1xyXG4gICAgICAgICAgICBsZXQgZGF0YXNldExhYmVsID0gZGF0YXNldC5sYWJlbDtcclxuICAgICAgICAgICAgbGV0IGRhdGFzZXRWYWwgPSBkYXRhc2V0LmRhdGFbY2xpY2tEYXRhLmluZGV4XTtcclxuICAgICAgICAgICAgbGV0IGN1c3RvbURhdGFPYmogPSB7XHJcbiAgICAgICAgICAgICAgdmFsOiBkYXRhc2V0VmFsLFxyXG4gICAgICAgICAgICAgIGRhdGFMYWJlbDogVEhJUy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPyBkYXRhc2V0TGFiZWwgOiB4QXhpc1ZhbCxcclxuICAgICAgICAgICAgICBkYXRhc2V0TGFiZWw6VEhJUy5zd2FwTGFiZWxzQW5kRGF0YXNldHMgPyB4QXhpc1ZhbCA6IGRhdGFzZXRMYWJlbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmICgpe1xyXG4gICAgICAgICAgICAvLyAgIGN1c3RvbURhdGFPYmouZGF0YUxhYmVsPSBkYXRhc2V0TGFiZWw7XHJcbiAgICAgICAgICAgIC8vICAgY3VzdG9tRGF0YU9iai5kYXRhc2V0TGFiZWw9IHhBeGlzVmFsO1xyXG4gICAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhID0ge1xyXG4gICAgICAgICAgICAgIGV2ZW50OiBldixcclxuICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxyXG4gICAgICAgICAgICAgIGNoYXJ0SW5zdGFuY2U6IGNoYXJ0T2JqLFxyXG4gICAgICAgICAgICAgIGRhdGE6IGN1c3RvbURhdGFPYmpcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBUSElTLmRhdGFPbkNsaWNrLmVtaXQoZGF0YSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FudmFzID0gbmV3IENoYXJ0KGN0eCwgcHJvcHMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsIlxyXG48ZGl2IGNsYXNzPVwiY29tcG9uZW50LXdyYXBwZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJ0b29sYmFyLXdyYXBwZXJcIiAqbmdJZj1cInNob3dUb29sYmFyXCI+XHJcbiAgICAgICAgPG5ldXJhc2lsLWNoYXJ0cy10b29sYmFyIFsodG9vbGJhclByb3BzKV09XCJ0b29sYmFyUHJvcHNcIiAodG9vbGJhclByb3BzQ2hhbmdlKT1cInVwZGF0ZVRvb2xiYXJQcm9wcygkZXZlbnQpXCI+PC9uZXVyYXNpbC1jaGFydHMtdG9vbGJhcj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cImNhbnZhcy13cmFwcGVyXCI+XHJcbiAgICAgICAgPGNhbnZhcyBbbmdDbGFzc109XCJoYXNEYXRhID8gJycgOiAnY2FudmFzLWhpZGRlbidcIiAjbmV1cmFzaWxDaGFydENhbnZhcyBpZD1cIm5ldXJhc2lsQ2hhcnRDYW52YXNcIj48L2NhbnZhcz5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwib3ZlcmxheVwiICpuZ0lmPVwiIWhhc0RhdGFcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm92ZXJsYXktY29udGVudHNcIj5cclxuICAgICAgICAgICAgICAgIE5vIGRhdGEgdG8gZGlzcGxheS4gQ2hlY2sgeW91ciBmaWx0ZXJzLlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuIl19