/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NeurasilChartsService } from './neurasil-charts.service';
import { NEURASIL_CHART_TYPE } from './models';
import { NeurasilDataFilter } from './pipes';
import * as Chart from 'chart.js';
var NeurasilChartsComponent = /** @class */ (function () {
    function NeurasilChartsComponent(neurasilChartsService, neurasilDataFilter) {
        this.neurasilChartsService = neurasilChartsService;
        this.neurasilDataFilter = neurasilDataFilter;
        this.showToolbar = true;
        this.showToolbarChange = new EventEmitter();
        this.chartTypeChange = new EventEmitter();
        this.useAltAxis = true; // not sure if needed
        // not sure if needed
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
    /**
     * @return {?}
     */
    NeurasilChartsComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.chartType) {
            this.toolbarProps.chartType = this.chartType;
        }
        if (this.swapLabelsAndDatasets) {
            this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets;
        }
        this.hasData = (this.data && this.data.length > 0);
    };
    /**
     * @return {?}
     */
    NeurasilChartsComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.drawChart();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    NeurasilChartsComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes) {
            console.log(changes);
            this.drawChart();
        }
    };
    /**
     * @param {?} ev
     * @return {?}
     */
    NeurasilChartsComponent.prototype.updateToolbarProps = /**
     * @param {?} ev
     * @return {?}
     */
    function (ev) {
        console.log(">>>", ev);
        console.log(this.toolbarProps);
        this.chartTypeChange.emit(this.toolbarProps.chartType);
        this.showToolbarChange.emit(this.showToolbar);
        this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
        this.drawChart();
    };
    /**
     * @return {?}
     */
    NeurasilChartsComponent.prototype.drawChart = /**
     * @return {?}
     */
    function () {
        if (this._canvas) {
            this._canvas.destroy();
        }
        if (this.canvas) {
            /** @type {?} */
            var ctx = this.canvas.nativeElement.getContext('2d');
            /** @type {?} */
            var filterString = "";
            if (this.globalFilter.length > 0) {
                filterString += this.globalFilter + ",";
            }
            filterString += this.toolbarProps._datasetFilter;
            /** @type {?} */
            var filteredData = this.neurasilDataFilter.transform(this.data, filterString);
            console.log(filteredData);
            this.hasData = (filteredData && filteredData.length > 0);
            if (this.hasData) {
                /** @type {?} */
                var o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
                /** @type {?} */
                var props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject);
                if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
                }
                this._canvas = new Chart(ctx, props);
            }
        }
    };
    NeurasilChartsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'neurasil-charts',
                    template: "\r\n<div class=\"component-wrapper\">\r\n    <div class=\"toolbar-wrapper\" *ngIf=\"showToolbar\">\r\n        <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\r\n    </div>\r\n    <div class=\"canvas-wrapper\">\r\n        <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\r\n        <div class=\"overlay\" *ngIf=\"!hasData\">\r\n            <div class=\"overlay-contents\">\r\n                No data to display. Check your filters.\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                    providers: [NeurasilDataFilter],
                    styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex-grow:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:rgba(0,0,0,.1)}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"]
                }] }
    ];
    /** @nocollapse */
    NeurasilChartsComponent.ctorParameters = function () { return [
        { type: NeurasilChartsService },
        { type: NeurasilDataFilter }
    ]; };
    NeurasilChartsComponent.propDecorators = {
        canvas: [{ type: ViewChild, args: ['neurasilChartCanvas', { static: false },] }],
        data: [{ type: Input }],
        showToolbar: [{ type: Input }],
        showToolbarChange: [{ type: Output }],
        chartType: [{ type: Input }],
        chartTypeChange: [{ type: Output }],
        useAltAxis: [{ type: Input }],
        chartTitle: [{ type: Input }],
        xAxisLabelText: [{ type: Input }],
        yAxisLabelText_Alt: [{ type: Input }],
        yAxisLabelText: [{ type: Input }],
        swapLabelsAndDatasets: [{ type: Input }],
        swapLabelsAndDatasetsChange: [{ type: Output }],
        globalFilter: [{ type: Input }]
    };
    return NeurasilChartsComponent;
}());
export { NeurasilChartsComponent };
if (false) {
    /** @type {?} */
    NeurasilChartsComponent.prototype.canvas;
    /**
     * Data to plot
     * @type {?}
     */
    NeurasilChartsComponent.prototype.data;
    /** @type {?} */
    NeurasilChartsComponent.prototype.showToolbar;
    /** @type {?} */
    NeurasilChartsComponent.prototype.showToolbarChange;
    /**
     * User-defined default chart type
     * @type {?}
     */
    NeurasilChartsComponent.prototype.chartType;
    /** @type {?} */
    NeurasilChartsComponent.prototype.chartTypeChange;
    /** @type {?} */
    NeurasilChartsComponent.prototype.useAltAxis;
    /** @type {?} */
    NeurasilChartsComponent.prototype.chartTitle;
    /** @type {?} */
    NeurasilChartsComponent.prototype.xAxisLabelText;
    /** @type {?} */
    NeurasilChartsComponent.prototype.yAxisLabelText_Alt;
    /** @type {?} */
    NeurasilChartsComponent.prototype.yAxisLabelText;
    /** @type {?} */
    NeurasilChartsComponent.prototype.swapLabelsAndDatasets;
    /** @type {?} */
    NeurasilChartsComponent.prototype.swapLabelsAndDatasetsChange;
    /** @type {?} */
    NeurasilChartsComponent.prototype.globalFilter;
    /** @type {?} */
    NeurasilChartsComponent.prototype.toolbarProps;
    /** @type {?} */
    NeurasilChartsComponent.prototype._canvas;
    /** @type {?} */
    NeurasilChartsComponent.prototype.hasData;
    /** @type {?} */
    NeurasilChartsComponent.prototype.neurasilChartsService;
    /** @type {?} */
    NeurasilChartsComponent.prototype.neurasilDataFilter;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25ldXJhc2lsLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxTQUFTLEVBQUUsVUFBVSxFQUFpQixLQUFLLEVBQTRCLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0ksT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUU3QyxPQUFPLEtBQUssS0FBSyxNQUFNLFVBQVUsQ0FBQztBQUVsQztJQTJDRSxpQ0FBbUIscUJBQTRDLEVBQVMsa0JBQXNDO1FBQTNGLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFBUyx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQW9CO1FBNUJyRyxnQkFBVyxHQUFZLElBQUksQ0FBQztRQUMzQixzQkFBaUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBS3ZDLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV0QyxlQUFVLEdBQVksSUFBSSxDQUFDLENBQUMscUJBQXFCOztRQUNqRCxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLG1CQUFjLEdBQVcsRUFBRSxDQUFDO1FBQzVCLHVCQUFrQixHQUFXLEVBQUUsQ0FBQztRQUNoQyxtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQUczQixnQ0FBMkIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xELGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRW5DLGlCQUFZLEdBQUc7WUFDYixTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMs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REFBK0M7O0lBRS9DLDZDQUFvQzs7SUFDcEMsNkNBQWlDOztJQUNqQyxpREFBcUM7O0lBQ3JDLHFEQUF5Qzs7SUFDekMsaURBQXFDOztJQUVyQyx3REFBd0M7O0lBQ3hDLDhEQUEyRDs7SUFDM0QsK0NBQW1DOztJQUVuQywrQ0FJRTs7SUFFRiwwQ0FBYTs7SUFDYiwwQ0FBaUI7O0lBR0wsd0RBQW1EOztJQUFFLHFEQUE2QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYsIEFmdGVyVmlld0luaXQsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE91dHB1dCwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOZXVyYXNpbENoYXJ0c1NlcnZpY2UgfSBmcm9tICcuL25ldXJhc2lsLWNoYXJ0cy5zZXJ2aWNlJztcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBOZXVyYXNpbERhdGFGaWx0ZXIgfSBmcm9tICcuL3BpcGVzJztcblxuaW1wb3J0ICogYXMgQ2hhcnQgZnJvbSAnY2hhcnQuanMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZXVyYXNpbC1jaGFydHMnLFxuICB0ZW1wbGF0ZVVybDogJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vbmV1cmFzaWwtY2hhcnRzLmNvbXBvbmVudC5zYXNzJ10sXG4gIHByb3ZpZGVyczogW05ldXJhc2lsRGF0YUZpbHRlcl1cbn0pXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxDaGFydHNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XG5cbiAgQFZpZXdDaGlsZCgnbmV1cmFzaWxDaGFydENhbnZhcycsIHsgc3RhdGljOiBmYWxzZSB9KSBjYW52YXM6IEVsZW1lbnRSZWY7XG5cbiAgLyoqXG4gICAqIERhdGEgdG8gcGxvdFxuICAgKi9cbiAgQElucHV0KCkgZGF0YTogQXJyYXk8YW55PjtcblxuICBASW5wdXQoKSBzaG93VG9vbGJhcjogYm9vbGVhbiA9IHRydWU7XG4gIEBPdXRwdXQoKSBzaG93VG9vbGJhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgLyoqXG4gICAqIFVzZXItZGVmaW5lZCBkZWZhdWx0IGNoYXJ0IHR5cGVcbiAgICovXG4gIEBJbnB1dCgpIGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRTtcbiAgQE91dHB1dCgpIGNoYXJ0VHlwZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBASW5wdXQoKSB1c2VBbHRBeGlzOiBib29sZWFuID0gdHJ1ZTsgLy8gbm90IHN1cmUgaWYgbmVlZGVkXG4gIEBJbnB1dCgpIGNoYXJ0VGl0bGU6IHN0cmluZyA9IFwiXCI7XG4gIEBJbnB1dCgpIHhBeGlzTGFiZWxUZXh0OiBzdHJpbmcgPSBcIlwiO1xuICBASW5wdXQoKSB5QXhpc0xhYmVsVGV4dF9BbHQ6IHN0cmluZyA9IFwiXCI7XG4gIEBJbnB1dCgpIHlBeGlzTGFiZWxUZXh0OiBzdHJpbmcgPSBcIlwiO1xuXG4gIEBJbnB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0czogYm9vbGVhbjtcbiAgQE91dHB1dCgpIHN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgQElucHV0KCkgZ2xvYmFsRmlsdGVyOiBzdHJpbmcgPSBcIlwiO1xuXG4gIHRvb2xiYXJQcm9wcyA9IHtcbiAgICBjaGFydFR5cGU6IHRoaXMuY2hhcnRUeXBlID8gdGhpcy5jaGFydFR5cGUgOiBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUixcbiAgICBfZGF0YXNldEZpbHRlcjogXCJcIixcbiAgICBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGZhbHNlXG4gIH07XG5cbiAgX2NhbnZhczogYW55O1xuICBoYXNEYXRhOiBib29sZWFuOyAvLyBmb3IgdGhlIHB1cnBvc2Ugb2YgY2hlY2tpbmcgbGVuZ3RoIGluIGh0bWwgdGVtcGxhdGVcblxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBuZXVyYXNpbENoYXJ0c1NlcnZpY2U6IE5ldXJhc2lsQ2hhcnRzU2VydmljZSwgcHVibGljIG5ldXJhc2lsRGF0YUZpbHRlcjogTmV1cmFzaWxEYXRhRmlsdGVyKSB7IH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5jaGFydFR5cGUpIHtcbiAgICAgIHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSA9IHRoaXMuY2hhcnRUeXBlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xuICAgICAgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzID0gdGhpcy5zd2FwTGFiZWxzQW5kRGF0YXNldHNcbiAgICB9XG5cbiAgICB0aGlzLmhhc0RhdGEgPSAodGhpcy5kYXRhICYmIHRoaXMuZGF0YS5sZW5ndGggPiAwKTtcbiAgfVxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgfVxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIGNvbnNvbGUubG9nKGNoYW5nZXMpIFxuICAgICAgdGhpcy5kcmF3Q2hhcnQoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVUb29sYmFyUHJvcHMoZXYpIHtcbiAgICBjb25zb2xlLmxvZyhcIj4+PlwiICwgZXYpXG4gICAgY29uc29sZS5sb2codGhpcy50b29sYmFyUHJvcHMpXG4gICAgdGhpcy5jaGFydFR5cGVDaGFuZ2UuZW1pdCh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUpO1xuICAgIHRoaXMuc2hvd1Rvb2xiYXJDaGFuZ2UuZW1pdCh0aGlzLnNob3dUb29sYmFyKTtcbiAgICB0aGlzLnN3YXBMYWJlbHNBbmREYXRhc2V0c0NoYW5nZS5lbWl0KHRoaXMudG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0cylcbiAgICB0aGlzLmRyYXdDaGFydCgpO1xuICB9XG5cblxuICBkcmF3Q2hhcnQoKSB7XG4gICAgaWYgKHRoaXMuX2NhbnZhcykge1xuICAgICAgdGhpcy5fY2FudmFzLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuY2FudmFzKSB7XG4gICAgICB2YXIgY3R4ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgbGV0IGZpbHRlclN0cmluZyA9IFwiXCJcbiAgICAgIGlmICh0aGlzLmdsb2JhbEZpbHRlci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGZpbHRlclN0cmluZyArPSB0aGlzLmdsb2JhbEZpbHRlciArIFwiLFwiXG4gICAgICB9XG4gICAgICBmaWx0ZXJTdHJpbmcgKz0gdGhpcy50b29sYmFyUHJvcHMuX2RhdGFzZXRGaWx0ZXI7XG4gICAgICBsZXQgZmlsdGVyZWREYXRhID0gdGhpcy5uZXVyYXNpbERhdGFGaWx0ZXIudHJhbnNmb3JtKHRoaXMuZGF0YSwgZmlsdGVyU3RyaW5nKTtcbiAgICAgIGNvbnNvbGUubG9nKGZpbHRlcmVkRGF0YSk7XG4gICAgICB0aGlzLmhhc0RhdGEgPSAoZmlsdGVyZWREYXRhICYmIGZpbHRlcmVkRGF0YS5sZW5ndGggPiAwKTtcbiAgICAgIGlmICh0aGlzLmhhc0RhdGEpIHtcbiAgICAgICAgbGV0IG8gPSB0aGlzLm5ldXJhc2lsQ2hhcnRzU2VydmljZS5wYXJzZURhdGFGcm9tRGF0YXNvdXJjZSh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUsIGZpbHRlcmVkRGF0YSwgdGhpcy50b29sYmFyUHJvcHMuc3dhcExhYmVsc0FuZERhdGFzZXRzKTtcbiAgICAgICAgbGV0IHByb3BzID0gdGhpcy5uZXVyYXNpbENoYXJ0c1NlcnZpY2UuY2hhcnRPYmplY3RCdWlsZGVyKHRoaXMudG9vbGJhclByb3BzLmNoYXJ0VHlwZSwgby5kYXRhLCB0aGlzLnVzZUFsdEF4aXMsIHRoaXMuY2hhcnRUaXRsZSwgdGhpcy55QXhpc0xhYmVsVGV4dCwgdGhpcy55QXhpc0xhYmVsVGV4dF9BbHQsIHRoaXMueEF4aXNMYWJlbFRleHQsIG8uX2Nvcm5lcnN0b25lLCB0aGlzLnRvb2xiYXJQcm9wcy5zd2FwTGFiZWxzQW5kRGF0YXNldHMsIG8uX2Zvcm1hdE9iamVjdCk7XG4gICAgICAgIGlmICh0aGlzLnRvb2xiYXJQcm9wcy5jaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xuICAgICAgICAgIHRoaXMubmV1cmFzaWxDaGFydHNTZXJ2aWNlLnBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcyk7IC8vIG1vZGlmeSBjaGFydCBwcm9wcyBvYmplY3RcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jYW52YXMgPSBuZXcgQ2hhcnQoY3R4LCBwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=