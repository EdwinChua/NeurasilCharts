import * as i0 from '@angular/core';
import { Injectable, Pipe, EventEmitter, Component, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import * as i3 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@angular/forms';
import { FormsModule } from '@angular/forms';

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
    ;
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
        let data = JSON.parse(JSON.stringify(incomingData)); // make a copy of the data
        let k_arr_Temp = Object.keys(data[0]);
        let k_arr = Object.keys(data[0]);
        let cDat = {};
        for (let i = 0; i < k_arr.length; i++) {
            let currKey = k_arr[i];
            cDat[currKey] = [];
            for (var j in data) {
                cDat[k_arr[i]].push(data[j][currKey]);
            }
        }
        // console.log(cDat)
        let formatObj = {};
        let k_arr_new = Object.keys(cDat);
        returnData._cornerstone = k_arr_new[0];
        for (let i = 0; i < k_arr_new.length; i++) { // for each key in formatted object
            let currKey = k_arr_new[i];
            formatObj[currKey] = {};
            if (currKey != returnData._cornerstone) {
                let testItem;
                for (var j in cDat[currKey]) {
                    if (cDat[currKey][j]) { // set test item and break if the value is not null
                        testItem = cDat[currKey][j];
                        break;
                    }
                }
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
            let cDat_New = {};
            cDat_New[returnData._cornerstone] = Object.keys(cDat);
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
        function isNumber(value) {
            return ((value != null) && !isNaN(Number(value.toString())));
        }
        returnData._formatObject = formatObj;
        returnData.data = cDat;
        // console.log(returnData);
        return returnData;
    }
    chartObjectBuilder(chartType, chartData, useAltAxis, title, yAxisLabelText, yAxisLabelText_Alt, xAxisLabelText, cornerstone, swapLabelsAndDatasets, formatObject, useLogScale, colorPalette, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border) {
        if ((chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.LINE || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) && useAltAxis == true) {
            console.warn("You have enabled alternate axis on a (unsupported) chart type. It has been set to false");
            useAltAxis = false;
        }
        if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            yAxisLabelText_Alt = "Pareto %";
            useAltAxis = true;
        }
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
        let yAxisLabel = { display: false, text: "" };
        if (yAxisLabelText) {
            yAxisLabel.display = true;
            yAxisLabel.text = yAxisLabelText;
        }
        let yAxisLabel_Alt = { display: false, text: "" };
        if (yAxisLabelText_Alt) {
            yAxisLabel_Alt.display = true;
            yAxisLabel_Alt.text = yAxisLabelText_Alt;
        }
        let xAxisLabel = { display: false, text: null };
        if (xAxisLabelText) {
            xAxisLabel.display = true;
            xAxisLabel.text = xAxisLabelText;
        }
        else {
            xAxisLabel.display = true;
            xAxisLabel.text = [" ", " "];
        }
        // console.log(xAxisLabelText)
        if (chartType != NEURASIL_CHART_TYPE.PIE && chartType != NEURASIL_CHART_TYPE.DONUT) {
            if (chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                options.scales = {
                    x: {
                        stacked: true,
                        title: xAxisLabel,
                        ticks: {
                            callback: function (value, index, ticks) {
                                let label = this.getLabelForValue(value);
                                if (!Array.isArray(label)) {
                                    if (label.length <= 10) {
                                        return label;
                                    }
                                    return label.substr(0, 8) + "..."; //truncate
                                }
                                else {
                                    let res = [];
                                    for (var i in label) {
                                        if (label[i][0].length <= 10) {
                                            res.push(label[i][0]);
                                        }
                                        else {
                                            res.push([label[i][0].substr(0, 8) + "..."]);
                                        }
                                    }
                                    return res;
                                }
                            }
                        }
                    },
                    yAxis: {
                        type: useLogScale ? 'logarithmic' : 'linear',
                        position: 'left',
                        stacked: true,
                        title: yAxisLabel
                    }
                };
                if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    let altAxisObj = {
                        //id: 'yAxis_pareto',
                        type: 'linear',
                        position: 'right',
                        display: true,
                        beginAtZero: true,
                        ticks: {},
                        title: yAxisLabel_Alt
                    };
                    altAxisObj.min = 0;
                    altAxisObj.max = 100;
                    altAxisObj.ticks = {
                        stepSize: 80
                    };
                    options.scales.yAxis_pareto = altAxisObj;
                }
            }
            else {
                // if (options.scales == null) options.scales = {};
                // if (options.scales.x == null) options.scales.x = {};
                // options.scales.x.ticks = {
                //   callback: function (value, index, ticks) {
                //     console.log(value, index)
                //     console.log(ticks)
                //     console.log(this.getLabelForValue(value))
                //     return this.getLabelForValue(value).substr(0, 10);//truncate
                //   }
                // }
                options.scales = {
                    x: {
                        title: xAxisLabel,
                        ticks: {
                            callback: function (value, index, ticks) {
                                let label = this.getLabelForValue(value);
                                if (!Array.isArray(label)) {
                                    if (label.length <= 10) {
                                        return label;
                                    }
                                    return label.substr(0, 8) + "..."; //truncate
                                }
                                else {
                                    let res = [];
                                    for (var i in label) {
                                        if (label[i][0].length <= 10) {
                                            res.push(label[i][0]);
                                        }
                                        else {
                                            res.push([label[i][0].substr(0, 8) + "..."]);
                                        }
                                    }
                                    return res;
                                }
                            }
                        }
                    },
                    yAxis: {
                        type: useLogScale ? 'logarithmic' : 'linear',
                        beginAtZero: true,
                        title: yAxisLabel
                    },
                };
                if (useAltAxis) {
                    let altAxisObj = {
                        //id: 'yAxis_alt',
                        display: true,
                        ticks: {
                            beginAtZero: true,
                        },
                        position: 'right',
                        type: 'linear',
                        title: yAxisLabel_Alt
                    };
                    // if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    //   altAxisObj.ticks.min = 0;
                    //   altAxisObj.ticks.max = 100;
                    //   altAxisObj.ticks.stepSize = 80
                    // }
                    options.scales.yAxis_alt = altAxisObj;
                }
            }
        }
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
            type = 'bar';
        }
        else if (chartType == NEURASIL_CHART_TYPE.PIE) {
            type = 'pie';
        }
        else if (chartType == NEURASIL_CHART_TYPE.DONUT) {
            type = 'doughnut';
        }
        let THIS = this;
        // tooltip & title prefix/suffix addition. Title uses default configs for bar /line
        options.tooltips = {};
        options.tooltips.callbacks = {};
        if (chartType == NEURASIL_CHART_TYPE.BAR ||
            chartType == NEURASIL_CHART_TYPE.BAR_LINE ||
            chartType == NEURASIL_CHART_TYPE.LINE ||
            chartType == NEURASIL_CHART_TYPE.STACKED ||
            chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
            options.tooltips.callbacks.label = function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || '';
                if (label) {
                    label += ': ';
                }
                if (swapLabelsAndDatasets) {
                    label += `${formatObject[tooltipItem.xLabel].prefix}` + tooltipItem.yLabel + `${formatObject[tooltipItem.xLabel].suffix}`;
                }
                else {
                    let objKeys = Object.keys(formatObject);
                    let key = objKeys[tooltipItem.datasetIndex + 1];
                    let formatObj = formatObject[key];
                    label += `${formatObj.prefix}` + tooltipItem.yLabel + `${formatObj.suffix}`;
                    ;
                }
                return label;
            };
        }
        else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) {
            options.tooltips.callbacks.label = function (tooltipItem, data) {
                var label = data.labels[tooltipItem.index];
                if (label) {
                    label += ': ';
                }
                let formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
                return label;
            };
            options.tooltips.callbacks.title = function (tooltipItem, data) {
                return data.datasets[tooltipItem[0].datasetIndex].label;
            };
        }
        else if (chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
            options.indexAxis = 'y';
            options.tooltips.callbacks.label = function (tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label;
                if (label) {
                    label += ': ';
                }
                let formatObj;
                if (swapLabelsAndDatasets) {
                    formatObj = formatObject[data.labels[tooltipItem.index]];
                }
                else {
                    formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];
                }
                label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
                return label;
            };
            options.tooltips.callbacks.title = function (tooltipItem, data) {
                return tooltipItem[0].yLabel;
            };
        }
        let returnOpts = {
            plugins: [],
            type: type,
            data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets, colorPalette, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border),
            options: options
        };
        return returnOpts;
    }
    dataParser(chartData, useAltAxis /*boolean*/, chartType /*chartType enum*/, cornerstone, swapLabelsAndDatasets, colorPaletteToUse = null, hoverOpacity, defaultOpacity, hoverOpacity_border, defaultOpacity_border) {
        // helper function to get color array for chart. cycles through when 
        function getPalette(opacity, noOfColors) {
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
            if (colorPaletteToUse) {
                colors = [];
                for (let i in colorPaletteToUse) {
                    let color = colorPaletteToUse[i];
                    if (Utils.colorIsHex(color)) {
                        color = Utils.hexToRgba(color, opacity);
                    }
                    else {
                        color = Utils.rgbToRgba(color, opacity);
                    }
                    colors.push(color);
                }
            }
            if (noOfColors > colors.length) { // if more colors are required than available, cycle through beginning again
                let diff = noOfColors - colors.length;
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
        let colorPalette;
        let colorPalette_hover;
        let bgColorPalette;
        let bgColorPalette_hover;
        if (!swapLabelsAndDatasets) {
            bgColorPalette = getPalette(defaultOpacity, chartData[cornerstone].length);
            bgColorPalette_hover = getPalette(hoverOpacity, chartData[cornerstone].length);
            colorPalette = getPalette(defaultOpacity_border, chartData[cornerstone].length);
            colorPalette_hover = getPalette(hoverOpacity_border, chartData[cornerstone].length);
        }
        else {
            bgColorPalette = getPalette(defaultOpacity, Object.keys(chartData).length);
            bgColorPalette_hover = getPalette(hoverOpacity, Object.keys(chartData).length);
            colorPalette = getPalette(defaultOpacity_border, Object.keys(chartData).length);
            colorPalette_hover = getPalette(hoverOpacity_border, Object.keys(chartData).length);
        }
        let dataSets = [];
        let objKeys = Object.keys(chartData);
        let index = objKeys.indexOf(cornerstone);
        if (index > -1) {
            objKeys.splice(index, 1);
        }
        for (let i = 0; i < objKeys.length; i++) {
            let yAxis = 'yAxis';
            if (useAltAxis) {
                if (i > 0) {
                    yAxis += '_alt';
                }
            }
            // console.log(objKeys[i])
            let dataSet = {
                label: objKeys[i],
                data: chartData[objKeys[i]],
                backgroundColor: bgColorPalette[i],
                borderColor: colorPalette[i],
                hoverBackgroundColor: bgColorPalette_hover[i],
                hoverBorderColor: colorPalette_hover[i],
                borderWidth: 2
            };
            // console.log(dataSet)
            if (chartType == NEURASIL_CHART_TYPE.BAR_LINE) { // ignores stacked and bar options. Makes assumption that only 1st dataset is bar
                if (i == 0) {
                    dataSet.type = 'bar';
                }
                else {
                    dataSet.type = 'line';
                }
            }
            if (chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                dataSet.backgroundColor = bgColorPalette[i];
                dataSet.borderColor = colorPalette[i];
                dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
                dataSet.hoverBorderColor = colorPalette[i];
            }
            else if (chartType == NEURASIL_CHART_TYPE.BAR_LINE || chartType == NEURASIL_CHART_TYPE.LINE) {
                if (dataSet.type == 'bar') {
                    dataSet.backgroundColor = bgColorPalette[i];
                    dataSet.borderColor = colorPalette[i];
                    dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
                    dataSet.hoverBorderColor = colorPalette[i];
                }
                else {
                    dataSet.borderColor = colorPalette[i];
                    dataSet.backgroundColor = 'rgba(0,0,0,0)';
                }
            }
            else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) { // overwrite single color assignment to array.
                dataSet.backgroundColor = bgColorPalette;
                dataSet.borderColor = colorPalette;
                dataSet.hoverBackgroundColor = bgColorPalette_hover;
                dataSet.hoverBorderColor = colorPalette;
            }
            if (chartType != NEURASIL_CHART_TYPE.PIE && chartType != NEURASIL_CHART_TYPE.DONUT) {
                if (chartType != NEURASIL_CHART_TYPE.STACKED && chartType != NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    dataSet.yAxisID = yAxis;
                }
            }
            dataSets.push(dataSet);
        }
        let returnData = {
            labels: chartData[cornerstone],
            datasets: dataSets
        };
        return returnData;
    }
    performParetoAnalysis(props) {
        //modify chart object
        let localSumArr = [];
        let totalSum = 0;
        // calculate the local sum of each datapoint (i.e. for datasets 1, 2, 3, sum of each corresponding datapoint ds1[0] + ds2[0] + ds3[0]) 
        for (let j = 0; j < props.data.datasets[0].data.length; j++) { // takes the first dataset length as reference
            let sum = 0;
            for (let i = 0; i < props.data.datasets.length; i++) { // for each dataset
                let val = parseFloat(props.data.datasets[i].data[j]);
                if (isNaN(val)) {
                    val = 0; // set invalid values as 0
                }
                sum += val;
            }
            localSumArr.push(sum);
            totalSum += sum;
        }
        //populate new array with modified sorting object
        let newArr = []; // this array holds an object with the sum, label, and data from each dataset
        /*
        Each object looks like this:
        o = {
                sum: 418
                labels: "Whatever label"
                0: 66
                1: 98
                2: 67
                3: 96
                4: 91
            }
        */
        for (let i = 0; i < localSumArr.length; i++) {
            let o = {
                sum: localSumArr[i],
                labels: props.data.labels[i],
            };
            for (let j = 0; j < props.data.datasets.length; j++) {
                o[j] = props.data.datasets[j].data[i];
            }
            newArr.push(o);
        }
        //sort new array (newArr) descending ["sum"] property
        newArr.sort(function (a, b) {
            return ((a.sum < b.sum) ? 1 : ((a.sum == b.sum) ? 0 : -1));
        });
        //rebuild and reassign labels array - directly modifies chart object passed in
        let newLabelsArray = [];
        for (let i = 0; i < newArr.length; i++) {
            newLabelsArray.push(newArr[i]["labels"]);
        }
        props.data.labels = newLabelsArray;
        //rebuild and reassign data array for each dataset - directly modifies chart object passed in
        for (let j = 0; j < props.data.datasets.length; j++) {
            let data = [];
            for (let i = 0; i < newArr.length; i++) {
                data.push(newArr[i][j]);
            }
            props.data.datasets[j].data = data;
        }
        //create a sorted local sum array for pareto curve calculations
        let sortedlocalSumArr = [];
        for (let i = 0; i < newArr.length; i++) {
            sortedlocalSumArr.push(newArr[i].sum);
        }
        let rollingSum = 0; // cumulative sum of values
        let paretoLineValues = [];
        let eightyPercentLine = []; // hard coded to 80%
        // calculate and push pareto line, also populate 80% line array
        for (let i = 0; i < sortedlocalSumArr.length; i++) {
            rollingSum += sortedlocalSumArr[i];
            let paretoVal = rollingSum / totalSum * 100;
            paretoLineValues.push(Math.floor(paretoVal * 100) / 100);
            eightyPercentLine.push(80);
        }
        // add pareto curve as a new dataset - directly modifies chart object passed in 
        props.data.datasets.push({
            "label": "Pareto",
            "data": paretoLineValues,
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "rgba(0,0,0,0.8)",
            "borderWidth": 2,
            "type": "line",
            "yAxisID": "yAxis_pareto",
            "datalabels": {
                "display": false
            },
            "pointRadius": 0
        });
        // push 80% line as a new dataset - directly modifies chart object passed in
        props.data.datasets.push({
            "label": "80% line",
            "data": eightyPercentLine,
            "backgroundColor": "rgba(0,0,0,0)",
            "borderColor": "rgba(0,0,0,0.8)",
            "borderWidth": 2,
            "type": "line",
            "yAxisID": "yAxis_pareto",
            "datalabels": {
                "display": false
            },
            "pointRadius": 0
        });
    }
}
/** @nocollapse */ NeurasilChartsService.ɵfac = function NeurasilChartsService_Factory(t) { return new (t || NeurasilChartsService)(); };
/** @nocollapse */ NeurasilChartsService.ɵprov = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjectable({ token: NeurasilChartsService, factory: NeurasilChartsService.ɵfac, providedIn: 'root' });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsService, [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], function () { return []; }, null);
})();

