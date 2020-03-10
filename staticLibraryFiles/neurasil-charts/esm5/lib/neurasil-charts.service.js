/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
import * as i0 from "@angular/core";
var NeurasilChartsService = /** @class */ (function () {
    function NeurasilChartsService() {
    }
    /**
     * @param {?} chartType
     * @param {?} incomingData
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    NeurasilChartsService.prototype.parseDataFromDatasource = /**
     * @param {?} chartType
     * @param {?} incomingData
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    function (chartType, incomingData, swapLabelsAndDatasets) {
        /** @type {?} */
        var returnData = {
            _cornerstone: "",
            _formatObject: null,
            data: null
        };
        /** @type {?} */
        var data = JSON.parse(JSON.stringify(incomingData));
        // make a copy of the data
        /** @type {?} */
        var k_arr_Temp = Object.keys(data[0]);
        /** @type {?} */
        var k_arr = Object.keys(data[0]);
        /** @type {?} */
        var cDat = {};
        for (var i = 0; i < k_arr.length; i++) {
            /** @type {?} */
            var currKey = k_arr[i];
            cDat[currKey] = [];
            for (var j in data) {
                cDat[k_arr[i]].push(data[j][currKey]);
            }
        }
        /** @type {?} */
        var formatObj = {};
        /** @type {?} */
        var k_arr_new = Object.keys(cDat);
        returnData._cornerstone = k_arr_new[0];
        for (var i = 0; i < k_arr_new.length; i++) { // for each key in formatted object
            // for each key in formatted object
            /** @type {?} */
            var currKey = k_arr_new[i];
            formatObj[currKey] = {};
            if (currKey != returnData._cornerstone) {
                /** @type {?} */
                var testItem = void 0;
                for (var j in cDat[currKey]) {
                    if (cDat[currKey][j]) { // set test item and break if the value is not null
                        testItem = cDat[currKey][j];
                        break;
                    }
                }
                /** @type {?} */
                var prefix = "";
                /** @type {?} */
                var suffix = "";
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
            var cDat_New = {};
            cDat_New[returnData._cornerstone] = Object.keys(cDat);
            /** @type {?} */
            var index = cDat_New[returnData._cornerstone].indexOf(returnData._cornerstone);
            if (index > -1) {
                cDat_New[returnData._cornerstone].splice(index, 1);
            }
            for (var i = 0; i < cDat[returnData._cornerstone].length; i++) {
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
    };
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
    NeurasilChartsService.prototype.chartObjectBuilder = /**
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
    function (chartType, chartData, useAltAxis, title, yAxisLabelText, yAxisLabelText_Alt, xAxisLabelText, cornerstone, swapLabelsAndDatasets, formatObject) {
        //const chartTypes = NexusChartjsChart.chartTypes;
        if ((chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.LINE || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) && useAltAxis == true) {
            console.warn("You have enabled alternate axis on a (unsupported) chart type. It has been set to false");
            useAltAxis = false;
        }
        if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            yAxisLabelText_Alt = "Pareto %";
        }
        /** @type {?} */
        var options = {
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
        var yAxisLabel = { display: false, labelString: "" };
        if (yAxisLabelText) {
            yAxisLabel.display = true;
            yAxisLabel.labelString = yAxisLabelText;
        }
        /** @type {?} */
        var yAxisLabel_Alt = { display: false, labelString: "" };
        if (yAxisLabelText_Alt) {
            yAxisLabel_Alt.display = true;
            yAxisLabel_Alt.labelString = yAxisLabelText_Alt;
        }
        /** @type {?} */
        var xAxisLabel = { display: false, labelString: "" };
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
                    var altAxisObj = {
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
                    var altAxisObj = {
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
        var type;
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
        var THIS = this;
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
                    label += "" + formatObject[tooltipItem.xLabel].prefix + tooltipItem.yLabel + ("" + formatObject[tooltipItem.xLabel].suffix);
                }
                else {
                    /** @type {?} */
                    var objKeys = Object.keys(formatObject);
                    /** @type {?} */
                    var key = objKeys[tooltipItem.datasetIndex + 1];
                    /** @type {?} */
                    var formatObj = formatObject[key];
                    label += "" + formatObj.prefix + tooltipItem.yLabel + ("" + formatObj.suffix);
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
                var formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += "" + formatObj.prefix + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + formatObj.suffix;
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
                var formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += "" + formatObj.prefix + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + formatObj.suffix;
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
        var returnOpts = {
            type: type,
            data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets),
            options: options
        };
        return returnOpts;
    };
    /**
     * @param {?} chartData
     * @param {?} useAltAxis
     * @param {?} chartType
     * @param {?} cornerstone
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    NeurasilChartsService.prototype.dataParser = /**
     * @param {?} chartData
     * @param {?} useAltAxis
     * @param {?} chartType
     * @param {?} cornerstone
     * @param {?} swapLabelsAndDatasets
     * @return {?}
     */
    function (chartData, useAltAxis /*boolean*/, chartType /*chartType enum*/, cornerstone, swapLabelsAndDatasets) {
        // helper function to get color array for chart. cycles through when 
        /**
         * @param {?} opacity
         * @param {?} noOfColors
         * @return {?}
         */
        function getPalette(opacity, noOfColors) {
            /** @type {?} */
            var colors = [
                "rgba(199,233,180," + opacity + ")",
                "rgba(127,205,187," + opacity + ")",
                "rgba(65,182,196," + opacity + ")",
                "rgba(29,145,192," + opacity + ")",
                "rgba(34,94,168," + opacity + ")",
                "rgba(37,52,148," + opacity + ")",
                "rgba(8,29,88," + opacity + ")",
                "rgba(254,178,76," + opacity + ")",
                "rgba(253,141,60," + opacity + ")",
                "rgba(252,78,42," + opacity + ")",
                "rgba(227,26,28," + opacity + ")",
                "rgba(189,0,38," + opacity + ")",
                "rgba(128,0,38," + opacity + ")"
            ];
            if (noOfColors > colors.length) { // if more colors are required than available, cycle through beginning again
                // if more colors are required than available, cycle through beginning again
                /** @type {?} */
                var diff = noOfColors - colors.length;
                /** @type {?} */
                var colorsLength = colors.length;
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
        var colorPalatte;
        /** @type {?} */
        var bgColorPalatte;
        if (!swapLabelsAndDatasets) {
            colorPalatte = getPalette(1, chartData[cornerstone].length);
            bgColorPalatte = getPalette(0.3, chartData[cornerstone].length);
        }
        else {
            colorPalatte = getPalette(1, Object.keys(chartData).length);
            bgColorPalatte = getPalette(0.3, Object.keys(chartData).length);
        }
        /** @type {?} */
        var dataSets = [];
        /** @type {?} */
        var objKeys = Object.keys(chartData);
        /** @type {?} */
        var index = objKeys.indexOf(cornerstone);
        if (index > -1) {
            objKeys.splice(index, 1);
        }
        for (var i = 0; i < objKeys.length; i++) {
            /** @type {?} */
            var yAxis = 'yAxis';
            if (useAltAxis) {
                if (i > 0) {
                    yAxis += '-alt';
                }
            }
            /** @type {?} */
            var dataSet = {
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
        var returnData = {
            labels: chartData[cornerstone],
            datasets: dataSets
        };
        return returnData;
    };
    /**
     * @param {?} props
     * @return {?}
     */
    NeurasilChartsService.prototype.performParetoAnalysis = /**
     * @param {?} props
     * @return {?}
     */
    function (props) {
        //modify chart object
        /** @type {?} */
        var localSumArr = [];
        /** @type {?} */
        var totalSum = 0;
        for (var j = 0; j < props.data.datasets[0].data.length; j++) {
            /** @type {?} */
            var sum = 0;
            for (var i = 0; i < props.data.datasets.length; i++) {
                /** @type {?} */
                var val = parseFloat(props.data.datasets[i].data[j]);
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
        var newArr = [];
        for (var i = 0; i < localSumArr.length; i++) {
            /** @type {?} */
            var o = {
                sum: localSumArr[i],
                labels: props.data.labels[i],
            };
            for (var j = 0; j < props.data.datasets.length; j++) {
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
        var newLabelsArray = [];
        for (var i = 0; i < newArr.length; i++) {
            newLabelsArray.push(newArr[i]["labels"]);
        }
        props.data.labels = newLabelsArray;
        //rebuild and reassign data array for each dataset
        for (var j = 0; j < props.data.datasets.length; j++) {
            /** @type {?} */
            var data = [];
            for (var i = 0; i < newArr.length; i++) {
                data.push(newArr[i][j]);
            }
            props.data.datasets[j].data = data;
        }
        /** @type {?} */
        var sortedlocalSumArr = [];
        for (var i = 0; i < newArr.length; i++) {
            sortedlocalSumArr.push(newArr[i].sum);
        }
        // calculate and push pareto line, also populate 80%line array
        /** @type {?} */
        var rollingSum = 0;
        /** @type {?} */
        var paretoLineValues = [];
        /** @type {?} */
        var eightyPercentLine = [];
        for (var i = 0; i < sortedlocalSumArr.length; i++) {
            rollingSum += sortedlocalSumArr[i];
            /** @type {?} */
            var paretoVal = rollingSum / totalSum * 100;
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
    };
    NeurasilChartsService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    NeurasilChartsService.ctorParameters = function () { return []; };
    /** @nocollapse */ NeurasilChartsService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function NeurasilChartsService_Factory() { return new NeurasilChartsService(); }, token: NeurasilChartsService, providedIn: "root" });
    return NeurasilChartsService;
}());
export { NeurasilChartsService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZXVyYXNpbC1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvbmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFFL0M7SUFLRTtJQUFnQixDQUFDOzs7Ozs7O0lBR2pCLHVEQUF1Qjs7Ozs7O0lBQXZCLFVBQXdCLFNBQThCLEVBQUUsWUFBd0IsRUFBRSxxQkFBOEI7O1lBQzFHLFVBQVUsR0FBRztZQUNmLFlBQVksRUFBRSxFQUFFO1lBQ2hCLGFBQWEsRUFBRSxJQUFJO1lBQ25CLElBQUksRUFBRSxJQUFJO1NBQ1g7O1lBRUcsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7O1lBRS9DLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFHakMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUM1QixJQUFJLEdBQUcsRUFBRTtRQUNiLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFOztnQkFDakMsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNuQixLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDbEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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Q0FBQyxJQUFJLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFFLENBQUM7WUFDM0QsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQzNCO1FBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE9BQU8sRUFBQyxRQUFRO1lBQ2hCLE1BQU0sRUFBQyxnQkFBZ0I7WUFDdkIsaUJBQWlCLEVBQUMsZUFBZTtZQUNqQyxhQUFhLEVBQUMsaUJBQWlCO1lBQy9CLGFBQWEsRUFBQyxDQUFDO1lBQ2YsTUFBTSxFQUFDLE1BQU07WUFDYixTQUFTLEVBQUMsV0FBVztTQUN0QixDQUFDLENBQUE7UUFDRixnQkFBZ0I7UUFDaEIsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO1lBQ3ZCLE9BQU8sRUFBQyxVQUFVO1lBQ2xCLE1BQU0sRUFBQyxpQkFBaUI7WUFDeEIsaUJBQWlCLEVBQUMsZUFBZTtZQUNqQyxhQUFhLEVBQUMsaUJBQWlCO1lBQy9CLGFBQWEsRUFBQyxDQUFDO1lBQ2YsTUFBTSxFQUFDLE1BQU07WUFDYixTQUFTLEVBQUMsV0FBVztTQUN0QixDQUFDLENBQUE7SUFDSixDQUFDOztnQkE5aEJGLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozs7O2dDQUxEO0NBcXBCQyxBQWxwQkQsSUFrcEJDO1NBL29CWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBORVVSQVNJTF9DSEFSVF9UWVBFIH0gZnJvbSAnLi9tb2RlbHMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c1NlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCkgeyB9XG5cblxuICBwYXJzZURhdGFGcm9tRGF0YXNvdXJjZShjaGFydFR5cGU6IE5FVVJBU0lMX0NIQVJUX1RZUEUsIGluY29taW5nRGF0YTogQXJyYXk8YW55Piwgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBib29sZWFuKTogeyBfY29ybmVyc3RvbmU6IHN0cmluZywgX2Zvcm1hdE9iamVjdDogeyBwcmVmaXg6IHN0cmluZywgc3VmZml4OiBzdHJpbmcgfSwgZGF0YTogQXJyYXk8YW55PiB9IHtcbiAgICBsZXQgcmV0dXJuRGF0YSA9IHtcbiAgICAgIF9jb3JuZXJzdG9uZTogXCJcIixcbiAgICAgIF9mb3JtYXRPYmplY3Q6IG51bGwsXG4gICAgICBkYXRhOiBudWxsXG4gICAgfVxuXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGluY29taW5nRGF0YSkpOyAvLyBtYWtlIGEgY29weSBvZiB0aGUgZGF0YVxuXG4gICAgbGV0IGtfYXJyX1RlbXAgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcblxuXG4gICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XG4gICAgbGV0IGNEYXQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldXG4gICAgICBjRGF0W2N1cnJLZXldID0gW107XG4gICAgICBmb3IgKHZhciBqIGluIGRhdGEpIHtcbiAgICAgICAgY0RhdFtrX2FycltpXV0ucHVzaChkYXRhW2pdW2N1cnJLZXldKTtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGxldCBmb3JtYXRPYmogPSB7fTtcbiAgICBsZXQga19hcnJfbmV3ID0gT2JqZWN0LmtleXMoY0RhdCk7XG4gICAgcmV0dXJuRGF0YS5fY29ybmVyc3RvbmUgPSBrX2Fycl9uZXdbMF07XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyX25ldy5sZW5ndGg7IGkrKykgeyAvLyBmb3IgZWFjaCBrZXkgaW4gZm9ybWF0dGVkIG9iamVjdFxuICAgICAgbGV0IGN1cnJLZXkgPSBrX2Fycl9uZXdbaV07XG4gICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7fTtcbiAgICAgIGlmIChjdXJyS2V5ICE9IHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKSB7XG4gICAgICAgIGxldCB0ZXN0SXRlbTtcbiAgICAgICAgZm9yICh2YXIgaiBpbiBjRGF0W2N1cnJLZXldKSB7XG4gICAgICAgICAgaWYgKGNEYXRbY3VycktleV1bal0pIHsgLy8gc2V0IHRlc3QgaXRlbSBhbmQgYnJlYWsgaWYgdGhlIHZhbHVlIGlzIG5vdCBudWxsXG4gICAgICAgICAgICB0ZXN0SXRlbSA9IGNEYXRbY3VycktleV1bal07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcHJlZml4ID0gXCJcIjtcbiAgICAgICAgbGV0IHN1ZmZpeCA9IFwiXCI7XG4gICAgICAgIGlmICh0ZXN0SXRlbSkge1xuICAgICAgICAgIGlmICghaXNOdW1iZXIodGVzdEl0ZW0pKSB7XG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIodGVzdEl0ZW0uc3Vic3RyKDEpKSkge1xuICAgICAgICAgICAgICBwcmVmaXggPSB0ZXN0SXRlbS5zdWJzdHIoMCwgMSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodGVzdEl0ZW0uc3Vic3RyKDAsIHRlc3RJdGVtLmxlbmd0aCAtIDEpKSkge1xuICAgICAgICAgICAgICBzdWZmaXggPSB0ZXN0SXRlbS5zdWJzdHIodGVzdEl0ZW0ubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge1xuICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgIHN1ZmZpeDogc3VmZml4XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3JtYXQgZWFjaCBkYXRhIGluIHRoZSBpbmRpdmlkdWFsIGFycmF5c1xuICAgICAgICBmb3IgKHZhciBrIGluIGNEYXRbY3VycktleV0pIHtcbiAgICAgICAgICBpZiAocHJlZml4ICE9IFwiXCIpIHtcbiAgICAgICAgICAgIGNEYXRbY3VycktleV1ba10gPSBjRGF0W2N1cnJLZXldW2tdLnJlcGxhY2UocHJlZml4LCBcIlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHN1ZmZpeCAhPSBcIlwiKSB7XG4gICAgICAgICAgICBjRGF0W2N1cnJLZXldW2tdID0gY0RhdFtjdXJyS2V5XVtrXS5yZXBsYWNlKHN1ZmZpeCwgXCJcIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy9uZXdTdHIgPSBjRGF0XG4gICAgICAgICAgLy9yZXBsYWNlRGF0YS5wdXNoKClcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKGN1cnJLZXkgPT0gcmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpIHtcbiAgICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge1xuICAgICAgICAgIHByZWZpeDogXCJcIixcbiAgICAgICAgICBzdWZmaXg6IFwiXCJcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBpZiAoIXN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xuICAgICAgLy8gZG8gbm90aGluZztcbiAgICAgIC8vIHJldHVybiBjRGF0O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGxldCBjRGF0X05ldyA9IHt9O1xuXG4gICAgICBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0gPSBPYmplY3Qua2V5cyhjRGF0KTtcbiAgICAgIGxldCBpbmRleCA9IGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5pbmRleE9mKHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKTtcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0gPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiBpbiBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0pIHtcbiAgICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0ucHVzaChjRGF0W2NEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtqXV1baV0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vcmV0dXJuIGNEYXRfTmV3O1xuICAgICAgY0RhdCA9IGNEYXRfTmV3OyAvLyByZWFzc2lnbiB0byBjRGF0XG4gICAgfVxuXG5cbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcbiAgICAgIC8vIEFkZCBzdWZmaXhlcyB0byBhdXRvLWdlbmVyYXRlZCBsaW5lc1xuICAgICAgZm9ybWF0T2JqW1wiUGFyZXRvXCJdID0ge1xuICAgICAgICBwcmVmaXg6IFwiXCIsXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcbiAgICAgIH1cbiAgICAgIGZvcm1hdE9ialtcIjgwJSBsaW5lXCJdID0ge1xuICAgICAgICBwcmVmaXg6IFwiXCIsXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gKCh2YWx1ZSAhPSBudWxsKSAmJiAhaXNOYU4oTnVtYmVyKHZhbHVlLnRvU3RyaW5nKCkpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuRGF0YS5fZm9ybWF0T2JqZWN0ID0gZm9ybWF0T2JqO1xuICAgIHJldHVybkRhdGEuZGF0YSA9IGNEYXQ7XG4gICAgLy9jb25zb2xlLmxvZyhjRGF0KTtcbiAgICByZXR1cm4gcmV0dXJuRGF0YTtcbiAgfVxuXG5cbiAgY2hhcnRPYmplY3RCdWlsZGVyKGNoYXJ0VHlwZSwgY2hhcnREYXRhLCB1c2VBbHRBeGlzLCB0aXRsZSwgeUF4aXNMYWJlbFRleHQsIHlBeGlzTGFiZWxUZXh0X0FsdCwgeEF4aXNMYWJlbFRleHQsIGNvcm5lcnN0b25lLCBzd2FwTGFiZWxzQW5kRGF0YXNldHMsIGZvcm1hdE9iamVjdCkge1xuICAgIC8vY29uc3QgY2hhcnRUeXBlcyA9IE5leHVzQ2hhcnRqc0NoYXJ0LmNoYXJ0VHlwZXM7XG4gICAgaWYgKChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgJiYgdXNlQWx0QXhpcyA9PSB0cnVlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJZb3UgaGF2ZSBlbmFibGVkIGFsdGVybmF0ZSBheGlzIG9uIGEgKHVuc3VwcG9ydGVkKSBjaGFydCB0eXBlLiBJdCBoYXMgYmVlbiBzZXQgdG8gZmFsc2VcIik7XG4gICAgICB1c2VBbHRBeGlzID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XG4gICAgICB5QXhpc0xhYmVsVGV4dF9BbHQgPSBcIlBhcmV0byAlXCI7XG4gICAgfVxuXG4gICAgbGV0IG9wdGlvbnM6IGFueSA9IHtcbiAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcbiAgICB9O1xuICAgIGlmICh0aXRsZSkge1xuICAgICAgb3B0aW9ucy50aXRsZSA9IHtcbiAgICAgICAgZGlzcGxheTogdHJ1ZSxcbiAgICAgICAgdGV4dDogdGl0bGVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgeUF4aXNMYWJlbCA9IHsgZGlzcGxheTogZmFsc2UsIGxhYmVsU3RyaW5nOiBcIlwiIH1cbiAgICBpZiAoeUF4aXNMYWJlbFRleHQpIHtcbiAgICAgIHlBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XG4gICAgICB5QXhpc0xhYmVsLmxhYmVsU3RyaW5nID0geUF4aXNMYWJlbFRleHQ7XG4gICAgfVxuXG4gICAgbGV0IHlBeGlzTGFiZWxfQWx0ID0geyBkaXNwbGF5OiBmYWxzZSwgbGFiZWxTdHJpbmc6IFwiXCIgfVxuICAgIGlmICh5QXhpc0xhYmVsVGV4dF9BbHQpIHtcbiAgICAgIHlBeGlzTGFiZWxfQWx0LmRpc3BsYXkgPSB0cnVlO1xuICAgICAgeUF4aXNMYWJlbF9BbHQubGFiZWxTdHJpbmcgPSB5QXhpc0xhYmVsVGV4dF9BbHQ7XG4gICAgfVxuXG4gICAgbGV0IHhBeGlzTGFiZWwgPSB7IGRpc3BsYXk6IGZhbHNlLCBsYWJlbFN0cmluZzogXCJcIiB9O1xuICAgIGlmICh4QXhpc0xhYmVsVGV4dCkge1xuICAgICAgeEF4aXNMYWJlbC5kaXNwbGF5ID0gdHJ1ZTtcbiAgICAgIHhBeGlzTGFiZWwubGFiZWxTdHJpbmcgPSB4QXhpc0xhYmVsVGV4dDtcbiAgICB9XG5cbiAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xuXG4gICAgICAgIG9wdGlvbnMuc2NhbGVzID0ge1xuICAgICAgICAgIHhBeGVzOiBbe1xuICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcbiAgICAgICAgICAgIHNjYWxlTGFiZWw6IHhBeGlzTGFiZWxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICB5QXhlczogW3tcbiAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXG4gICAgICAgICAgICBzY2FsZUxhYmVsOiB5QXhpc0xhYmVsXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xuICAgICAgICAgIGxldCBhbHRBeGlzT2JqOiBhbnkgPSB7XG4gICAgICAgICAgICBpZDogJ3lBeGlzLWFsdCcsXG4gICAgICAgICAgICBkaXNwbGF5OiAnYXV0bycsXG4gICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIHNjYWxlTGFiZWw6IHlBeGlzTGFiZWxfQWx0XG4gICAgICAgICAgfVxuICAgICAgICAgIGFsdEF4aXNPYmoudGlja3MubWluID0gMDtcbiAgICAgICAgICBhbHRBeGlzT2JqLnRpY2tzLm1heCA9IDEwMDtcbiAgICAgICAgICBhbHRBeGlzT2JqLnRpY2tzLnN0ZXBTaXplID0gODBcblxuICAgICAgICAgIG9wdGlvbnMuc2NhbGVzLnlBeGVzLnB1c2goYWx0QXhpc09iailcblxuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMuc2NhbGVzID0ge1xuICAgICAgICAgIHhBeGVzOiBbe1xuICAgICAgICAgICAgc2NhbGVMYWJlbDogeEF4aXNMYWJlbFxuICAgICAgICAgIH1dLFxuICAgICAgICAgIHlBeGVzOiBbe1xuICAgICAgICAgICAgaWQ6ICd5QXhpcycsXG4gICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzY2FsZUxhYmVsOiB5QXhpc0xhYmVsXG4gICAgICAgICAgfSxdXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXNlQWx0QXhpcykge1xuICAgICAgICAgIGxldCBhbHRBeGlzT2JqOiBhbnkgPSB7XG4gICAgICAgICAgICBpZDogJ3lBeGlzLWFsdCcsXG4gICAgICAgICAgICBkaXNwbGF5OiAnYXV0bycsXG4gICAgICAgICAgICB0aWNrczoge1xuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgIHNjYWxlTGFiZWw6IHlBeGlzTGFiZWxfQWx0XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xuICAgICAgICAgICAgYWx0QXhpc09iai50aWNrcy5taW4gPSAwO1xuICAgICAgICAgICAgYWx0QXhpc09iai50aWNrcy5tYXggPSAxMDA7XG4gICAgICAgICAgICBhbHRBeGlzT2JqLnRpY2tzLnN0ZXBTaXplID0gODBcbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0aW9ucy5zY2FsZXMueUF4ZXMucHVzaChhbHRBeGlzT2JqKVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdHlwZTtcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSkge1xuICAgICAgdHlwZSA9ICdsaW5lJ1xuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8XG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSB8fFxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fFxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcbiAgICAgIHR5cGUgPSAnYmFyJ1xuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcbiAgICAgIHR5cGUgPSAnaG9yaXpvbnRhbEJhcidcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSkge1xuICAgICAgdHlwZSA9ICdwaWUnXG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XG4gICAgICB0eXBlID0gJ2RvdWdobnV0J1xuICAgIH1cblxuXG4gICAgbGV0IFRISVMgPSB0aGlzO1xuXG4gICAgLy8gdG9vbHRpcCAmIHRpdGxlIHByZWZpeC9zdWZmaXggYWRkaXRpb24uIFRpdGxlIHVzZXMgZGVmYXVsdCBjb25maWdzIGZvciBiYXIgL2xpbmVcbiAgICBvcHRpb25zLnRvb2x0aXBzID0ge307XG4gICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MgPSB7fTtcblxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHxcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8XG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FIHx8XG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8XG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsIHx8ICcnO1xuICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcbiAgICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmplY3RbdG9vbHRpcEl0ZW0ueExhYmVsXS5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iamVjdFt0b29sdGlwSXRlbS54TGFiZWxdLnN1ZmZpeH1gO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgbGV0IG9iaktleXMgPSBPYmplY3Qua2V5cyhmb3JtYXRPYmplY3QpO1xuICAgICAgICAgIGxldCBrZXkgPSBvYmpLZXlzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleCArIDFdXG4gICAgICAgICAgbGV0IGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtrZXldO1xuICAgICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iai5zdWZmaXh9YDs7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF07XG4gICAgICAgIGlmIChsYWJlbCkge1xuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGZvcm1hdE9iajtcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF1dO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbF07XG5cbiAgICAgICAgfVxuICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmoucHJlZml4fSR7ZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmRhdGFbdG9vbHRpcEl0ZW0uaW5kZXhdfSR7Zm9ybWF0T2JqLnN1ZmZpeH1gO1xuICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgICB9XG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy50aXRsZSA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbVswXS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLmxhYmVsID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XG5cbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xuICAgICAgICBpZiAobGFiZWwpIHtcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xuICAgICAgICB9XG4gICAgICAgIGxldCBmb3JtYXRPYmo7XG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW0uaW5kZXhdXTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWxdO1xuXG4gICAgICAgIH1cbiAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH0ke2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5kYXRhW3Rvb2x0aXBJdGVtLmluZGV4XX0ke2Zvcm1hdE9iai5zdWZmaXh9YDtcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgICAgfVxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MudGl0bGUgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcblxuICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW1bMF0ueUxhYmVsO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgbGV0IHJldHVybk9wdHMgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgZGF0YTogdGhpcy5kYXRhUGFyc2VyKGNoYXJ0RGF0YSwgdXNlQWx0QXhpcywgY2hhcnRUeXBlLCBjb3JuZXJzdG9uZSwgc3dhcExhYmVsc0FuZERhdGFzZXRzKSxcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICB9XG4gICAgcmV0dXJuIHJldHVybk9wdHM7XG4gIH1cblxuICBkYXRhUGFyc2VyKGNoYXJ0RGF0YSwgdXNlQWx0QXhpcyAvKmJvb2xlYW4qLywgY2hhcnRUeXBlIC8qY2hhcnRUeXBlIGVudW0qLywgY29ybmVyc3RvbmUsIHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xuXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBjb2xvciBhcnJheSBmb3IgY2hhcnQuIGN5Y2xlcyB0aHJvdWdoIHdoZW4gXG4gICAgZnVuY3Rpb24gZ2V0UGFsZXR0ZShvcGFjaXR5LCBub09mQ29sb3JzKSB7XG4gICAgICBsZXQgY29sb3JzID0gW1xuICAgICAgICBgcmdiYSgxOTksMjMzLDE4MCwke29wYWNpdHl9KWAsXG4gICAgICAgIGByZ2JhKDEyNywyMDUsMTg3LCR7b3BhY2l0eX0pYCxcbiAgICAgICAgYHJnYmEoNjUsMTgyLDE5Niwke29wYWNpdHl9KWAsXG4gICAgICAgIGByZ2JhKDI5LDE0NSwxOTIsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSgzNCw5NCwxNjgsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSgzNyw1MiwxNDgsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSg4LDI5LDg4LCR7b3BhY2l0eX0pYCxcbiAgICAgICAgYHJnYmEoMjU0LDE3OCw3Niwke29wYWNpdHl9KWAsXG4gICAgICAgIGByZ2JhKDI1MywxNDEsNjAsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSgyNTIsNzgsNDIsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSgyMjcsMjYsMjgsJHtvcGFjaXR5fSlgLFxuICAgICAgICBgcmdiYSgxODksMCwzOCwke29wYWNpdHl9KWAsXG4gICAgICAgIGByZ2JhKDEyOCwwLDM4LCR7b3BhY2l0eX0pYFxuICAgICAgXTtcblxuICAgICAgaWYgKG5vT2ZDb2xvcnMgPiBjb2xvcnMubGVuZ3RoKSB7IC8vIGlmIG1vcmUgY29sb3JzIGFyZSByZXF1aXJlZCB0aGFuIGF2YWlsYWJsZSwgY3ljbGUgdGhyb3VnaCBiZWdpbm5pbmcgYWdhaW5cbiAgICAgICAgbGV0IGRpZmYgPSBub09mQ29sb3JzIC0gY29sb3JzLmxlbmd0aDtcbiAgICAgICAgbGV0IGNvbG9yc0xlbmd0aCA9IGNvbG9ycy5sZW5ndGg7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGRpZmY7IGkpIHsgLy8gTk8gSU5DUkVNRU5UIEhFUkVcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbG9yc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb2xvcnMucHVzaChjb2xvcnNbal0pXG4gICAgICAgICAgICBpKys7IC8vIElOQ1JFTUVOVCBIRVJFXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb2xvcnM7XG4gICAgfVxuXG4gICAgbGV0IGNvbG9yUGFsYXR0ZTtcbiAgICBsZXQgYmdDb2xvclBhbGF0dGVcbiAgICBpZiAoIXN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xuICAgICAgY29sb3JQYWxhdHRlID0gZ2V0UGFsZXR0ZSgxLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcbiAgICAgIGJnQ29sb3JQYWxhdHRlID0gZ2V0UGFsZXR0ZSgwLjMsIGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0ubGVuZ3RoKVxuICAgIH0gZWxzZSB7XG4gICAgICBjb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDEsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxuICAgICAgYmdDb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDAuMywgT2JqZWN0LmtleXMoY2hhcnREYXRhKS5sZW5ndGgpXG4gICAgfVxuXG5cblxuICAgIGxldCBkYXRhU2V0cyA9IFtdO1xuICAgIGxldCBvYmpLZXlzID0gT2JqZWN0LmtleXMoY2hhcnREYXRhKTtcbiAgICBsZXQgaW5kZXggPSBvYmpLZXlzLmluZGV4T2YoY29ybmVyc3RvbmUpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICBvYmpLZXlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgbGV0IHlBeGlzID0gJ3lBeGlzJztcbiAgICAgIGlmICh1c2VBbHRBeGlzKSB7XG4gICAgICAgIGlmIChpID4gMCkge1xuICAgICAgICAgIHlBeGlzICs9ICctYWx0JztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YVNldDogYW55ID0ge1xuICAgICAgICBsYWJlbDogb2JqS2V5c1tpXSxcbiAgICAgICAgZGF0YTogY2hhcnREYXRhW29iaktleXNbaV1dLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3JQYWxhdHRlW2ldLFxuICAgICAgICBib3JkZXJDb2xvcjogY29sb3JQYWxhdHRlW2ldLFxuICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgICAgfTtcblxuXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUpIHsgLy8gaWdub3JlcyBzdGFja2VkIGFuZCBiYXIgb3B0aW9ucy4gTWFrZXMgYXNzdW1wdGlvbiB0aGF0IG9ubHkgMXN0IGRhdGFzZXQgaXMgYmFyXG4gICAgICAgIGlmIChpID09IDApIHtcbiAgICAgICAgICBkYXRhU2V0LnR5cGUgPSAnYmFyJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhU2V0LnR5cGUgPSAnbGluZSc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuXG5cblxuICAgICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XG4gICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVbaV07XG4gICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGVbaV07XG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUpIHtcbiAgICAgICAgaWYgKGRhdGFTZXQudHlwZSA9PSAnYmFyJykge1xuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVbaV07XG4gICAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxhdHRlW2ldO1xuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgey8vIG92ZXJ3cml0ZSBzaW5nbGUgY29sb3IgYXNzaWdubWVudCB0byBhcnJheS5cbiAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsYXR0ZTtcbiAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZTtcbiAgICAgIH1cblxuXG4gICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XG4gICAgICAgIGlmIChjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XG4gICAgICAgICAgZGF0YVNldC55QXhpc0lEID0geUF4aXM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZGF0YVNldHMucHVzaChkYXRhU2V0KTtcbiAgICB9XG4gICAgbGV0IHJldHVybkRhdGEgPSB7XG4gICAgICBsYWJlbHM6IGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0sXG4gICAgICBkYXRhc2V0czogZGF0YVNldHNcbiAgICB9XG4gICAgcmV0dXJuIHJldHVybkRhdGE7XG4gIH1cblxuICBwZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpe1xuICAgIC8vbW9kaWZ5IGNoYXJ0IG9iamVjdFxuICAgIGxldCBsb2NhbFN1bUFyciA9IFtdO1xuICAgIGxldCB0b3RhbFN1bSA9IDA7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzWzBdLmRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBzdW0gPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB2YWwgPSBwYXJzZUZsb2F0KHByb3BzLmRhdGEuZGF0YXNldHNbaV0uZGF0YVtqXSk7XG4gICAgICAgIGlmIChpc05hTih2YWwpKSB7XG4gICAgICAgICAgdmFsID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzdW0gKz0gdmFsXG4gICAgICB9XG4gICAgICBsb2NhbFN1bUFyci5wdXNoKHN1bSk7XG4gICAgICB0b3RhbFN1bSArPSBzdW07XG4gICAgfVxuXG4gICAgLy9zb3J0IGRhdGEgYnkgbG9jYWwgc3VtXG4gICAgbGV0IG5ld0FyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdW1BcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBvID0ge1xuICAgICAgICBzdW06IGxvY2FsU3VtQXJyW2ldLFxuICAgICAgICBsYWJlbHM6IHByb3BzLmRhdGEubGFiZWxzW2ldLFxuICAgICAgfVxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIG9bal0gPSBwcm9wcy5kYXRhLmRhdGFzZXRzW2pdLmRhdGFbaV07XG4gICAgICB9XG4gICAgICBuZXdBcnIucHVzaChvKVxuICAgIH1cblxuICAgIC8vc29ydCBkZXNjZW5kaW5nXG4gICAgbmV3QXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiAoKGEuc3VtIDwgYi5zdW0pID8gMSA6ICgoYS5zdW0gPT0gYi5zdW0pID8gMCA6IC0xKSk7XG4gICAgfSk7XG5cbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGxhYmVscyBhcnJheVxuICAgIGxldCBuZXdMYWJlbHNBcnJheSA9IFtdXG4gICAgZm9yIChsZXQgaSA9MDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKyl7XG4gICAgICBuZXdMYWJlbHNBcnJheS5wdXNoKG5ld0FycltpXVtcImxhYmVsc1wiXSk7XG4gICAgfVxuICAgIHByb3BzLmRhdGEubGFiZWxzID0gbmV3TGFiZWxzQXJyYXk7XG5cbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGRhdGEgYXJyYXkgZm9yIGVhY2ggZGF0YXNldFxuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgZGF0YSA9IFtdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspe1xuICAgICAgICBkYXRhLnB1c2gobmV3QXJyW2ldW2pdKVxuICAgICAgfVxuICAgICAgcHJvcHMuZGF0YS5kYXRhc2V0c1tqXS5kYXRhID0gZGF0YTtcbiAgICB9XG5cbiAgICBsZXQgc29ydGVkbG9jYWxTdW1BcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspe1xuICAgICAgc29ydGVkbG9jYWxTdW1BcnIucHVzaChuZXdBcnJbaV0uc3VtKVxuICAgIH1cblxuXG4gICAgLy8gY2FsY3VsYXRlIGFuZCBwdXNoIHBhcmV0byBsaW5lLCBhbHNvIHBvcHVsYXRlIDgwJWxpbmUgYXJyYXlcbiAgICBsZXQgcm9sbGluZ1N1bSA9IDA7XG4gICAgbGV0IHBhcmV0b0xpbmVWYWx1ZXMgPSBbXTtcbiAgICBsZXQgZWlnaHR5UGVyY2VudExpbmUgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IHNvcnRlZGxvY2FsU3VtQXJyLmxlbmd0aDsgaSsrKXtcbiAgICAgIHJvbGxpbmdTdW0gKz0gc29ydGVkbG9jYWxTdW1BcnJbaV07XG4gICAgICBsZXQgcGFyZXRvVmFsID0gcm9sbGluZ1N1bS90b3RhbFN1bSAqIDEwMDtcbiAgICAgIHBhcmV0b0xpbmVWYWx1ZXMucHVzaCggTWF0aC5mbG9vcihwYXJldG9WYWwgKiAxMDApIC8gMTAwICk7XG4gICAgICBlaWdodHlQZXJjZW50TGluZS5wdXNoKDgwKVxuICAgIH1cbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xuICAgICAgXCJsYWJlbFwiOlwiUGFyZXRvXCIsXG4gICAgICBcImRhdGFcIjpwYXJldG9MaW5lVmFsdWVzLFxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjpcInJnYmEoMCwwLDAsMClcIixcbiAgICAgIFwiYm9yZGVyQ29sb3JcIjpcInJnYmEoMCwwLDAsMC44KVwiLFxuICAgICAgXCJib3JkZXJXaWR0aFwiOjIsXG4gICAgICBcInR5cGVcIjpcImxpbmVcIixcbiAgICAgIFwieUF4aXNJRFwiOlwieUF4aXMtYWx0XCJcbiAgICB9KVxuICAgIC8vIHB1c2ggODAlIGxpbmVcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xuICAgICAgXCJsYWJlbFwiOlwiODAlIGxpbmVcIixcbiAgICAgIFwiZGF0YVwiOmVpZ2h0eVBlcmNlbnRMaW5lLFxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjpcInJnYmEoMCwwLDAsMClcIixcbiAgICAgIFwiYm9yZGVyQ29sb3JcIjpcInJnYmEoMCwwLDAsMC44KVwiLFxuICAgICAgXCJib3JkZXJXaWR0aFwiOjIsXG4gICAgICBcInR5cGVcIjpcImxpbmVcIixcbiAgICAgIFwieUF4aXNJRFwiOlwieUF4aXMtYWx0XCJcbiAgICB9KVxuICB9XG5cbiAgICAvLyB1bnVzZWQuIE1pZ3JhdGVkIGNvZGUgdG8gTmV1cmFzaWxEYXRhRmlsdGVyUGlwZVxuICAvLyBmaWx0ZXJEYXRhKGRhdGE6IEFycmF5PGFueT4sIGRhdGFzZXRGaWx0ZXI6IHN0cmluZykge1xuXG4gIC8vICAgaWYgKGRhdGFzZXRGaWx0ZXIpIHtcbiAgLy8gICAgIGxldCBmaWx0ZXJUZXJtcyA9IGRhdGFzZXRGaWx0ZXIuc3BsaXQoJywnKTtcbiAgLy8gICAgIGxldCBpbmNsdWRlVGVybXMgPSBbXTtcbiAgLy8gICAgIGxldCBleGNsdWRlVGVybXMgPSBbXTtcbiAgLy8gICAgIGxldCBpbmNsdWRlQ29sdW1ucyA9IFtdO1xuICAvLyAgICAgbGV0IGV4Y2x1ZGVDb2x1bW5zID0gW107XG4gIC8vICAgICBmb3IgKGxldCBpIGluIGZpbHRlclRlcm1zKSB7XG4gIC8vICAgICAgIGlmIChmaWx0ZXJUZXJtc1tpXSAhPSBudWxsICYmIGZpbHRlclRlcm1zW2ldICE9IHVuZGVmaW5lZCAmJiBmaWx0ZXJUZXJtc1tpXS5sZW5ndGggPiAxKSB7XG4gIC8vICAgICAgICAgbGV0IHRlcm0gPSBmaWx0ZXJUZXJtc1tpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgLy8gICAgICAgICBpZiAodGVybVswXSA9PSBcIi1cIikge1xuICAvLyAgICAgICAgICAgZXhjbHVkZVRlcm1zLnB1c2godGVybS5yZXBsYWNlKFwiLVwiLCBcIlwiKS50cmltKCkpO1xuICAvLyAgICAgICAgIH0gZWxzZSBpZiAodGVybVswXSA9PSBcIn5cIikge1xuICAvLyAgICAgICAgICAgaWYgKHRlcm1bMV0gPT0gXCIhXCIpIHtcbiAgLy8gICAgICAgICAgICAgZXhjbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+IVwiLCBcIlwiKS50cmltKCkpO1xuICAvLyAgICAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgICAgaW5jbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+XCIsIFwiXCIpLnRyaW0oKSlcbiAgLy8gICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9IGVsc2Uge1xuICAvLyAgICAgICAgICAgaW5jbHVkZVRlcm1zLnB1c2godGVybS50cmltKCkpXG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICB9XG4gIC8vICAgICB9XG5cblxuICAvLyAgICAgbGV0IGRhdGFfRmlsdGVyZWQgPSBkYXRhLmZpbHRlcihmdW5jdGlvbiAoZGF0YUl0ZW0pIHtcbiAgLy8gICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xuICAvLyAgICAgICBsZXQgc2VhcmNoU3RyaW5nID0gXCJcIjtcbiAgLy8gICAgICAgZm9yIChsZXQgaSBpbiBrX2Fycikge1xuICAvLyAgICAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJbaV07XG4gIC8vICAgICAgICAgbGV0IHZhbHVlID0gZGF0YUl0ZW1bY3VycktleV07XG4gIC8vICAgICAgICAgc2VhcmNoU3RyaW5nICs9IHZhbHVlICsgXCIgXCI7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgc2VhcmNoU3RyaW5nID0gc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAvLyAgICAgICBsZXQgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcbiAgLy8gICAgICAgaWYgKGluY2x1ZGVUZXJtcy5sZW5ndGggPiAwKSB7XG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBpbmNsdWRlVGVybXMpIHtcbiAgLy8gICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoaW5jbHVkZVRlcm1zW2ldKSkge1xuICAvLyAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XG4gIC8vICAgICAgICAgICAgIGJyZWFrO1xuICAvLyAgICAgICAgICAgfVxuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgaWYgKGV4Y2x1ZGVUZXJtcy5sZW5ndGggPiAwICYmIGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBleGNsdWRlVGVybXMpIHtcbiAgLy8gICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoZXhjbHVkZVRlcm1zW2ldKSkge1xuICAvLyAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xuICAvLyAgICAgICAgICAgICBicmVhaztcbiAgLy8gICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1cbiAgLy8gICAgICAgaWYgKGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XG5cbiAgLy8gICAgICAgICByZXR1cm4gZGF0YUl0ZW07XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH0pO1xuXG4gIC8vICAgICBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCAmJiBleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gIC8vICAgICAgIHdpbmRvdy5hbGVydChcIlVuc3VwcG9ydGVkIHVzYWdlIG9mIGluY2x1ZGUgJiBleGNsdWRlIGNvbHVtbnMuIFRoaW5ncyBtYXkgYnJlYWtcIilcbiAgLy8gICAgIH1cbiAgLy8gICAgIC8vYWZ0ZXIgZmlsdGVyaW5nIGlzIGNvbXBsZXRlLCByZW1vdmUgY29sdW1ucyBmcm9tIGNsb25lIG9mIGRhdGFcbiAgLy8gICAgIGVsc2UgaWYgKGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgLy8gICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpXG4gIC8vICAgICAgIC8vY29uc29sZS5sb2coXCJoZXJlXCIpXG4gIC8vICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xuICAvLyAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XG4gIC8vICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xuICAvLyAgICAgICAgIC8vZm9yIChsZXQgaSBpbiBrX2Fycikge1xuICAvLyAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gRG8gbm90IGFsbG93IHVzZXIgdG8gZGVsZXRlIGZpcnN0IGNvbHVtblxuICAvLyAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGV4Y2x1ZGVDb2x1bW5zKSB7XG4gIC8vICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAvLyAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoZXhjbHVkZUNvbHVtbnNbal0pKSB7XG4gIC8vICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xuICAvLyAgICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgICAgfVxuICAvLyAgICAgICAgICAgfVxuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfVxuICAvLyAgICAgfVxuXG4gIC8vICAgICBlbHNlIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gIC8vICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKTtcbiAgLy8gICAgICAgZm9yICh2YXIgaCBpbiBkYXRhX0ZpbHRlcmVkKSB7XG4gIC8vICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcbiAgLy8gICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XG4gIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xuICAvLyAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBOZWVkZWQ/XG4gIC8vICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgLy8gICAgICAgICAgICAgbGV0IGtlZXBDb2x1bW4gPSBmYWxzZTtcbiAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBpbmNsdWRlQ29sdW1ucykge1xuICAvLyAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XG4gIC8vICAgICAgICAgICAgICAgICBrZWVwQ29sdW1uID0gdHJ1ZTtcbiAgLy8gICAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgICAgICAgLy8gaWYgKCFwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XG4gIC8vICAgICAgICAgICAgICAgLy8gICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XG4gIC8vICAgICAgICAgICAgICAgLy8gfVxuICAvLyAgICAgICAgICAgICB9XG4gIC8vICAgICAgICAgICAgIGlmICgha2VlcENvbHVtbikge1xuICAvLyAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XG4gIC8vICAgICAgICAgICAgIH1cbiAgLy8gICAgICAgICAgIH1cbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH1cbiAgLy8gICAgIH1cblxuICAvLyAgICAgcmV0dXJuIGRhdGFfRmlsdGVyZWQ7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBkYXRhOyAvLyBpZiBubyBmaWx0ZXIsIHJldHVybiBvcmlnaW5hbCBkYXRhXG4gIC8vIH1cbn1cbiJdfQ==