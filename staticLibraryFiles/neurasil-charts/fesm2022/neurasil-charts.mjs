import * as i0 from '@angular/core';
import { Injectable, Pipe, EventEmitter, Component, Output, Input, ViewChild, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgClass, CommonModule } from '@angular/common';

var NEURASIL_CHART_TYPE;
(function (NEURASIL_CHART_TYPE) {
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["BAR"] = 0] = "BAR";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["BAR_LINE"] = 1] = "BAR_LINE";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["STACKED"] = 2] = "STACKED";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["LINE"] = 3] = "LINE";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["PIE"] = 4] = "PIE";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["DONUT"] = 5] = "DONUT";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["GRID"] = 6] = "GRID";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["HORIZONTAL_BAR"] = 7] = "HORIZONTAL_BAR";
    NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE["STACKED_PARETO"] = 9] = "STACKED_PARETO";
})(NEURASIL_CHART_TYPE || (NEURASIL_CHART_TYPE = {}));

class Utils {
    static hexToRgba(hex, alpha = 1) {
        const [r, g, b] = hex.match(hex.length <= 4 ? /\w/g : /\w\w/g)
            .map(x => parseInt(x.length < 2 ? `${x}${x}` : x, 16));
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    //takes opacity param, convert rgb to rgba OR set opacity for rgba
    static rgbToRgba(rgb, opacity = 1) {
        const [r, g, b] = rgb.match(/\d+/g);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    //checks string to determine if is hex
    static colorIsHex(str) {
        return str.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    }
}

class NeurasilChartsService {
    constructor() { }
    parseDataFromDatasource(chartType, incomingData, swapLabelsAndDatasets) {
        let returnData = {
            _cornerstone: "",
            _formatObject: null,
            data: null
        };
        let data = structuredClone(incomingData);
        let k_arr = Object.keys(data[0]);
        let cDat = {};
        for (let i = 0; i < k_arr.length; i++) {
            let currKey = k_arr[i];
            cDat[currKey] = data.map(row => row[currKey]);
        }
        let formatObj = {};
        let k_arr_new = Object.keys(cDat);
        returnData._cornerstone = k_arr_new[0];
        for (let i = 0; i < k_arr_new.length; i++) {
            let currKey = k_arr_new[i];
            formatObj[currKey] = {};
            if (currKey !== returnData._cornerstone) {
                let testItem = cDat[currKey].find(v => v);
                let prefix = "";
                let suffix = "";
                if (testItem) {
                    if (!isNumber(testItem)) {
                        if (isNumber(testItem.substr(1))) {
                            prefix = testItem.substr(0, 1);
                        }
                        else if (isNumber(testItem.substr(0, testItem.length - 1))) {
                            suffix = testItem.substr(testItem.length - 1);
                        }
                    }
                }
                formatObj[currKey] = { prefix, suffix };
                // strip prefix/suffix from each value
                if (prefix !== "" || suffix !== "") {
                    for (let k = 0; k < cDat[currKey].length; k++) {
                        if (prefix !== "") {
                            cDat[currKey][k] = cDat[currKey][k].replace(prefix, "");
                        }
                        if (suffix !== "") {
                            cDat[currKey][k] = cDat[currKey][k].replace(suffix, "");
                        }
                    }
                }
            }
            else {
                formatObj[currKey] = { prefix: "", suffix: "" };
            }
        }
        if (swapLabelsAndDatasets) {
            let cDat_New = {};
            cDat_New[returnData._cornerstone] = Object.keys(cDat).filter(k => k !== returnData._cornerstone);
            for (let i = 0; i < cDat[returnData._cornerstone].length; i++) {
                cDat_New[cDat[returnData._cornerstone][i]] = cDat_New[returnData._cornerstone].map(key => cDat[key][i]);
            }
            cDat = cDat_New;
        }
        if (chartType === NEURASIL_CHART_TYPE.STACKED_PARETO) {
            formatObj["Pareto"] = { prefix: "", suffix: "%" };
            formatObj["80% line"] = { prefix: "", suffix: "%" };
        }
        function isNumber(value) {
            return ((value != null) && !isNaN(Number(value.toString())));
        }
        returnData._formatObject = formatObj;
        returnData.data = cDat;
        return returnData;
    }
    chartObjectBuilder(chartType, chartData, useAltAxis, title, yAxisLabelText, yAxisLabelText_Alt, xAxisLabelText, cornerstone, swapLabelsAndDatasets, formatObject, useLogScale, colorPalette, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border) {
        const unsupportedAltAxisTypes = [
            NEURASIL_CHART_TYPE.BAR,
            NEURASIL_CHART_TYPE.HORIZONTAL_BAR,
            NEURASIL_CHART_TYPE.LINE,
            NEURASIL_CHART_TYPE.STACKED,
            NEURASIL_CHART_TYPE.PIE,
            NEURASIL_CHART_TYPE.DONUT
        ];
        if (unsupportedAltAxisTypes.includes(chartType) && useAltAxis === true) {
            console.warn("You have enabled alternate axis on a (unsupported) chart type. It has been set to false");
            useAltAxis = false;
        }
        if (chartType === NEURASIL_CHART_TYPE.STACKED_PARETO) {
            yAxisLabelText_Alt = "Pareto %";
            useAltAxis = true;
        }
        let options = {
            maintainAspectRatio: false,
            responsive: true,
        };
        if (title) {
            options.plugins = {
                title: {
                    display: true,
                    text: title
                }
            };
        }
        const yAxisLabel = yAxisLabelText
            ? { display: true, text: yAxisLabelText }
            : { display: false, text: "" };
        const yAxisLabel_Alt = yAxisLabelText_Alt
            ? { display: true, text: yAxisLabelText_Alt }
            : { display: false, text: "" };
        const xAxisLabel = xAxisLabelText
            ? { display: true, text: xAxisLabelText }
            : { display: true, text: [" ", " "] };
        const labelTickCallback = function (value, _index, _ticks) {
            const label = this.getLabelForValue(value);
            if (!Array.isArray(label)) {
                return label.length <= 10 ? label : label.substr(0, 8) + "...";
            }
            return label.map(item => item[0].length <= 10 ? item[0] : [item[0].substr(0, 8) + "..."]);
        };
        if (chartType !== NEURASIL_CHART_TYPE.PIE && chartType !== NEURASIL_CHART_TYPE.DONUT) {
            const isStacked = chartType === NEURASIL_CHART_TYPE.STACKED || chartType === NEURASIL_CHART_TYPE.STACKED_PARETO;
            const isHorizontal = chartType === NEURASIL_CHART_TYPE.HORIZONTAL_BAR;
            options.scales = {
                x: {
                    type: isHorizontal ? (useLogScale ? 'logarithmic' : 'linear') : undefined,
                    stacked: isStacked || undefined,
                    beginAtZero: isHorizontal ? true : undefined,
                    title: isHorizontal ? yAxisLabel : xAxisLabel,
                    ticks: isHorizontal ? {} : { callback: labelTickCallback }
                },
                ...(!isHorizontal && {
                    yAxis: {
                        type: useLogScale ? 'logarithmic' : 'linear',
                        position: 'left',
                        stacked: isStacked || undefined,
                        beginAtZero: isStacked ? undefined : true,
                        title: yAxisLabel
                    }
                }),
                ...(isHorizontal && {
                    y: {
                        title: xAxisLabel,
                        ticks: { callback: labelTickCallback }
                    }
                })
            };
            if (chartType === NEURASIL_CHART_TYPE.STACKED_PARETO) {
                options.scales.yAxis_pareto = {
                    type: 'linear',
                    position: 'right',
                    display: true,
                    beginAtZero: true,
                    min: 0,
                    max: 100,
                    ticks: { stepSize: 80 },
                    title: yAxisLabel_Alt
                };
            }
            else if (useAltAxis) {
                options.scales.yAxis_alt = {
                    display: true,
                    beginAtZero: true,
                    position: 'right',
                    type: 'linear',
                    title: yAxisLabel_Alt
                };
            }
        }
        const chartTypeMap = {
            [NEURASIL_CHART_TYPE.LINE]: 'line',
            [NEURASIL_CHART_TYPE.BAR]: 'bar',
            [NEURASIL_CHART_TYPE.BAR_LINE]: 'bar',
            [NEURASIL_CHART_TYPE.STACKED]: 'bar',
            [NEURASIL_CHART_TYPE.STACKED_PARETO]: 'bar',
            [NEURASIL_CHART_TYPE.HORIZONTAL_BAR]: 'bar',
            [NEURASIL_CHART_TYPE.PIE]: 'pie',
            [NEURASIL_CHART_TYPE.DONUT]: 'doughnut',
        };
        const type = chartTypeMap[chartType];
        if (chartType === NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
            options.indexAxis = 'y';
        }
        let returnOpts = {
            plugins: [],
            type: type,
            data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets, colorPalette, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border),
            options: options
        };
        return returnOpts;
    }
    dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets, colorPaletteToUse = null, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border) {
        const BASE_COLORS = [
            'rgba(199,233,180,{a})',
            'rgba(127,205,187,{a})',
            'rgba(65,182,196,{a})',
            'rgba(29,145,192,{a})',
            'rgba(34,94,168,{a})',
            'rgba(37,52,148,{a})',
            'rgba(8,29,88,{a})',
            'rgba(254,178,76,{a})',
            'rgba(253,141,60,{a})',
            'rgba(252,78,42,{a})',
            'rgba(227,26,28,{a})',
            'rgba(189,0,38,{a})',
            'rgba(128,0,38,{a})'
        ];
        function getPalette(opacity, noOfColors) {
            let baseColors;
            if (colorPaletteToUse) {
                baseColors = colorPaletteToUse.map(color => Utils.colorIsHex(color)
                    ? Utils.hexToRgba(color, opacity)
                    : Utils.rgbToRgba(color, opacity));
            }
            else {
                baseColors = BASE_COLORS.map(c => c.replace('{a}', String(opacity)));
            }
            if (noOfColors <= baseColors.length) {
                return baseColors.slice(0, noOfColors);
            }
            // cycle through colors if more are needed
            const result = [];
            for (let i = 0; i < noOfColors; i++) {
                result.push(baseColors[i % baseColors.length]);
            }
            return result;
        }
        const colorCount = swapLabelsAndDatasets
            ? Object.keys(chartData).length
            : chartData[cornerstone].length;
        const bgColorPalette = getPalette(defaultOpacity, colorCount);
        const bgColorPalette_hover = getPalette(hoverOpacity, colorCount);
        const colorPalette = getPalette(defaultOpacity_border, colorCount);
        const colorPalette_hover = getPalette(hoverOpacity_border, colorCount);
        const objKeys = Object.keys(chartData).filter(k => k !== cornerstone);
        const isPieOrDonut = chartType === NEURASIL_CHART_TYPE.PIE || chartType === NEURASIL_CHART_TYPE.DONUT;
        const isStacked = chartType === NEURASIL_CHART_TYPE.STACKED || chartType === NEURASIL_CHART_TYPE.STACKED_PARETO;
        const dataSets = objKeys.map((key, i) => {
            const yAxis = (useAltAxis && i > 0) ? 'yAxis_alt' : 'yAxis';
            let dataSet = {
                label: key,
                data: chartData[key],
                borderWidth: 2
            };
            if (isPieOrDonut) {
                dataSet.backgroundColor = bgColorPalette;
                dataSet.borderColor = colorPalette;
                dataSet.hoverBackgroundColor = bgColorPalette_hover;
                dataSet.hoverBorderColor = colorPalette;
            }
            else if (chartType === NEURASIL_CHART_TYPE.BAR_LINE || chartType === NEURASIL_CHART_TYPE.LINE) {
                if (chartType === NEURASIL_CHART_TYPE.BAR_LINE) {
                    dataSet.type = i === 0 ? 'bar' : 'line';
                }
                if (dataSet.type === 'bar' || chartType === NEURASIL_CHART_TYPE.LINE) {
                    dataSet.borderColor = colorPalette[i];
                    if (dataSet.type !== 'line' && chartType !== NEURASIL_CHART_TYPE.LINE) {
                        dataSet.backgroundColor = bgColorPalette[i];
                        dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
                        dataSet.hoverBorderColor = colorPalette[i];
                    }
                    else {
                        dataSet.backgroundColor = 'rgba(0,0,0,0)';
                    }
                }
                else {
                    dataSet.borderColor = colorPalette[i];
                    dataSet.backgroundColor = 'rgba(0,0,0,0)';
                }
            }
            else {
                // BAR, HORIZONTAL_BAR, STACKED, STACKED_PARETO
                dataSet.backgroundColor = bgColorPalette[i];
                dataSet.borderColor = colorPalette[i];
                dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
                dataSet.hoverBorderColor = colorPalette[i];
            }
            if (!isPieOrDonut && !isStacked && chartType !== NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
                dataSet.yAxisID = yAxis;
            }
            return dataSet;
        });
        return {
            labels: chartData[cornerstone],
            datasets: dataSets
        };
    }
    performParetoAnalysis(props) {
        const datasets = props.data.datasets;
        const labels = props.data.labels;
        const dataLength = datasets[0].data.length;
        // calculate sum for each label position across all datasets
        const localSumArr = Array.from({ length: dataLength }, (_, j) => datasets.reduce((sum, ds) => {
            const val = parseFloat(ds.data[j]);
            return sum + (isNaN(val) ? 0 : val);
        }, 0));
        const totalSum = localSumArr.reduce((a, b) => a + b, 0);
        // build sortable array
        const sortable = localSumArr.map((sum, i) => {
            const entry = { sum, labels: labels[i] };
            datasets.forEach((ds, j) => { entry[j] = ds.data[i]; });
            return entry;
        });
        // sort descending by sum
        sortable.sort((a, b) => b.sum - a.sum);
        // rebuild labels and dataset data arrays from sorted result
        props.data.labels = sortable.map(o => o.labels);
        datasets.forEach((ds, j) => {
            ds.data = sortable.map(o => o[j]);
        });
        // calculate pareto curve
        let rollingSum = 0;
        const paretoLineValues = sortable.map(o => {
            rollingSum += o.sum;
            return Math.floor(rollingSum / totalSum * 10000) / 100;
        });
        const PARETO_THRESHOLD = 80;
        const paretoDatasetBase = {
            backgroundColor: "rgba(0,0,0,0)",
            borderColor: "rgba(0,0,0,0.8)",
            borderWidth: 2,
            type: "line",
            yAxisID: "yAxis_pareto",
            datalabels: { display: false },
            pointRadius: 0
        };
        datasets.push({
            ...paretoDatasetBase,
            label: "Pareto",
            data: paretoLineValues,
        });
        datasets.push({
            ...paretoDatasetBase,
            label: "80% line",
            data: Array(dataLength).fill(PARETO_THRESHOLD),
        });
    }
    static ɵfac = function NeurasilChartsService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NeurasilChartsService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: NeurasilChartsService, factory: NeurasilChartsService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [], null); })();

