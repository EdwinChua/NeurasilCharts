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
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], function () { return []; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUMvQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDOztBQUtoQyxNQUFNLE9BQU8scUJBQXFCO0lBRWhDLGdCQUFnQixDQUFDO0lBR2pCLHVCQUF1QixDQUFDLFNBQThCLEVBQUUsWUFBd0IsRUFBRSxxQkFBOEI7UUFDOUcsSUFBSSxVQUFVLEdBQUc7WUFDZixZQUFZLEVBQUUsRUFBRTtZQUNoQixhQUFhLEVBQUUsSUFBSTtZQUNuQixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUE7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUEwQjtRQUUvRSxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBR3RDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FB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cUJBQXFCO2NBSGpDLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHsgVXRpbHMgfSBmcm9tICcuL3V0aWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG5cclxuICBwYXJzZURhdGFGcm9tRGF0YXNvdXJjZShjaGFydFR5cGU6IE5FVVJBU0lMX0NIQVJUX1RZUEUsIGluY29taW5nRGF0YTogQXJyYXk8YW55Piwgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBib29sZWFuKTogeyBfY29ybmVyc3RvbmU6IHN0cmluZywgX2Zvcm1hdE9iamVjdDogeyBwcmVmaXg6IHN0cmluZywgc3VmZml4OiBzdHJpbmcgfSwgZGF0YTogQXJyYXk8YW55PiB9IHtcclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBfY29ybmVyc3RvbmU6IFwiXCIsXHJcbiAgICAgIF9mb3JtYXRPYmplY3Q6IG51bGwsXHJcbiAgICAgIGRhdGE6IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5jb21pbmdEYXRhKSk7IC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBkYXRhXHJcblxyXG4gICAgbGV0IGtfYXJyX1RlbXAgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcclxuXHJcblxyXG4gICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XHJcbiAgICBsZXQgY0RhdCA9IHt9O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldXHJcbiAgICAgIGNEYXRbY3VycktleV0gPSBbXTtcclxuICAgICAgZm9yICh2YXIgaiBpbiBkYXRhKSB7XHJcbiAgICAgICAgY0RhdFtrX2FycltpXV0ucHVzaChkYXRhW2pdW2N1cnJLZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coY0RhdClcclxuXHJcbiAgICBsZXQgZm9ybWF0T2JqID0ge307XHJcbiAgICBsZXQga19hcnJfbmV3ID0gT2JqZWN0LmtleXMoY0RhdCk7XHJcbiAgICByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSA9IGtfYXJyX25ld1swXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyX25ldy5sZW5ndGg7IGkrKykgeyAvLyBmb3IgZWFjaCBrZXkgaW4gZm9ybWF0dGVkIG9iamVjdFxyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyX25ld1tpXTtcclxuICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge307XHJcbiAgICAgIGlmIChjdXJyS2V5ICE9IHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKSB7XHJcbiAgICAgICAgbGV0IHRlc3RJdGVtO1xyXG4gICAgICAgIGZvciAodmFyIGogaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKGNEYXRbY3VycktleV1bal0pIHsgLy8gc2V0IHRlc3QgaXRlbSBhbmQgYnJlYWsgaWYgdGhlIHZhbHVlIGlzIG5vdCBudWxsXHJcbiAgICAgICAgICAgIHRlc3RJdGVtID0gY0RhdFtjdXJyS2V5XVtqXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICBsZXQgc3VmZml4ID0gXCJcIjtcclxuICAgICAgICBpZiAodGVzdEl0ZW0pIHtcclxuICAgICAgICAgIGlmICghaXNOdW1iZXIodGVzdEl0ZW0pKSB7XHJcbiAgICAgICAgICAgIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMSkpKSB7XHJcbiAgICAgICAgICAgICAgcHJlZml4ID0gdGVzdEl0ZW0uc3Vic3RyKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMCwgdGVzdEl0ZW0ubGVuZ3RoIC0gMSkpKSB7XHJcbiAgICAgICAgICAgICAgc3VmZml4ID0gdGVzdEl0ZW0uc3Vic3RyKHRlc3RJdGVtLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7XHJcbiAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICAgIHN1ZmZpeDogc3VmZml4XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3JtYXQgZWFjaCBkYXRhIGluIHRoZSBpbmRpdmlkdWFsIGFycmF5c1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKHByZWZpeCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNEYXRbY3VycktleV1ba10gPSBjRGF0W2N1cnJLZXldW2tdLnJlcGxhY2UocHJlZml4LCBcIlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzdWZmaXggIT0gXCJcIikge1xyXG4gICAgICAgICAgICBjRGF0W2N1cnJLZXldW2tdID0gY0RhdFtjdXJyS2V5XVtrXS5yZXBsYWNlKHN1ZmZpeCwgXCJcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy9uZXdTdHIgPSBjRGF0XHJcbiAgICAgICAgICAvL3JlcGxhY2VEYXRhLnB1c2goKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycktleSA9PSByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSkge1xyXG4gICAgICAgIGZvcm1hdE9ialtjdXJyS2V5XSA9IHtcclxuICAgICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICAgIHN1ZmZpeDogXCJcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKCFzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgLy8gZG8gbm90aGluZztcclxuICAgICAgLy8gcmV0dXJuIGNEYXQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbGV0IGNEYXRfTmV3ID0ge307XHJcblxyXG4gICAgICBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0gPSBPYmplY3Qua2V5cyhjRGF0KTtcclxuICAgICAgbGV0IGluZGV4ID0gY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdLmluZGV4T2YocmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpO1xyXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBqIGluIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXSkge1xyXG4gICAgICAgICAgY0RhdF9OZXdbY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1baV1dLnB1c2goY0RhdFtjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1bal1dW2ldKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL3JldHVybiBjRGF0X05ldztcclxuICAgICAgY0RhdCA9IGNEYXRfTmV3OyAvLyByZWFzc2lnbiB0byBjRGF0XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAvLyBBZGQgc3VmZml4ZXMgdG8gYXV0by1nZW5lcmF0ZWQgbGluZXNcclxuICAgICAgZm9ybWF0T2JqW1wiUGFyZXRvXCJdID0ge1xyXG4gICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICBzdWZmaXg6IFwiJVwiXHJcbiAgICAgIH1cclxuICAgICAgZm9ybWF0T2JqW1wiODAlIGxpbmVcIl0gPSB7XHJcbiAgICAgICAgcHJlZml4OiBcIlwiLFxyXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuICgodmFsdWUgIT0gbnVsbCkgJiYgIWlzTmFOKE51bWJlcih2YWx1ZS50b1N0cmluZygpKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybkRhdGEuX2Zvcm1hdE9iamVjdCA9IGZvcm1hdE9iajtcclxuICAgIHJldHVybkRhdGEuZGF0YSA9IGNEYXQ7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhyZXR1cm5EYXRhKTtcclxuICAgIHJldHVybiByZXR1cm5EYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIGNoYXJ0T2JqZWN0QnVpbGRlcihcclxuICAgIGNoYXJ0VHlwZSxcclxuICAgIGNoYXJ0RGF0YSxcclxuICAgIHVzZUFsdEF4aXMsXHJcbiAgICB0aXRsZSxcclxuICAgIHlBeGlzTGFiZWxUZXh0LFxyXG4gICAgeUF4aXNMYWJlbFRleHRfQWx0LFxyXG4gICAgeEF4aXNMYWJlbFRleHQsXHJcbiAgICBjb3JuZXJzdG9uZSxcclxuICAgIHN3YXBMYWJlbHNBbmREYXRhc2V0cyxcclxuICAgIGZvcm1hdE9iamVjdCxcclxuICAgIHVzZUxvZ1NjYWxlLFxyXG4gICAgY29sb3JQYWxldHRlLFxyXG4gICAgaG92ZXJPcGFjaXR5LFxyXG4gICAgZGVmYXVsdE9wYWNpdHksXHJcbiAgICBob3Zlck9wYWNpdHlfYm9yZGVyLFxyXG4gICAgZGVmYXVsdE9wYWNpdHlfYm9yZGVyXHJcbiAgKSB7XHJcbiAgICBpZiAoKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUiB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSAmJiB1c2VBbHRBeGlzID09IHRydWUpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiWW91IGhhdmUgZW5hYmxlZCBhbHRlcm5hdGUgYXhpcyBvbiBhICh1bnN1cHBvcnRlZCkgY2hhcnQgdHlwZS4gSXQgaGFzIGJlZW4gc2V0IHRvIGZhbHNlXCIpO1xyXG4gICAgICB1c2VBbHRBeGlzID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgIHlBeGlzTGFiZWxUZXh0X0FsdCA9IFwiUGFyZXRvICVcIjtcclxuICAgICAgdXNlQWx0QXhpcyA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9wdGlvbnM6IGFueSA9IHtcclxuICAgICAgbWFpbnRhaW5Bc3BlY3RSYXRpbzogZmFsc2UsXHJcbiAgICAgIHJlc3BvbnNpdmU6IHRydWUsXHJcbiAgICB9O1xyXG4gICAgaWYgKHRpdGxlKSB7XHJcbiAgICAgIG9wdGlvbnMudGl0bGUgPSB7XHJcbiAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICB0ZXh0OiB0aXRsZVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHlBeGlzTGFiZWwgPSB7IGRpc3BsYXk6IGZhbHNlLCB0ZXh0OiBcIlwiIH1cclxuICAgIGlmICh5QXhpc0xhYmVsVGV4dCkge1xyXG4gICAgICB5QXhpc0xhYmVsLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB5QXhpc0xhYmVsLnRleHQgPSB5QXhpc0xhYmVsVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeUF4aXNMYWJlbF9BbHQgPSB7IGRpc3BsYXk6IGZhbHNlLCB0ZXh0OiBcIlwiIH1cclxuICAgIGlmICh5QXhpc0xhYmVsVGV4dF9BbHQpIHtcclxuICAgICAgeUF4aXNMYWJlbF9BbHQuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHlBeGlzTGFiZWxfQWx0LnRleHQgPSB5QXhpc0xhYmVsVGV4dF9BbHQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHhBeGlzTGFiZWwgPSB7IGRpc3BsYXk6IGZhbHNlLCB0ZXh0OiBudWxsIH07XHJcbiAgICBpZiAoeEF4aXNMYWJlbFRleHQpIHtcclxuICAgICAgeEF4aXNMYWJlbC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeEF4aXNMYWJlbC50ZXh0ID0geEF4aXNMYWJlbFRleHQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgeEF4aXNMYWJlbC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeEF4aXNMYWJlbC50ZXh0ID0gW1wiIFwiLCBcIiBcIl07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKHhBeGlzTGFiZWxUZXh0KVxyXG4gICAgaWYgKGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSAmJiBjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG5cclxuICAgICAgICBvcHRpb25zLnNjYWxlcyA9IHtcclxuICAgICAgICAgIHg6IHtcclxuICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHhBeGlzTGFiZWwsXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHRpY2tzKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFiZWwgPSB0aGlzLmdldExhYmVsRm9yVmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGxhYmVsKSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAobGFiZWwubGVuZ3RoIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbC5zdWJzdHIoMCwgOCkgKyBcIi4uLlwiOy8vdHJ1bmNhdGVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XHJcbiAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gbGFiZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGFiZWxbaV1bMF0ubGVuZ3RoIDw9IDEwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChsYWJlbFtpXVswXSlcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goW2xhYmVsW2ldWzBdLnN1YnN0cigwLCA4KSArIFwiLi4uXCJdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICB0eXBlOiB1c2VMb2dTY2FsZSA/ICdsb2dhcml0aG1pYyc6J2xpbmVhcicsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnbGVmdCcsXHJcbiAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuXHJcbiAgICAgICAgICBsZXQgYWx0QXhpc09iajogYW55ID0ge1xyXG4gICAgICAgICAgICAvL2lkOiAneUF4aXNfcGFyZXRvJyxcclxuICAgICAgICAgICAgdHlwZTogJ2xpbmVhcicsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgdGlja3M6IHt9LFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbF9BbHRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGFsdEF4aXNPYmoubWluID0gMDtcclxuICAgICAgICAgIGFsdEF4aXNPYmoubWF4ID0gMTAwO1xyXG4gICAgICAgICAgYWx0QXhpc09iai50aWNrcyA9IHtcclxuICAgICAgICAgICAgc3RlcFNpemU6IDgwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5zY2FsZXMueUF4aXNfcGFyZXRvID0gYWx0QXhpc09iajtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBpZiAob3B0aW9ucy5zY2FsZXMgPT0gbnVsbCkgb3B0aW9ucy5zY2FsZXMgPSB7fTtcclxuICAgICAgICAvLyBpZiAob3B0aW9ucy5zY2FsZXMueCA9PSBudWxsKSBvcHRpb25zLnNjYWxlcy54ID0ge307XHJcbiAgICAgICAgLy8gb3B0aW9ucy5zY2FsZXMueC50aWNrcyA9IHtcclxuICAgICAgICAvLyAgIGNhbGxiYWNrOiBmdW5jdGlvbiAodmFsdWUsIGluZGV4LCB0aWNrcykge1xyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgaW5kZXgpXHJcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKHRpY2tzKVxyXG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZyh0aGlzLmdldExhYmVsRm9yVmFsdWUodmFsdWUpKVxyXG4gICAgICAgIC8vICAgICByZXR1cm4gdGhpcy5nZXRMYWJlbEZvclZhbHVlKHZhbHVlKS5zdWJzdHIoMCwgMTApOy8vdHJ1bmNhdGVcclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgb3B0aW9ucy5zY2FsZXMgPSB7XHJcbiAgICAgICAgICB4OiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB4QXhpc0xhYmVsLFxyXG4gICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAodmFsdWUsIGluZGV4LCB0aWNrcykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhYmVsID0gdGhpcy5nZXRMYWJlbEZvclZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShsYWJlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsLmxlbmd0aCA8PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gbGFiZWwuc3Vic3RyKDAsIDgpICsgXCIuLi5cIjsvL3RydW5jYXRlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgbGV0IHJlcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGxhYmVsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhYmVsW2ldWzBdLmxlbmd0aCA8PSAxMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2gobGFiZWxbaV1bMF0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKFtsYWJlbFtpXVswXS5zdWJzdHIoMCwgOCkgKyBcIi4uLlwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiByZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgdHlwZTogdXNlTG9nU2NhbGUgPyAnbG9nYXJpdGhtaWMnOidsaW5lYXInLFxyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlQWx0QXhpcykge1xyXG4gICAgICAgICAgbGV0IGFsdEF4aXNPYmo6IGFueSA9IHtcclxuICAgICAgICAgICAgLy9pZDogJ3lBeGlzX2FsdCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICB0eXBlOiAnbGluZWFyJyxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxfQWx0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIC8vICAgYWx0QXhpc09iai50aWNrcy5taW4gPSAwO1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLm1heCA9IDEwMDtcclxuICAgICAgICAgIC8vICAgYWx0QXhpc09iai50aWNrcy5zdGVwU2l6ZSA9IDgwXHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICBvcHRpb25zLnNjYWxlcy55QXhpc19hbHQgPSBhbHRBeGlzT2JqO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgdHlwZTtcclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FKSB7XHJcbiAgICAgIHR5cGUgPSAnbGluZSdcclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgdHlwZSA9ICdiYXInXHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkhPUklaT05UQUxfQkFSKSB7XHJcbiAgICAgIHR5cGUgPSAnYmFyJ1xyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUpIHtcclxuICAgICAgdHlwZSA9ICdwaWUnXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICB0eXBlID0gJ2RvdWdobnV0J1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgVEhJUyA9IHRoaXM7XHJcblxyXG4gICAgLy8gdG9vbHRpcCAmIHRpdGxlIHByZWZpeC9zdWZmaXggYWRkaXRpb24uIFRpdGxlIHVzZXMgZGVmYXVsdCBjb25maWdzIGZvciBiYXIgL2xpbmVcclxuICAgIG9wdGlvbnMudG9vbHRpcHMgPSB7fTtcclxuICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzID0ge307XHJcblxyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWwgfHwgJyc7XHJcbiAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmplY3RbdG9vbHRpcEl0ZW0ueExhYmVsXS5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iamVjdFt0b29sdGlwSXRlbS54TGFiZWxdLnN1ZmZpeH1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgbGV0IG9iaktleXMgPSBPYmplY3Qua2V5cyhmb3JtYXRPYmplY3QpO1xyXG4gICAgICAgICAgbGV0IGtleSA9IG9iaktleXNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4ICsgMV1cclxuICAgICAgICAgIGxldCBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3Rba2V5XTtcclxuICAgICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iai5zdWZmaXh9YDs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF07XHJcbiAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZm9ybWF0T2JqO1xyXG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF1dO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbF07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmoucHJlZml4fSR7ZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmRhdGFbdG9vbHRpcEl0ZW0uaW5kZXhdfSR7Zm9ybWF0T2JqLnN1ZmZpeH1gO1xyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgfVxyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy50aXRsZSA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtWzBdLmRhdGFzZXRJbmRleF0ubGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcclxuICAgICAgb3B0aW9ucy5pbmRleEF4aXMgPSAneSc7XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLmxhYmVsID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcblxyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbDtcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmb3JtYXRPYmo7XHJcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XV07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9JHtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0uZGF0YVt0b29sdGlwSXRlbS5pbmRleF19JHtmb3JtYXRPYmouc3VmZml4fWA7XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLnRpdGxlID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0b29sdGlwSXRlbVswXS55TGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IHJldHVybk9wdHMgPSB7XHJcbiAgICAgIHBsdWdpbnM6IFtdLFxyXG4gICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGFQYXJzZXIoXHJcbiAgICAgICAgY2hhcnREYXRhLFxyXG4gICAgICAgIHVzZUFsdEF4aXMsXHJcbiAgICAgICAgY2hhcnRUeXBlLFxyXG4gICAgICAgIGNvcm5lcnN0b25lLFxyXG4gICAgICAgIHN3YXBMYWJlbHNBbmREYXRhc2V0cyxcclxuICAgICAgICBjb2xvclBhbGV0dGUsXHJcbiAgICAgICAgaG92ZXJPcGFjaXR5LFxyXG4gICAgICAgIGRlZmF1bHRPcGFjaXR5LFxyXG4gICAgICAgIGhvdmVyT3BhY2l0eV9ib3JkZXIsXHJcbiAgICAgICAgZGVmYXVsdE9wYWNpdHlfYm9yZGVyKSxcclxuICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybk9wdHM7XHJcbiAgfVxyXG5cclxuICBkYXRhUGFyc2VyKFxyXG4gICAgY2hhcnREYXRhLFxyXG4gICAgdXNlQWx0QXhpcyAvKmJvb2xlYW4qLyxcclxuICAgIGNoYXJ0VHlwZSAvKmNoYXJ0VHlwZSBlbnVtKi8sXHJcbiAgICBjb3JuZXJzdG9uZSxcclxuICAgIHN3YXBMYWJlbHNBbmREYXRhc2V0cyxcclxuICAgIGNvbG9yUGFsZXR0ZVRvVXNlOiBBcnJheTxzdHJpbmc+ID0gbnVsbCxcclxuICAgIGhvdmVyT3BhY2l0eSxcclxuICAgIGRlZmF1bHRPcGFjaXR5LFxyXG4gICAgaG92ZXJPcGFjaXR5X2JvcmRlcixcclxuICAgIGRlZmF1bHRPcGFjaXR5X2JvcmRlcikgXHJcbiAge1xyXG5cclxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgY29sb3IgYXJyYXkgZm9yIGNoYXJ0LiBjeWNsZXMgdGhyb3VnaCB3aGVuIFxyXG4gICAgZnVuY3Rpb24gZ2V0UGFsZXR0ZShvcGFjaXR5LCBub09mQ29sb3JzKSB7XHJcbiAgICAgIGxldCBjb2xvcnMgPSBbXHJcbiAgICAgICAgYHJnYmEoMTk5LDIzMywxODAsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDEyNywyMDUsMTg3LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSg2NSwxODIsMTk2LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyOSwxNDUsMTkyLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgzNCw5NCwxNjgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDM3LDUyLDE0OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoOCwyOSw4OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjU0LDE3OCw3Niwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjUzLDE0MSw2MCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjUyLDc4LDQyLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyMjcsMjYsMjgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDE4OSwwLDM4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgxMjgsMCwzOCwke29wYWNpdHl9KWBcclxuICAgICAgXTtcclxuICAgICAgaWYgKGNvbG9yUGFsZXR0ZVRvVXNlKSB7XHJcbiAgICAgICAgY29sb3JzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSBpbiBjb2xvclBhbGV0dGVUb1VzZSkge1xyXG4gICAgICAgICAgbGV0IGNvbG9yID0gY29sb3JQYWxldHRlVG9Vc2VbaV07XHJcbiAgICAgICAgICBpZiAoVXRpbHMuY29sb3JJc0hleChjb2xvcikpIHtcclxuICAgICAgICAgICAgY29sb3IgPSBVdGlscy5oZXhUb1JnYmEoY29sb3IsIG9wYWNpdHkpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29sb3IgPSBVdGlscy5yZ2JUb1JnYmEoY29sb3IsIG9wYWNpdHkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29sb3JzLnB1c2goY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGlmIChub09mQ29sb3JzID4gY29sb3JzLmxlbmd0aCkgeyAvLyBpZiBtb3JlIGNvbG9ycyBhcmUgcmVxdWlyZWQgdGhhbiBhdmFpbGFibGUsIGN5Y2xlIHRocm91Z2ggYmVnaW5uaW5nIGFnYWluXHJcbiAgICAgICAgbGV0IGRpZmYgPSBub09mQ29sb3JzIC0gY29sb3JzLmxlbmd0aDtcclxuICAgICAgICBsZXQgY29sb3JzTGVuZ3RoID0gY29sb3JzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBkaWZmOyBpKSB7IC8vIE5PIElOQ1JFTUVOVCBIRVJFXHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbG9yc0xlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKGNvbG9yc1tqXSlcclxuICAgICAgICAgICAgaSsrOyAvLyBJTkNSRU1FTlQgSEVSRVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY29sb3JQYWxldHRlO1xyXG4gICAgbGV0IGNvbG9yUGFsZXR0ZV9ob3ZlcjtcclxuICAgIGxldCBiZ0NvbG9yUGFsZXR0ZTtcclxuICAgIGxldCBiZ0NvbG9yUGFsZXR0ZV9ob3ZlcjtcclxuICAgIGlmICghc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgIGJnQ29sb3JQYWxldHRlID0gZ2V0UGFsZXR0ZShkZWZhdWx0T3BhY2l0eSwgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICAgIGJnQ29sb3JQYWxldHRlX2hvdmVyID0gZ2V0UGFsZXR0ZShob3Zlck9wYWNpdHksIGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0ubGVuZ3RoKVxyXG4gICAgICBjb2xvclBhbGV0dGUgPSBnZXRQYWxldHRlKGRlZmF1bHRPcGFjaXR5X2JvcmRlciwgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICAgIGNvbG9yUGFsZXR0ZV9ob3ZlciA9IGdldFBhbGV0dGUoaG92ZXJPcGFjaXR5X2JvcmRlciwgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBiZ0NvbG9yUGFsZXR0ZSA9IGdldFBhbGV0dGUoZGVmYXVsdE9wYWNpdHksIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgICBiZ0NvbG9yUGFsZXR0ZV9ob3ZlciA9IGdldFBhbGV0dGUoaG92ZXJPcGFjaXR5LCBPYmplY3Qua2V5cyhjaGFydERhdGEpLmxlbmd0aClcclxuICAgICAgY29sb3JQYWxldHRlID0gZ2V0UGFsZXR0ZShkZWZhdWx0T3BhY2l0eV9ib3JkZXIsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgICBjb2xvclBhbGV0dGVfaG92ZXIgPSBnZXRQYWxldHRlKGhvdmVyT3BhY2l0eV9ib3JkZXIsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGV0IGRhdGFTZXRzID0gW107XHJcbiAgICBsZXQgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGNoYXJ0RGF0YSk7XHJcbiAgICBsZXQgaW5kZXggPSBvYmpLZXlzLmluZGV4T2YoY29ybmVyc3RvbmUpO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgb2JqS2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIGxldCB5QXhpcyA9ICd5QXhpcyc7XHJcbiAgICAgIGlmICh1c2VBbHRBeGlzKSB7XHJcbiAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICB5QXhpcyArPSAnX2FsdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG9iaktleXNbaV0pXHJcbiAgICAgIGxldCBkYXRhU2V0OiBhbnkgPSB7XHJcbiAgICAgICAgbGFiZWw6IG9iaktleXNbaV0sXHJcbiAgICAgICAgZGF0YTogY2hhcnREYXRhW29iaktleXNbaV1dLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvclBhbGV0dGVbaV0sXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6IGNvbG9yUGFsZXR0ZVtpXSxcclxuICAgICAgICBob3ZlckJhY2tncm91bmRDb2xvcjogYmdDb2xvclBhbGV0dGVfaG92ZXJbaV0sXHJcbiAgICAgICAgaG92ZXJCb3JkZXJDb2xvcjogY29sb3JQYWxldHRlX2hvdmVyW2ldLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhkYXRhU2V0KVxyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUpIHsgLy8gaWdub3JlcyBzdGFja2VkIGFuZCBiYXIgb3B0aW9ucy4gTWFrZXMgYXNzdW1wdGlvbiB0aGF0IG9ubHkgMXN0IGRhdGFzZXQgaXMgYmFyXHJcbiAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgZGF0YVNldC50eXBlID0gJ2Jhcic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFTZXQudHlwZSA9ICdsaW5lJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGV0dGVbaV07XHJcbiAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsZXR0ZVtpXTtcclxuICAgICAgICBkYXRhU2V0LmhvdmVyQmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGV0dGVfaG92ZXJbaV07XHJcbiAgICAgICAgZGF0YVNldC5ob3ZlckJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlW2ldO1xyXG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUpIHtcclxuICAgICAgICBpZiAoZGF0YVNldC50eXBlID09ICdiYXInKSB7XHJcbiAgICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxldHRlW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsZXR0ZVtpXTtcclxuICAgICAgICAgIGRhdGFTZXQuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsZXR0ZV9ob3ZlcltpXTtcclxuICAgICAgICAgIGRhdGFTZXQuaG92ZXJCb3JkZXJDb2xvciA9IGNvbG9yUGFsZXR0ZVtpXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsZXR0ZVtpXTtcclxuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHsvLyBvdmVyd3JpdGUgc2luZ2xlIGNvbG9yIGFzc2lnbm1lbnQgdG8gYXJyYXkuXHJcbiAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsZXR0ZTtcclxuICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxldHRlO1xyXG4gICAgICAgIGRhdGFTZXQuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsZXR0ZV9ob3ZlcjtcclxuICAgICAgICBkYXRhU2V0LmhvdmVyQm9yZGVyQ29sb3IgPSBjb2xvclBhbGV0dGU7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgICAgaWYgKGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIGRhdGFTZXQueUF4aXNJRCA9IHlBeGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YVNldHMucHVzaChkYXRhU2V0KTtcclxuICAgIH1cclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBsYWJlbHM6IGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0sXHJcbiAgICAgIGRhdGFzZXRzOiBkYXRhU2V0c1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybkRhdGE7XHJcbiAgfVxyXG5cclxuICBwZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpIHtcclxuICAgIC8vbW9kaWZ5IGNoYXJ0IG9iamVjdFxyXG4gICAgbGV0IGxvY2FsU3VtQXJyID0gW107XHJcbiAgICBsZXQgdG90YWxTdW0gPSAwO1xyXG5cclxuICAgIC8vIGNhbGN1bGF0ZSB0aGUgbG9jYWwgc3VtIG9mIGVhY2ggZGF0YXBvaW50IChpLmUuIGZvciBkYXRhc2V0cyAxLCAyLCAzLCBzdW0gb2YgZWFjaCBjb3JyZXNwb25kaW5nIGRhdGFwb2ludCBkczFbMF0gKyBkczJbMF0gKyBkczNbMF0pIFxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzWzBdLmRhdGEubGVuZ3RoOyBqKyspIHsgLy8gdGFrZXMgdGhlIGZpcnN0IGRhdGFzZXQgbGVuZ3RoIGFzIHJlZmVyZW5jZVxyXG4gICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaSsrKSB7IC8vIGZvciBlYWNoIGRhdGFzZXRcclxuICAgICAgICBsZXQgdmFsID0gcGFyc2VGbG9hdChwcm9wcy5kYXRhLmRhdGFzZXRzW2ldLmRhdGFbal0pO1xyXG4gICAgICAgIGlmIChpc05hTih2YWwpKSB7XHJcbiAgICAgICAgICB2YWwgPSAwOyAvLyBzZXQgaW52YWxpZCB2YWx1ZXMgYXMgMFxyXG4gICAgICAgIH1cclxuICAgICAgICBzdW0gKz0gdmFsXHJcbiAgICAgIH1cclxuICAgICAgbG9jYWxTdW1BcnIucHVzaChzdW0pO1xyXG4gICAgICB0b3RhbFN1bSArPSBzdW07XHJcbiAgICB9XHJcblxyXG4gICAgLy9wb3B1bGF0ZSBuZXcgYXJyYXkgd2l0aCBtb2RpZmllZCBzb3J0aW5nIG9iamVjdFxyXG4gICAgbGV0IG5ld0FyciA9IFtdOyAvLyB0aGlzIGFycmF5IGhvbGRzIGFuIG9iamVjdCB3aXRoIHRoZSBzdW0sIGxhYmVsLCBhbmQgZGF0YSBmcm9tIGVhY2ggZGF0YXNldFxyXG4gICAgLypcclxuICAgIEVhY2ggb2JqZWN0IGxvb2tzIGxpa2UgdGhpczpcclxuICAgIG8gPSB7XHJcbiAgICAgICAgICAgIHN1bTogNDE4XHJcbiAgICAgICAgICAgIGxhYmVsczogXCJXaGF0ZXZlciBsYWJlbFwiXHJcbiAgICAgICAgICAgIDA6IDY2XHJcbiAgICAgICAgICAgIDE6IDk4XHJcbiAgICAgICAgICAgIDI6IDY3XHJcbiAgICAgICAgICAgIDM6IDk2XHJcbiAgICAgICAgICAgIDQ6IDkxXHJcbiAgICAgICAgfVxyXG4gICAgKi9cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxTdW1BcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IG8gPSB7XHJcbiAgICAgICAgc3VtOiBsb2NhbFN1bUFycltpXSxcclxuICAgICAgICBsYWJlbHM6IHByb3BzLmRhdGEubGFiZWxzW2ldLFxyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcHMuZGF0YS5kYXRhc2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgIG9bal0gPSBwcm9wcy5kYXRhLmRhdGFzZXRzW2pdLmRhdGFbaV07XHJcbiAgICAgIH1cclxuICAgICAgbmV3QXJyLnB1c2gobylcclxuICAgIH1cclxuXHJcbiAgICAvL3NvcnQgbmV3IGFycmF5IChuZXdBcnIpIGRlc2NlbmRpbmcgW1wic3VtXCJdIHByb3BlcnR5XHJcbiAgICBuZXdBcnIuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICByZXR1cm4gKChhLnN1bSA8IGIuc3VtKSA/IDEgOiAoKGEuc3VtID09IGIuc3VtKSA/IDAgOiAtMSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy9yZWJ1aWxkIGFuZCByZWFzc2lnbiBsYWJlbHMgYXJyYXkgLSBkaXJlY3RseSBtb2RpZmllcyBjaGFydCBvYmplY3QgcGFzc2VkIGluXHJcbiAgICBsZXQgbmV3TGFiZWxzQXJyYXkgPSBbXVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbmV3TGFiZWxzQXJyYXkucHVzaChuZXdBcnJbaV1bXCJsYWJlbHNcIl0pO1xyXG4gICAgfVxyXG4gICAgcHJvcHMuZGF0YS5sYWJlbHMgPSBuZXdMYWJlbHNBcnJheTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGRhdGEgYXJyYXkgZm9yIGVhY2ggZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcHMuZGF0YS5kYXRhc2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGRhdGEucHVzaChuZXdBcnJbaV1bal0pXHJcbiAgICAgIH1cclxuICAgICAgcHJvcHMuZGF0YS5kYXRhc2V0c1tqXS5kYXRhID0gZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvL2NyZWF0ZSBhIHNvcnRlZCBsb2NhbCBzdW0gYXJyYXkgZm9yIHBhcmV0byBjdXJ2ZSBjYWxjdWxhdGlvbnNcclxuICAgIGxldCBzb3J0ZWRsb2NhbFN1bUFyciA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgc29ydGVkbG9jYWxTdW1BcnIucHVzaChuZXdBcnJbaV0uc3VtKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCByb2xsaW5nU3VtID0gMDsgLy8gY3VtdWxhdGl2ZSBzdW0gb2YgdmFsdWVzXHJcbiAgICBsZXQgcGFyZXRvTGluZVZhbHVlcyA9IFtdO1xyXG4gICAgbGV0IGVpZ2h0eVBlcmNlbnRMaW5lID0gW107IC8vIGhhcmQgY29kZWQgdG8gODAlXHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIGFuZCBwdXNoIHBhcmV0byBsaW5lLCBhbHNvIHBvcHVsYXRlIDgwJSBsaW5lIGFycmF5XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvcnRlZGxvY2FsU3VtQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHJvbGxpbmdTdW0gKz0gc29ydGVkbG9jYWxTdW1BcnJbaV07XHJcbiAgICAgIGxldCBwYXJldG9WYWwgPSByb2xsaW5nU3VtIC8gdG90YWxTdW0gKiAxMDA7XHJcbiAgICAgIHBhcmV0b0xpbmVWYWx1ZXMucHVzaChNYXRoLmZsb29yKHBhcmV0b1ZhbCAqIDEwMCkgLyAxMDApO1xyXG4gICAgICBlaWdodHlQZXJjZW50TGluZS5wdXNoKDgwKVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBwYXJldG8gY3VydmUgYXMgYSBuZXcgZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW4gXHJcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xyXG4gICAgICBcImxhYmVsXCI6IFwiUGFyZXRvXCIsXHJcbiAgICAgIFwiZGF0YVwiOiBwYXJldG9MaW5lVmFsdWVzLFxyXG4gICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYmEoMCwwLDAsMClcIixcclxuICAgICAgXCJib3JkZXJDb2xvclwiOiBcInJnYmEoMCwwLDAsMC44KVwiLFxyXG4gICAgICBcImJvcmRlcldpZHRoXCI6IDIsXHJcbiAgICAgIFwidHlwZVwiOiBcImxpbmVcIixcclxuICAgICAgXCJ5QXhpc0lEXCI6IFwieUF4aXNfcGFyZXRvXCIsXHJcbiAgICAgIFwiZGF0YWxhYmVsc1wiOiB7XHJcbiAgICAgICAgXCJkaXNwbGF5XCI6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicG9pbnRSYWRpdXNcIjogMFxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBwdXNoIDgwJSBsaW5lIGFzIGEgbmV3IGRhdGFzZXQgLSBkaXJlY3RseSBtb2RpZmllcyBjaGFydCBvYmplY3QgcGFzc2VkIGluXHJcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xyXG4gICAgICBcImxhYmVsXCI6IFwiODAlIGxpbmVcIixcclxuICAgICAgXCJkYXRhXCI6IGVpZ2h0eVBlcmNlbnRMaW5lLFxyXG4gICAgICBcImJhY2tncm91bmRDb2xvclwiOiBcInJnYmEoMCwwLDAsMClcIixcclxuICAgICAgXCJib3JkZXJDb2xvclwiOiBcInJnYmEoMCwwLDAsMC44KVwiLFxyXG4gICAgICBcImJvcmRlcldpZHRoXCI6IDIsXHJcbiAgICAgIFwidHlwZVwiOiBcImxpbmVcIixcclxuICAgICAgXCJ5QXhpc0lEXCI6IFwieUF4aXNfcGFyZXRvXCIsXHJcbiAgICAgIFwiZGF0YWxhYmVsc1wiOiB7XHJcbiAgICAgICAgXCJkaXNwbGF5XCI6IGZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicG9pbnRSYWRpdXNcIjogMFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIC8vIHVudXNlZC4gTWlncmF0ZWQgY29kZSB0byBOZXVyYXNpbERhdGFGaWx0ZXJQaXBlXHJcbiAgLy8gZmlsdGVyRGF0YShkYXRhOiBBcnJheTxhbnk+LCBkYXRhc2V0RmlsdGVyOiBzdHJpbmcpIHtcclxuXHJcbiAgLy8gICBpZiAoZGF0YXNldEZpbHRlcikge1xyXG4gIC8vICAgICBsZXQgZmlsdGVyVGVybXMgPSBkYXRhc2V0RmlsdGVyLnNwbGl0KCcsJyk7XHJcbiAgLy8gICAgIGxldCBpbmNsdWRlVGVybXMgPSBbXTtcclxuICAvLyAgICAgbGV0IGV4Y2x1ZGVUZXJtcyA9IFtdO1xyXG4gIC8vICAgICBsZXQgaW5jbHVkZUNvbHVtbnMgPSBbXTtcclxuICAvLyAgICAgbGV0IGV4Y2x1ZGVDb2x1bW5zID0gW107XHJcbiAgLy8gICAgIGZvciAobGV0IGkgaW4gZmlsdGVyVGVybXMpIHtcclxuICAvLyAgICAgICBpZiAoZmlsdGVyVGVybXNbaV0gIT0gbnVsbCAmJiBmaWx0ZXJUZXJtc1tpXSAhPSB1bmRlZmluZWQgJiYgZmlsdGVyVGVybXNbaV0ubGVuZ3RoID4gMSkge1xyXG4gIC8vICAgICAgICAgbGV0IHRlcm0gPSBmaWx0ZXJUZXJtc1tpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAvLyAgICAgICAgIGlmICh0ZXJtWzBdID09IFwiLVwiKSB7XHJcbiAgLy8gICAgICAgICAgIGV4Y2x1ZGVUZXJtcy5wdXNoKHRlcm0ucmVwbGFjZShcIi1cIiwgXCJcIikudHJpbSgpKTtcclxuICAvLyAgICAgICAgIH0gZWxzZSBpZiAodGVybVswXSA9PSBcIn5cIikge1xyXG4gIC8vICAgICAgICAgICBpZiAodGVybVsxXSA9PSBcIiFcIikge1xyXG4gIC8vICAgICAgICAgICAgIGV4Y2x1ZGVDb2x1bW5zLnB1c2godGVybS5yZXBsYWNlKFwifiFcIiwgXCJcIikudHJpbSgpKTtcclxuICAvLyAgICAgICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgICAgICBpbmNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn5cIiwgXCJcIikudHJpbSgpKVxyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgICBpbmNsdWRlVGVybXMucHVzaCh0ZXJtLnRyaW0oKSlcclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcblxyXG4gIC8vICAgICBsZXQgZGF0YV9GaWx0ZXJlZCA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uIChkYXRhSXRlbSkge1xyXG4gIC8vICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcclxuICAvLyAgICAgICBsZXQgc2VhcmNoU3RyaW5nID0gXCJcIjtcclxuICAvLyAgICAgICBmb3IgKGxldCBpIGluIGtfYXJyKSB7XHJcbiAgLy8gICAgICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldO1xyXG4gIC8vICAgICAgICAgbGV0IHZhbHVlID0gZGF0YUl0ZW1bY3VycktleV07XHJcbiAgLy8gICAgICAgICBzZWFyY2hTdHJpbmcgKz0gdmFsdWUgKyBcIiBcIjtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgc2VhcmNoU3RyaW5nID0gc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xyXG4gIC8vICAgICAgIGxldCBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xyXG4gIC8vICAgICAgIGlmIChpbmNsdWRlVGVybXMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBpbmNsdWRlVGVybXMpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhpbmNsdWRlVGVybXNbaV0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSB0cnVlO1xyXG4gIC8vICAgICAgICAgICAgIGJyZWFrO1xyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgaWYgKGV4Y2x1ZGVUZXJtcy5sZW5ndGggPiAwICYmIGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpIGluIGV4Y2x1ZGVUZXJtcykge1xyXG4gIC8vICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmluY2x1ZGVzKGV4Y2x1ZGVUZXJtc1tpXSkpIHtcclxuICAvLyAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xyXG4gIC8vICAgICAgICAgICAgIGJyZWFrO1xyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIGlmIChjdXJyZW50UGFzc2luZ1N0YXR1cykge1xyXG5cclxuICAvLyAgICAgICAgIHJldHVybiBkYXRhSXRlbTtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH0pO1xyXG5cclxuICAvLyAgICAgaWYgKGluY2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDAgJiYgZXhjbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIHdpbmRvdy5hbGVydChcIlVuc3VwcG9ydGVkIHVzYWdlIG9mIGluY2x1ZGUgJiBleGNsdWRlIGNvbHVtbnMuIFRoaW5ncyBtYXkgYnJlYWtcIilcclxuICAvLyAgICAgfVxyXG4gIC8vICAgICAvL2FmdGVyIGZpbHRlcmluZyBpcyBjb21wbGV0ZSwgcmVtb3ZlIGNvbHVtbnMgZnJvbSBjbG9uZSBvZiBkYXRhXHJcbiAgLy8gICAgIGVsc2UgaWYgKGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICBkYXRhX0ZpbHRlcmVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhX0ZpbHRlcmVkKSlcclxuICAvLyAgICAgICAvL2NvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gIC8vICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xyXG4gIC8vICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcclxuICAvLyAgICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcclxuICAvLyAgICAgICAgIC8vZm9yIChsZXQgaSBpbiBrX2Fycikge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gIC8vICAgICAgICAgICBpZiAoaSA+IDApIHsvLyBza2lwIHRoZSBmaXJzdCBjb2x1bW4uIERvIG5vdCBhbGxvdyB1c2VyIHRvIGRlbGV0ZSBmaXJzdCBjb2x1bW5cclxuICAvLyAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGV4Y2x1ZGVDb2x1bW5zKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkS2V5ID0ga19hcnJbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICAgICAgICBpZiAocHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGV4Y2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gIC8vICAgICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgZWxzZSBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKTtcclxuICAvLyAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcclxuICAvLyAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XHJcbiAgLy8gICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gTmVlZGVkP1xyXG4gIC8vICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAvLyAgICAgICAgICAgICBsZXQga2VlcENvbHVtbiA9IGZhbHNlO1xyXG4gIC8vICAgICAgICAgICAgIGZvciAodmFyIGogaW4gaW5jbHVkZUNvbHVtbnMpIHtcclxuICAvLyAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIGtlZXBDb2x1bW4gPSB0cnVlO1xyXG4gIC8vICAgICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgICAgLy8gaWYgKCFwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAvLyAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICAgIC8vIH1cclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgICAgaWYgKCFrZWVwQ29sdW1uKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgcmV0dXJuIGRhdGFfRmlsdGVyZWQ7XHJcbiAgLy8gICB9XHJcbiAgLy8gICByZXR1cm4gZGF0YTsgLy8gaWYgbm8gZmlsdGVyLCByZXR1cm4gb3JpZ2luYWwgZGF0YVxyXG4gIC8vIH1cclxufVxyXG4iXX0=