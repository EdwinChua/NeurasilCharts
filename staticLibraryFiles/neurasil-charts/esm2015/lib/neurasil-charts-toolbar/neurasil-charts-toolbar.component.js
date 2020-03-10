/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts-toolbar/neurasil-charts-toolbar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType';
export class NeurasilChartsToolbarComponent {
    constructor() {
        this.toolbarPropsChange = new EventEmitter();
        this.NEURASIL_CHART_TYPE = NEURASIL_CHART_TYPE;
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    toolbarPropsChanged(ev) {
        //console.log(ev)
        this.toolbarPropsChange.emit(this.toolbarProps);
    }
}
NeurasilChartsToolbarComponent.decorators = [
    { type: Component, args: [{
                selector: 'neurasil-charts-toolbar',
                template: "<div class=\"toolbar-container\" >\r\n    <div class=\"toolbar\">\r\n        <div class=\"filter-textbox-container input-group input-group-sm\">\r\n            <input type=\"text\" class=\"filter-textbox form-control noSelect\" placeholder=\"Filters\" [(ngModel)]=\"toolbarProps._datasetFilter\" (change)=\"toolbarPropsChanged($event)\">\r\n        </div>\r\n        <div class=\"input-group input-group-sm filter-help\" >\r\n            <div class=\"tooltip_qd_chartHelper\">?\r\n                <span class=\"tooltiptext_qd_chartHelper\">\r\n                To filter data, use commas to separate data, add - to exclude data.\r\n                <br> <br> \r\n                EITHER use ~ to include columns OR ~! to exclude columns.\r\n                </span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"chart-selector-container\">\r\n            <div class=\"chart-selector input-group input-group-sm\">\r\n                <select class=\"form-control\" [(ngModel)]=\"toolbarProps.chartType\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                    <option value='0'>Bar Chart</option>\r\n                    <option value='7'>Horizontal Bar</option>               \r\n                    <option value='2'>Stacked Bar Chart</option>\r\n                    <option value='3'>Line Chart</option>\r\n                    <option value='1'>Bar & Line Combo</option>\r\n                    <option value='4'>Pie</option>\r\n                    <option value='5'>Donut</option>\r\n                    <!-- <option value='8'>Pareto (1 dataset)</option> -->\r\n                    <option value='9'>Pareto Analysis</option>\r\n                    <option value='6'>Grid View</option>\r\n\r\n                </select>\r\n            </div>\r\n            <div style=\"float:right\">\r\n                <div style=\"padding-top:4px;padding-right: 15px; padding-left:5px\">\r\n                    <span style=\"zoom:0.8;\">\r\n                        <label class=\"switch tooltip_qd_chartHelper\" >\r\n                        <input type='checkbox' id='${this.id}_swapCheckbox'  [(ngModel)]=\"toolbarProps.swapLabelsAndDatasets\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                            <span class=\"slider round\"></span>\r\n                            <span class=\"tooltiptext_qd_chartHelper\">\r\n                                Swap labels and datasets\r\n                            </span>\r\n                        </label>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>",
                styles: [".toolbar-container{width:100%;height:100%;display:flex;flex-flow:column}.toolbar{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox{width:100%;border:0;background-color:#d3d3d3;border-bottom:2px solid #a9a9a9}.filter-textbox:focus{border:0;border-bottom:2px solid #000;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:0}.filter-help{padding-top:4px;float:left}.chart-selector-container{float:right}.chart-selector{padding-top:4px;float:left}select{width:80px}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{transform:translateX(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.tooltip_qd_chartHelper{position:relative;display:inline-block}.tooltip_qd_chartHelper .tooltiptext_qd_chartHelper{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper:hover .tooltiptext_qd_chartHelper{visibility:visible}"]
            }] }
];
NeurasilChartsToolbarComponent.propDecorators = {
    toolbarProps: [{ type: Input }],
    toolbarPropsChange: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    NeurasilChartsToolbarComponent.prototype.toolbarProps;
    /** @type {?} */
    NeurasilChartsToolbarComponent.prototype.toolbarPropsChange;
    /** @type {?} */
    NeurasilChartsToolbarComponent.prototype.NEURASIL_CHART_TYPE;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmV1cmFzaWwtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL25ldXJhc2lsLWNoYXJ0cy10b29sYmFyL25ldXJhc2lsLWNoYXJ0cy10b29sYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFdEUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUE7QUFPakUsTUFBTSxPQUFPLDhCQUE4QjtJQUwzQztRQU9ZLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDdkQsd0JBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFLNUMsQ0FBQzs7Ozs7SUFKQyxtQkFBbUIsQ0FBQyxFQUFFO1FBQ3BCLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNsRCxDQUFDOzs7WUFaRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsOGpGQUF1RDs7YUFFeEQ7OzsyQkFFRSxLQUFLO2lDQUNMLE1BQU07Ozs7SUFEUCxzREFBc0I7O0lBQ3RCLDREQUF1RDs7SUFDdkQsNkRBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4uL21vZGVscy9OZXVyYXNpbENoYXJ0VHlwZSdcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZXVyYXNpbC1jaGFydHMtdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50LnNhc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxDaGFydHNUb29sYmFyQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSB0b29sYmFyUHJvcHM7XHJcbiAgQE91dHB1dCgpIHRvb2xiYXJQcm9wc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIE5FVVJBU0lMX0NIQVJUX1RZUEUgPSBORVVSQVNJTF9DSEFSVF9UWVBFO1xyXG4gIHRvb2xiYXJQcm9wc0NoYW5nZWQoZXYpe1xyXG4gICAgLy9jb25zb2xlLmxvZyhldilcclxuICAgIHRoaXMudG9vbGJhclByb3BzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMpO1xyXG4gIH1cclxufSJdfQ==