class NeurasilDataFilter {
    transform(data, filterText) {
        if (!filterText) {
            return data;
        }
        const filterTerms = filterText.split(',');
        const includeTerms = [];
        const excludeTerms = [];
        const includeColumns = [];
        const excludeColumns = [];
        for (const term of filterTerms) {
            if (term != null && term.length > 1) {
                const normalized = term.trim().toLowerCase();
                if (normalized[0] === "-") {
                    excludeTerms.push(normalized.replace("-", "").trim());
                }
                else if (normalized[0] === "~") {
                    if (normalized[1] === "!") {
                        excludeColumns.push(normalized.replace("~!", "").trim());
                    }
                    else {
                        includeColumns.push(normalized.replace("~", "").trim());
                    }
                }
                else {
                    includeTerms.push(normalized.trim());
                }
            }
        }
        let data_Filtered = data.filter(dataItem => {
            const searchString = Object.values(dataItem).join(" ").toLowerCase().trim();
            let passes = includeTerms.length === 0 || includeTerms.some(t => searchString.includes(t));
            if (passes && excludeTerms.length > 0) {
                passes = !excludeTerms.some(t => searchString.includes(t));
            }
            return passes;
        });
        if (includeColumns.length > 0 && excludeColumns.length > 0) {
            console.warn("Unsupported usage of include & exclude columns. Things may break");
        }
        else if (excludeColumns.length > 0) {
            data_Filtered = structuredClone(data_Filtered);
            for (const dataItem of data_Filtered) {
                const keys = Object.keys(dataItem);
                for (let i = 1; i < keys.length; i++) { // skip the first column
                    const processedKey = keys[i].trim().toLowerCase();
                    if (excludeColumns.some(col => processedKey.includes(col))) {
                        delete dataItem[keys[i]];
                    }
                }
            }
        }
        else if (includeColumns.length > 0) {
            data_Filtered = structuredClone(data_Filtered);
            for (const dataItem of data_Filtered) {
                const keys = Object.keys(dataItem);
                for (let i = 1; i < keys.length; i++) { // skip the first column
                    const processedKey = keys[i].trim().toLowerCase();
                    if (!includeColumns.some(col => processedKey.includes(col))) {
                        delete dataItem[keys[i]];
                    }
                }
            }
        }
        return data_Filtered;
    }
    static ɵfac = function NeurasilDataFilter_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NeurasilDataFilter)(); };
    static ɵpipe = /*@__PURE__*/ i0.ɵɵdefinePipe({ name: "neurasilDataFilter", type: NeurasilDataFilter, pure: true });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilDataFilter, [{
        type: Pipe,
        args: [{
                name: 'neurasilDataFilter',
                pure: true
            }]
    }], null, null); })();

