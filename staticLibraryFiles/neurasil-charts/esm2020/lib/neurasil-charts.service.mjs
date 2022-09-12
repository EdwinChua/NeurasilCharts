import { Injectable } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
import { Utils } from './utils';
import * as i0 from "@angular/core";
export class NeurasilChartsService {
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
            responsive: true
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
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDOztBQUtoQyxNQUFNLE9BQU8scUJBQXFCO0lBRWhDLGdCQUFnQixDQUFDO0lBR2pCLHVCQUF1QixDQUFDLFNBQThCLEVBQUUsWUFBd0IsRUFBRSxxQkFBOEI7UUFDOUcsSUFBSSxVQUFVLEdBQUc7WUFDZixZQUFZLEVBQUUsRUFBRTtZQUNoQixhQUFhLEVBQUUsSUFBSTtZQUNuQixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUE7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUEwQjtRQUUvRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR3RDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FB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cUJBQXFCO2NBSGpDLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG5cclxuICBwYXJzZURhdGFGcm9tRGF0YXNvdXJjZShjaGFydFR5cGU6IE5FVVJBU0lMX0NIQVJUX1RZUEUsIGluY29taW5nRGF0YTogQXJyYXk8YW55Piwgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBib29sZWFuKTogeyBfY29ybmVyc3RvbmU6IHN0cmluZywgX2Zvcm1hdE9iamVjdDogeyBwcmVmaXg6IHN0cmluZywgc3VmZml4OiBzdHJpbmcgfSwgZGF0YTogQXJyYXk8YW55PiB9IHtcclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBfY29ybmVyc3RvbmU6IFwiXCIsXHJcbiAgICAgIF9mb3JtYXRPYmplY3Q6IG51bGwsXHJcbiAgICAgIGRhdGE6IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5jb21pbmdEYXRhKSk7IC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBkYXRhXHJcblxyXG4gICAgbGV0IGtfYXJyX1RlbXAgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcclxuXHJcblxyXG4gICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XHJcbiAgICBsZXQgY0RhdCA9IHt9O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldXHJcbiAgICAgIGNEYXRbY3VycktleV0gPSBbXTtcclxuICAgICAgZm9yICh2YXIgaiBpbiBkYXRhKSB7XHJcbiAgICAgICAgY0RhdFtrX2FycltpXV0ucHVzaChkYXRhW2pdW2N1cnJLZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coY0RhdClcclxuXHJcbiAgICBsZXQgZm9ybWF0T2JqID0ge307XHJcbiAgICBsZXQga19hcnJfbmV3ID0gT2JqZWN0LmtleXMoY0RhdCk7XHJcbiAgICByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSA9IGtfYXJyX25ld1swXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyX25ldy5sZW5ndGg7IGkrKykgeyAvLyBmb3IgZWFjaCBrZXkgaW4gZm9ybWF0dGVkIG9iamVjdFxyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyX25ld1tpXTtcclxuICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge307XHJcbiAgICAgIGlmIChjdXJyS2V5ICE9IHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKSB7XHJcbiAgICAgICAgbGV0IHRlc3RJdGVtO1xyXG4gICAgICAgIGZvciAodmFyIGogaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKGNEYXRbY3VycktleV1bal0pIHsgLy8gc2V0IHRlc3QgaXRlbSBhbmQgYnJlYWsgaWYgdGhlIHZhbHVlIGlzIG5vdCBudWxsXHJcbiAgICAgICAgICAgIHRlc3RJdGVtID0gY0RhdFtjdXJyS2V5XVtqXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICBsZXQgc3VmZml4ID0gXCJcIjtcclxuICAgICAgICBpZiAodGVzdEl0ZW0pIHtcclxuICAgICAgICAgIGlmICghaXNOdW1iZXIodGVzdEl0ZW0pKSB7XHJcbiAgICAgICAgICAgIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMSkpKSB7XHJcbiAgICAgICAgICAgICAgcHJlZml4ID0gdGVzdEl0ZW0uc3Vic3RyKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMCwgdGVzdEl0ZW0ubGVuZ3RoIC0gMSkpKSB7XHJcbiAgICAgICAgICAgICAgc3VmZml4ID0gdGVzdEl0ZW0uc3Vic3RyKHRlc3RJdGVtLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7XHJcbiAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICAgIHN1ZmZpeDogc3VmZml4XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3JtYXQgZWFjaCBkYXRhIGluIHRoZSBpbmRpdmlkdWFsIGFycmF5c1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKHByZWZpeCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNEYXRbY3VycktleV1ba10gPSBjRGF0W2N1cnJLZXldW2tdLnJlcGxhY2UocHJlZml4LCBcIlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzdWZmaXggIT0gXCJcIikge1xyXG4gICAgICAgICAgICBjRGF0W2N1cnJLZXldW2tdID0gY0RhdFtjdXJyS2V5XVtrXS5yZXBsYWNlKHN1ZmZpeCwgXCJcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy9uZXdTdHIgPSBjRGF0XHJcbiAgICAgICAgICAvL3JlcGxhY2VEYXRhLnB1c2goKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycktleSA9PSByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSkge1xyXG4gICAgICAgIGZvcm1hdE9ialtjdXJyS2V5XSA9IHtcclxuICAgICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICAgIHN1ZmZpeDogXCJcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKCFzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgLy8gZG8gbm90aGluZztcclxuICAgICAgLy8gcmV0dXJuIGNEYXQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbGV0IGNEYXRfTmV3ID0ge307XHJcblxyXG4gICAgICBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0gPSBPYmplY3Qua2V5cyhjRGF0KTtcclxuICAgICAgbGV0IGluZGV4ID0gY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdLmluZGV4T2YocmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpO1xyXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBqIGluIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXSkge1xyXG4gICAgICAgICAgY0RhdF9OZXdbY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1baV1dLnB1c2goY0RhdFtjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1bal1dW2ldKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL3JldHVybiBjRGF0X05ldztcclxuICAgICAgY0RhdCA9IGNEYXRfTmV3OyAvLyByZWFzc2lnbiB0byBjRGF0XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAvLyBBZGQgc3VmZml4ZXMgdG8gYXV0by1nZW5lcmF0ZWQgbGluZXNcclxuICAgICAgZm9ybWF0T2JqW1wiUGFyZXRvXCJdID0ge1xyXG4gICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICBzdWZmaXg6IFwiJVwiXHJcbiAgICAgIH1cclxuICAgICAgZm9ybWF0T2JqW1wiODAlIGxpbmVcIl0gPSB7XHJcbiAgICAgICAgcHJlZml4OiBcIlwiLFxyXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuICgodmFsdWUgIT0gbnVsbCkgJiYgIWlzTmFOKE51bWJlcih2YWx1ZS50b1N0cmluZygpKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybkRhdGEuX2Zvcm1hdE9iamVjdCA9IGZvcm1hdE9iajtcclxuICAgIHJldHVybkRhdGEuZGF0YSA9IGNEYXQ7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXR1cm5EYXRhKTtcclxuICAgIHJldHVybiByZXR1cm5EYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIGNoYXJ0T2JqZWN0QnVpbGRlcihcclxuICAgIGNoYXJ0VHlwZSxcclxuICAgIGNoYXJ0RGF0YSxcclxuICAgIHVzZUFsdEF4aXMsXHJcbiAgICB0aXRsZSxcclxuICAgIHlBeGlzTGFiZWxUZXh0LFxyXG4gICAgeUF4aXNMYWJlbFRleHRfQWx0LFxyXG4gICAgeEF4aXNMYWJlbFRleHQsXHJcbiAgICBjb3JuZXJzdG9uZSxcclxuICAgIHN3YXBMYWJlbHNBbmREYXRhc2V0cyxcclxuICAgIGZvcm1hdE9iamVjdCxcclxuICAgIHVzZUxvZ1NjYWxlLFxyXG4gICAgY29sb3JQYWxldHRlLFxyXG4gICAgaG92ZXJPcGFjaXR5LFxyXG4gICAgZGVmYXVsdE9wYWNpdHksXHJcbiAgICBob3Zlck9wYWNpdHlfYm9yZGVyLFxyXG4gICAgZGVmYXVsdE9wYWNpdHlfYm9yZGVyXHJcbiAgKSB7XHJcbiAgICBpZiAoKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSAmJiB1c2VBbHRBeGlzID09IHRydWUpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiWW91IGhhdmUgZW5hYmxlZCBhbHRlcm5hdGUgYXhpcyBvbiBhICh1bnN1cHBvcnRlZCkgY2hhcnQgdHlwZS4gSXQgaGFzIGJlZW4gc2V0IHRvIGZhbHNlXCIpO1xyXG4gICAgICB1c2VBbHRBeGlzID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgIHlBeGlzTGFiZWxUZXh0X0FsdCA9IFwiUGFyZXRvICVcIjtcclxuICAgICAgdXNlQWx0QXhpcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9wdGlvbnM6IGFueSA9IHtcclxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2UsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWVcclxuICAgIH07XHJcbiAgICBpZiAodGl0bGUpIHtcclxuICAgICAgb3B0aW9ucy50aXRsZSA9IHtcclxuICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgIHRleHQ6IHRpdGxlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgeUF4aXNMYWJlbCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IFwiXCIgfVxyXG4gICAgaWYgKHlBeGlzTGFiZWxUZXh0KSB7XHJcbiAgICAgIHlBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHlBeGlzTGFiZWwudGV4dCA9IHlBeGlzTGFiZWxUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB5QXhpc0xhYmVsX0FsdCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IFwiXCIgfVxyXG4gICAgaWYgKHlBeGlzTGFiZWxUZXh0X0FsdCkge1xyXG4gICAgICB5QXhpc0xhYmVsX0FsdC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeUF4aXNMYWJlbF9BbHQudGV4dCA9IHlBeGlzTGFiZWxUZXh0X0FsdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeEF4aXNMYWJlbCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IG51bGwgfTtcclxuICAgIGlmICh4QXhpc0xhYmVsVGV4dCkge1xyXG4gICAgICB4QXhpc0xhYmVsLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB4QXhpc0xhYmVsLnRleHQgPSB4QXhpc0xhYmVsVGV4dDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB4QXhpc0xhYmVsLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB4QXhpc0xhYmVsLnRleHQgPSBbXCIgXCIsIFwiIFwiXTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gY29uc29sZS5sb2coeEF4aXNMYWJlbFRleHQpXHJcbiAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuc2NhbGVzID0ge1xyXG4gICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICB0aXRsZTogeEF4aXNMYWJlbCxcclxuICAgICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgdGlja3MpIHtcclxuICAgICAgICAgICAgICAgIGxldCBsYWJlbCA9IHRoaXMuZ2V0TGFiZWxGb3JWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobGFiZWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmIChsYWJlbC5sZW5ndGggPD0gMTApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsLnN1YnN0cigwLCA4KSArIFwiLi4uXCI7Ly90cnVuY2F0ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBsYWJlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsYWJlbFtpXVswXS5sZW5ndGggPD0gMTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGxhYmVsW2ldWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChbbGFiZWxbaV1bMF0uc3Vic3RyKDAsIDgpICsgXCIuLi5cIl0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IHVzZUxvZ1NjYWxlID8gJ2xvZ2FyaXRobWljJzonbGluZWFyJyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdsZWZ0JyxcclxuICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG5cclxuICAgICAgICAgIGxldCBhbHRBeGlzT2JqOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIC8vaWQ6ICd5QXhpc19wYXJldG8nLFxyXG4gICAgICAgICAgICB0eXBlOiAnbGluZWFyJyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxyXG4gICAgICAgICAgICB0aWNrczoge30sXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsX0FsdFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYWx0QXhpc09iai5taW4gPSAwO1xyXG4gICAgICAgICAgYWx0QXhpc09iai5tYXggPSAxMDA7XHJcbiAgICAgICAgICBhbHRBeGlzT2JqLnRpY2tzID0ge1xyXG4gICAgICAgICAgICBzdGVwU2l6ZTogODBcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvcHRpb25zLnNjYWxlcy55QXhpc19wYXJldG8gPSBhbHRBeGlzT2JqO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGlmIChvcHRpb25zLnNjYWxlcyA9PSBudWxsKSBvcHRpb25zLnNjYWxlcyA9IHt9O1xyXG4gICAgICAgIC8vIGlmIChvcHRpb25zLnNjYWxlcy54ID09IG51bGwpIG9wdGlvbnMuc2NhbGVzLnggPSB7fTtcclxuICAgICAgICAvLyBvcHRpb25zLnNjYWxlcy54LnRpY2tzID0ge1xyXG4gICAgICAgIC8vICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHRpY2tzKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHZhbHVlLCBpbmRleClcclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGlja3MpXHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHRoaXMuZ2V0TGFiZWxGb3JWYWx1ZSh2YWx1ZSkpXHJcbiAgICAgICAgLy8gICAgIHJldHVybiB0aGlzLmdldExhYmVsRm9yVmFsdWUodmFsdWUpLnN1YnN0cigwLCAxMCk7Ly90cnVuY2F0ZVxyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH1cclxuICAgICAgICBvcHRpb25zLnNjYWxlcyA9IHtcclxuICAgICAgICAgIHg6IHtcclxuICAgICAgICAgICAgdGl0bGU6IHhBeGlzTGFiZWwsXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHRpY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLmdldExhYmVsRm9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGxhYmVsKSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbC5zdWJzdHIoMCwgOCkgKyBcIi4uLlwiOy8vdHJ1bmNhdGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxbaV1bMF0ubGVuZ3RoIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChsYWJlbFtpXVswXSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goW2xhYmVsW2ldWzBdLnN1YnN0cigwLCA4KSArIFwiLi4uXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VMb2dTY2FsZSA/ICdsb2dhcml0aG1pYyc6J2xpbmVhcicsXHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1c2VBbHRBeGlzKSB7XHJcbiAgICAgICAgICBsZXQgYWx0QXhpc09iajogYW55ID0ge1xyXG4gICAgICAgICAgICAvL2lkOiAneUF4aXNfYWx0JyxcclxuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgIHR5cGU6ICdsaW5lYXInLFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbF9BbHRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLm1pbiA9IDA7XHJcbiAgICAgICAgICAvLyAgIGFsdEF4aXNPYmoudGlja3MubWF4ID0gMTAwO1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLnN0ZXBTaXplID0gODBcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIG9wdGlvbnMuc2NhbGVzLnlBeGlzX2FsdCA9IGFsdEF4aXNPYmo7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB0eXBlO1xyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUpIHtcclxuICAgICAgdHlwZSA9ICdsaW5lJ1xyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICB0eXBlID0gJ2JhcidcclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcclxuICAgICAgdHlwZSA9ICdiYXInXHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSkge1xyXG4gICAgICB0eXBlID0gJ3BpZSdcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgIHR5cGUgPSAnZG91Z2hudXQnXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCBUSElTID0gdGhpcztcclxuXHJcbiAgICAvLyB0b29sdGlwICYgdGl0bGUgcHJlZml4L3N1ZmZpeCBhZGRpdGlvbi4gVGl0bGUgdXNlcyBkZWZhdWx0IGNvbmZpZ3MgZm9yIGJhciAvbGluZVxyXG4gICAgb3B0aW9ucy50b29sdGlwcyA9IHt9O1xyXG4gICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MgPSB7fTtcclxuXHJcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbCB8fCAnJztcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iamVjdFt0b29sdGlwSXRlbS54TGFiZWxdLnByZWZpeH1gICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgYCR7Zm9ybWF0T2JqZWN0W3Rvb2x0aXBJdGVtLnhMYWJlbF0uc3VmZml4fWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBsZXQgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGZvcm1hdE9iamVjdCk7XHJcbiAgICAgICAgICBsZXQga2V5ID0gb2JqS2V5c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXggKyAxXVxyXG4gICAgICAgICAgbGV0IGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtrZXldO1xyXG4gICAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH1gICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgYCR7Zm9ybWF0T2JqLnN1ZmZpeH1gOztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XTtcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmb3JtYXRPYmo7XHJcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XV07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9JHtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0uZGF0YVt0b29sdGlwSXRlbS5pbmRleF19JHtmb3JtYXRPYmouc3VmZml4fWA7XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLnRpdGxlID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1bMF0uZGF0YXNldEluZGV4XS5sYWJlbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUikge1xyXG4gICAgICBvcHRpb25zLmluZGV4QXhpcyA9ICd5JztcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZvcm1hdE9iajtcclxuICAgICAgICBpZiAoc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW0uaW5kZXhdXTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWxdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH0ke2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5kYXRhW3Rvb2x0aXBJdGVtLmluZGV4XX0ke2Zvcm1hdE9iai5zdWZmaXh9YDtcclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MudGl0bGUgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRvb2x0aXBJdGVtWzBdLnlMYWJlbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgcmV0dXJuT3B0cyA9IHtcclxuICAgICAgcGx1Z2luczogW10sXHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YVBhcnNlcihcclxuICAgICAgICBjaGFydERhdGEsXHJcbiAgICAgICAgdXNlQWx0QXhpcyxcclxuICAgICAgICBjaGFydFR5cGUsXHJcbiAgICAgICAgY29ybmVyc3RvbmUsXHJcbiAgICAgICAgc3dhcExhYmVsc0FuZERhdGFzZXRzLFxyXG4gICAgICAgIGNvbG9yUGFsZXR0ZSxcclxuICAgICAgICBob3Zlck9wYWNpdHksXHJcbiAgICAgICAgZGVmYXVsdE9wYWNpdHksXHJcbiAgICAgICAgaG92ZXJPcGFjaXR5X2JvcmRlcixcclxuICAgICAgICBkZWZhdWx0T3BhY2l0eV9ib3JkZXIpLFxyXG4gICAgICBvcHRpb25zOiBvcHRpb25zXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuT3B0cztcclxuICB9XHJcblxyXG4gIGRhdGFQYXJzZXIoXHJcbiAgICBjaGFydERhdGEsXHJcbiAgICB1c2VBbHRBeGlzIC8qYm9vbGVhbiovLFxyXG4gICAgY2hhcnRUeXBlIC8qY2hhcnRUeXBlIGVudW0qLyxcclxuICAgIGNvcm5lcnN0b25lLFxyXG4gICAgc3dhcExhYmVsc0FuZERhdGFzZXRzLFxyXG4gICAgY29sb3JQYWxldHRlVG9Vc2U6IEFycmF5PHN0cmluZz4gPSBudWxsLFxyXG4gICAgaG92ZXJPcGFjaXR5LFxyXG4gICAgZGVmYXVsdE9wYWNpdHksXHJcbiAgICBob3Zlck9wYWNpdHlfYm9yZGVyLFxyXG4gICAgZGVmYXVsdE9wYWNpdHlfYm9yZGVyKSBcclxuICB7XHJcblxyXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBjb2xvciBhcnJheSBmb3IgY2hhcnQuIGN5Y2xlcyB0aHJvdWdoIHdoZW4gXHJcbiAgICBmdW5jdGlvbiBnZXRQYWxldHRlKG9wYWNpdHksIG5vT2ZDb2xvcnMpIHtcclxuICAgICAgbGV0IGNvbG9ycyA9IFtcclxuICAgICAgICBgcmdiYSgxOTksMjMzLDE4MCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMTI3LDIwNSwxODcsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDY1LDE4MiwxOTYsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDI5LDE0NSwxOTIsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDM0LDk0LDE2OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMzcsNTIsMTQ4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSg4LDI5LDg4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTQsMTc4LDc2LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTMsMTQxLDYwLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTIsNzgsNDIsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDIyNywyNiwyOCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMTg5LDAsMzgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDEyOCwwLDM4LCR7b3BhY2l0eX0pYFxyXG4gICAgICBdO1xyXG4gICAgICBpZiAoY29sb3JQYWxldHRlVG9Vc2UpIHtcclxuICAgICAgICBjb2xvcnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGNvbG9yUGFsZXR0ZVRvVXNlKSB7XHJcbiAgICAgICAgICBsZXQgY29sb3IgPSBjb2xvclBhbGV0dGVUb1VzZVtpXTtcclxuICAgICAgICAgIGlmIChVdGlscy5jb2xvcklzSGV4KGNvbG9yKSkge1xyXG4gICAgICAgICAgICBjb2xvciA9IFV0aWxzLmhleFRvUmdiYShjb2xvciwgb3BhY2l0eSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb2xvciA9IFV0aWxzLnJnYlRvUmdiYShjb2xvciwgb3BhY2l0eSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb2xvcnMucHVzaChjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuICAgICAgaWYgKG5vT2ZDb2xvcnMgPiBjb2xvcnMubGVuZ3RoKSB7IC8vIGlmIG1vcmUgY29sb3JzIGFyZSByZXF1aXJlZCB0aGFuIGF2YWlsYWJsZSwgY3ljbGUgdGhyb3VnaCBiZWdpbm5pbmcgYWdhaW5cclxuICAgICAgICBsZXQgZGlmZiA9IG5vT2ZDb2xvcnMgLSBjb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb2xvcnNMZW5ndGggPSBjb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGRpZmY7IGkpIHsgLy8gTk8gSU5DUkVNRU5UIEhFUkVcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sb3JzTGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goY29sb3JzW2pdKVxyXG4gICAgICAgICAgICBpKys7IC8vIElOQ1JFTUVOVCBIRVJFXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjb2xvclBhbGV0dGU7XHJcbiAgICBsZXQgY29sb3JQYWxldHRlX2hvdmVyO1xyXG4gICAgbGV0IGJnQ29sb3JQYWxldHRlO1xyXG4gICAgbGV0IGJnQ29sb3JQYWxldHRlX2hvdmVyO1xyXG4gICAgaWYgKCFzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgYmdDb2xvclBhbGV0dGUgPSBnZXRQYWxldHRlKGRlZmF1bHRPcGFjaXR5LCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgICAgYmdDb2xvclBhbGV0dGVfaG92ZXIgPSBnZXRQYWxldHRlKGhvdmVyT3BhY2l0eSwgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICAgIGNvbG9yUGFsZXR0ZSA9IGdldFBhbGV0dGUoZGVmYXVsdE9wYWNpdHlfYm9yZGVyLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgICAgY29sb3JQYWxldHRlX2hvdmVyID0gZ2V0UGFsZXR0ZShob3Zlck9wYWNpdHlfYm9yZGVyLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGJnQ29sb3JQYWxldHRlID0gZ2V0UGFsZXR0ZShkZWZhdWx0T3BhY2l0eSwgT2JqZWN0LmtleXMoY2hhcnREYXRhKS5sZW5ndGgpXHJcbiAgICAgIGJnQ29sb3JQYWxldHRlX2hvdmVyID0gZ2V0UGFsZXR0ZShob3Zlck9wYWNpdHksIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgICBjb2xvclBhbGV0dGUgPSBnZXRQYWxldHRlKGRlZmF1bHRPcGFjaXR5X2JvcmRlciwgT2JqZWN0LmtleXMoY2hhcnREYXRhKS5sZW5ndGgpXHJcbiAgICAgIGNvbG9yUGFsZXR0ZV9ob3ZlciA9IGdldFBhbGV0dGUoaG92ZXJPcGFjaXR5X2JvcmRlciwgT2JqZWN0LmtleXMoY2hhcnREYXRhKS5sZW5ndGgpXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBsZXQgZGF0YVNldHMgPSBbXTtcclxuICAgIGxldCBvYmpLZXlzID0gT2JqZWN0LmtleXMoY2hhcnREYXRhKTtcclxuICAgIGxldCBpbmRleCA9IG9iaktleXMuaW5kZXhPZihjb3JuZXJzdG9uZSk7XHJcbiAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICBvYmpLZXlzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqS2V5cy5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgbGV0IHlBeGlzID0gJ3lBeGlzJztcclxuICAgICAgaWYgKHVzZUFsdEF4aXMpIHtcclxuICAgICAgICBpZiAoaSA+IDApIHtcclxuICAgICAgICAgIHlBeGlzICs9ICdfYWx0JztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy8gY29uc29sZS5sb2cob2JqS2V5c1tpXSlcclxuICAgICAgbGV0IGRhdGFTZXQ6IGFueSA9IHtcclxuICAgICAgICBsYWJlbDogb2JqS2V5c1tpXSxcclxuICAgICAgICBkYXRhOiBjaGFydERhdGFbb2JqS2V5c1tpXV0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yUGFsZXR0ZVtpXSxcclxuICAgICAgICBib3JkZXJDb2xvcjogY29sb3JQYWxldHRlW2ldLFxyXG4gICAgICAgIGhvdmVyQmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yUGFsZXR0ZV9ob3ZlcltpXSxcclxuICAgICAgICBob3ZlckJvcmRlckNvbG9yOiBjb2xvclBhbGV0dGVfaG92ZXJbaV0sXHJcbiAgICAgICAgYm9yZGVyV2lkdGg6IDJcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGFTZXQpXHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSkgeyAvLyBpZ25vcmVzIHN0YWNrZWQgYW5kIGJhciBvcHRpb25zLiBNYWtlcyBhc3N1bXB0aW9uIHRoYXQgb25seSAxc3QgZGF0YXNldCBpcyBiYXJcclxuICAgICAgICBpZiAoaSA9PSAwKSB7XHJcbiAgICAgICAgICBkYXRhU2V0LnR5cGUgPSAnYmFyJztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YVNldC50eXBlID0gJ2xpbmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsZXR0ZVtpXTtcclxuICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlW2ldO1xyXG4gICAgICAgIGRhdGFTZXQuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsZXR0ZV9ob3ZlcltpXTtcclxuICAgICAgICBkYXRhU2V0LmhvdmVyQm9yZGVyQ29sb3IgPSBjb2xvclBhbGV0dGVbaV07XHJcbiAgICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSkge1xyXG4gICAgICAgIGlmIChkYXRhU2V0LnR5cGUgPT0gJ2JhcicpIHtcclxuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGV0dGVbaV07XHJcbiAgICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5ob3ZlckJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxldHRlX2hvdmVyW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5ob3ZlckJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlW2ldO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgey8vIG92ZXJ3cml0ZSBzaW5nbGUgY29sb3IgYXNzaWdubWVudCB0byBhcnJheS5cclxuICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxldHRlO1xyXG4gICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGV0dGU7XHJcbiAgICAgICAgZGF0YVNldC5ob3ZlckJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxldHRlX2hvdmVyO1xyXG4gICAgICAgIGRhdGFTZXQuaG92ZXJCb3JkZXJDb2xvciA9IGNvbG9yUGFsZXR0ZTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGlmIChjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCAmJiBjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgZGF0YVNldC55QXhpc0lEID0geUF4aXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhU2V0cy5wdXNoKGRhdGFTZXQpO1xyXG4gICAgfVxyXG4gICAgbGV0IHJldHVybkRhdGEgPSB7XHJcbiAgICAgIGxhYmVsczogY2hhcnREYXRhW2Nvcm5lcnN0b25lXSxcclxuICAgICAgZGF0YXNldHM6IGRhdGFTZXRzXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuRGF0YTtcclxuICB9XHJcblxyXG4gIHBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcykge1xyXG4gICAgLy9tb2RpZnkgY2hhcnQgb2JqZWN0XHJcbiAgICBsZXQgbG9jYWxTdW1BcnIgPSBbXTtcclxuICAgIGxldCB0b3RhbFN1bSA9IDA7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBsb2NhbCBzdW0gb2YgZWFjaCBkYXRhcG9pbnQgKGkuZS4gZm9yIGRhdGFzZXRzIDEsIDIsIDMsIHN1bSBvZiBlYWNoIGNvcnJlc3BvbmRpbmcgZGF0YXBvaW50IGRzMVswXSArIGRzMlswXSArIGRzM1swXSkgXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHByb3BzLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGg7IGorKykgeyAvLyB0YWtlcyB0aGUgZmlyc3QgZGF0YXNldCBsZW5ndGggYXMgcmVmZXJlbmNlXHJcbiAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmRhdGEuZGF0YXNldHMubGVuZ3RoOyBpKyspIHsgLy8gZm9yIGVhY2ggZGF0YXNldFxyXG4gICAgICAgIGxldCB2YWwgPSBwYXJzZUZsb2F0KHByb3BzLmRhdGEuZGF0YXNldHNbaV0uZGF0YVtqXSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHtcclxuICAgICAgICAgIHZhbCA9IDA7IC8vIHNldCBpbnZhbGlkIHZhbHVlcyBhcyAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1bSArPSB2YWxcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN1bUFyci5wdXNoKHN1bSk7XHJcbiAgICAgIHRvdGFsU3VtICs9IHN1bTtcclxuICAgIH1cclxuXHJcbiAgICAvL3BvcHVsYXRlIG5ldyBhcnJheSB3aXRoIG1vZGlmaWVkIHNvcnRpbmcgb2JqZWN0XHJcbiAgICBsZXQgbmV3QXJyID0gW107IC8vIHRoaXMgYXJyYXkgaG9sZHMgYW4gb2JqZWN0IHdpdGggdGhlIHN1bSwgbGFiZWwsIGFuZCBkYXRhIGZyb20gZWFjaCBkYXRhc2V0XHJcbiAgICAvKlxyXG4gICAgRWFjaCBvYmplY3QgbG9va3MgbGlrZSB0aGlzOlxyXG4gICAgbyA9IHtcclxuICAgICAgICAgICAgc3VtOiA0MThcclxuICAgICAgICAgICAgbGFiZWxzOiBcIldoYXRldmVyIGxhYmVsXCJcclxuICAgICAgICAgICAgMDogNjZcclxuICAgICAgICAgICAgMTogOThcclxuICAgICAgICAgICAgMjogNjdcclxuICAgICAgICAgICAgMzogOTZcclxuICAgICAgICAgICAgNDogOTFcclxuICAgICAgICB9XHJcbiAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN1bUFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbyA9IHtcclxuICAgICAgICBzdW06IGxvY2FsU3VtQXJyW2ldLFxyXG4gICAgICAgIGxhYmVsczogcHJvcHMuZGF0YS5sYWJlbHNbaV0sXHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgb1tqXSA9IHByb3BzLmRhdGEuZGF0YXNldHNbal0uZGF0YVtpXTtcclxuICAgICAgfVxyXG4gICAgICBuZXdBcnIucHVzaChvKVxyXG4gICAgfVxyXG5cclxuICAgIC8vc29ydCBuZXcgYXJyYXkgKG5ld0FycikgZGVzY2VuZGluZyBbXCJzdW1cIl0gcHJvcGVydHlcclxuICAgIG5ld0Fyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiAoKGEuc3VtIDwgYi5zdW0pID8gMSA6ICgoYS5zdW0gPT0gYi5zdW0pID8gMCA6IC0xKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGxhYmVscyBhcnJheSAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGxldCBuZXdMYWJlbHNBcnJheSA9IFtdXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBuZXdMYWJlbHNBcnJheS5wdXNoKG5ld0FycltpXVtcImxhYmVsc1wiXSk7XHJcbiAgICB9XHJcbiAgICBwcm9wcy5kYXRhLmxhYmVscyA9IG5ld0xhYmVsc0FycmF5O1xyXG5cclxuICAgIC8vcmVidWlsZCBhbmQgcmVhc3NpZ24gZGF0YSBhcnJheSBmb3IgZWFjaCBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGxldCBkYXRhID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3QXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgZGF0YS5wdXNoKG5ld0FycltpXVtqXSlcclxuICAgICAgfVxyXG4gICAgICBwcm9wcy5kYXRhLmRhdGFzZXRzW2pdLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY3JlYXRlIGEgc29ydGVkIGxvY2FsIHN1bSBhcnJheSBmb3IgcGFyZXRvIGN1cnZlIGNhbGN1bGF0aW9uc1xyXG4gICAgbGV0IHNvcnRlZGxvY2FsU3VtQXJyID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBzb3J0ZWRsb2NhbFN1bUFyci5wdXNoKG5ld0FycltpXS5zdW0pXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJvbGxpbmdTdW0gPSAwOyAvLyBjdW11bGF0aXZlIHN1bSBvZiB2YWx1ZXNcclxuICAgIGxldCBwYXJldG9MaW5lVmFsdWVzID0gW107XHJcbiAgICBsZXQgZWlnaHR5UGVyY2VudExpbmUgPSBbXTsgLy8gaGFyZCBjb2RlZCB0byA4MCVcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgYW5kIHB1c2ggcGFyZXRvIGxpbmUsIGFsc28gcG9wdWxhdGUgODAlIGxpbmUgYXJyYXlcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc29ydGVkbG9jYWxTdW1BcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgcm9sbGluZ1N1bSArPSBzb3J0ZWRsb2NhbFN1bUFycltpXTtcclxuICAgICAgbGV0IHBhcmV0b1ZhbCA9IHJvbGxpbmdTdW0gLyB0b3RhbFN1bSAqIDEwMDtcclxuICAgICAgcGFyZXRvTGluZVZhbHVlcy5wdXNoKE1hdGguZmxvb3IocGFyZXRvVmFsICogMTAwKSAvIDEwMCk7XHJcbiAgICAgIGVpZ2h0eVBlcmNlbnRMaW5lLnB1c2goODApXHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIHBhcmV0byBjdXJ2ZSBhcyBhIG5ldyBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpbiBcclxuICAgIHByb3BzLmRhdGEuZGF0YXNldHMucHVzaCh7XHJcbiAgICAgIFwibGFiZWxcIjogXCJQYXJldG9cIixcclxuICAgICAgXCJkYXRhXCI6IHBhcmV0b0xpbmVWYWx1ZXMsXHJcbiAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiYSgwLDAsMCwwKVwiLFxyXG4gICAgICBcImJvcmRlckNvbG9yXCI6IFwicmdiYSgwLDAsMCwwLjgpXCIsXHJcbiAgICAgIFwiYm9yZGVyV2lkdGhcIjogMixcclxuICAgICAgXCJ0eXBlXCI6IFwibGluZVwiLFxyXG4gICAgICBcInlBeGlzSURcIjogXCJ5QXhpc19wYXJldG9cIixcclxuICAgICAgXCJkYXRhbGFiZWxzXCI6IHtcclxuICAgICAgICBcImRpc3BsYXlcIjogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgXCJwb2ludFJhZGl1c1wiOiAwXHJcbiAgICB9KVxyXG5cclxuICAgIC8vIHB1c2ggODAlIGxpbmUgYXMgYSBuZXcgZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIHByb3BzLmRhdGEuZGF0YXNldHMucHVzaCh7XHJcbiAgICAgIFwibGFiZWxcIjogXCI4MCUgbGluZVwiLFxyXG4gICAgICBcImRhdGFcIjogZWlnaHR5UGVyY2VudExpbmUsXHJcbiAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6IFwicmdiYSgwLDAsMCwwKVwiLFxyXG4gICAgICBcImJvcmRlckNvbG9yXCI6IFwicmdiYSgwLDAsMCwwLjgpXCIsXHJcbiAgICAgIFwiYm9yZGVyV2lkdGhcIjogMixcclxuICAgICAgXCJ0eXBlXCI6IFwibGluZVwiLFxyXG4gICAgICBcInlBeGlzSURcIjogXCJ5QXhpc19wYXJldG9cIixcclxuICAgICAgXCJkYXRhbGFiZWxzXCI6IHtcclxuICAgICAgICBcImRpc3BsYXlcIjogZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgXCJwb2ludFJhZGl1c1wiOiAwXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgLy8gdW51c2VkLiBNaWdyYXRlZCBjb2RlIHRvIE5ldXJhc2lsRGF0YUZpbHRlclBpcGVcclxuICAvLyBmaWx0ZXJEYXRhKGRhdGE6IEFycmF5PGFueT4sIGRhdGFzZXRGaWx0ZXI6IHN0cmluZykge1xyXG5cclxuICAvLyAgIGlmIChkYXRhc2V0RmlsdGVyKSB7XHJcbiAgLy8gICAgIGxldCBmaWx0ZXJUZXJtcyA9IGRhdGFzZXRGaWx0ZXIuc3BsaXQoJywnKTtcclxuICAvLyAgICAgbGV0IGluY2x1ZGVUZXJtcyA9IFtdO1xyXG4gIC8vICAgICBsZXQgZXhjbHVkZVRlcm1zID0gW107XHJcbiAgLy8gICAgIGxldCBpbmNsdWRlQ29sdW1ucyA9IFtdO1xyXG4gIC8vICAgICBsZXQgZXhjbHVkZUNvbHVtbnMgPSBbXTtcclxuICAvLyAgICAgZm9yIChsZXQgaSBpbiBmaWx0ZXJUZXJtcykge1xyXG4gIC8vICAgICAgIGlmIChmaWx0ZXJUZXJtc1tpXSAhPSBudWxsICYmIGZpbHRlclRlcm1zW2ldICE9IHVuZGVmaW5lZCAmJiBmaWx0ZXJUZXJtc1tpXS5sZW5ndGggPiAxKSB7XHJcbiAgLy8gICAgICAgICBsZXQgdGVybSA9IGZpbHRlclRlcm1zW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gIC8vICAgICAgICAgaWYgKHRlcm1bMF0gPT0gXCItXCIpIHtcclxuICAvLyAgICAgICAgICAgZXhjbHVkZVRlcm1zLnB1c2godGVybS5yZXBsYWNlKFwiLVwiLCBcIlwiKS50cmltKCkpO1xyXG4gIC8vICAgICAgICAgfSBlbHNlIGlmICh0ZXJtWzBdID09IFwiflwiKSB7XHJcbiAgLy8gICAgICAgICAgIGlmICh0ZXJtWzFdID09IFwiIVwiKSB7XHJcbiAgLy8gICAgICAgICAgICAgZXhjbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+IVwiLCBcIlwiKS50cmltKCkpO1xyXG4gIC8vICAgICAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgICAgIGluY2x1ZGVDb2x1bW5zLnB1c2godGVybS5yZXBsYWNlKFwiflwiLCBcIlwiKS50cmltKCkpXHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICAgIGluY2x1ZGVUZXJtcy5wdXNoKHRlcm0udHJpbSgpKVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuXHJcbiAgLy8gICAgIGxldCBkYXRhX0ZpbHRlcmVkID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGRhdGFJdGVtKSB7XHJcbiAgLy8gICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gIC8vICAgICAgIGxldCBzZWFyY2hTdHJpbmcgPSBcIlwiO1xyXG4gIC8vICAgICAgIGZvciAobGV0IGkgaW4ga19hcnIpIHtcclxuICAvLyAgICAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJbaV07XHJcbiAgLy8gICAgICAgICBsZXQgdmFsdWUgPSBkYXRhSXRlbVtjdXJyS2V5XTtcclxuICAvLyAgICAgICAgIHNlYXJjaFN0cmluZyArPSB2YWx1ZSArIFwiIFwiO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBzZWFyY2hTdHJpbmcgPSBzZWFyY2hTdHJpbmcudG9Mb3dlckNhc2UoKS50cmltKCk7XHJcbiAgLy8gICAgICAgbGV0IGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gZmFsc2U7XHJcbiAgLy8gICAgICAgaWYgKGluY2x1ZGVUZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpIGluIGluY2x1ZGVUZXJtcykge1xyXG4gIC8vICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmluY2x1ZGVzKGluY2x1ZGVUZXJtc1tpXSkpIHtcclxuICAvLyAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XHJcbiAgLy8gICAgICAgICAgICAgYnJlYWs7XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSB0cnVlO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBpZiAoZXhjbHVkZVRlcm1zLmxlbmd0aCA+IDAgJiYgY3VycmVudFBhc3NpbmdTdGF0dXMpIHtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgaW4gZXhjbHVkZVRlcm1zKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoZXhjbHVkZVRlcm1zW2ldKSkge1xyXG4gIC8vICAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gZmFsc2U7XHJcbiAgLy8gICAgICAgICAgICAgYnJlYWs7XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgaWYgKGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XHJcblxyXG4gIC8vICAgICAgICAgcmV0dXJuIGRhdGFJdGVtO1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfSk7XHJcblxyXG4gIC8vICAgICBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCAmJiBleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgLy8gICAgICAgd2luZG93LmFsZXJ0KFwiVW5zdXBwb3J0ZWQgdXNhZ2Ugb2YgaW5jbHVkZSAmIGV4Y2x1ZGUgY29sdW1ucy4gVGhpbmdzIG1heSBicmVha1wiKVxyXG4gIC8vICAgICB9XHJcbiAgLy8gICAgIC8vYWZ0ZXIgZmlsdGVyaW5nIGlzIGNvbXBsZXRlLCByZW1vdmUgY29sdW1ucyBmcm9tIGNsb25lIG9mIGRhdGFcclxuICAvLyAgICAgZWxzZSBpZiAoZXhjbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKVxyXG4gIC8vICAgICAgIC8vY29uc29sZS5sb2coXCJoZXJlXCIpXHJcbiAgLy8gICAgICAgZm9yICh2YXIgaCBpbiBkYXRhX0ZpbHRlcmVkKSB7XHJcbiAgLy8gICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhX0ZpbHRlcmVkW2hdO1xyXG4gIC8vICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gIC8vICAgICAgICAgLy9mb3IgKGxldCBpIGluIGtfYXJyKSB7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gRG8gbm90IGFsbG93IHVzZXIgdG8gZGVsZXRlIGZpcnN0IGNvbHVtblxyXG4gIC8vICAgICAgICAgICAgIGZvciAodmFyIGogaW4gZXhjbHVkZUNvbHVtbnMpIHtcclxuICAvLyAgICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAvLyAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoZXhjbHVkZUNvbHVtbnNbal0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XHJcbiAgLy8gICAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9XHJcblxyXG4gIC8vICAgICBlbHNlIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgLy8gICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpO1xyXG4gIC8vICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xyXG4gIC8vICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcclxuICAvLyAgICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcclxuICAvLyAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBOZWVkZWQ/XHJcbiAgLy8gICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gIC8vICAgICAgICAgICAgIGxldCBrZWVwQ29sdW1uID0gZmFsc2U7XHJcbiAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBpbmNsdWRlQ29sdW1ucykge1xyXG4gIC8vICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhpbmNsdWRlQ29sdW1uc1tqXSkpIHtcclxuICAvLyAgICAgICAgICAgICAgICAga2VlcENvbHVtbiA9IHRydWU7XHJcbiAgLy8gICAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgICAgICAvLyBpZiAoIXByb2Nlc3NlZEtleS5pbmNsdWRlcyhpbmNsdWRlQ29sdW1uc1tqXSkpIHtcclxuICAvLyAgICAgICAgICAgICAgIC8vICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gIC8vICAgICAgICAgICAgICAgLy8gfVxyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgICBpZiAoIWtlZXBDb2x1bW4pIHtcclxuICAvLyAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9XHJcblxyXG4gIC8vICAgICByZXR1cm4gZGF0YV9GaWx0ZXJlZDtcclxuICAvLyAgIH1cclxuICAvLyAgIHJldHVybiBkYXRhOyAvLyBpZiBubyBmaWx0ZXIsIHJldHVybiBvcmlnaW5hbCBkYXRhXHJcbiAgLy8gfVxyXG59XHJcbiJdfQ==