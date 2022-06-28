import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class NeurasilChartsToolbarComponent {
    constructor() {
        this.toolbarPropsChange = new EventEmitter();
        this.NEURASIL_CHART_TYPE = NEURASIL_CHART_TYPE;
    }
    toolbarPropsChanged(ev) {
        //console.log(ev)
        this.toolbarPropsChange.emit(this.toolbarProps);
    }
}
/** @nocollapse */ NeurasilChartsToolbarComponent.ɵfac = function NeurasilChartsToolbarComponent_Factory(t) { return new (t || NeurasilChartsToolbarComponent)(); };
/** @nocollapse */ NeurasilChartsToolbarComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NeurasilChartsToolbarComponent, selectors: [["neurasil-charts-toolbar"]], inputs: { toolbarProps: "toolbarProps" }, outputs: { toolbarPropsChange: "toolbarPropsChange" }, decls: 41, vars: 3, consts: [[1, "toolbar-container"], [1, "toolbar"], [1, "filter-textbox-container", "input-group", "input-group-sm"], ["type", "text", "placeholder", "Filters", 1, "filter-textbox", "form-control", "noSelect", 3, "ngModel", "ngModelChange", "change"], [1, "input-group", "input-group-sm", "filter-help"], [1, "tooltip_qd_chartHelper"], [1, "tooltiptext_qd_chartHelper"], [1, "chart-selector-container"], [1, "chart-selector", "input-group", "input-group-sm"], [1, "form-control", 3, "ngModel", "ngModelChange"], ["value", "0"], ["value", "7"], ["value", "2"], ["value", "3"], ["value", "1"], ["value", "4"], ["value", "5"], ["value", "9"], ["value", "6"], [2, "float", "right"], [2, "padding-top", "4px", "padding-right", "15px", "padding-left", "5px"], [2, "zoom", "0.8"], [1, "switch", "tooltip_qd_chartHelper"], ["type", "checkbox", "id", "${this.id}_swapCheckbox", 3, "ngModel", "ngModelChange"], [1, "slider", "round"]], template: function NeurasilChartsToolbarComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "input", 3);
        i0.ɵɵlistener("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_3_listener($event) { return ctx.toolbarProps._datasetFilter = $event; })("change", function NeurasilChartsToolbarComponent_Template_input_change_3_listener($event) { return ctx.toolbarPropsChanged($event); });
        i0.ɵɵelementEnd()();
        i0.ɵɵelementStart(4, "div", 4)(5, "div", 5);
        i0.ɵɵtext(6, "? ");
        i0.ɵɵelementStart(7, "span", 6);
        i0.ɵɵtext(8, " To filter data, use commas to separate data, add - to exclude data. ");
        i0.ɵɵelement(9, "br")(10, "br");
        i0.ɵɵtext(11, " EITHER use ~ to include columns OR ~! to exclude columns. ");
        i0.ɵɵelementEnd()()();
        i0.ɵɵelementStart(12, "div", 7)(13, "div", 8)(14, "select", 9);
        i0.ɵɵlistener("ngModelChange", function NeurasilChartsToolbarComponent_Template_select_ngModelChange_14_listener($event) { return ctx.toolbarProps.chartType = $event; })("ngModelChange", function NeurasilChartsToolbarComponent_Template_select_ngModelChange_14_listener($event) { return ctx.toolbarPropsChanged($event); });
        i0.ɵɵelementStart(15, "option", 10);
        i0.ɵɵtext(16, "Bar Chart");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(17, "option", 11);
        i0.ɵɵtext(18, "Horizontal Bar");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(19, "option", 12);
        i0.ɵɵtext(20, "Stacked Bar Chart");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(21, "option", 13);
        i0.ɵɵtext(22, "Line Chart");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(23, "option", 14);
        i0.ɵɵtext(24, "Bar & Line Combo");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(25, "option", 15);
        i0.ɵɵtext(26, "Pie");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(27, "option", 16);
        i0.ɵɵtext(28, "Donut");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(29, "option", 17);
        i0.ɵɵtext(30, "Pareto Analysis");
        i0.ɵɵelementEnd();
        i0.ɵɵelementStart(31, "option", 18);
        i0.ɵɵtext(32, "Grid View");
        i0.ɵɵelementEnd()()();
        i0.ɵɵelementStart(33, "div", 19)(34, "div", 20)(35, "span", 21)(36, "label", 22)(37, "input", 23);
        i0.ɵɵlistener("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_37_listener($event) { return ctx.toolbarProps.swapLabelsAndDatasets = $event; })("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_37_listener($event) { return ctx.toolbarPropsChanged($event); });
        i0.ɵɵelementEnd();
        i0.ɵɵelement(38, "span", 24);
        i0.ɵɵelementStart(39, "span", 6);
        i0.ɵɵtext(40, " Swap labels and datasets ");
        i0.ɵɵelementEnd()()()()()()()();
    } if (rf & 2) {
        i0.ɵɵadvance(3);
        i0.ɵɵproperty("ngModel", ctx.toolbarProps._datasetFilter);
        i0.ɵɵadvance(11);
        i0.ɵɵproperty("ngModel", ctx.toolbarProps.chartType);
        i0.ɵɵadvance(23);
        i0.ɵɵproperty("ngModel", ctx.toolbarProps.swapLabelsAndDatasets);
    } }, dependencies: [i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], styles: [".toolbar-container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-flow:column}.toolbar[_ngcontent-%COMP%]{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container[_ngcontent-%COMP%]{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox[_ngcontent-%COMP%]{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox[_ngcontent-%COMP%]:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help[_ngcontent-%COMP%]{padding-top:4px;float:left}.chart-selector-container[_ngcontent-%COMP%]{float:right}.chart-selector[_ngcontent-%COMP%]{padding-top:4px;float:left}select[_ngcontent-%COMP%]{width:80px}.switch[_ngcontent-%COMP%]{position:relative;display:inline-block;width:60px;height:34px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.slider[_ngcontent-%COMP%]{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider[_ngcontent-%COMP%]:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#2196f3}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translate(26px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}.tooltip_qd_chartHelper[_ngcontent-%COMP%]{position:relative;display:inline-block}.tooltip_qd_chartHelper[_ngcontent-%COMP%]   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper[_ngcontent-%COMP%]:hover   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:visible}"] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsToolbarComponent, [{
        type: Component,
        args: [{ selector: 'neurasil-charts-toolbar', template: "<div class=\"toolbar-container\" >\r\n    <div class=\"toolbar\">\r\n        <div class=\"filter-textbox-container input-group input-group-sm\">\r\n            <input type=\"text\" class=\"filter-textbox form-control noSelect\" placeholder=\"Filters\" [(ngModel)]=\"toolbarProps._datasetFilter\" (change)=\"toolbarPropsChanged($event)\">\r\n        </div>\r\n        <div class=\"input-group input-group-sm filter-help\" >\r\n            <div class=\"tooltip_qd_chartHelper\">?\r\n                <span class=\"tooltiptext_qd_chartHelper\">\r\n                To filter data, use commas to separate data, add - to exclude data.\r\n                <br> <br> \r\n                EITHER use ~ to include columns OR ~! to exclude columns.\r\n                </span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"chart-selector-container\">\r\n            <div class=\"chart-selector input-group input-group-sm\">\r\n                <select class=\"form-control\" [(ngModel)]=\"toolbarProps.chartType\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                    <option value='0'>Bar Chart</option>\r\n                    <option value='7'>Horizontal Bar</option>               \r\n                    <option value='2'>Stacked Bar Chart</option>\r\n                    <option value='3'>Line Chart</option>\r\n                    <option value='1'>Bar & Line Combo</option>\r\n                    <option value='4'>Pie</option>\r\n                    <option value='5'>Donut</option>\r\n                    <!-- <option value='8'>Pareto (1 dataset)</option> -->\r\n                    <option value='9'>Pareto Analysis</option>\r\n                    <option value='6'>Grid View</option>\r\n\r\n                </select>\r\n            </div>\r\n            <div style=\"float:right\">\r\n                <div style=\"padding-top:4px;padding-right: 15px; padding-left:5px\">\r\n                    <span style=\"zoom:0.8;\">\r\n                        <label class=\"switch tooltip_qd_chartHelper\" >\r\n                        <input type='checkbox' id='${this.id}_swapCheckbox'  [(ngModel)]=\"toolbarProps.swapLabelsAndDatasets\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                            <span class=\"slider round\"></span>\r\n                            <span class=\"tooltiptext_qd_chartHelper\">\r\n                                Swap labels and datasets\r\n                            </span>\r\n                        </label>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".toolbar-container{width:100%;height:100%;display:flex;flex-flow:column}.toolbar{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help{padding-top:4px;float:left}.chart-selector-container{float:right}.chart-selector{padding-top:4px;float:left}select{width:80px}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{transform:translate(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.tooltip_qd_chartHelper{position:relative;display:inline-block}.tooltip_qd_chartHelper .tooltiptext_qd_chartHelper{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper:hover .tooltiptext_qd_chartHelper{visibility:visible}\n"] }]
    }], null, { toolbarProps: [{
            type: Input
        }], toolbarPropsChange: [{
            type: Output
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmV1cmFzaWwtY2hhcnRzL3NyYy9saWIvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmV1cmFzaWwtY2hhcnRzL3NyYy9saWIvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUV0RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQTs7O0FBT2pFLE1BQU0sT0FBTyw4QkFBOEI7SUFMM0M7UUFPWSx1QkFBa0IsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ3ZELHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO0tBSzNDO0lBSkMsbUJBQW1CLENBQUMsRUFBRTtRQUNwQixpQkFBaUI7UUFDakIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEQsQ0FBQzs7K0hBUFUsOEJBQThCO2dIQUE5Qiw4QkFBOEI7UUNUM0MsOEJBQWdDLGFBQUEsYUFBQSxlQUFBO1FBR2tFLDRLQUF5QyxxR0FBVywrQkFBMkIsSUFBdEM7UUFBL0gsaUJBQXVLLEVBQUE7UUFFM0ssOEJBQXFELGFBQUE7UUFDYixrQkFDaEM7UUFBQSwrQkFBeUM7UUFDekMscUZBQ0E7UUFBQSxxQkFBSSxVQUFBO1FBQ0osNEVBQ0E7UUFBQSxpQkFBTyxFQUFBLEVBQUE7UUFJZiwrQkFBc0MsY0FBQSxpQkFBQTtRQUVELHlLQUFvQyxxSEFBa0IsK0JBQTJCLElBQTdDO1FBQzdELG1DQUFrQjtRQUFBLDBCQUFTO1FBQUEsaUJBQVM7UUFDcEMsbUNBQWtCO1FBQUEsK0JBQWM7UUFBQSxpQkFBUztRQUN6QyxtQ0FBa0I7UUFBQSxrQ0FBaUI7UUFBQSxpQkFBUztRQUM1QyxtQ0FBa0I7UUFBQSwyQkFBVTtRQUFBLGlCQUFTO1FBQ3JDLG1DQUFrQjtRQUFBLGlDQUFnQjtRQUFBLGlCQUFTO1FBQzNDLG1DQUFrQjtRQUFBLG9CQUFHO1FBQUEsaUJBQVM7UUFDOUIsbUNBQWtCO1FBQUEsc0JBQUs7UUFBQSxpQkFBUztRQUVoQyxtQ0FBa0I7UUFBQSxnQ0FBZTtRQUFBLGlCQUFTO1FBQzFDLG1DQUFrQjtRQUFBLDBCQUFTO1FBQUEsaUJBQVMsRUFBQSxFQUFBO1FBSTVDLGdDQUF5QixlQUFBLGdCQUFBLGlCQUFBLGlCQUFBO1FBSXdDLG9MQUFnRCxvSEFBa0IsK0JBQTJCLElBQTdDO1FBQXJHLGlCQUFvSjtRQUNoSiw0QkFBa0M7UUFDbEMsZ0NBQXlDO1FBQ3JDLDJDQUNKO1FBQUEsaUJBQU8sRUFBQSxFQUFBLEVBQUEsRUFBQSxFQUFBLEVBQUEsRUFBQTs7UUFwQytELGVBQXlDO1FBQXpDLHlEQUF5QztRQWM5RixnQkFBb0M7UUFBcEMsb0RBQW9DO1FBa0JKLGdCQUFnRDtRQUFoRCxnRUFBZ0Q7O3VGRDFCaEgsOEJBQThCO2NBTDFDLFNBQVM7MkJBQ0UseUJBQXlCO2dCQUsxQixZQUFZO2tCQUFwQixLQUFLO1lBQ0ksa0JBQWtCO2tCQUEzQixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4uL21vZGVscy9OZXVyYXNpbENoYXJ0VHlwZSdcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXInLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9uZXVyYXNpbC1jaGFydHMtdG9vbGJhci5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50LnNhc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxDaGFydHNUb29sYmFyQ29tcG9uZW50IHtcclxuICBASW5wdXQoKSB0b29sYmFyUHJvcHM7XHJcbiAgQE91dHB1dCgpIHRvb2xiYXJQcm9wc0NoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xyXG4gIE5FVVJBU0lMX0NIQVJUX1RZUEUgPSBORVVSQVNJTF9DSEFSVF9UWVBFO1xyXG4gIHRvb2xiYXJQcm9wc0NoYW5nZWQoZXYpe1xyXG4gICAgLy9jb25zb2xlLmxvZyhldilcclxuICAgIHRoaXMudG9vbGJhclByb3BzQ2hhbmdlLmVtaXQodGhpcy50b29sYmFyUHJvcHMpO1xyXG4gIH1cclxufSIsIjxkaXYgY2xhc3M9XCJ0b29sYmFyLWNvbnRhaW5lclwiID5cclxuICAgIDxkaXYgY2xhc3M9XCJ0b29sYmFyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImZpbHRlci10ZXh0Ym94LWNvbnRhaW5lciBpbnB1dC1ncm91cCBpbnB1dC1ncm91cC1zbVwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZpbHRlci10ZXh0Ym94IGZvcm0tY29udHJvbCBub1NlbGVjdFwiIHBsYWNlaG9sZGVyPVwiRmlsdGVyc1wiIFsobmdNb2RlbCldPVwidG9vbGJhclByb3BzLl9kYXRhc2V0RmlsdGVyXCIgKGNoYW5nZSk9XCJ0b29sYmFyUHJvcHNDaGFuZ2VkKCRldmVudClcIj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAgaW5wdXQtZ3JvdXAtc20gZmlsdGVyLWhlbHBcIiA+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwX3FkX2NoYXJ0SGVscGVyXCI+P1xyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b29sdGlwdGV4dF9xZF9jaGFydEhlbHBlclwiPlxyXG4gICAgICAgICAgICAgICAgVG8gZmlsdGVyIGRhdGEsIHVzZSBjb21tYXMgdG8gc2VwYXJhdGUgZGF0YSwgYWRkIC0gdG8gZXhjbHVkZSBkYXRhLlxyXG4gICAgICAgICAgICAgICAgPGJyPiA8YnI+IFxyXG4gICAgICAgICAgICAgICAgRUlUSEVSIHVzZSB+IHRvIGluY2x1ZGUgY29sdW1ucyBPUiB+ISB0byBleGNsdWRlIGNvbHVtbnMuXHJcbiAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hhcnQtc2VsZWN0b3ItY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaGFydC1zZWxlY3RvciBpbnB1dC1ncm91cCBpbnB1dC1ncm91cC1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIFsobmdNb2RlbCldPVwidG9vbGJhclByb3BzLmNoYXJ0VHlwZVwiIChuZ01vZGVsQ2hhbmdlKT1cInRvb2xiYXJQcm9wc0NoYW5nZWQoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9JzAnPkJhciBDaGFydDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9JzcnPkhvcml6b250YWwgQmFyPC9vcHRpb24+ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nMic+U3RhY2tlZCBCYXIgQ2hhcnQ8L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPSczJz5MaW5lIENoYXJ0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nMSc+QmFyICYgTGluZSBDb21ibzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9JzQnPlBpZTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9JzUnPkRvbnV0PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPCEtLSA8b3B0aW9uIHZhbHVlPSc4Jz5QYXJldG8gKDEgZGF0YXNldCk8L29wdGlvbj4gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nOSc+UGFyZXRvIEFuYWx5c2lzPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nNic+R3JpZCBWaWV3PC9vcHRpb24+XHJcblxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZmxvYXQ6cmlnaHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJwYWRkaW5nLXRvcDo0cHg7cGFkZGluZy1yaWdodDogMTVweDsgcGFkZGluZy1sZWZ0OjVweFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPVwiem9vbTowLjg7XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInN3aXRjaCB0b29sdGlwX3FkX2NoYXJ0SGVscGVyXCIgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGlkPScke3RoaXMuaWR9X3N3YXBDaGVja2JveCcgIFsobmdNb2RlbCldPVwidG9vbGJhclByb3BzLnN3YXBMYWJlbHNBbmREYXRhc2V0c1wiIChuZ01vZGVsQ2hhbmdlKT1cInRvb2xiYXJQcm9wc0NoYW5nZWQoJGV2ZW50KVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzbGlkZXIgcm91bmRcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvb2x0aXB0ZXh0X3FkX2NoYXJ0SGVscGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgU3dhcCBsYWJlbHMgYW5kIGRhdGFzZXRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PiJdfQ==