class NeurasilChartsToolbarComponent {
    toolbarProps;
    toolbarPropsChange = new EventEmitter();
    NEURASIL_CHART_TYPE = NEURASIL_CHART_TYPE;
    toolbarPropsChanged(_ev) {
        this.toolbarPropsChange.emit(this.toolbarProps);
    }
    static ɵfac = function NeurasilChartsToolbarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NeurasilChartsToolbarComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NeurasilChartsToolbarComponent, selectors: [["neurasil-charts-toolbar"]], inputs: { toolbarProps: "toolbarProps" }, outputs: { toolbarPropsChange: "toolbarPropsChange" }, decls: 41, vars: 3, consts: [[1, "toolbar-container"], [1, "toolbar"], [1, "filter-textbox-container", "input-group", "input-group-sm"], ["type", "text", "placeholder", "Filters", 1, "filter-textbox", "form-control", "noSelect", 3, "ngModelChange", "change", "ngModel"], [1, "input-group", "input-group-sm", "filter-help"], [1, "tooltip_qd_chartHelper"], [1, "tooltiptext_qd_chartHelper"], [1, "chart-selector-container"], [1, "chart-selector", "input-group", "input-group-sm"], [1, "form-control", 3, "ngModelChange", "ngModel"], ["value", "0"], ["value", "7"], ["value", "2"], ["value", "3"], ["value", "1"], ["value", "4"], ["value", "5"], ["value", "9"], ["value", "6"], [2, "float", "right"], [2, "padding-top", "4px", "padding-right", "15px", "padding-left", "5px"], [2, "zoom", "0.8"], [1, "switch", "tooltip_qd_chartHelper"], ["type", "checkbox", "id", "${this.id}_swapCheckbox", 3, "ngModelChange", "ngModel"], [1, "slider", "round"]], template: function NeurasilChartsToolbarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "input", 3);
            i0.ɵɵtwoWayListener("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_3_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.toolbarProps._datasetFilter, $event) || (ctx.toolbarProps._datasetFilter = $event); return $event; });
            i0.ɵɵlistener("change", function NeurasilChartsToolbarComponent_Template_input_change_3_listener($event) { return ctx.toolbarPropsChanged($event); });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(4, "div", 4)(5, "div", 5);
            i0.ɵɵtext(6, "? ");
            i0.ɵɵelementStart(7, "span", 6);
            i0.ɵɵtext(8, " To filter data, use commas to separate data, add - to exclude data. ");
            i0.ɵɵelement(9, "br")(10, "br");
            i0.ɵɵtext(11, " EITHER use ~ to include columns OR ~! to exclude columns. ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(12, "div", 7)(13, "div", 8)(14, "select", 9);
            i0.ɵɵtwoWayListener("ngModelChange", function NeurasilChartsToolbarComponent_Template_select_ngModelChange_14_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.toolbarProps.chartType, $event) || (ctx.toolbarProps.chartType = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function NeurasilChartsToolbarComponent_Template_select_ngModelChange_14_listener($event) { return ctx.toolbarPropsChanged($event); });
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
            i0.ɵɵtwoWayListener("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_37_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.toolbarProps.swapLabelsAndDatasets, $event) || (ctx.toolbarProps.swapLabelsAndDatasets = $event); return $event; });
            i0.ɵɵlistener("ngModelChange", function NeurasilChartsToolbarComponent_Template_input_ngModelChange_37_listener($event) { return ctx.toolbarPropsChanged($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵelement(38, "span", 24);
            i0.ɵɵelementStart(39, "span", 6);
            i0.ɵɵtext(40, " Swap labels and datasets ");
            i0.ɵɵelementEnd()()()()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtwoWayProperty("ngModel", ctx.toolbarProps._datasetFilter);
            i0.ɵɵadvance(11);
            i0.ɵɵtwoWayProperty("ngModel", ctx.toolbarProps.chartType);
            i0.ɵɵadvance(23);
            i0.ɵɵtwoWayProperty("ngModel", ctx.toolbarProps.swapLabelsAndDatasets);
        } }, dependencies: [FormsModule, i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], styles: [".toolbar-container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-flow:column}.toolbar[_ngcontent-%COMP%]{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container[_ngcontent-%COMP%]{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox[_ngcontent-%COMP%]{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox[_ngcontent-%COMP%]:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help[_ngcontent-%COMP%]{padding-top:4px;float:left}.chart-selector-container[_ngcontent-%COMP%]{float:right}.chart-selector[_ngcontent-%COMP%]{padding-top:4px;float:left}select[_ngcontent-%COMP%]{width:80px}.switch[_ngcontent-%COMP%]{position:relative;display:inline-block;width:60px;height:34px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.slider[_ngcontent-%COMP%]{position:absolute;cursor:pointer;inset:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider[_ngcontent-%COMP%]:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#2196f3}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translate(26px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}.tooltip_qd_chartHelper[_ngcontent-%COMP%]{position:relative;display:inline-block}.tooltip_qd_chartHelper[_ngcontent-%COMP%]   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper[_ngcontent-%COMP%]:hover   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:visible}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsToolbarComponent, [{
        type: Component,
        args: [{ selector: 'neurasil-charts-toolbar', imports: [FormsModule], template: "<div class=\"toolbar-container\" >\r\n    <div class=\"toolbar\">\r\n        <div class=\"filter-textbox-container input-group input-group-sm\">\r\n            <input type=\"text\" class=\"filter-textbox form-control noSelect\" placeholder=\"Filters\" [(ngModel)]=\"toolbarProps._datasetFilter\" (change)=\"toolbarPropsChanged($event)\">\r\n        </div>\r\n        <div class=\"input-group input-group-sm filter-help\" >\r\n            <div class=\"tooltip_qd_chartHelper\">?\r\n                <span class=\"tooltiptext_qd_chartHelper\">\r\n                To filter data, use commas to separate data, add - to exclude data.\r\n                <br> <br> \r\n                EITHER use ~ to include columns OR ~! to exclude columns.\r\n                </span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"chart-selector-container\">\r\n            <div class=\"chart-selector input-group input-group-sm\">\r\n                <select class=\"form-control\" [(ngModel)]=\"toolbarProps.chartType\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                    <option value='0'>Bar Chart</option>\r\n                    <option value='7'>Horizontal Bar</option>               \r\n                    <option value='2'>Stacked Bar Chart</option>\r\n                    <option value='3'>Line Chart</option>\r\n                    <option value='1'>Bar & Line Combo</option>\r\n                    <option value='4'>Pie</option>\r\n                    <option value='5'>Donut</option>\r\n                    <!-- <option value='8'>Pareto (1 dataset)</option> -->\r\n                    <option value='9'>Pareto Analysis</option>\r\n                    <option value='6'>Grid View</option>\r\n\r\n                </select>\r\n            </div>\r\n            <div style=\"float:right\">\r\n                <div style=\"padding-top:4px;padding-right: 15px; padding-left:5px\">\r\n                    <span style=\"zoom:0.8;\">\r\n                        <label class=\"switch tooltip_qd_chartHelper\" >\r\n                        <input type='checkbox' id='${this.id}_swapCheckbox'  [(ngModel)]=\"toolbarProps.swapLabelsAndDatasets\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                            <span class=\"slider round\"></span>\r\n                            <span class=\"tooltiptext_qd_chartHelper\">\r\n                                Swap labels and datasets\r\n                            </span>\r\n                        </label>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".toolbar-container{width:100%;height:100%;display:flex;flex-flow:column}.toolbar{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help{padding-top:4px;float:left}.chart-selector-container{float:right}.chart-selector{padding-top:4px;float:left}select{width:80px}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;inset:0;background-color:#ccc;-webkit-transition:.4s;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;-webkit-transition:.4s;transition:.4s}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{-webkit-transform:translateX(26px);-ms-transform:translateX(26px);transform:translate(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.tooltip_qd_chartHelper{position:relative;display:inline-block}.tooltip_qd_chartHelper .tooltiptext_qd_chartHelper{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper:hover .tooltiptext_qd_chartHelper{visibility:visible}\n"] }]
    }], null, { toolbarProps: [{
            type: Input
        }], toolbarPropsChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NeurasilChartsToolbarComponent, { className: "NeurasilChartsToolbarComponent", filePath: "lib/neurasil-charts-toolbar/neurasil-charts-toolbar.component.ts", lineNumber: 12 }); })();

const _c0 = ["neurasilChartCanvas"];
function NeurasilChartsComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "neurasil-charts-toolbar", 6);
    i0.ɵɵtwoWayListener("toolbarPropsChange", function NeurasilChartsComponent_Conditional_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); i0.ɵɵtwoWayBindingSet(ctx_r1.toolbarProps, $event) || (ctx_r1.toolbarProps = $event); return i0.ɵɵresetView($event); });
    i0.ɵɵlistener("toolbarPropsChange", function NeurasilChartsComponent_Conditional_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.updateToolbarProps($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtwoWayProperty("toolbarProps", ctx_r1.toolbarProps);
} }
function NeurasilChartsComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5)(1, "div", 7);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.noDataMessage, " ");
} }
Chart.register(...registerables);
class NeurasilChartsComponent {
    neurasilChartsService;
    neurasilDataFilter;
    canvas;
    /** Data to plot */
    data;
    /** Show hide toolbar */
    showToolbar = true;
    /** User-defined default chart type */
    chartType = null;
    /** Show data on a secondary Y-axis */
    useAltAxis = true;
    /** Set a chart title */
    chartTitle = "";
    /** X-Axis text */
    xAxisLabelText = "";
    /** Y-Axis text */
    yAxisLabelText = "";
    /** Alt-Y-Axis text   */
    yAxisLabelText_Alt = "";
    colorPalette;
    hoverOpacity = 0.9;
    defaultOpacity = 0.5;
    hoverOpacity_border = 1;
    defaultOpacity_border = 1;
    /** Swap Dataset and Labels */
    swapLabelsAndDatasets;
    /** Filter data */
    globalFilter = "";
    /** Show data labels
     * @param showDataLabels default: false
    */
    showDataLabels = false;
    noDataMessage = "No data to display. Check your filters.";
    additionalOpts_Plugins = {};
    additionalOpts_Elements = {};
    useLogScale = false;
    /** Emits event from changing Chart type from toolbar */
    chartTypeChange = new EventEmitter();
    showToolbarChange = new EventEmitter();
    /** Emits event from toggling the swap label/data switch from toolbar */
    swapLabelsAndDatasetsChange = new EventEmitter();
    /** Emits data from clicked chart item */
    dataOnClick = new EventEmitter();
    /** default toolbar props */
    toolbarProps = {
        chartType: this.chartType ?? NEURASIL_CHART_TYPE.BAR,
        _datasetFilter: "",
        swapLabelsAndDatasets: false
    };
    _canvas;
    hasData;
    constructor(neurasilChartsService, neurasilDataFilter) {
        this.neurasilChartsService = neurasilChartsService;
        this.neurasilDataFilter = neurasilDataFilter;
    }
    ngOnInit() {
        if (this.chartType) {
            this.toolbarProps.chartType = this.chartType;
        }
        if (this.swapLabelsAndDatasets) {
            this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets;
        }
        this.hasData = !!(this.data && this.data.length > 0);
    }
    ngAfterViewInit() {
        this.drawChart();
    }
    ngOnChanges(_changes) {
        this.drawChart();
    }
    updateToolbarProps(_ev) {
        this.chartTypeChange.emit(this.toolbarProps.chartType);
        this.showToolbarChange.emit(this.showToolbar);
        this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
        this.drawChart();
    }
    drawChart(isPrinting = false) {
        if (this._canvas) {
            this._canvas.destroy();
        }
        if (!this.canvas) {
            return;
        }
        const ctx = this.canvas.nativeElement.getContext('2d');
        const filterString = [this.globalFilter, this.toolbarProps._datasetFilter]
            .filter(Boolean)
            .join(',');
        const filteredData = this.neurasilDataFilter.transform(this.data, filterString);
        this.hasData = !!(filteredData && filteredData.length > 0);
        if (!this.hasData) {
            return;
        }
        const o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
        const props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject, this.useLogScale, this.colorPalette, this.hoverOpacity, this.defaultOpacity, this.hoverOpacity_border, this.defaultOpacity_border);
        if (this.toolbarProps.chartType === NEURASIL_CHART_TYPE.STACKED_PARETO) {
            this.neurasilChartsService.performParetoAnalysis(props);
        }
        // emit onclick event data
        const swapped = this.swapLabelsAndDatasets;
        props.options.onClick = function (_ev, element, chartObj) {
            if (element[0]) {
                const clickData = element[0];
                const xAxisVal = props.data.labels[clickData.index];
                const dataset = props.data.datasets[clickData.datasetIndex];
                const datasetLabel = dataset.label;
                const datasetVal = dataset.data[clickData.index];
                const customDataObj = {
                    val: datasetVal,
                    dataLabel: swapped ? datasetLabel : xAxisVal,
                    datasetLabel: swapped ? xAxisVal : datasetLabel
                };
                this.dataOnClick?.emit({
                    event: _ev,
                    element,
                    chartInstance: chartObj,
                    data: customDataObj
                });
            }
        }.bind(this);
        if (this.showDataLabels || isPrinting) {
            props.plugins.push(ChartDataLabels);
        }
        if (!props.options.plugins) {
            props.options.plugins = {};
        }
        if (this.additionalOpts_Plugins) {
            props.options.plugins = { ...props.options.plugins, ...this.additionalOpts_Plugins };
        }
        if (!props.options.elements) {
            props.options.elements = {};
        }
        props.options.elements = { ...props.options.elements, ...this.additionalOpts_Elements };
        props.options.plugins.datalabels = {
            formatter: function (value) {
                if (value == null) {
                    return "";
                }
                const absVal = Math.abs(value);
                if (absVal === 0) {
                    return value;
                }
                if (absVal >= 0.001) {
                    return Math.round(value * 1000) / 1000;
                }
                return value > 0 ? "< 0.001" : "> -0.001";
            }
        };
        const isPieOrDonut = this.toolbarProps.chartType === NEURASIL_CHART_TYPE.DONUT || this.toolbarProps.chartType === NEURASIL_CHART_TYPE.PIE;
        if (isPieOrDonut) {
            props.options.plugins.tooltip = {
                callbacks: {
                    title: (tooltipItems) => tooltipItems[0].label,
                    label: (tooltipItem) => {
                        const label = tooltipItem.dataset.label ? tooltipItem.dataset.label + ': ' : '';
                        return label + `${tooltipItem.parsed}`;
                    }
                }
            };
        }
        else {
            props.options.plugins.tooltip = {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label ? context.dataset.label + ': ' : '';
                        return context.parsed.y !== null ? label + `${context.parsed.y}` : label;
                    }
                }
            };
        }
        this._canvas = new Chart(ctx, props);
    }
    static ɵfac = function NeurasilChartsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NeurasilChartsComponent)(i0.ɵɵdirectiveInject(NeurasilChartsService), i0.ɵɵdirectiveInject(NeurasilDataFilter)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: NeurasilChartsComponent, selectors: [["neurasil-charts"]], viewQuery: function NeurasilChartsComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
        } }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", colorPalette: "colorPalette", hoverOpacity: "hoverOpacity", defaultOpacity: "defaultOpacity", hoverOpacity_border: "hoverOpacity_border", defaultOpacity_border: "defaultOpacity_border", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter", showDataLabels: "showDataLabels", noDataMessage: "noDataMessage", additionalOpts_Plugins: "additionalOpts_Plugins", additionalOpts_Elements: "additionalOpts_Elements", useLogScale: "useLogScale" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [["neurasilChartCanvas", ""], [1, "component-wrapper"], [1, "toolbar-wrapper"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], [1, "overlay"], [3, "toolbarPropsChange", "toolbarProps"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1);
            i0.ɵɵconditionalCreate(1, NeurasilChartsComponent_Conditional_1_Template, 2, 1, "div", 2);
            i0.ɵɵelementStart(2, "div", 3);
            i0.ɵɵelement(3, "canvas", 4, 0);
            i0.ɵɵconditionalCreate(5, NeurasilChartsComponent_Conditional_5_Template, 3, 1, "div", 5);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showToolbar ? 1 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngClass", ctx.hasData ? "" : "canvas-hidden");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.hasData ? 5 : -1);
        } }, dependencies: [NeurasilChartsToolbarComponent, NgClass], styles: [".canvas-wrapper[_ngcontent-%COMP%], neurasil-charts-toolbar[_ngcontent-%COMP%]{display:block}.component-wrapper[_ngcontent-%COMP%]{width:100%;height:100%}.toolbar-wrapper[_ngcontent-%COMP%]{display:block;height:50px}.component-wrapper[_ngcontent-%COMP%]{display:flex;flex-flow:column;height:100%}.canvas-wrapper[_ngcontent-%COMP%]{flex:1}.canvas-hidden[_ngcontent-%COMP%]{display:none}.overlay[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#0000001a}.overlay-contents[_ngcontent-%COMP%]{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsComponent, [{
        type: Component,
        args: [{ selector: 'neurasil-charts', providers: [NeurasilDataFilter], imports: [NeurasilChartsToolbarComponent, NgClass], template: "\n<div class=\"component-wrapper\">\n  @if (showToolbar) {\n    <div class=\"toolbar-wrapper\">\n      <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\n    </div>\n  }\n  <div class=\"canvas-wrapper\">\n    <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\n    @if (!hasData) {\n      <div class=\"overlay\">\n        <div class=\"overlay-contents\">\n          {{noDataMessage}}\n        </div>\n      </div>\n    }\n  </div>\n</div>\n", styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;height:100%}.toolbar-wrapper{display:block;height:50px}.component-wrapper{display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:#0000001a}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}\n"] }]
    }], () => [{ type: NeurasilChartsService }, { type: NeurasilDataFilter }], { canvas: [{
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
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(NeurasilChartsComponent, { className: "NeurasilChartsComponent", filePath: "lib/neurasil-charts.component.ts", lineNumber: 21 }); })();

class NeurasilChartsModule {
    static ɵfac = function NeurasilChartsModule_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || NeurasilChartsModule)(); };
    static ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: NeurasilChartsModule });
    static ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({ imports: [CommonModule,
            FormsModule,
            NeurasilChartsComponent,
            NeurasilChartsToolbarComponent] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsModule, [{
        type: NgModule,
        args: [{
                imports: [
                    CommonModule,
                    FormsModule,
                    NeurasilChartsComponent,
                    NeurasilChartsToolbarComponent,
                    NeurasilDataFilter
                ],
                exports: [NeurasilChartsComponent, NeurasilDataFilter]
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NeurasilChartsModule, { imports: [CommonModule,
        FormsModule,
        NeurasilChartsComponent,
        NeurasilChartsToolbarComponent,
        NeurasilDataFilter], exports: [NeurasilChartsComponent, NeurasilDataFilter] }); })();

/*
 * Public API Surface of neurasil-charts
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NEURASIL_CHART_TYPE, NeurasilChartsComponent, NeurasilChartsModule, NeurasilChartsService, NeurasilDataFilter };
//# sourceMappingURL=neurasil-charts.mjs.map