class NeurasilDataFilter {
    transform(data, filterText) {
        if (filterText === "" || filterText === null || filterText === undefined) {
            return data;
        }
        else {
            if (filterText) {
                let filterTerms = filterText.split(',');
                let includeTerms = [];
                let excludeTerms = [];
                let includeColumns = [];
                let excludeColumns = [];
                for (let i in filterTerms) {
                    if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
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
                let data_Filtered = data.filter(function (dataItem) {
                    let k_arr = Object.keys(dataItem);
                    let searchString = "";
                    for (let i in k_arr) {
                        let currKey = k_arr[i];
                        let value = dataItem[currKey];
                        searchString += value + " ";
                    }
                    searchString = searchString.toLowerCase().trim();
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
                });
                if (includeColumns.length > 0 && excludeColumns.length > 0) {
                    window.alert("Unsupported usage of include & exclude columns. Things may break");
                }
                //after filtering is complete, remove columns from clone of data
                else if (excludeColumns.length > 0) {
                    data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
                    //console.log("here")
                    for (var h in data_Filtered) {
                        let dataItem = data_Filtered[h];
                        let k_arr = Object.keys(dataItem);
                        //for (let i in k_arr) {
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Do not allow user to delete first column
                                for (var j in excludeColumns) {
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
                        let dataItem = data_Filtered[h];
                        let k_arr = Object.keys(dataItem);
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Needed?
                                let processedKey = k_arr[i].trim().toLowerCase();
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
/** @nocollapse */ NeurasilDataFilter.ɵfac = function NeurasilDataFilter_Factory(t) { return new (t || NeurasilDataFilter)(); };
/** @nocollapse */ NeurasilDataFilter.ɵpipe = /** @pureOrBreakMyCode */ i0.ɵɵdefinePipe({ name: "neurasilDataFilter", type: NeurasilDataFilter, pure: true });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilDataFilter, [{
            type: Pipe,
            args: [{
                    name: 'neurasilDataFilter',
                    pure: true
                }]
        }], null, null);
})();

class NeurasilChartsToolbarComponent {
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
/** @nocollapse */ NeurasilChartsToolbarComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NeurasilChartsToolbarComponent, selectors: [["neurasil-charts-toolbar"]], inputs: { toolbarProps: "toolbarProps" }, outputs: { toolbarPropsChange: "toolbarPropsChange" }, decls: 41, vars: 3, consts: [[1, "toolbar-container"], [1, "toolbar"], [1, "filter-textbox-container", "input-group", "input-group-sm"], ["type", "text", "placeholder", "Filters", 1, "filter-textbox", "form-control", "noSelect", 3, "ngModel", "ngModelChange", "change"], [1, "input-group", "input-group-sm", "filter-help"], [1, "tooltip_qd_chartHelper"], [1, "tooltiptext_qd_chartHelper"], [1, "chart-selector-container"], [1, "chart-selector", "input-group", "input-group-sm"], [1, "form-control", 3, "ngModel", "ngModelChange"], ["value", "0"], ["value", "7"], ["value", "2"], ["value", "3"], ["value", "1"], ["value", "4"], ["value", "5"], ["value", "9"], ["value", "6"], [2, "float", "right"], [2, "padding-top", "4px", "padding-right", "15px", "padding-left", "5px"], [2, "zoom", "0.8"], [1, "switch", "tooltip_qd_chartHelper"], ["type", "checkbox", "id", "${this.id}_swapCheckbox", 3, "ngModel", "ngModelChange"], [1, "slider", "round"]], template: function NeurasilChartsToolbarComponent_Template(rf, ctx) {
        if (rf & 1) {
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
        }
        if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("ngModel", ctx.toolbarProps._datasetFilter);
            i0.ɵɵadvance(11);
            i0.ɵɵproperty("ngModel", ctx.toolbarProps.chartType);
            i0.ɵɵadvance(23);
            i0.ɵɵproperty("ngModel", ctx.toolbarProps.swapLabelsAndDatasets);
        }
    }, dependencies: [i1.NgSelectOption, i1.ɵNgSelectMultipleOption, i1.DefaultValueAccessor, i1.CheckboxControlValueAccessor, i1.SelectControlValueAccessor, i1.NgControlStatus, i1.NgModel], styles: [".toolbar-container[_ngcontent-%COMP%]{width:100%;height:100%;display:flex;flex-flow:column}.toolbar[_ngcontent-%COMP%]{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container[_ngcontent-%COMP%]{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox[_ngcontent-%COMP%]{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox[_ngcontent-%COMP%]:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help[_ngcontent-%COMP%]{padding-top:4px;float:left}.chart-selector-container[_ngcontent-%COMP%]{float:right}.chart-selector[_ngcontent-%COMP%]{padding-top:4px;float:left}select[_ngcontent-%COMP%]{width:80px}.switch[_ngcontent-%COMP%]{position:relative;display:inline-block;width:60px;height:34px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{display:none}.slider[_ngcontent-%COMP%]{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider[_ngcontent-%COMP%]:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#2196f3}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #2196f3}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translate(26px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}.tooltip_qd_chartHelper[_ngcontent-%COMP%]{position:relative;display:inline-block}.tooltip_qd_chartHelper[_ngcontent-%COMP%]   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper[_ngcontent-%COMP%]:hover   .tooltiptext_qd_chartHelper[_ngcontent-%COMP%]{visibility:visible}"] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsToolbarComponent, [{
            type: Component,
            args: [{ selector: 'neurasil-charts-toolbar', template: "<div class=\"toolbar-container\" >\r\n    <div class=\"toolbar\">\r\n        <div class=\"filter-textbox-container input-group input-group-sm\">\r\n            <input type=\"text\" class=\"filter-textbox form-control noSelect\" placeholder=\"Filters\" [(ngModel)]=\"toolbarProps._datasetFilter\" (change)=\"toolbarPropsChanged($event)\">\r\n        </div>\r\n        <div class=\"input-group input-group-sm filter-help\" >\r\n            <div class=\"tooltip_qd_chartHelper\">?\r\n                <span class=\"tooltiptext_qd_chartHelper\">\r\n                To filter data, use commas to separate data, add - to exclude data.\r\n                <br> <br> \r\n                EITHER use ~ to include columns OR ~! to exclude columns.\r\n                </span>\r\n            </div>\r\n        </div>\r\n\r\n        <div class=\"chart-selector-container\">\r\n            <div class=\"chart-selector input-group input-group-sm\">\r\n                <select class=\"form-control\" [(ngModel)]=\"toolbarProps.chartType\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                    <option value='0'>Bar Chart</option>\r\n                    <option value='7'>Horizontal Bar</option>               \r\n                    <option value='2'>Stacked Bar Chart</option>\r\n                    <option value='3'>Line Chart</option>\r\n                    <option value='1'>Bar & Line Combo</option>\r\n                    <option value='4'>Pie</option>\r\n                    <option value='5'>Donut</option>\r\n                    <!-- <option value='8'>Pareto (1 dataset)</option> -->\r\n                    <option value='9'>Pareto Analysis</option>\r\n                    <option value='6'>Grid View</option>\r\n\r\n                </select>\r\n            </div>\r\n            <div style=\"float:right\">\r\n                <div style=\"padding-top:4px;padding-right: 15px; padding-left:5px\">\r\n                    <span style=\"zoom:0.8;\">\r\n                        <label class=\"switch tooltip_qd_chartHelper\" >\r\n                        <input type='checkbox' id='${this.id}_swapCheckbox'  [(ngModel)]=\"toolbarProps.swapLabelsAndDatasets\" (ngModelChange)=\"toolbarPropsChanged($event)\">\r\n                            <span class=\"slider round\"></span>\r\n                            <span class=\"tooltiptext_qd_chartHelper\">\r\n                                Swap labels and datasets\r\n                            </span>\r\n                        </label>\r\n                    </span>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>", styles: [".toolbar-container{width:100%;height:100%;display:flex;flex-flow:column}.toolbar{background-color:#d3d3d3;padding:4px;border-radius:8px 8px 0 0}.filter-textbox-container{padding-top:4px;float:left;width:40%;padding-left:15px}.filter-textbox{width:100%;border:0px;background-color:#d3d3d3;border-bottom:2px solid darkgrey}.filter-textbox:focus{border:0px;border-bottom:2px solid black;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}.filter-help{padding-top:4px;float:left}.chart-selector-container{float:right}.chart-selector{padding-top:4px;float:left}select{width:80px}.switch{position:relative;display:inline-block;width:60px;height:34px}.switch input{display:none}.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s}.slider:before{position:absolute;content:\"\";height:26px;width:26px;left:4px;bottom:4px;background-color:#fff;transition:.4s}input:checked+.slider{background-color:#2196f3}input:focus+.slider{box-shadow:0 0 1px #2196f3}input:checked+.slider:before{transform:translate(26px)}.slider.round{border-radius:34px}.slider.round:before{border-radius:50%}.tooltip_qd_chartHelper{position:relative;display:inline-block}.tooltip_qd_chartHelper .tooltiptext_qd_chartHelper{visibility:hidden;width:120px;background-color:#000;color:#fff;text-align:center;padding:5px 0;border-radius:6px;position:absolute;z-index:1;margin-top:40px}.tooltip_qd_chartHelper:hover .tooltiptext_qd_chartHelper{visibility:visible}\n"] }]
        }], null, { toolbarProps: [{
                type: Input
            }], toolbarPropsChange: [{
                type: Output
            }] });
})();

const _c0 = ["neurasilChartCanvas"];
function NeurasilChartsComponent_div_1_Template(rf, ctx) {
    if (rf & 1) {
        const _r4 = i0.ɵɵgetCurrentView();
        i0.ɵɵelementStart(0, "div", 6)(1, "neurasil-charts-toolbar", 7);
        i0.ɵɵlistener("toolbarPropsChange", function NeurasilChartsComponent_div_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.toolbarProps = $event); })("toolbarPropsChange", function NeurasilChartsComponent_div_1_Template_neurasil_charts_toolbar_toolbarPropsChange_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r5 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r5.updateToolbarProps($event)); });
        i0.ɵɵelementEnd()();
    }
    if (rf & 2) {
        const ctx_r0 = i0.ɵɵnextContext();
        i0.ɵɵadvance(1);
        i0.ɵɵproperty("toolbarProps", ctx_r0.toolbarProps);
    }
}
function NeurasilChartsComponent_div_5_Template(rf, ctx) {
    if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 8)(1, "div", 9);
        i0.ɵɵtext(2);
        i0.ɵɵelementEnd()();
    }
    if (rf & 2) {
        const ctx_r2 = i0.ɵɵnextContext();
        i0.ɵɵadvance(2);
        i0.ɵɵtextInterpolate1(" ", ctx_r2.noDataMessage, " ");
    }
}
Chart.register(...registerables);
class NeurasilChartsComponent {
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
        this.hoverOpacity = 0.9;
        this.defaultOpacity = 0.5;
        this.hoverOpacity_border = 1;
        this.defaultOpacity_border = 1;
        /** Filter data */
        this.globalFilter = "";
        /** Show data labels
         * @param showDataLabels default: false
        */
        this.showDataLabels = false;
        this.noDataMessage = "No data to display. Check your filters.";
        this.additionalOpts_Plugins = {};
        this.additionalOpts_Elements = {};
        this.useLogScale = false;
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
                let props = this.neurasilChartsService.chartObjectBuilder(this.toolbarProps.chartType, o.data, this.useAltAxis, this.chartTitle, this.yAxisLabelText, this.yAxisLabelText_Alt, this.xAxisLabelText, o._cornerstone, this.toolbarProps.swapLabelsAndDatasets, o._formatObject, this.useLogScale, this.colorPalette, this.hoverOpacity, this.defaultOpacity, this.hoverOpacity_border, this.defaultOpacity_border);
                if (this.toolbarProps.chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
                    this.neurasilChartsService.performParetoAnalysis(props); // modify chart props object
                }
                let THIS = this;
                //Cant put this in service, idk why
                //#region emit onclick event data
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
                //#endregion
                //#region show data labels
                if (this.showDataLabels || isPrinting) {
                    props.plugins.push(ChartDataLabels);
                }
                //#endregion
                //#region add additional options.plugins data
                if (!props.options.plugins) {
                    props.options.plugins = {};
                }
                if (this.additionalOpts_Plugins) {
                    props.options.plugins = this.additionalOpts_Plugins;
                }
                //#endregion
                //#region add additional options.elements data
                if (!props.options.elements) {
                    props.options.elements = {};
                }
                props.options.elements = Object.assign(Object.assign({}, props.options.elements), this.additionalOpts_Elements);
                //#endregion
                //#region format datalabels to 3 decimal places
                props.options.plugins.datalabels = {
                    formatter: function (value, context) {
                        //return Math.round(value*100) + '%';
                        if ((value > 0 && value >= 0.001) || (value < 0 && value < -0.001)) {
                            return Math.round(value * 1000) / 1000;
                        }
                        else if (value > 0 && value < 0.001) {
                            return "< 0.001";
                        }
                        else {
                            return "> -0.001";
                        }
                    }
                };
                //#endregion
                //#region customize tooltip
                if (this.chartType == NEURASIL_CHART_TYPE.DONUT || this.chartType == NEURASIL_CHART_TYPE.PIE) {
                    props.options.plugins.tooltip = {
                        callbacks: {
                            title: function (tooltipItem) {
                                // TODO: could be an issue with multiple datasets
                                return tooltipItem[0].label;
                            },
                            label: function (tooltipItem) {
                                let label = tooltipItem.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (tooltipItem.parsed.y !== null) {
                                    label += `${tooltipItem.parsed}`;
                                }
                                return label;
                            },
                        }
                    };
                }
                else {
                    props.options.plugins.tooltip = {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += `${context.parsed.y}`;
                                }
                                return label;
                            }
                        }
                    };
                }
                //#endregion
                this._canvas = new Chart(ctx, props);
            }
        }
    }
}
/** @nocollapse */ NeurasilChartsComponent.ɵfac = function NeurasilChartsComponent_Factory(t) { return new (t || NeurasilChartsComponent)(i0.ɵɵdirectiveInject(NeurasilChartsService), i0.ɵɵdirectiveInject(NeurasilDataFilter)); };
/** @nocollapse */ NeurasilChartsComponent.ɵcmp = /** @pureOrBreakMyCode */ i0.ɵɵdefineComponent({ type: NeurasilChartsComponent, selectors: [["neurasil-charts"]], viewQuery: function NeurasilChartsComponent_Query(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        }
        if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.canvas = _t.first);
        }
    }, hostBindings: function NeurasilChartsComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵlistener("beforeprint", function NeurasilChartsComponent_beforeprint_HostBindingHandler($event) { return ctx.onBeforePrint($event); }, false, i0.ɵɵresolveWindow)("afterprint", function NeurasilChartsComponent_afterprint_HostBindingHandler($event) { return ctx.onAfterPrint($event); }, false, i0.ɵɵresolveWindow);
        }
    }, inputs: { data: "data", showToolbar: "showToolbar", chartType: "chartType", useAltAxis: "useAltAxis", chartTitle: "chartTitle", xAxisLabelText: "xAxisLabelText", yAxisLabelText: "yAxisLabelText", yAxisLabelText_Alt: "yAxisLabelText_Alt", colorPalette: "colorPalette", hoverOpacity: "hoverOpacity", defaultOpacity: "defaultOpacity", hoverOpacity_border: "hoverOpacity_border", defaultOpacity_border: "defaultOpacity_border", swapLabelsAndDatasets: "swapLabelsAndDatasets", globalFilter: "globalFilter", showDataLabels: "showDataLabels", noDataMessage: "noDataMessage", additionalOpts_Plugins: "additionalOpts_Plugins", additionalOpts_Elements: "additionalOpts_Elements", useLogScale: "useLogScale" }, outputs: { chartTypeChange: "chartTypeChange", showToolbarChange: "showToolbarChange", swapLabelsAndDatasetsChange: "swapLabelsAndDatasetsChange", dataOnClick: "dataOnClick" }, features: [i0.ɵɵProvidersFeature([NeurasilDataFilter]), i0.ɵɵNgOnChangesFeature], decls: 6, vars: 3, consts: [[1, "component-wrapper"], ["class", "toolbar-wrapper", 4, "ngIf"], [1, "canvas-wrapper"], ["id", "neurasilChartCanvas", 3, "ngClass"], ["neurasilChartCanvas", ""], ["class", "overlay", 4, "ngIf"], [1, "toolbar-wrapper"], [3, "toolbarProps", "toolbarPropsChange"], [1, "overlay"], [1, "overlay-contents"]], template: function NeurasilChartsComponent_Template(rf, ctx) {
        if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵtemplate(1, NeurasilChartsComponent_div_1_Template, 2, 1, "div", 1);
            i0.ɵɵelementStart(2, "div", 2);
            i0.ɵɵelement(3, "canvas", 3, 4);
            i0.ɵɵtemplate(5, NeurasilChartsComponent_div_5_Template, 3, 1, "div", 5);
            i0.ɵɵelementEnd()();
        }
        if (rf & 2) {
            i0.ɵɵadvance(1);
            i0.ɵɵproperty("ngIf", ctx.showToolbar);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngClass", ctx.hasData ? "" : "canvas-hidden");
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("ngIf", !ctx.hasData);
        }
    }, dependencies: [i3.NgClass, i3.NgIf, NeurasilChartsToolbarComponent], styles: [".canvas-wrapper[_ngcontent-%COMP%], neurasil-charts-toolbar[_ngcontent-%COMP%]{display:block}.component-wrapper[_ngcontent-%COMP%]{width:100%;height:100%}.toolbar-wrapper[_ngcontent-%COMP%]{display:block;height:50px}.component-wrapper[_ngcontent-%COMP%]{display:flex;flex-flow:column;height:100%}.canvas-wrapper[_ngcontent-%COMP%]{flex:1}.canvas-hidden[_ngcontent-%COMP%]{display:none}.overlay[_ngcontent-%COMP%]{width:100%;height:100%;background-color:#0000001a}.overlay-contents[_ngcontent-%COMP%]{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}"] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsComponent, [{
            type: Component,
            args: [{ selector: 'neurasil-charts', providers: [NeurasilDataFilter], template: "\r\n<div class=\"component-wrapper\">\r\n    <div class=\"toolbar-wrapper\" *ngIf=\"showToolbar\">\r\n        <neurasil-charts-toolbar [(toolbarProps)]=\"toolbarProps\" (toolbarPropsChange)=\"updateToolbarProps($event)\"></neurasil-charts-toolbar>\r\n    </div>\r\n    <div class=\"canvas-wrapper\">\r\n        <canvas [ngClass]=\"hasData ? '' : 'canvas-hidden'\" #neurasilChartCanvas id=\"neurasilChartCanvas\"></canvas>\r\n        <div class=\"overlay\" *ngIf=\"!hasData\">\r\n            <div class=\"overlay-contents\">\r\n                {{noDataMessage}}\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n", styles: [".canvas-wrapper,neurasil-charts-toolbar{display:block}.component-wrapper{width:100%;height:100%}.toolbar-wrapper{display:block;height:50px}.component-wrapper{display:flex;flex-flow:column;height:100%}.canvas-wrapper{flex:1}.canvas-hidden{display:none}.overlay{width:100%;height:100%;background-color:#0000001a}.overlay-contents{font-family:sans-serif;left:50%;float:left;top:50%;transform:translate(-50%,-50%);position:relative}\n"] }]
        }], function () { return [{ type: NeurasilChartsService }, { type: NeurasilDataFilter }]; }, { canvas: [{
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
            }], onBeforePrint: [{
                type: HostListener,
                args: ['window:beforeprint', ['$event']]
            }], onAfterPrint: [{
                type: HostListener,
                args: ['window:afterprint', ['$event']]
            }] });
})();

class NeurasilChartsModule {
}
/** @nocollapse */ NeurasilChartsModule.ɵfac = function NeurasilChartsModule_Factory(t) { return new (t || NeurasilChartsModule)(); };
/** @nocollapse */ NeurasilChartsModule.ɵmod = /** @pureOrBreakMyCode */ i0.ɵɵdefineNgModule({ type: NeurasilChartsModule });
/** @nocollapse */ NeurasilChartsModule.ɵinj = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjector({ imports: [CommonModule,
        FormsModule] });
(function () {
    (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsModule, [{
            type: NgModule,
            args: [{
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
                }]
        }], null, null);
})();
(function () {
    (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NeurasilChartsModule, { declarations: [NeurasilChartsComponent,
            NeurasilChartsToolbarComponent,
            NeurasilDataFilter], imports: [CommonModule,
            FormsModule], exports: [NeurasilChartsComponent, NeurasilDataFilter] });
})();

/*
 * Public API Surface of neurasil-charts
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NEURASIL_CHART_TYPE, NeurasilChartsComponent, NeurasilChartsModule, NeurasilChartsService, NeurasilDataFilter };
//# sourceMappingURL=neurasil-charts.mjs.map
