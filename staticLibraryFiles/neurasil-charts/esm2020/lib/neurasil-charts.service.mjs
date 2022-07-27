import { Injectable } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
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
    chartObjectBuilder(chartType, chartData, useAltAxis, title, yAxisLabelText, yAxisLabelText_Alt, xAxisLabelText, cornerstone, swapLabelsAndDatasets, formatObject) {
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
                        title: xAxisLabel
                    },
                    yAxis: {
                        type: 'linear',
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
                options.scales = {
                    x: {
                        title: xAxisLabel
                    },
                    yAxis: {
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
            data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets),
            options: options
        };
        return returnOpts;
    }
    dataParser(chartData, useAltAxis /*boolean*/, chartType /*chartType enum*/, cornerstone, swapLabelsAndDatasets) {
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
        let colorPalatte;
        let bgColorPalatte;
        let bgColorPalatte_hover;
        if (!swapLabelsAndDatasets) {
            colorPalatte = getPalette(1, chartData[cornerstone].length);
            bgColorPalatte = getPalette(0.3, chartData[cornerstone].length);
            bgColorPalatte_hover = getPalette(0.5, chartData[cornerstone].length);
        }
        else {
            colorPalatte = getPalette(1, Object.keys(chartData).length);
            bgColorPalatte = getPalette(0.3, Object.keys(chartData).length);
            bgColorPalatte_hover = getPalette(0.5, Object.keys(chartData).length);
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
                backgroundColor: bgColorPalatte[i],
                borderColor: colorPalatte[i],
                hoverBackgroundColor: bgColorPalatte_hover[i],
                hoverBorderColor: colorPalatte[i],
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
                dataSet.backgroundColor = bgColorPalatte[i];
                dataSet.borderColor = colorPalatte[i];
                dataSet.hoverBackgroundColor = bgColorPalatte_hover[i];
                dataSet.hoverBorderColor = colorPalatte[i];
            }
            else if (chartType == NEURASIL_CHART_TYPE.BAR_LINE || chartType == NEURASIL_CHART_TYPE.LINE) {
                if (dataSet.type == 'bar') {
                    dataSet.backgroundColor = bgColorPalatte[i];
                    dataSet.borderColor = colorPalatte[i];
                    dataSet.hoverBackgroundColor = bgColorPalatte_hover[i];
                    dataSet.hoverBorderColor = colorPalatte[i];
                }
                else {
                    dataSet.borderColor = colorPalatte[i];
                    dataSet.backgroundColor = 'rgba(0,0,0,0)';
                }
            }
            else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) { // overwrite single color assignment to array.
                dataSet.backgroundColor = bgColorPalatte;
                dataSet.borderColor = colorPalatte;
                dataSet.hoverBackgroundColor = bgColorPalatte_hover;
                dataSet.hoverBorderColor = colorPalatte;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFLL0MsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxnQkFBZ0IsQ0FBQztJQUdqQix1QkFBdUIsQ0FBQyxTQUE4QixFQUFFLFlBQXdCLEVBQUUscUJBQThCO1FBQzlHLElBQUksVUFBVSxHQUFHO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFBO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFFL0UsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUd0QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25CLEtBQUssSUFBSSxDQUFDLElBQUksSUFB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QU07WUFDYixTQUFTLEVBQUMsY0FBYztZQUN4QixZQUFZLEVBQUU7Z0JBQ1osU0FBUyxFQUFDLEtBQUs7YUFDaEI7WUFDRCxhQUFhLEVBQUUsQ0FBQztTQUNqQixDQUFDLENBQUE7SUFDSixDQUFDOzs2R0F2a0JVLHFCQUFxQjswR0FBckIscUJBQXFCLFdBQXJCLHFCQUFxQixtQkFGcEIsTUFBTTt1RkFFUCxxQkFBcUI7Y0FIakMsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBORVVSQVNJTF9DSEFSVF9UWVBFIH0gZnJvbSAnLi9tb2RlbHMnO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxDaGFydHNTZXJ2aWNlIHtcclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcblxyXG4gIHBhcnNlRGF0YUZyb21EYXRhc291cmNlKGNoYXJ0VHlwZTogTkVVUkFTSUxfQ0hBUlRfVFlQRSwgaW5jb21pbmdEYXRhOiBBcnJheTxhbnk+LCBzd2FwTGFiZWxzQW5kRGF0YXNldHM6IGJvb2xlYW4pOiB7IF9jb3JuZXJzdG9uZTogc3RyaW5nLCBfZm9ybWF0T2JqZWN0OiB7IHByZWZpeDogc3RyaW5nLCBzdWZmaXg6IHN0cmluZyB9LCBkYXRhOiBBcnJheTxhbnk+IH0ge1xyXG4gICAgbGV0IHJldHVybkRhdGEgPSB7XHJcbiAgICAgIF9jb3JuZXJzdG9uZTogXCJcIixcclxuICAgICAgX2Zvcm1hdE9iamVjdDogbnVsbCxcclxuICAgICAgZGF0YTogbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGxldCBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpbmNvbWluZ0RhdGEpKTsgLy8gbWFrZSBhIGNvcHkgb2YgdGhlIGRhdGFcclxuXHJcbiAgICBsZXQga19hcnJfVGVtcCA9IE9iamVjdC5rZXlzKGRhdGFbMF0pO1xyXG5cclxuXHJcbiAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcclxuICAgIGxldCBjRGF0ID0ge307XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJbaV1cclxuICAgICAgY0RhdFtjdXJyS2V5XSA9IFtdO1xyXG4gICAgICBmb3IgKHZhciBqIGluIGRhdGEpIHtcclxuICAgICAgICBjRGF0W2tfYXJyW2ldXS5wdXNoKGRhdGFbal1bY3VycktleV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjb25zb2xlLmxvZyhjRGF0KVxyXG5cclxuICAgIGxldCBmb3JtYXRPYmogPSB7fTtcclxuICAgIGxldCBrX2Fycl9uZXcgPSBPYmplY3Qua2V5cyhjRGF0KTtcclxuICAgIHJldHVybkRhdGEuX2Nvcm5lcnN0b25lID0ga19hcnJfbmV3WzBdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnJfbmV3Lmxlbmd0aDsgaSsrKSB7IC8vIGZvciBlYWNoIGtleSBpbiBmb3JtYXR0ZWQgb2JqZWN0XHJcbiAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJfbmV3W2ldO1xyXG4gICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7fTtcclxuICAgICAgaWYgKGN1cnJLZXkgIT0gcmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpIHtcclxuICAgICAgICBsZXQgdGVzdEl0ZW07XHJcbiAgICAgICAgZm9yICh2YXIgaiBpbiBjRGF0W2N1cnJLZXldKSB7XHJcbiAgICAgICAgICBpZiAoY0RhdFtjdXJyS2V5XVtqXSkgeyAvLyBzZXQgdGVzdCBpdGVtIGFuZCBicmVhayBpZiB0aGUgdmFsdWUgaXMgbm90IG51bGxcclxuICAgICAgICAgICAgdGVzdEl0ZW0gPSBjRGF0W2N1cnJLZXldW2pdO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBwcmVmaXggPSBcIlwiO1xyXG4gICAgICAgIGxldCBzdWZmaXggPSBcIlwiO1xyXG4gICAgICAgIGlmICh0ZXN0SXRlbSkge1xyXG4gICAgICAgICAgaWYgKCFpc051bWJlcih0ZXN0SXRlbSkpIHtcclxuICAgICAgICAgICAgaWYgKGlzTnVtYmVyKHRlc3RJdGVtLnN1YnN0cigxKSkpIHtcclxuICAgICAgICAgICAgICBwcmVmaXggPSB0ZXN0SXRlbS5zdWJzdHIoMCwgMSk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzTnVtYmVyKHRlc3RJdGVtLnN1YnN0cigwLCB0ZXN0SXRlbS5sZW5ndGggLSAxKSkpIHtcclxuICAgICAgICAgICAgICBzdWZmaXggPSB0ZXN0SXRlbS5zdWJzdHIodGVzdEl0ZW0ubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcm1hdE9ialtjdXJyS2V5XSA9IHtcclxuICAgICAgICAgIHByZWZpeDogcHJlZml4LFxyXG4gICAgICAgICAgc3VmZml4OiBzdWZmaXhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZvcm1hdCBlYWNoIGRhdGEgaW4gdGhlIGluZGl2aWR1YWwgYXJyYXlzXHJcbiAgICAgICAgZm9yICh2YXIgayBpbiBjRGF0W2N1cnJLZXldKSB7XHJcbiAgICAgICAgICBpZiAocHJlZml4ICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgY0RhdFtjdXJyS2V5XVtrXSA9IGNEYXRbY3VycktleV1ba10ucmVwbGFjZShwcmVmaXgsIFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHN1ZmZpeCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNEYXRbY3VycktleV1ba10gPSBjRGF0W2N1cnJLZXldW2tdLnJlcGxhY2Uoc3VmZml4LCBcIlwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAvL25ld1N0ciA9IGNEYXRcclxuICAgICAgICAgIC8vcmVwbGFjZURhdGEucHVzaCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIGlmIChjdXJyS2V5ID09IHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKSB7XHJcbiAgICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge1xyXG4gICAgICAgICAgcHJlZml4OiBcIlwiLFxyXG4gICAgICAgICAgc3VmZml4OiBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoIXN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAvLyBkbyBub3RoaW5nO1xyXG4gICAgICAvLyByZXR1cm4gY0RhdDtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICBsZXQgY0RhdF9OZXcgPSB7fTtcclxuXHJcbiAgICAgIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXSA9IE9iamVjdC5rZXlzKGNEYXQpO1xyXG4gICAgICBsZXQgaW5kZXggPSBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0uaW5kZXhPZihyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSk7XHJcbiAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNEYXRfTmV3W2NEYXRbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdW2ldXSA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGogaW4gY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdKSB7XHJcbiAgICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0ucHVzaChjRGF0W2NEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtqXV1baV0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vcmV0dXJuIGNEYXRfTmV3O1xyXG4gICAgICBjRGF0ID0gY0RhdF9OZXc7IC8vIHJlYXNzaWduIHRvIGNEYXRcclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgIC8vIEFkZCBzdWZmaXhlcyB0byBhdXRvLWdlbmVyYXRlZCBsaW5lc1xyXG4gICAgICBmb3JtYXRPYmpbXCJQYXJldG9cIl0gPSB7XHJcbiAgICAgICAgcHJlZml4OiBcIlwiLFxyXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcclxuICAgICAgfVxyXG4gICAgICBmb3JtYXRPYmpbXCI4MCUgbGluZVwiXSA9IHtcclxuICAgICAgICBwcmVmaXg6IFwiXCIsXHJcbiAgICAgICAgc3VmZml4OiBcIiVcIlxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gaXNOdW1iZXIodmFsdWU6IHN0cmluZyB8IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICByZXR1cm4gKCh2YWx1ZSAhPSBudWxsKSAmJiAhaXNOYU4oTnVtYmVyKHZhbHVlLnRvU3RyaW5nKCkpKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuRGF0YS5fZm9ybWF0T2JqZWN0ID0gZm9ybWF0T2JqO1xyXG4gICAgcmV0dXJuRGF0YS5kYXRhID0gY0RhdDtcclxuICAgIC8vIGNvbnNvbGUubG9nKHJldHVybkRhdGEpO1xyXG4gICAgcmV0dXJuIHJldHVybkRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhcnRPYmplY3RCdWlsZGVyKGNoYXJ0VHlwZSwgY2hhcnREYXRhLCB1c2VBbHRBeGlzLCB0aXRsZSwgeUF4aXNMYWJlbFRleHQsIHlBeGlzTGFiZWxUZXh0X0FsdCwgeEF4aXNMYWJlbFRleHQsIGNvcm5lcnN0b25lLCBzd2FwTGFiZWxzQW5kRGF0YXNldHMsIGZvcm1hdE9iamVjdCkge1xyXG4gICAgaWYgKChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgJiYgdXNlQWx0QXhpcyA9PSB0cnVlKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIllvdSBoYXZlIGVuYWJsZWQgYWx0ZXJuYXRlIGF4aXMgb24gYSAodW5zdXBwb3J0ZWQpIGNoYXJ0IHR5cGUuIEl0IGhhcyBiZWVuIHNldCB0byBmYWxzZVwiKTtcclxuICAgICAgdXNlQWx0QXhpcyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICB5QXhpc0xhYmVsVGV4dF9BbHQgPSBcIlBhcmV0byAlXCI7XHJcbiAgICAgIHVzZUFsdEF4aXMgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcHRpb25zOiBhbnkgPSB7XHJcbiAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxyXG4gICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIGlmICh0aXRsZSkge1xyXG4gICAgICBvcHRpb25zLnRpdGxlID0ge1xyXG4gICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgdGV4dDogdGl0bGVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB5QXhpc0xhYmVsID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogXCJcIiB9XHJcbiAgICBpZiAoeUF4aXNMYWJlbFRleHQpIHtcclxuICAgICAgeUF4aXNMYWJlbC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeUF4aXNMYWJlbC50ZXh0ID0geUF4aXNMYWJlbFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHlBeGlzTGFiZWxfQWx0ID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogXCJcIiB9XHJcbiAgICBpZiAoeUF4aXNMYWJlbFRleHRfQWx0KSB7XHJcbiAgICAgIHlBeGlzTGFiZWxfQWx0LmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB5QXhpc0xhYmVsX0FsdC50ZXh0ID0geUF4aXNMYWJlbFRleHRfQWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB4QXhpc0xhYmVsID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogbnVsbCB9O1xyXG4gICAgaWYgKHhBeGlzTGFiZWxUZXh0KSB7XHJcbiAgICAgIHhBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHhBeGlzTGFiZWwudGV4dCA9IHhBeGlzTGFiZWxUZXh0O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHhBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHhBeGlzTGFiZWwudGV4dCA9IFtcIiBcIiwgXCIgXCJdO1xyXG4gICAgfVxyXG4gICAgLy8gY29uc29sZS5sb2coeEF4aXNMYWJlbFRleHQpXHJcbiAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcblxyXG4gICAgICAgIG9wdGlvbnMuc2NhbGVzID0ge1xyXG4gICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICB0aXRsZTogeEF4aXNMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgIHR5cGU6J2xpbmVhcicsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnbGVmdCcsXHJcbiAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgbGV0IGFsdEF4aXNPYmo6IGFueSA9IHtcclxuICAgICAgICAgICAgLy9pZDogJ3lBeGlzX3BhcmV0bycsXHJcbiAgICAgICAgICAgIHR5cGU6J2xpbmVhcicsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgdGlja3M6e30sXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsX0FsdFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYWx0QXhpc09iai5taW4gPSAwO1xyXG4gICAgICAgICAgYWx0QXhpc09iai5tYXggPSAxMDA7XHJcbiAgICAgICAgICBhbHRBeGlzT2JqLnRpY2tzID0ge1xyXG4gICAgICAgICAgICBzdGVwU2l6ZTogODBcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBvcHRpb25zLnNjYWxlcy55QXhpc19wYXJldG89IGFsdEF4aXNPYmo7XHJcbiAgICAgICAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMuc2NhbGVzID0ge1xyXG4gICAgICAgICAgeDoge1xyXG4gICAgICAgICAgICB0aXRsZTogeEF4aXNMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHlBeGlzOiB7XHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh1c2VBbHRBeGlzKSB7XHJcbiAgICAgICAgICBsZXQgYWx0QXhpc09iajogYW55ID0ge1xyXG4gICAgICAgICAgICAvL2lkOiAneUF4aXNfYWx0JyxcclxuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgdGlja3M6IHtcclxuICAgICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgIHR5cGU6J2xpbmVhcicsXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsX0FsdFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgICAgICAvLyAgIGFsdEF4aXNPYmoudGlja3MubWluID0gMDtcclxuICAgICAgICAgIC8vICAgYWx0QXhpc09iai50aWNrcy5tYXggPSAxMDA7XHJcbiAgICAgICAgICAvLyAgIGFsdEF4aXNPYmoudGlja3Muc3RlcFNpemUgPSA4MFxyXG4gICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgb3B0aW9ucy5zY2FsZXMueUF4aXNfYWx0ID0gYWx0QXhpc09iajtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHR5cGU7XHJcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSkge1xyXG4gICAgICB0eXBlID0gJ2xpbmUnXHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgIHR5cGUgPSAnYmFyJ1xyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUikge1xyXG4gICAgICB0eXBlID0gJ2JhcidcclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFKSB7XHJcbiAgICAgIHR5cGUgPSAncGllJ1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgdHlwZSA9ICdkb3VnaG51dCdcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IFRISVMgPSB0aGlzO1xyXG5cclxuICAgIC8vIHRvb2x0aXAgJiB0aXRsZSBwcmVmaXgvc3VmZml4IGFkZGl0aW9uLiBUaXRsZSB1c2VzIGRlZmF1bHQgY29uZmlncyBmb3IgYmFyIC9saW5lXHJcbiAgICBvcHRpb25zLnRvb2x0aXBzID0ge307XHJcbiAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcyA9IHt9O1xyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLmxhYmVsID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsIHx8ICcnO1xyXG4gICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqZWN0W3Rvb2x0aXBJdGVtLnhMYWJlbF0ucHJlZml4fWAgKyB0b29sdGlwSXRlbS55TGFiZWwgKyBgJHtmb3JtYXRPYmplY3RbdG9vbHRpcEl0ZW0ueExhYmVsXS5zdWZmaXh9YDtcclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgIGxldCBvYmpLZXlzID0gT2JqZWN0LmtleXMoZm9ybWF0T2JqZWN0KTtcclxuICAgICAgICAgIGxldCBrZXkgPSBvYmpLZXlzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleCArIDFdXHJcbiAgICAgICAgICBsZXQgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2tleV07XHJcbiAgICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmoucHJlZml4fWAgKyB0b29sdGlwSXRlbS55TGFiZWwgKyBgJHtmb3JtYXRPYmouc3VmZml4fWA7O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLmxhYmVsID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW0uaW5kZXhdO1xyXG4gICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZvcm1hdE9iajtcclxuICAgICAgICBpZiAoc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW0uaW5kZXhdXTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWxdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH0ke2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5kYXRhW3Rvb2x0aXBJdGVtLmluZGV4XX0ke2Zvcm1hdE9iai5zdWZmaXh9YDtcclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MudGl0bGUgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbVswXS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkhPUklaT05UQUxfQkFSKSB7XHJcbiAgICAgIG9wdGlvbnMuaW5kZXhBeGlzID0gJ3knO1xyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG5cclxuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWw7XHJcbiAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZm9ybWF0T2JqO1xyXG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF1dO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbF07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmoucHJlZml4fSR7ZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmRhdGFbdG9vbHRpcEl0ZW0uaW5kZXhdfSR7Zm9ybWF0T2JqLnN1ZmZpeH1gO1xyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgfVxyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy50aXRsZSA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG5cclxuICAgICAgICByZXR1cm4gdG9vbHRpcEl0ZW1bMF0ueUxhYmVsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCByZXR1cm5PcHRzID0ge1xyXG4gICAgICBwbHVnaW5zOltdLFxyXG4gICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGFQYXJzZXIoY2hhcnREYXRhLCB1c2VBbHRBeGlzLCBjaGFydFR5cGUsIGNvcm5lcnN0b25lLCBzd2FwTGFiZWxzQW5kRGF0YXNldHMpLFxyXG4gICAgICBvcHRpb25zOiBvcHRpb25zXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuT3B0cztcclxuICB9XHJcblxyXG4gIGRhdGFQYXJzZXIoY2hhcnREYXRhLCB1c2VBbHRBeGlzIC8qYm9vbGVhbiovLCBjaGFydFR5cGUgLypjaGFydFR5cGUgZW51bSovLCBjb3JuZXJzdG9uZSwgc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcblxyXG4gICAgLy8gaGVscGVyIGZ1bmN0aW9uIHRvIGdldCBjb2xvciBhcnJheSBmb3IgY2hhcnQuIGN5Y2xlcyB0aHJvdWdoIHdoZW4gXHJcbiAgICBmdW5jdGlvbiBnZXRQYWxldHRlKG9wYWNpdHksIG5vT2ZDb2xvcnMpIHtcclxuICAgICAgbGV0IGNvbG9ycyA9IFtcclxuICAgICAgICBgcmdiYSgxOTksMjMzLDE4MCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMTI3LDIwNSwxODcsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDY1LDE4MiwxOTYsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDI5LDE0NSwxOTIsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDM0LDk0LDE2OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMzcsNTIsMTQ4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSg4LDI5LDg4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTQsMTc4LDc2LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTMsMTQxLDYwLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyNTIsNzgsNDIsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDIyNywyNiwyOCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMTg5LDAsMzgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDEyOCwwLDM4LCR7b3BhY2l0eX0pYFxyXG4gICAgICBdO1xyXG5cclxuICAgICAgaWYgKG5vT2ZDb2xvcnMgPiBjb2xvcnMubGVuZ3RoKSB7IC8vIGlmIG1vcmUgY29sb3JzIGFyZSByZXF1aXJlZCB0aGFuIGF2YWlsYWJsZSwgY3ljbGUgdGhyb3VnaCBiZWdpbm5pbmcgYWdhaW5cclxuICAgICAgICBsZXQgZGlmZiA9IG5vT2ZDb2xvcnMgLSBjb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgIGxldCBjb2xvcnNMZW5ndGggPSBjb2xvcnMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IGRpZmY7IGkpIHsgLy8gTk8gSU5DUkVNRU5UIEhFUkVcclxuICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY29sb3JzTGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY29sb3JzLnB1c2goY29sb3JzW2pdKVxyXG4gICAgICAgICAgICBpKys7IC8vIElOQ1JFTUVOVCBIRVJFXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gY29sb3JzO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjb2xvclBhbGF0dGU7XHJcbiAgICBsZXQgYmdDb2xvclBhbGF0dGU7XHJcbiAgICBsZXQgYmdDb2xvclBhbGF0dGVfaG92ZXI7XHJcbiAgICBpZiAoIXN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICBjb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDEsIGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0ubGVuZ3RoKVxyXG4gICAgICBiZ0NvbG9yUGFsYXR0ZSA9IGdldFBhbGV0dGUoMC4zLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgICAgYmdDb2xvclBhbGF0dGVfaG92ZXIgPSBnZXRQYWxldHRlKDAuNSwgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDEsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgICBiZ0NvbG9yUGFsYXR0ZSA9IGdldFBhbGV0dGUoMC4zLCBPYmplY3Qua2V5cyhjaGFydERhdGEpLmxlbmd0aClcclxuICAgICAgYmdDb2xvclBhbGF0dGVfaG92ZXIgPSBnZXRQYWxldHRlKDAuNSwgIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGV0IGRhdGFTZXRzID0gW107XHJcbiAgICBsZXQgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGNoYXJ0RGF0YSk7XHJcbiAgICBsZXQgaW5kZXggPSBvYmpLZXlzLmluZGV4T2YoY29ybmVyc3RvbmUpO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgb2JqS2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIGxldCB5QXhpcyA9ICd5QXhpcyc7XHJcbiAgICAgIGlmICh1c2VBbHRBeGlzKSB7XHJcbiAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICB5QXhpcyArPSAnX2FsdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIGNvbnNvbGUubG9nKG9iaktleXNbaV0pXHJcbiAgICAgIGxldCBkYXRhU2V0OiBhbnkgPSB7XHJcbiAgICAgICAgbGFiZWw6IG9iaktleXNbaV0sXHJcbiAgICAgICAgZGF0YTogY2hhcnREYXRhW29iaktleXNbaV1dLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogYmdDb2xvclBhbGF0dGVbaV0sXHJcbiAgICAgICAgYm9yZGVyQ29sb3I6IGNvbG9yUGFsYXR0ZVtpXSxcclxuICAgICAgICBob3ZlckJhY2tncm91bmRDb2xvcjogYmdDb2xvclBhbGF0dGVfaG92ZXJbaV0sXHJcbiAgICAgICAgaG92ZXJCb3JkZXJDb2xvcjogY29sb3JQYWxhdHRlW2ldLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBjb25zb2xlLmxvZyhkYXRhU2V0KVxyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUpIHsgLy8gaWdub3JlcyBzdGFja2VkIGFuZCBiYXIgb3B0aW9ucy4gTWFrZXMgYXNzdW1wdGlvbiB0aGF0IG9ubHkgMXN0IGRhdGFzZXQgaXMgYmFyXHJcbiAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgZGF0YVNldC50eXBlID0gJ2Jhcic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFTZXQudHlwZSA9ICdsaW5lJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVbaV07XHJcbiAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgICBkYXRhU2V0LmhvdmVyQmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVfaG92ZXJbaV07XHJcbiAgICAgICAgZGF0YVNldC5ob3ZlckJvcmRlckNvbG9yID0gY29sb3JQYWxhdHRlW2ldO1xyXG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUpIHtcclxuICAgICAgICBpZiAoZGF0YVNldC50eXBlID09ICdiYXInKSB7XHJcbiAgICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxhdHRlW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgICAgIGRhdGFTZXQuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsYXR0ZV9ob3ZlcltpXTtcclxuICAgICAgICAgIGRhdGFTZXQuaG92ZXJCb3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMCwwLDAsMCknO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHsvLyBvdmVyd3JpdGUgc2luZ2xlIGNvbG9yIGFzc2lnbm1lbnQgdG8gYXJyYXkuXHJcbiAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsYXR0ZTtcclxuICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxhdHRlO1xyXG4gICAgICAgIGRhdGFTZXQuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsYXR0ZV9ob3ZlcjtcclxuICAgICAgICBkYXRhU2V0LmhvdmVyQm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGU7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgICAgaWYgKGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIGRhdGFTZXQueUF4aXNJRCA9IHlBeGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YVNldHMucHVzaChkYXRhU2V0KTtcclxuICAgIH1cclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBsYWJlbHM6IGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0sXHJcbiAgICAgIGRhdGFzZXRzOiBkYXRhU2V0c1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybkRhdGE7XHJcbiAgfVxyXG5cclxuICBwZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpe1xyXG4gICAgLy9tb2RpZnkgY2hhcnQgb2JqZWN0XHJcbiAgICBsZXQgbG9jYWxTdW1BcnIgPSBbXTtcclxuICAgIGxldCB0b3RhbFN1bSA9IDA7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBsb2NhbCBzdW0gb2YgZWFjaCBkYXRhcG9pbnQgKGkuZS4gZm9yIGRhdGFzZXRzIDEsIDIsIDMsIHN1bSBvZiBlYWNoIGNvcnJlc3BvbmRpbmcgZGF0YXBvaW50IGRzMVswXSArIGRzMlswXSArIGRzM1swXSkgXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHByb3BzLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGg7IGorKykgeyAvLyB0YWtlcyB0aGUgZmlyc3QgZGF0YXNldCBsZW5ndGggYXMgcmVmZXJlbmNlXHJcbiAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmRhdGEuZGF0YXNldHMubGVuZ3RoOyBpKyspIHsgLy8gZm9yIGVhY2ggZGF0YXNldFxyXG4gICAgICAgIGxldCB2YWwgPSBwYXJzZUZsb2F0KHByb3BzLmRhdGEuZGF0YXNldHNbaV0uZGF0YVtqXSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHtcclxuICAgICAgICAgIHZhbCA9IDA7IC8vIHNldCBpbnZhbGlkIHZhbHVlcyBhcyAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1bSArPSB2YWxcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN1bUFyci5wdXNoKHN1bSk7XHJcbiAgICAgIHRvdGFsU3VtICs9IHN1bTtcclxuICAgIH1cclxuXHJcbiAgICAvL3BvcHVsYXRlIG5ldyBhcnJheSB3aXRoIG1vZGlmaWVkIHNvcnRpbmcgb2JqZWN0XHJcbiAgICBsZXQgbmV3QXJyID0gW107IC8vIHRoaXMgYXJyYXkgaG9sZHMgYW4gb2JqZWN0IHdpdGggdGhlIHN1bSwgbGFiZWwsIGFuZCBkYXRhIGZyb20gZWFjaCBkYXRhc2V0XHJcbiAgICAvKlxyXG4gICAgRWFjaCBvYmplY3QgbG9va3MgbGlrZSB0aGlzOlxyXG4gICAgbyA9IHtcclxuICAgICAgICAgICAgc3VtOiA0MThcclxuICAgICAgICAgICAgbGFiZWxzOiBcIldoYXRldmVyIGxhYmVsXCJcclxuICAgICAgICAgICAgMDogNjZcclxuICAgICAgICAgICAgMTogOThcclxuICAgICAgICAgICAgMjogNjdcclxuICAgICAgICAgICAgMzogOTZcclxuICAgICAgICAgICAgNDogOTFcclxuICAgICAgICB9XHJcbiAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN1bUFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbyA9IHtcclxuICAgICAgICBzdW06IGxvY2FsU3VtQXJyW2ldLFxyXG4gICAgICAgIGxhYmVsczogcHJvcHMuZGF0YS5sYWJlbHNbaV0sXHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgb1tqXSA9IHByb3BzLmRhdGEuZGF0YXNldHNbal0uZGF0YVtpXTtcclxuICAgICAgfVxyXG4gICAgICBuZXdBcnIucHVzaChvKVxyXG4gICAgfVxyXG5cclxuICAgIC8vc29ydCBuZXcgYXJyYXkgKG5ld0FycikgZGVzY2VuZGluZyBbXCJzdW1cIl0gcHJvcGVydHlcclxuICAgIG5ld0Fyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiAoKGEuc3VtIDwgYi5zdW0pID8gMSA6ICgoYS5zdW0gPT0gYi5zdW0pID8gMCA6IC0xKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGxhYmVscyBhcnJheSAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGxldCBuZXdMYWJlbHNBcnJheSA9IFtdXHJcbiAgICBmb3IgKGxldCBpID0wOyBpIDwgbmV3QXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3TGFiZWxzQXJyYXkucHVzaChuZXdBcnJbaV1bXCJsYWJlbHNcIl0pO1xyXG4gICAgfVxyXG4gICAgcHJvcHMuZGF0YS5sYWJlbHMgPSBuZXdMYWJlbHNBcnJheTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGRhdGEgYXJyYXkgZm9yIGVhY2ggZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcHMuZGF0YS5kYXRhc2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgZGF0YS5wdXNoKG5ld0FycltpXVtqXSlcclxuICAgICAgfVxyXG4gICAgICBwcm9wcy5kYXRhLmRhdGFzZXRzW2pdLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY3JlYXRlIGEgc29ydGVkIGxvY2FsIHN1bSBhcnJheSBmb3IgcGFyZXRvIGN1cnZlIGNhbGN1bGF0aW9uc1xyXG4gICAgbGV0IHNvcnRlZGxvY2FsU3VtQXJyID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMCA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICBzb3J0ZWRsb2NhbFN1bUFyci5wdXNoKG5ld0FycltpXS5zdW0pXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJvbGxpbmdTdW0gPSAwOyAvLyBjdW11bGF0aXZlIHN1bSBvZiB2YWx1ZXNcclxuICAgIGxldCBwYXJldG9MaW5lVmFsdWVzID0gW107XHJcbiAgICBsZXQgZWlnaHR5UGVyY2VudExpbmUgPSBbXTsgLy8gaGFyZCBjb2RlZCB0byA4MCVcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgYW5kIHB1c2ggcGFyZXRvIGxpbmUsIGFsc28gcG9wdWxhdGUgODAlIGxpbmUgYXJyYXlcclxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IHNvcnRlZGxvY2FsU3VtQXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgcm9sbGluZ1N1bSArPSBzb3J0ZWRsb2NhbFN1bUFycltpXTtcclxuICAgICAgbGV0IHBhcmV0b1ZhbCA9IHJvbGxpbmdTdW0vdG90YWxTdW0gKiAxMDA7XHJcbiAgICAgIHBhcmV0b0xpbmVWYWx1ZXMucHVzaCggTWF0aC5mbG9vcihwYXJldG9WYWwgKiAxMDApIC8gMTAwICk7XHJcbiAgICAgIGVpZ2h0eVBlcmNlbnRMaW5lLnB1c2goODApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIGFkZCBwYXJldG8gY3VydmUgYXMgYSBuZXcgZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW4gXHJcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xyXG4gICAgICBcImxhYmVsXCI6XCJQYXJldG9cIixcclxuICAgICAgXCJkYXRhXCI6cGFyZXRvTGluZVZhbHVlcyxcclxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjpcInJnYmEoMCwwLDAsMClcIixcclxuICAgICAgXCJib3JkZXJDb2xvclwiOlwicmdiYSgwLDAsMCwwLjgpXCIsXHJcbiAgICAgIFwiYm9yZGVyV2lkdGhcIjoyLFxyXG4gICAgICBcInR5cGVcIjpcImxpbmVcIixcclxuICAgICAgXCJ5QXhpc0lEXCI6XCJ5QXhpc19wYXJldG9cIixcclxuICAgICAgXCJkYXRhbGFiZWxzXCI6IHtcclxuICAgICAgICBcImRpc3BsYXlcIjpmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBcInBvaW50UmFkaXVzXCI6IDBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gcHVzaCA4MCUgbGluZSBhcyBhIG5ldyBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpblxyXG4gICAgcHJvcHMuZGF0YS5kYXRhc2V0cy5wdXNoKHtcclxuICAgICAgXCJsYWJlbFwiOlwiODAlIGxpbmVcIixcclxuICAgICAgXCJkYXRhXCI6ZWlnaHR5UGVyY2VudExpbmUsXHJcbiAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6XCJyZ2JhKDAsMCwwLDApXCIsXHJcbiAgICAgIFwiYm9yZGVyQ29sb3JcIjpcInJnYmEoMCwwLDAsMC44KVwiLFxyXG4gICAgICBcImJvcmRlcldpZHRoXCI6MixcclxuICAgICAgXCJ0eXBlXCI6XCJsaW5lXCIsXHJcbiAgICAgIFwieUF4aXNJRFwiOlwieUF4aXNfcGFyZXRvXCIsXHJcbiAgICAgIFwiZGF0YWxhYmVsc1wiOiB7XHJcbiAgICAgICAgXCJkaXNwbGF5XCI6ZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgXCJwb2ludFJhZGl1c1wiOiAwXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgICAvLyB1bnVzZWQuIE1pZ3JhdGVkIGNvZGUgdG8gTmV1cmFzaWxEYXRhRmlsdGVyUGlwZVxyXG4gIC8vIGZpbHRlckRhdGEoZGF0YTogQXJyYXk8YW55PiwgZGF0YXNldEZpbHRlcjogc3RyaW5nKSB7XHJcblxyXG4gIC8vICAgaWYgKGRhdGFzZXRGaWx0ZXIpIHtcclxuICAvLyAgICAgbGV0IGZpbHRlclRlcm1zID0gZGF0YXNldEZpbHRlci5zcGxpdCgnLCcpO1xyXG4gIC8vICAgICBsZXQgaW5jbHVkZVRlcm1zID0gW107XHJcbiAgLy8gICAgIGxldCBleGNsdWRlVGVybXMgPSBbXTtcclxuICAvLyAgICAgbGV0IGluY2x1ZGVDb2x1bW5zID0gW107XHJcbiAgLy8gICAgIGxldCBleGNsdWRlQ29sdW1ucyA9IFtdO1xyXG4gIC8vICAgICBmb3IgKGxldCBpIGluIGZpbHRlclRlcm1zKSB7XHJcbiAgLy8gICAgICAgaWYgKGZpbHRlclRlcm1zW2ldICE9IG51bGwgJiYgZmlsdGVyVGVybXNbaV0gIT0gdW5kZWZpbmVkICYmIGZpbHRlclRlcm1zW2ldLmxlbmd0aCA+IDEpIHtcclxuICAvLyAgICAgICAgIGxldCB0ZXJtID0gZmlsdGVyVGVybXNbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICBpZiAodGVybVswXSA9PSBcIi1cIikge1xyXG4gIC8vICAgICAgICAgICBleGNsdWRlVGVybXMucHVzaCh0ZXJtLnJlcGxhY2UoXCItXCIsIFwiXCIpLnRyaW0oKSk7XHJcbiAgLy8gICAgICAgICB9IGVsc2UgaWYgKHRlcm1bMF0gPT0gXCJ+XCIpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHRlcm1bMV0gPT0gXCIhXCIpIHtcclxuICAvLyAgICAgICAgICAgICBleGNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn4hXCIsIFwiXCIpLnRyaW0oKSk7XHJcbiAgLy8gICAgICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICAgICAgaW5jbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+XCIsIFwiXCIpLnRyaW0oKSlcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgICAgaW5jbHVkZVRlcm1zLnB1c2godGVybS50cmltKCkpXHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9XHJcblxyXG5cclxuICAvLyAgICAgbGV0IGRhdGFfRmlsdGVyZWQgPSBkYXRhLmZpbHRlcihmdW5jdGlvbiAoZGF0YUl0ZW0pIHtcclxuICAvLyAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgbGV0IHNlYXJjaFN0cmluZyA9IFwiXCI7XHJcbiAgLy8gICAgICAgZm9yIChsZXQgaSBpbiBrX2Fycikge1xyXG4gIC8vICAgICAgICAgbGV0IGN1cnJLZXkgPSBrX2FycltpXTtcclxuICAvLyAgICAgICAgIGxldCB2YWx1ZSA9IGRhdGFJdGVtW2N1cnJLZXldO1xyXG4gIC8vICAgICAgICAgc2VhcmNoU3RyaW5nICs9IHZhbHVlICsgXCIgXCI7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIHNlYXJjaFN0cmluZyA9IHNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAvLyAgICAgICBsZXQgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcclxuICAvLyAgICAgICBpZiAoaW5jbHVkZVRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgaW4gaW5jbHVkZVRlcm1zKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoaW5jbHVkZVRlcm1zW2ldKSkge1xyXG4gIC8vICAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcclxuICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIGlmIChleGNsdWRlVGVybXMubGVuZ3RoID4gMCAmJiBjdXJyZW50UGFzc2luZ1N0YXR1cykge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBleGNsdWRlVGVybXMpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhleGNsdWRlVGVybXNbaV0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcclxuICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBpZiAoY3VycmVudFBhc3NpbmdTdGF0dXMpIHtcclxuXHJcbiAgLy8gICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9KTtcclxuXHJcbiAgLy8gICAgIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwICYmIGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICB3aW5kb3cuYWxlcnQoXCJVbnN1cHBvcnRlZCB1c2FnZSBvZiBpbmNsdWRlICYgZXhjbHVkZSBjb2x1bW5zLiBUaGluZ3MgbWF5IGJyZWFrXCIpXHJcbiAgLy8gICAgIH1cclxuICAvLyAgICAgLy9hZnRlciBmaWx0ZXJpbmcgaXMgY29tcGxldGUsIHJlbW92ZSBjb2x1bW5zIGZyb20gY2xvbmUgb2YgZGF0YVxyXG4gIC8vICAgICBlbHNlIGlmIChleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgLy8gICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpXHJcbiAgLy8gICAgICAgLy9jb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAvLyAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcclxuICAvLyAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XHJcbiAgLy8gICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgICAvL2ZvciAobGV0IGkgaW4ga19hcnIpIHtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcclxuICAvLyAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBEbyBub3QgYWxsb3cgdXNlciB0byBkZWxldGUgZmlyc3QgY29sdW1uXHJcbiAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBleGNsdWRlQ29sdW1ucykge1xyXG4gIC8vICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gIC8vICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhleGNsdWRlQ29sdW1uc1tqXSkpIHtcclxuICAvLyAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICAgIGVsc2UgaWYgKGluY2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICBkYXRhX0ZpbHRlcmVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhX0ZpbHRlcmVkKSk7XHJcbiAgLy8gICAgICAgZm9yICh2YXIgaCBpbiBkYXRhX0ZpbHRlcmVkKSB7XHJcbiAgLy8gICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhX0ZpbHRlcmVkW2hdO1xyXG4gIC8vICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gIC8vICAgICAgICAgICBpZiAoaSA+IDApIHsvLyBza2lwIHRoZSBmaXJzdCBjb2x1bW4uIE5lZWRlZD9cclxuICAvLyAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkS2V5ID0ga19hcnJbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICAgICAgbGV0IGtlZXBDb2x1bW4gPSBmYWxzZTtcclxuICAvLyAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGluY2x1ZGVDb2x1bW5zKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBpZiAocHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgICBrZWVwQ29sdW1uID0gdHJ1ZTtcclxuICAvLyAgICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgICAgIC8vIGlmICghcHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgLy8gICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XHJcbiAgLy8gICAgICAgICAgICAgICAvLyB9XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgIGlmICgha2VlcENvbHVtbikge1xyXG4gIC8vICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICAgIHJldHVybiBkYXRhX0ZpbHRlcmVkO1xyXG4gIC8vICAgfVxyXG4gIC8vICAgcmV0dXJuIGRhdGE7IC8vIGlmIG5vIGZpbHRlciwgcmV0dXJuIG9yaWdpbmFsIGRhdGFcclxuICAvLyB9XHJcbn1cclxuIl19