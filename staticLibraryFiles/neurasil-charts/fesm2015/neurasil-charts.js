import { Injectable, ɵɵdefineInjectable, Pipe, EventEmitter, Component, ViewChild, Input, Output, NgModule } from '@angular/core';
import * as Chart from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/NeurasilChartType.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const NEURASIL_CHART_TYPE = {
    BAR: 0,
    BAR_LINE: 1,
    STACKED: 2,
    LINE: 3,
    PIE: 4,
    DONUT: 5,
    GRID: 6,
    HORIZONTAL_BAR: 7,
    STACKED_PARETO: 9,
};
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.BAR] = 'BAR';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.BAR_LINE] = 'BAR_LINE';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.STACKED] = 'STACKED';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.LINE] = 'LINE';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.PIE] = 'PIE';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.DONUT] = 'DONUT';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.GRID] = 'GRID';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.HORIZONTAL_BAR] = 'HORIZONTAL_BAR';
NEURASIL_CHART_TYPE[NEURASIL_CHART_TYPE.STACKED_PARETO] = 'STACKED_PARETO';

/**
 * @fileoverview added by tsickle
 * Generated from: lib/models/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NeurasilChartsService {
    constructor() { }
    /**
     * @param {?} chartType
     * @param {?} incomingData
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    parseDataFromDatasource(chartType, incomingData, swapLabelsAndDatasets) {
        /** @type {?} */
        let returnData = {
            _cornerstone: "",
            _formatObject: null,
            data: null
        };
        /** @type {?} */
        let data = JSON.parse(JSON.stringify(incomingData));
        // make a copy of the data
        /** @type {?} */
        let k_arr_Temp = Object.keys(data[0]);
        /** @type {?} */
        let k_arr = Object.keys(data[0]);
        /** @type {?} */
        let cDat = {};
        for (let i = 0; i < k_arr.length; i++) {
            /** @type {?} */
            let currKey = k_arr[i];
            cDat[currKey] = [];
            for (var j in data) {
                cDat[k_arr[i]].push(data[j][currKey]);
            }
        }
        /** @type {?} */
        let formatObj = {};
        /** @type {?} */
        let k_arr_new = Object.keys(cDat);
        returnData._cornerstone = k_arr_new[0];
        for (let i = 0; i < k_arr_new.length; i++) { // for each key in formatted object
            // for each key in formatted object
            /** @type {?} */
            let currKey = k_arr_new[i];
            formatObj[currKey] = {};
            if (currKey != returnData._cornerstone) {
                /** @type {?} */
                let testItem;
                for (var j in cDat[currKey]) {
                    if (cDat[currKey][j]) { // set test item and break if the value is not null
                        testItem = cDat[currKey][j];
                        break;
                    }
                }
                /** @type {?} */
                let prefix = "";
                /** @type {?} */
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
                formatObj[currKey] = {
                    prefix: prefix,
                    suffix: suffix
                };
                // format each data in the individual arrays
                for (var k in cDat[currKey]) {
                    if (prefix != "") {
                        cDat[currKey][k] = cDat[currKey][k].replace(prefix, "");
                    }
                    if (suffix != "") {
                        cDat[currKey][k] = cDat[currKey][k].replace(suffix, "");
                    }
                    //newStr = cDat
                    //replaceData.push()
                }
            }
            else if (currKey == returnData._cornerstone) {
                formatObj[currKey] = {
                    prefix: "",
                    suffix: ""
                };
            }
        }
        if (!swapLabelsAndDatasets) {
            // do nothing;
            // return cDat;
        }
        else {
            /** @type {?} */
            let cDat_New = {};
            cDat_New[returnData._cornerstone] = Object.keys(cDat);
            /** @type {?} */
            let index = cDat_New[returnData._cornerstone].indexOf(returnData._cornerstone);
            if (index > -1) {
                cDat_New[returnData._cornerstone].splice(index, 1);
            }
            for (let i = 0; i < cDat[returnData._cornerstone].length; i++) {
                cDat_New[cDat[returnData._cornerstone][i]] = [];
                for (var j in cDat_New[returnData._cornerstone]) {
                    cDat_New[cDat[returnData._cornerstone][i]].push(cDat[cDat_New[returnData._cornerstone][j]][i]);
                }
            }
            //return cDat_New;
            cDat = cDat_New; // reassign to cDat
        }
        if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            // Add suffixes to auto-generated lines
            formatObj["Pareto"] = {
                prefix: "",
                suffix: "%"
            };
            formatObj["80% line"] = {
                prefix: "",
                suffix: "%"
            };
        }
        /**
         * @param {?} value
         * @return {?}
         */
        function isNumber(value) {
            return ((value != null) && !isNaN(Number(value.toString())));
        }
        returnData._formatObject = formatObj;
        returnData.data = cDat;
        //console.log(cDat);
        return returnData;
    }
    /**
     * @param {?} chartType
     * @param {?} chartData
     * @param {?} useAltAxis
     * @param {?} title
     * @param {?} yAxisLabelText
     * @param {?} yAxisLabelText_Alt
     * @param {?} xAxisLabelText
     * @param {?} cornerstone
     * @param {?} swapLabelsAndDatasets
     * @param {?} formatObject
     * @return {?}
     */
    chartObjectBuilder(chartType, chartData, useAltAxis, title, yAxisLabelText, yAxisLabelText_Alt, xAxisLabelText, cornerstone, swapLabelsAndDatasets, formatObject) {
        //const chartTypes = NexusChartjsChart.chartTypes;
        if ((chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.LINE || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) && useAltAxis == true) {
            console.warn("You have enabled alternate axis on a (unsupported) chart type. It has been set to false");
            useAltAxis = false;
        }
        if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            yAxisLabelText_Alt = "Pareto %";
        }
        /** @type {?} */
        let options = {
            maintainAspectRatio: false,
            responsive: true,
        };
        if (title) {
            options.title = {
                display: true,
                text: title
            };
        }
        /** @type {?} */
        let yAxisLabel = { display: false, labelString: "" };
        if (yAxisLabelText) {
            yAxisLabel.display = true;
            yAxisLabel.labelString = yAxisLabelText;
        }
        /** @type {?} */
        let yAxisLabel_Alt = { display: false, labelString: "" };
        if (yAxisLabelText_Alt) {
            yAxisLabel_Alt.display = true;
            yAxisLabel_Alt.labelString = yAxisLabelText_Alt;
        }
        /** @type {?} */
        let xAxisLabel = { display: false, labelString: "" };
        if (xAxisLabelText) {
            xAxisLabel.display = true;
            xAxisLabel.labelString = xAxisLabelText;
        }
        if (chartType != NEURASIL_CHART_TYPE.PIE && chartType != NEURASIL_CHART_TYPE.DONUT) {
            if (chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                options.scales = {
                    xAxes: [{
                            stacked: true,
                            scaleLabel: xAxisLabel
                        }],
                    yAxes: [{
                            stacked: true,
                            scaleLabel: yAxisLabel
                        }]
                };
                if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    /** @type {?} */
                    let altAxisObj = {
                        id: 'yAxis-alt',
                        display: 'auto',
                        ticks: {
                            beginAtZero: true,
                        },
                        position: 'right',
                        scaleLabel: yAxisLabel_Alt
                    };
                    altAxisObj.ticks.min = 0;
                    altAxisObj.ticks.max = 100;
                    altAxisObj.ticks.stepSize = 80;
                    options.scales.yAxes.push(altAxisObj);
                }
            }
            else {
                options.scales = {
                    xAxes: [{
                            scaleLabel: xAxisLabel
                        }],
                    yAxes: [{
                            id: 'yAxis',
                            ticks: {
                                beginAtZero: true,
                            },
                            scaleLabel: yAxisLabel
                        },]
                };
                if (useAltAxis) {
                    /** @type {?} */
                    let altAxisObj = {
                        id: 'yAxis-alt',
                        display: 'auto',
                        ticks: {
                            beginAtZero: true,
                        },
                        position: 'right',
                        scaleLabel: yAxisLabel_Alt
                    };
                    if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                        altAxisObj.ticks.min = 0;
                        altAxisObj.ticks.max = 100;
                        altAxisObj.ticks.stepSize = 80;
                    }
                    options.scales.yAxes.push(altAxisObj);
                }
            }
        }
        /** @type {?} */
        let type;
        if (chartType == NEURASIL_CHART_TYPE.LINE) {
            type = 'line';
        }
        else if (chartType == NEURASIL_CHART_TYPE.BAR ||
            chartType == NEURASIL_CHART_TYPE.BAR_LINE ||
            chartType == NEURASIL_CHART_TYPE.STACKED ||
            chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            type = 'bar';
        }
        else if (chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
            type = 'horizontalBar';
        }
        else if (chartType == NEURASIL_CHART_TYPE.PIE) {
            type = 'pie';
        }
        else if (chartType == NEURASIL_CHART_TYPE.DONUT) {
            type = 'doughnut';
        }
        /** @type {?} */
        let THIS = this;
        // tooltip & title prefix/suffix addition. Title uses default configs for bar /line
        options.tooltips = {};
        options.tooltips.callbacks = {};
        if (chartType == NEURASIL_CHART_TYPE.BAR ||
            chartType == NEURASIL_CHART_TYPE.BAR_LINE ||
            chartType == NEURASIL_CHART_TYPE.LINE ||
            chartType == NEURASIL_CHART_TYPE.STACKED ||
            chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            options.tooltips.callbacks.label = (/**
             * @param {?} tooltipItem
             * @param {?} data
             * @return {?}
             */
            function (tooltipItem, data) {
                /** @type {?} */
                var label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                if (swapLabelsAndDatasets) {
                    label += `${formatObject[tooltipItem.xLabel].prefix}` + tooltipItem.yLabel + `${formatObject[tooltipItem.xLabel].suffix}`;
                }
                else {
                    /** @type {?} */
                    let objKeys = Object.keys(formatObject);
                    /** @type {?} */
                    let key = objKeys[tooltipItem.datasetIndex + 1];
                    /** @type {?} */
                    let formatObj = formatObject[key];
                    label += `${formatObj.prefix}` + tooltipItem.yLabel + `${formatObj.suffix}`;
                    ;
                }
                return label;
            });
        }
        else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) {
            options.tooltips.callbacks.label = (/**
             * @param {?} tooltipItem
             * @param {?} data
             * @return {?}
             */
            function (tooltipItem, data) {
                /** @type {?} */
                var label = data.labels[tooltipItem.index];
                if (label) {
                    label += ': ';
                }
                /** @type {?} */
                let formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
                return label;
            });
            options.tooltips.callbacks.title = (/**
             * @param {?} tooltipItem
             * @param {?} data
             * @return {?}
             */
            function (tooltipItem, data) {
                return data.datasets[tooltipItem[0].datasetIndex].label;
            });
        }
        else if (chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
            options.tooltips.callbacks.label = (/**
             * @param {?} tooltipItem
             * @param {?} data
             * @return {?}
             */
            function (tooltipItem, data) {
                /** @type {?} */
                var label = data.datasets[tooltipItem.datasetIndex].label;
                if (label) {
                    label += ': ';
                }
                /** @type {?} */
                let formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
                return label;
            });
            options.tooltips.callbacks.title = (/**
             * @param {?} tooltipItem
             * @param {?} data
             * @return {?}
             */
            function (tooltipItem, data) {
                return tooltipItem[0].yLabel;
            });
        }
        /** @type {?} */
        let returnOpts = {
            type: type,
            data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets),
            options: options
        };
        return returnOpts;
    }
    /**
     * @param {?} chartData
     * @param {?} useAltAxis
     * @param {?} chartType
     * @param {?} cornerstone
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    dataParser(chartData, useAltAxis /*boolean*/, chartType /*chartType enum*/, cornerstone, swapLabelsAndDatasets) {
        // helper function to get color array for chart. cycles through when 
        /**
         * @param {?} opacity
         * @param {?} noOfColors
         * @return {?}
         */
        function getPalette(opacity, noOfColors) {
            /** @type {?} */
            let colors = [
                `rgba(199,233,180,${opacity})`,
                `rgba(127,205,187,${opacity})`,
                `rgba(65,182,196,${opacity})`,
                `rgba(29,145,192,${opacity})`,
                `rgba(34,94,168,${opacity})`,
                `rgba(37,52,148,${opacity})`,
                `rgba(8,29,88,${opacity})`,
                `rgba(254,178,76,${opacity})`,
                `rgba(253,141,60,${opacity})`,
                `rgba(252,78,42,${opacity})`,
                `rgba(227,26,28,${opacity})`,
                `rgba(189,0,38,${opacity})`,
                `rgba(128,0,38,${opacity})`
            ];
            if (noOfColors > colors.length) { // if more colors are required than available, cycle through beginning again
                // if more colors are required than available, cycle through beginning again
                /** @type {?} */
                let diff = noOfColors - colors.length;
                /** @type {?} */
                let colorsLength = colors.length;
                for (var i = 0; i <= diff; i) { // NO INCREMENT HERE
                    for (var j = 0; j < colorsLength; j++) {
                        colors.push(colors[j]);
                        i++; // INCREMENT HERE
                    }
                }
            }
            return colors;
        }
        /** @type {?} */
        let colorPalatte;
        /** @type {?} */
        let bgColorPalatte;
        if (!swapLabelsAndDatasets) {
            colorPalatte = getPalette(1, chartData[cornerstone].length);
            bgColorPalatte = getPalette(0.3, chartData[cornerstone].length);
        }
        else {
            colorPalatte = getPalette(1, Object.keys(chartData).length);
            bgColorPalatte = getPalette(0.3, Object.keys(chartData).length);
        }
        /** @type {?} */
        let dataSets = [];
        /** @type {?} */
        let objKeys = Object.keys(chartData);
        /** @type {?} */
        let index = objKeys.indexOf(cornerstone);
        if (index > -1) {
            objKeys.splice(index, 1);
        }
        for (let i = 0; i < objKeys.length; i++) {
            /** @type {?} */
            let yAxis = 'yAxis';
            if (useAltAxis) {
                if (i > 0) {
                    yAxis += '-alt';
                }
            }
            /** @type {?} */
            let dataSet = {
                label: objKeys[i],
                data: chartData[objKeys[i]],
                backgroundColor: bgColorPalatte[i],
                borderColor: colorPalatte[i],
                borderWidth: 2
            };
            if (chartType == NEURASIL_CHART_TYPE.BAR_LINE) { // ignores stacked and bar options. Makes assumption that only 1st dataset is bar
                if (i == 0) {
                    dataSet.type = 'bar';
                }
                else {
                    dataSet.type = 'line';
                }
            }
            if (chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                dataSet.backgroundColor = bgColorPalatte[i];
                dataSet.borderColor = colorPalatte[i];
            }
            else if (chartType == NEURASIL_CHART_TYPE.BAR_LINE || chartType == NEURASIL_CHART_TYPE.LINE) {
                if (dataSet.type == 'bar') {
                    dataSet.backgroundColor = bgColorPalatte[i];
                    dataSet.borderColor = colorPalatte[i];
                }
                else {
                    dataSet.borderColor = colorPalatte[i];
                    dataSet.backgroundColor = 'rgba(0,0,0,0)';
                }
            }
            else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) { // overwrite single color assignment to array.
                dataSet.backgroundColor = bgColorPalatte;
                dataSet.borderColor = colorPalatte;
            }
            if (chartType != NEURASIL_CHART_TYPE.PIE && chartType != NEURASIL_CHART_TYPE.DONUT) {
                if (chartType != NEURASIL_CHART_TYPE.STACKED && chartType != NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    dataSet.yAxisID = yAxis;
                }
            }
            dataSets.push(dataSet);
        }
        /** @type {?} */
        let returnData = {
            labels: chartData[cornerstone],
            datasets: dataSets
        };
        return returnData;
    }
    /**
     * @param {?} props
     * @return {?}
     */
    performParetoAnalysis(props) {
        //modify chart object
        /** @type {?} */
        let localSumArr = [];
        /** @type {?} */
        let totalSum = 0;
        for (let j = 0; j < props.data.datasets[0].data.length; j++) {
            /** @type {?} */
            let sum = 0;
            for (let i = 0; i < props.data.datasets.length; i++) {
                /** @type {?} */
                let val = parseFloat(props.data.datasets[i].data[j]);
                if (isNaN(val)) {
                    val = 0;
                }
                sum += val;
            }
            localSumArr.push(sum);
            totalSum += sum;
        }
        //sort data by local sum
        /** @type {?} */
        let newArr = [];
        for (let i = 0; i < localSumArr.length; i++) {
            /** @type {?} */
            let o = {
                sum: localSumArr[i],
                labels: props.data.labels[i],
            };
            for (let j = 0; j < props.data.datasets.length; j++) {
                o[j] = props.data.datasets[j].data[i];
            }
            newArr.push(o);
        }
        //sort descending
        newArr.sort((/**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        function (a, b) {
            return ((a.sum < b.sum) ? 1 : ((a.sum == b.sum) ? 0 : -1));
        }));
        //rebuild and reassign labels array
        /** @type {?} */
        let newLabelsArray = [];
        for (let i = 0; i < newArr.length; i++) {
            newLabelsArray.push(newArr[i]["labels"]);
        }
        props.data.labels = newLabelsArray;
        //rebuild and reassign data array for each dataset
        for (let j = 0; j < props.data.datasets.length; j++) {
            /** @type {?} */
            let data = [];
            for (let i = 0; i < newArr.length; i++) {
                data.push(newArr[i][j]);
            }
            props.data.datasets[j].data = data;
        }
        /** @type {?} */
        let sortedlocalSumArr = [];
        for (let i = 0; i < newArr.length; i++) {
            sortedlocalSumArr.push(newArr[i].sum);
        }
        // calculate and push pareto line, also populate 80%line array
        /** @type {?} */
        let rollingSum = 0;
        /** @type {?} */
        let paretoLineValues = [];
        /** @type {?} */
        let eightyPercentLine = [];
        for (let i = 0; i < sortedlocalSumArr.length; i++) {
            rollingSum += sortedlocalSumArr[i];
            /** @type {?} */
            let paretoVal = rollingSum / totalSum * 100;
            paretoLineValues.push(Math.floor(paretoVal * 100) / 100);
            eightyPercentLine.push(80);
        }
        props.data.datasets.push({
            "label": "Pareto",
            "data": paretoLineValues,
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "rgba(0,0,0,0.8)",
            "borderWidth": 2,
            "type": "line",
            "yAxisID": "yAxis-alt"
        });
        // push 80% line
        props.data.datasets.push({
            "label": "80% line",
            "data": eightyPercentLine,
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "rgba(0,0,0,0.8)",
            "borderWidth": 2,
            "type": "line",
            "yAxisID": "yAxis-alt"
        });
    }
}
NeurasilChartsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
NeurasilChartsService.ctorParameters = () => [];
/** @nocollapse */ NeurasilChartsService.ngInjectableDef = ɵɵdefineInjectable({ factory: function NeurasilChartsService_Factory() { return new NeurasilChartsService(); }, token: NeurasilChartsService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: lib/pipes/neurasil-data-filter/neurasil-data-filter.pipe.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NeurasilDataFilter {
    /**
     * @param {?} data
     * @param {?} filterText
     * @return {?}
     */
    transform(data, filterText) {
        if (filterText === "" || filterText === null || filterText === undefined) {
            return data;
        }
        else {
            if (filterText) {
                /** @type {?} */
                let filterTerms = filterText.split(',');
                /** @type {?} */
                let includeTerms = [];
                /** @type {?} */
                let excludeTerms = [];
                /** @type {?} */
                let includeColumns = [];
                /** @type {?} */
                let excludeColumns = [];
                for (let i in filterTerms) {
                    if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
                        /** @type {?} */
                        let term = filterTerms[i].trim().toLowerCase();
                        if (term[0] == "-") {
                            excludeTerms.push(term.replace("-", "").trim());
                        }
                        else if (term[0] == "~") {
                            if (term[1] == "!") {
                                excludeColumns.push(term.replace("~!", "").trim());
                            }
                            else {
                                includeColumns.push(term.replace("~", "").trim());
                            }
                        }
                        else {
                            includeTerms.push(term.trim());
                        }
                    }
                }
                /** @type {?} */
                let data_Filtered = data.filter((/**
                 * @param {?} dataItem
                 * @return {?}
                 */
                function (dataItem) {
                    /** @type {?} */
                    let k_arr = Object.keys(dataItem);
                    /** @type {?} */
                    let searchString = "";
                    for (let i in k_arr) {
                        /** @type {?} */
                        let currKey = k_arr[i];
                        /** @type {?} */
                        let value = dataItem[currKey];
                        searchString += value + " ";
                    }
                    searchString = searchString.toLowerCase().trim();
                    /** @type {?} */
                    let currentPassingStatus = false;
                    if (includeTerms.length > 0) {
                        for (let i in includeTerms) {
                            if (searchString.includes(includeTerms[i])) {
                                currentPassingStatus = true;
                                break;
                            }
                        }
                    }
                    else {
                        currentPassingStatus = true;
                    }
                    if (excludeTerms.length > 0 && currentPassingStatus) {
                        for (let i in excludeTerms) {
                            if (searchString.includes(excludeTerms[i])) {
                                currentPassingStatus = false;
                                break;
                            }
                        }
                    }
                    if (currentPassingStatus) {
                        return dataItem;
                    }
                }));
                if (includeColumns.length > 0 && excludeColumns.length > 0) {
                    window.alert("Unsupported usage of include & exclude columns. Things may break");
                }
                //after filtering is complete, remove columns from clone of data
                else if (excludeColumns.length > 0) {
                    data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
                    //console.log("here")
                    for (var h in data_Filtered) {
                        /** @type {?} */
                        let dataItem = data_Filtered[h];
                        /** @type {?} */
                        let k_arr = Object.keys(dataItem);
                        //for (let i in k_arr) {
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Do not allow user to delete first column
                                for (var j in excludeColumns) {
                                    /** @type {?} */
                                    let processedKey = k_arr[i].trim().toLowerCase();
                                    if (processedKey.includes(excludeColumns[j])) {
                                        delete dataItem[k_arr[i]];
                                    }
                                }
                            }
                        }
                    }
                }
                else if (includeColumns.length > 0) {
                    data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
                    for (var h in data_Filtered) {
                        /** @type {?} */
                        let dataItem = data_Filtered[h];
                        /** @type {?} */
                        let k_arr = Object.keys(dataItem);
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Needed?
                                // skip the first column. Needed?
                                /** @type {?} */
                                let processedKey = k_arr[i].trim().toLowerCase();
                                /** @type {?} */
                                let keepColumn = false;
                                for (var j in includeColumns) {
                                    if (processedKey.includes(includeColumns[j])) {
                                        keepColumn = true;
                                    }
                                    // if (!processedKey.includes(includeColumns[j])) {
                                    //     delete dataItem[k_arr[i]];
                                    // }
                                }
                                if (!keepColumn) {
                                    delete dataItem[k_arr[i]];
                                }
                            }
                        }
                    }
                }
                return data_Filtered;
            }
            return data; // if no filter, return original data
        }
    }
}
NeurasilDataFilter.decorators = [
    { type: Pipe, args: [{
                name: 'neurasilDataFilter',
                pure: true
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: lib/pipes/index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NeurasilChartsComponent {
    // for the purpose of checking length in html template
    /**
     * @param {?} neurasilChartsService
     * @param {?} neurasilDataFilter
     */
    constructor(neurasilChartsService, neurasilDataFilter) {
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
    ngOnInit() {
        if (this.chartType) {
            this.toolbarProps.chartType = this.chartType;
        }
        if (this.swapLabelsAndDatasets) {
            this.toolbarProps.swapLabelsAndDatasets = this.swapLabelsAndDatasets;
        }
        this.hasData = (this.data && this.data.length > 0);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.drawChart();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            console.log(changes);
            this.drawChart();
        }
    }
    /**
     * @param {?} ev
     * @return {?}
     */
    updateToolbarProps(ev) {
        console.log(">>>", ev);
        console.log(this.toolbarProps);
        this.chartTypeChange.emit(this.toolbarProps.chartType);
        this.showToolbarChange.emit(this.showToolbar);
        this.swapLabelsAndDatasetsChange.emit(this.toolbarProps.swapLabelsAndDatasets);
        this.drawChart();
    }
    /**
     * @return {?}
     */
    drawChart() {
        if (this._canvas) {
            this._canvas.destroy();
        }
        if (this.canvas) {
            /** @type {?} */
            var ctx = this.canvas.nativeElement.getContext('2d');
            /** @type {?} */
            let filterString = "";
            if (this.globalFilter.length > 0) {
                filterString += this.globalFilter + ",";
            }
            filterString += this.toolbarProps._datasetFilter;
            /** @type {?} */
            let filteredData = this.neurasilDataFilter.transform(this.data, filterString);
            console.log(filteredData);
            this.hasData = (filteredData && filteredData.length > 0);
            if (this.hasData) {
                /** @type {?} */
                let o = this.neurasilChartsService.parseDataFromDatasource(this.toolbarProps.chartType, filteredData, this.toolbarProps.swapLabelsAndDatasets);
                /** @type {?} */
                let props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject);
                if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
                }
                this._canvas = new Chart(ctx, props);
            }
        }
    }
}
NeurasilChartsComponent.decorators = [
    { type: Component, args: [{
                selector: 'neurasil-charts',
                template: "\r\n<div class=\"component-wrapper\">\r\n    <div class=\"toolbar-wrapper\" *ngIf=\"showToolbar\">\r\n        <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\r\n    </div>\r\n    <div class=\"canvas-wrapper\">\r\n        <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\r\n        <div class=\"overlay\" *ngIf=\"!hasData\">\r\n            <div class=\"overlay-contents\">\r\n                No data to display. Check your filters.\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                providers: [NeurasilDataFilter],
                styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex-grow:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:rgba(0,0,0,.1)}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"]
            }] }
];
/** @nocollapse */
NeurasilChartsComponent.ctorParameters = () => [
    { type: NeurasilChartsService },
    { type: NeurasilDataFilter }
];
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts-toolbar/neurasil-charts-toolbar.component.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NeurasilChartsToolbarComponent {
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

/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class NeurasilChartsModule {
}
NeurasilChartsModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NeurasilChartsComponent,
                    NeurasilChartsToolbarComponent,
                    NeurasilDataFilter
                ],
                imports: [
                    CommonModule,
                    FormsModule
                ],
                exports: [NeurasilChartsComponent, NeurasilDataFilter]
            },] }
];

/**
 * @fileoverview added by tsickle
 * Generated from: public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: neurasil-charts.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { NEURASIL_CHART_TYPE, NeurasilChartsComponent, NeurasilChartsModule, NeurasilChartsService, NeurasilDataFilter, NeurasilChartsToolbarComponent as ɵa, NeurasilDataFilter as ɵb };
//# sourceMappingURL=neurasil-charts.js.map
