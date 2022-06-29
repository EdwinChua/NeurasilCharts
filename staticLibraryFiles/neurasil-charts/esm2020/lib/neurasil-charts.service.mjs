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
        //console.log(cDat);
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
        let xAxisLabel = { display: false, text: "" };
        if (xAxisLabelText) {
            xAxisLabel.display = true;
            xAxisLabel.text = xAxisLabelText;
        }
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
        if (!swapLabelsAndDatasets) {
            colorPalatte = getPalette(1, chartData[cornerstone].length);
            bgColorPalatte = getPalette(0.3, chartData[cornerstone].length);
        }
        else {
            colorPalatte = getPalette(1, Object.keys(chartData).length);
            bgColorPalatte = getPalette(0.3, Object.keys(chartData).length);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFLL0MsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxnQkFBZ0IsQ0FBQztJQUdqQix1QkFBdUIsQ0FBQyxTQUE4QixFQUFFLFlBQXdCLEVBQUUscUJBQThCO1FBQzlHLElBQUksVUFBVSxHQUFHO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFBO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFFL0UsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUd0QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25CLEtBQUssSUFBSSxDQUFDLElBQUksSUFB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QUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUN2QixPQUFPLEVBQUMsVUFBVTtZQUNsQixNQUFNLEVBQUMsaUJBQWlCO1lBQ3hCLGlCQUFpQixFQUFDLGVBQWU7WUFDakMsYUFBYSxFQUFDLGlCQUFpQjtZQUMvQixhQUFhLEVBQUMsQ0FBQztZQUNmLE1BQU0sRUFBQyxNQUFNO1lBQ2IsU0FBUyxFQUFDLGNBQWM7WUFDeEIsWUFBWSxFQUFFO2dCQUNaLFNBQVMsRUFBQyxLQUFLO2FBQ2hCO1lBQ0QsYUFBYSxFQUFFLENBQUM7U0FDakIsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7NkdBdmpCVSxxQkFBcUI7MEdBQXJCLHFCQUFxQixXQUFyQixxQkFBcUIsbUJBRnBCLE1BQU07dUZBRVAscUJBQXFCO2NBSGpDLFVBQVU7ZUFBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTkVVUkFTSUxfQ0hBUlRfVFlQRSB9IGZyb20gJy4vbW9kZWxzJztcclxuXHJcbkBJbmplY3RhYmxlKHtcclxuICBwcm92aWRlZEluOiAncm9vdCdcclxufSlcclxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzU2VydmljZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG5cclxuICBwYXJzZURhdGFGcm9tRGF0YXNvdXJjZShjaGFydFR5cGU6IE5FVVJBU0lMX0NIQVJUX1RZUEUsIGluY29taW5nRGF0YTogQXJyYXk8YW55Piwgc3dhcExhYmVsc0FuZERhdGFzZXRzOiBib29sZWFuKTogeyBfY29ybmVyc3RvbmU6IHN0cmluZywgX2Zvcm1hdE9iamVjdDogeyBwcmVmaXg6IHN0cmluZywgc3VmZml4OiBzdHJpbmcgfSwgZGF0YTogQXJyYXk8YW55PiB9IHtcclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBfY29ybmVyc3RvbmU6IFwiXCIsXHJcbiAgICAgIF9mb3JtYXRPYmplY3Q6IG51bGwsXHJcbiAgICAgIGRhdGE6IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaW5jb21pbmdEYXRhKSk7IC8vIG1ha2UgYSBjb3B5IG9mIHRoZSBkYXRhXHJcblxyXG4gICAgbGV0IGtfYXJyX1RlbXAgPSBPYmplY3Qua2V5cyhkYXRhWzBdKTtcclxuXHJcblxyXG4gICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XHJcbiAgICBsZXQgY0RhdCA9IHt9O1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldXHJcbiAgICAgIGNEYXRbY3VycktleV0gPSBbXTtcclxuICAgICAgZm9yICh2YXIgaiBpbiBkYXRhKSB7XHJcbiAgICAgICAgY0RhdFtrX2FycltpXV0ucHVzaChkYXRhW2pdW2N1cnJLZXldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgZm9ybWF0T2JqID0ge307XHJcbiAgICBsZXQga19hcnJfbmV3ID0gT2JqZWN0LmtleXMoY0RhdCk7XHJcbiAgICByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSA9IGtfYXJyX25ld1swXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyX25ldy5sZW5ndGg7IGkrKykgeyAvLyBmb3IgZWFjaCBrZXkgaW4gZm9ybWF0dGVkIG9iamVjdFxyXG4gICAgICBsZXQgY3VycktleSA9IGtfYXJyX25ld1tpXTtcclxuICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge307XHJcbiAgICAgIGlmIChjdXJyS2V5ICE9IHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKSB7XHJcbiAgICAgICAgbGV0IHRlc3RJdGVtO1xyXG4gICAgICAgIGZvciAodmFyIGogaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKGNEYXRbY3VycktleV1bal0pIHsgLy8gc2V0IHRlc3QgaXRlbSBhbmQgYnJlYWsgaWYgdGhlIHZhbHVlIGlzIG5vdCBudWxsXHJcbiAgICAgICAgICAgIHRlc3RJdGVtID0gY0RhdFtjdXJyS2V5XVtqXTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcHJlZml4ID0gXCJcIjtcclxuICAgICAgICBsZXQgc3VmZml4ID0gXCJcIjtcclxuICAgICAgICBpZiAodGVzdEl0ZW0pIHtcclxuICAgICAgICAgIGlmICghaXNOdW1iZXIodGVzdEl0ZW0pKSB7XHJcbiAgICAgICAgICAgIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMSkpKSB7XHJcbiAgICAgICAgICAgICAgcHJlZml4ID0gdGVzdEl0ZW0uc3Vic3RyKDAsIDEpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih0ZXN0SXRlbS5zdWJzdHIoMCwgdGVzdEl0ZW0ubGVuZ3RoIC0gMSkpKSB7XHJcbiAgICAgICAgICAgICAgc3VmZml4ID0gdGVzdEl0ZW0uc3Vic3RyKHRlc3RJdGVtLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7XHJcbiAgICAgICAgICBwcmVmaXg6IHByZWZpeCxcclxuICAgICAgICAgIHN1ZmZpeDogc3VmZml4XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3JtYXQgZWFjaCBkYXRhIGluIHRoZSBpbmRpdmlkdWFsIGFycmF5c1xyXG4gICAgICAgIGZvciAodmFyIGsgaW4gY0RhdFtjdXJyS2V5XSkge1xyXG4gICAgICAgICAgaWYgKHByZWZpeCAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIGNEYXRbY3VycktleV1ba10gPSBjRGF0W2N1cnJLZXldW2tdLnJlcGxhY2UocHJlZml4LCBcIlwiKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChzdWZmaXggIT0gXCJcIikge1xyXG4gICAgICAgICAgICBjRGF0W2N1cnJLZXldW2tdID0gY0RhdFtjdXJyS2V5XVtrXS5yZXBsYWNlKHN1ZmZpeCwgXCJcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy9uZXdTdHIgPSBjRGF0XHJcbiAgICAgICAgICAvL3JlcGxhY2VEYXRhLnB1c2goKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycktleSA9PSByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSkge1xyXG4gICAgICAgIGZvcm1hdE9ialtjdXJyS2V5XSA9IHtcclxuICAgICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICAgIHN1ZmZpeDogXCJcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgaWYgKCFzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgLy8gZG8gbm90aGluZztcclxuICAgICAgLy8gcmV0dXJuIGNEYXQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgbGV0IGNEYXRfTmV3ID0ge307XHJcblxyXG4gICAgICBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0gPSBPYmplY3Qua2V5cyhjRGF0KTtcclxuICAgICAgbGV0IGluZGV4ID0gY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdLmluZGV4T2YocmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpO1xyXG4gICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjRGF0X05ld1tjRGF0W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXVtpXV0gPSBbXTtcclxuICAgICAgICBmb3IgKHZhciBqIGluIGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXSkge1xyXG4gICAgICAgICAgY0RhdF9OZXdbY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1baV1dLnB1c2goY0RhdFtjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1bal1dW2ldKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL3JldHVybiBjRGF0X05ldztcclxuICAgICAgY0RhdCA9IGNEYXRfTmV3OyAvLyByZWFzc2lnbiB0byBjRGF0XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAvLyBBZGQgc3VmZml4ZXMgdG8gYXV0by1nZW5lcmF0ZWQgbGluZXNcclxuICAgICAgZm9ybWF0T2JqW1wiUGFyZXRvXCJdID0ge1xyXG4gICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICBzdWZmaXg6IFwiJVwiXHJcbiAgICAgIH1cclxuICAgICAgZm9ybWF0T2JqW1wiODAlIGxpbmVcIl0gPSB7XHJcbiAgICAgICAgcHJlZml4OiBcIlwiLFxyXG4gICAgICAgIHN1ZmZpeDogXCIlXCJcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgcmV0dXJuICgodmFsdWUgIT0gbnVsbCkgJiYgIWlzTmFOKE51bWJlcih2YWx1ZS50b1N0cmluZygpKSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybkRhdGEuX2Zvcm1hdE9iamVjdCA9IGZvcm1hdE9iajtcclxuICAgIHJldHVybkRhdGEuZGF0YSA9IGNEYXQ7XHJcbiAgICAvL2NvbnNvbGUubG9nKGNEYXQpO1xyXG4gICAgcmV0dXJuIHJldHVybkRhdGE7XHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhcnRPYmplY3RCdWlsZGVyKGNoYXJ0VHlwZSwgY2hhcnREYXRhLCB1c2VBbHRBeGlzLCB0aXRsZSwgeUF4aXNMYWJlbFRleHQsIHlBeGlzTGFiZWxUZXh0X0FsdCwgeEF4aXNMYWJlbFRleHQsIGNvcm5lcnN0b25lLCBzd2FwTGFiZWxzQW5kRGF0YXNldHMsIGZvcm1hdE9iamVjdCkge1xyXG4gICAgaWYgKChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgJiYgdXNlQWx0QXhpcyA9PSB0cnVlKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIllvdSBoYXZlIGVuYWJsZWQgYWx0ZXJuYXRlIGF4aXMgb24gYSAodW5zdXBwb3J0ZWQpIGNoYXJ0IHR5cGUuIEl0IGhhcyBiZWVuIHNldCB0byBmYWxzZVwiKTtcclxuICAgICAgdXNlQWx0QXhpcyA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICB5QXhpc0xhYmVsVGV4dF9BbHQgPSBcIlBhcmV0byAlXCI7XHJcbiAgICAgIHVzZUFsdEF4aXMgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvcHRpb25zOiBhbnkgPSB7XHJcbiAgICAgIG1haW50YWluQXNwZWN0UmF0aW86IGZhbHNlLFxyXG4gICAgICByZXNwb25zaXZlOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIGlmICh0aXRsZSkge1xyXG4gICAgICBvcHRpb25zLnRpdGxlID0ge1xyXG4gICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgdGV4dDogdGl0bGVcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB5QXhpc0xhYmVsID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogXCJcIiB9XHJcbiAgICBpZiAoeUF4aXNMYWJlbFRleHQpIHtcclxuICAgICAgeUF4aXNMYWJlbC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeUF4aXNMYWJlbC50ZXh0ID0geUF4aXNMYWJlbFRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHlBeGlzTGFiZWxfQWx0ID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogXCJcIiB9XHJcbiAgICBpZiAoeUF4aXNMYWJlbFRleHRfQWx0KSB7XHJcbiAgICAgIHlBeGlzTGFiZWxfQWx0LmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB5QXhpc0xhYmVsX0FsdC50ZXh0ID0geUF4aXNMYWJlbFRleHRfQWx0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB4QXhpc0xhYmVsID0geyBkaXNwbGF5OiBmYWxzZSwgdGV4dDogXCJcIiB9O1xyXG4gICAgaWYgKHhBeGlzTGFiZWxUZXh0KSB7XHJcbiAgICAgIHhBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHhBeGlzTGFiZWwudGV4dCA9IHhBeGlzTGFiZWxUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuXHJcbiAgICAgICAgb3B0aW9ucy5zY2FsZXMgPSB7XHJcbiAgICAgICAgICB4OiB7XHJcbiAgICAgICAgICAgIHN0YWNrZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIHRpdGxlOiB4QXhpc0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgdHlwZTonbGluZWFyJyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdsZWZ0JyxcclxuICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBsZXQgYWx0QXhpc09iajogYW55ID0ge1xyXG4gICAgICAgICAgICAvL2lkOiAneUF4aXNfcGFyZXRvJyxcclxuICAgICAgICAgICAgdHlwZTonbGluZWFyJyxcclxuICAgICAgICAgICAgcG9zaXRpb246ICdyaWdodCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxyXG4gICAgICAgICAgICB0aWNrczp7fSxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxfQWx0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBhbHRBeGlzT2JqLm1pbiA9IDA7XHJcbiAgICAgICAgICBhbHRBeGlzT2JqLm1heCA9IDEwMDtcclxuICAgICAgICAgIGFsdEF4aXNPYmoudGlja3MgPSB7XHJcbiAgICAgICAgICAgIHN0ZXBTaXplOiA4MFxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIG9wdGlvbnMuc2NhbGVzLnlBeGlzX3BhcmV0bz0gYWx0QXhpc09iajtcclxuICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5zY2FsZXMgPSB7XHJcbiAgICAgICAgICB4OiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiB4QXhpc0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgeUF4aXM6IHtcclxuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWUsXHJcbiAgICAgICAgICAgIHRpdGxlOiB5QXhpc0xhYmVsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHVzZUFsdEF4aXMpIHtcclxuICAgICAgICAgIGxldCBhbHRBeGlzT2JqOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIC8vaWQ6ICd5QXhpc19hbHQnLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgICAgICB0aWNrczoge1xyXG4gICAgICAgICAgICAgIGJlZ2luQXRaZXJvOiB0cnVlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgdHlwZTonbGluZWFyJyxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxfQWx0XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIC8vICAgYWx0QXhpc09iai50aWNrcy5taW4gPSAwO1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLm1heCA9IDEwMDtcclxuICAgICAgICAgIC8vICAgYWx0QXhpc09iai50aWNrcy5zdGVwU2l6ZSA9IDgwXHJcbiAgICAgICAgICAvLyB9XHJcbiAgICAgICAgICBvcHRpb25zLnNjYWxlcy55QXhpc19hbHQgPSBhbHRBeGlzT2JqO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgdHlwZTtcclxuICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FKSB7XHJcbiAgICAgIHR5cGUgPSAnbGluZSdcclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgdHlwZSA9ICdiYXInXHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkhPUklaT05UQUxfQkFSKSB7XHJcbiAgICAgIHR5cGUgPSAnYmFyJ1xyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUpIHtcclxuICAgICAgdHlwZSA9ICdwaWUnXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICB0eXBlID0gJ2RvdWdobnV0J1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgVEhJUyA9IHRoaXM7XHJcblxyXG4gICAgLy8gdG9vbHRpcCAmIHRpdGxlIHByZWZpeC9zdWZmaXggYWRkaXRpb24uIFRpdGxlIHVzZXMgZGVmYXVsdCBjb25maWdzIGZvciBiYXIgL2xpbmVcclxuICAgIG9wdGlvbnMudG9vbHRpcHMgPSB7fTtcclxuICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzID0ge307XHJcblxyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUiB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWwgfHwgJyc7XHJcbiAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmplY3RbdG9vbHRpcEl0ZW0ueExhYmVsXS5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iamVjdFt0b29sdGlwSXRlbS54TGFiZWxdLnN1ZmZpeH1gO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgbGV0IG9iaktleXMgPSBPYmplY3Qua2V5cyhmb3JtYXRPYmplY3QpO1xyXG4gICAgICAgICAgbGV0IGtleSA9IG9iaktleXNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4ICsgMV1cclxuICAgICAgICAgIGxldCBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3Rba2V5XTtcclxuICAgICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9YCArIHRvb2x0aXBJdGVtLnlMYWJlbCArIGAke2Zvcm1hdE9iai5zdWZmaXh9YDs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuICAgICAgICB2YXIgbGFiZWwgPSBkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF07XHJcbiAgICAgICAgaWYgKGxhYmVsKSB7XHJcbiAgICAgICAgICBsYWJlbCArPSAnOiAnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZm9ybWF0T2JqO1xyXG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmxhYmVsc1t0b29sdGlwSXRlbS5pbmRleF1dO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbF07XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBsYWJlbCArPSBgJHtmb3JtYXRPYmoucHJlZml4fSR7ZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmRhdGFbdG9vbHRpcEl0ZW0uaW5kZXhdfSR7Zm9ybWF0T2JqLnN1ZmZpeH1gO1xyXG4gICAgICAgIHJldHVybiBsYWJlbDtcclxuICAgICAgfVxyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy50aXRsZSA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtWzBdLmRhdGFzZXRJbmRleF0ubGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcclxuICAgICAgb3B0aW9ucy5pbmRleEF4aXMgPSAneSc7XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLmxhYmVsID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcblxyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbDtcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmb3JtYXRPYmo7XHJcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XV07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9JHtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0uZGF0YVt0b29sdGlwSXRlbS5pbmRleF19JHtmb3JtYXRPYmouc3VmZml4fWA7XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLnRpdGxlID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcblxyXG4gICAgICAgIHJldHVybiB0b29sdGlwSXRlbVswXS55TGFiZWw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IHJldHVybk9wdHMgPSB7XHJcbiAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YVBhcnNlcihjaGFydERhdGEsIHVzZUFsdEF4aXMsIGNoYXJ0VHlwZSwgY29ybmVyc3RvbmUsIHN3YXBMYWJlbHNBbmREYXRhc2V0cyksXHJcbiAgICAgIG9wdGlvbnM6IG9wdGlvbnNcclxuICAgIH1cclxuICAgIHJldHVybiByZXR1cm5PcHRzO1xyXG4gIH1cclxuXHJcbiAgZGF0YVBhcnNlcihjaGFydERhdGEsIHVzZUFsdEF4aXMgLypib29sZWFuKi8sIGNoYXJ0VHlwZSAvKmNoYXJ0VHlwZSBlbnVtKi8sIGNvcm5lcnN0b25lLCBzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuXHJcbiAgICAvLyBoZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGNvbG9yIGFycmF5IGZvciBjaGFydC4gY3ljbGVzIHRocm91Z2ggd2hlbiBcclxuICAgIGZ1bmN0aW9uIGdldFBhbGV0dGUob3BhY2l0eSwgbm9PZkNvbG9ycykge1xyXG4gICAgICBsZXQgY29sb3JzID0gW1xyXG4gICAgICAgIGByZ2JhKDE5OSwyMzMsMTgwLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgxMjcsMjA1LDE4Nywke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoNjUsMTgyLDE5Niwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjksMTQ1LDE5Miwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMzQsOTQsMTY4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgzNyw1MiwxNDgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDgsMjksODgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDI1NCwxNzgsNzYsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDI1MywxNDEsNjAsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDI1Miw3OCw0Miwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjI3LDI2LDI4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgxODksMCwzOCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMTI4LDAsMzgsJHtvcGFjaXR5fSlgXHJcbiAgICAgIF07XHJcblxyXG4gICAgICBpZiAobm9PZkNvbG9ycyA+IGNvbG9ycy5sZW5ndGgpIHsgLy8gaWYgbW9yZSBjb2xvcnMgYXJlIHJlcXVpcmVkIHRoYW4gYXZhaWxhYmxlLCBjeWNsZSB0aHJvdWdoIGJlZ2lubmluZyBhZ2FpblxyXG4gICAgICAgIGxldCBkaWZmID0gbm9PZkNvbG9ycyAtIGNvbG9ycy5sZW5ndGg7XHJcbiAgICAgICAgbGV0IGNvbG9yc0xlbmd0aCA9IGNvbG9ycy5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gZGlmZjsgaSkgeyAvLyBOTyBJTkNSRU1FTlQgSEVSRVxyXG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb2xvcnNMZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBjb2xvcnMucHVzaChjb2xvcnNbal0pXHJcbiAgICAgICAgICAgIGkrKzsgLy8gSU5DUkVNRU5UIEhFUkVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBjb2xvcnM7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNvbG9yUGFsYXR0ZTtcclxuICAgIGxldCBiZ0NvbG9yUGFsYXR0ZVxyXG4gICAgaWYgKCFzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgY29sb3JQYWxhdHRlID0gZ2V0UGFsZXR0ZSgxLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgICAgYmdDb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDAuMywgY2hhcnREYXRhW2Nvcm5lcnN0b25lXS5sZW5ndGgpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDEsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgICBiZ0NvbG9yUGFsYXR0ZSA9IGdldFBhbGV0dGUoMC4zLCBPYmplY3Qua2V5cyhjaGFydERhdGEpLmxlbmd0aClcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGxldCBkYXRhU2V0cyA9IFtdO1xyXG4gICAgbGV0IG9iaktleXMgPSBPYmplY3Qua2V5cyhjaGFydERhdGEpO1xyXG4gICAgbGV0IGluZGV4ID0gb2JqS2V5cy5pbmRleE9mKGNvcm5lcnN0b25lKTtcclxuICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgIG9iaktleXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmpLZXlzLmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgICBsZXQgeUF4aXMgPSAneUF4aXMnO1xyXG4gICAgICBpZiAodXNlQWx0QXhpcykge1xyXG4gICAgICAgIGlmIChpID4gMCkge1xyXG4gICAgICAgICAgeUF4aXMgKz0gJ19hbHQnO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IGRhdGFTZXQ6IGFueSA9IHtcclxuICAgICAgICBsYWJlbDogb2JqS2V5c1tpXSxcclxuICAgICAgICBkYXRhOiBjaGFydERhdGFbb2JqS2V5c1tpXV0sXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiBiZ0NvbG9yUGFsYXR0ZVtpXSxcclxuICAgICAgICBib3JkZXJDb2xvcjogY29sb3JQYWxhdHRlW2ldLFxyXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXHJcbiAgICAgIH07XHJcblxyXG5cclxuICAgICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FKSB7IC8vIGlnbm9yZXMgc3RhY2tlZCBhbmQgYmFyIG9wdGlvbnMuIE1ha2VzIGFzc3VtcHRpb24gdGhhdCBvbmx5IDFzdCBkYXRhc2V0IGlzIGJhclxyXG4gICAgICAgIGlmIChpID09IDApIHtcclxuICAgICAgICAgIGRhdGFTZXQudHlwZSA9ICdiYXInO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhU2V0LnR5cGUgPSAnbGluZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkhPUklaT05UQUxfQkFSIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxhdHRlW2ldO1xyXG4gICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGVbaV07XHJcbiAgICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuTElORSkge1xyXG4gICAgICAgIGlmIChkYXRhU2V0LnR5cGUgPT0gJ2JhcicpIHtcclxuICAgICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVbaV07XHJcbiAgICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxhdHRlW2ldO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkYXRhU2V0LmJvcmRlckNvbG9yID0gY29sb3JQYWxhdHRlW2ldO1xyXG4gICAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgwLDAsMCwwKSc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkgey8vIG92ZXJ3cml0ZSBzaW5nbGUgY29sb3IgYXNzaWdubWVudCB0byBhcnJheS5cclxuICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9IGJnQ29sb3JQYWxhdHRlO1xyXG4gICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGU7XHJcbiAgICAgIH1cclxuXHJcblxyXG4gICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFICYmIGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgICAgaWYgKGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRUQgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgICAgIGRhdGFTZXQueUF4aXNJRCA9IHlBeGlzO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgZGF0YVNldHMucHVzaChkYXRhU2V0KTtcclxuICAgIH1cclxuICAgIGxldCByZXR1cm5EYXRhID0ge1xyXG4gICAgICBsYWJlbHM6IGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0sXHJcbiAgICAgIGRhdGFzZXRzOiBkYXRhU2V0c1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybkRhdGE7XHJcbiAgfVxyXG5cclxuICBwZXJmb3JtUGFyZXRvQW5hbHlzaXMocHJvcHMpe1xyXG4gICAgLy9tb2RpZnkgY2hhcnQgb2JqZWN0XHJcbiAgICBsZXQgbG9jYWxTdW1BcnIgPSBbXTtcclxuICAgIGxldCB0b3RhbFN1bSA9IDA7XHJcblxyXG4gICAgLy8gY2FsY3VsYXRlIHRoZSBsb2NhbCBzdW0gb2YgZWFjaCBkYXRhcG9pbnQgKGkuZS4gZm9yIGRhdGFzZXRzIDEsIDIsIDMsIHN1bSBvZiBlYWNoIGNvcnJlc3BvbmRpbmcgZGF0YXBvaW50IGRzMVswXSArIGRzMlswXSArIGRzM1swXSkgXHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHByb3BzLmRhdGEuZGF0YXNldHNbMF0uZGF0YS5sZW5ndGg7IGorKykgeyAvLyB0YWtlcyB0aGUgZmlyc3QgZGF0YXNldCBsZW5ndGggYXMgcmVmZXJlbmNlXHJcbiAgICAgIGxldCBzdW0gPSAwO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmRhdGEuZGF0YXNldHMubGVuZ3RoOyBpKyspIHsgLy8gZm9yIGVhY2ggZGF0YXNldFxyXG4gICAgICAgIGxldCB2YWwgPSBwYXJzZUZsb2F0KHByb3BzLmRhdGEuZGF0YXNldHNbaV0uZGF0YVtqXSk7XHJcbiAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHtcclxuICAgICAgICAgIHZhbCA9IDA7IC8vIHNldCBpbnZhbGlkIHZhbHVlcyBhcyAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN1bSArPSB2YWxcclxuICAgICAgfVxyXG4gICAgICBsb2NhbFN1bUFyci5wdXNoKHN1bSk7XHJcbiAgICAgIHRvdGFsU3VtICs9IHN1bTtcclxuICAgIH1cclxuXHJcbiAgICAvL3BvcHVsYXRlIG5ldyBhcnJheSB3aXRoIG1vZGlmaWVkIHNvcnRpbmcgb2JqZWN0XHJcbiAgICBsZXQgbmV3QXJyID0gW107IC8vIHRoaXMgYXJyYXkgaG9sZHMgYW4gb2JqZWN0IHdpdGggdGhlIHN1bSwgbGFiZWwsIGFuZCBkYXRhIGZyb20gZWFjaCBkYXRhc2V0XHJcbiAgICAvKlxyXG4gICAgRWFjaCBvYmplY3QgbG9va3MgbGlrZSB0aGlzOlxyXG4gICAgbyA9IHtcclxuICAgICAgICAgICAgc3VtOiA0MThcclxuICAgICAgICAgICAgbGFiZWxzOiBcIldoYXRldmVyIGxhYmVsXCJcclxuICAgICAgICAgICAgMDogNjZcclxuICAgICAgICAgICAgMTogOThcclxuICAgICAgICAgICAgMjogNjdcclxuICAgICAgICAgICAgMzogOTZcclxuICAgICAgICAgICAgNDogOTFcclxuICAgICAgICB9XHJcbiAgICAqL1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbFN1bUFyci5sZW5ndGg7IGkrKykge1xyXG4gICAgICBsZXQgbyA9IHtcclxuICAgICAgICBzdW06IGxvY2FsU3VtQXJyW2ldLFxyXG4gICAgICAgIGxhYmVsczogcHJvcHMuZGF0YS5sYWJlbHNbaV0sXHJcbiAgICAgIH1cclxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgb1tqXSA9IHByb3BzLmRhdGEuZGF0YXNldHNbal0uZGF0YVtpXTtcclxuICAgICAgfVxyXG4gICAgICBuZXdBcnIucHVzaChvKVxyXG4gICAgfVxyXG5cclxuICAgIC8vc29ydCBuZXcgYXJyYXkgKG5ld0FycikgZGVzY2VuZGluZyBbXCJzdW1cIl0gcHJvcGVydHlcclxuICAgIG5ld0Fyci5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgIHJldHVybiAoKGEuc3VtIDwgYi5zdW0pID8gMSA6ICgoYS5zdW0gPT0gYi5zdW0pID8gMCA6IC0xKSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGxhYmVscyBhcnJheSAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGxldCBuZXdMYWJlbHNBcnJheSA9IFtdXHJcbiAgICBmb3IgKGxldCBpID0wOyBpIDwgbmV3QXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgbmV3TGFiZWxzQXJyYXkucHVzaChuZXdBcnJbaV1bXCJsYWJlbHNcIl0pO1xyXG4gICAgfVxyXG4gICAgcHJvcHMuZGF0YS5sYWJlbHMgPSBuZXdMYWJlbHNBcnJheTtcclxuXHJcbiAgICAvL3JlYnVpbGQgYW5kIHJlYXNzaWduIGRhdGEgYXJyYXkgZm9yIGVhY2ggZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW5cclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcHMuZGF0YS5kYXRhc2V0cy5sZW5ndGg7IGorKykge1xyXG4gICAgICBsZXQgZGF0YSA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgZGF0YS5wdXNoKG5ld0FycltpXVtqXSlcclxuICAgICAgfVxyXG4gICAgICBwcm9wcy5kYXRhLmRhdGFzZXRzW2pdLmRhdGEgPSBkYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vY3JlYXRlIGEgc29ydGVkIGxvY2FsIHN1bSBhcnJheSBmb3IgcGFyZXRvIGN1cnZlIGNhbGN1bGF0aW9uc1xyXG4gICAgbGV0IHNvcnRlZGxvY2FsU3VtQXJyID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMCA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICBzb3J0ZWRsb2NhbFN1bUFyci5wdXNoKG5ld0FycltpXS5zdW0pXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHJvbGxpbmdTdW0gPSAwOyAvLyBjdW11bGF0aXZlIHN1bSBvZiB2YWx1ZXNcclxuICAgIGxldCBwYXJldG9MaW5lVmFsdWVzID0gW107XHJcbiAgICBsZXQgZWlnaHR5UGVyY2VudExpbmUgPSBbXTsgLy8gaGFyZCBjb2RlZCB0byA4MCVcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgYW5kIHB1c2ggcGFyZXRvIGxpbmUsIGFsc28gcG9wdWxhdGUgODAlIGxpbmUgYXJyYXlcclxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IHNvcnRlZGxvY2FsU3VtQXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgcm9sbGluZ1N1bSArPSBzb3J0ZWRsb2NhbFN1bUFycltpXTtcclxuICAgICAgbGV0IHBhcmV0b1ZhbCA9IHJvbGxpbmdTdW0vdG90YWxTdW0gKiAxMDA7XHJcbiAgICAgIHBhcmV0b0xpbmVWYWx1ZXMucHVzaCggTWF0aC5mbG9vcihwYXJldG9WYWwgKiAxMDApIC8gMTAwICk7XHJcbiAgICAgIGVpZ2h0eVBlcmNlbnRMaW5lLnB1c2goODApXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIGFkZCBwYXJldG8gY3VydmUgYXMgYSBuZXcgZGF0YXNldCAtIGRpcmVjdGx5IG1vZGlmaWVzIGNoYXJ0IG9iamVjdCBwYXNzZWQgaW4gXHJcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xyXG4gICAgICBcImxhYmVsXCI6XCJQYXJldG9cIixcclxuICAgICAgXCJkYXRhXCI6cGFyZXRvTGluZVZhbHVlcyxcclxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjpcInJnYmEoMCwwLDAsMClcIixcclxuICAgICAgXCJib3JkZXJDb2xvclwiOlwicmdiYSgwLDAsMCwwLjgpXCIsXHJcbiAgICAgIFwiYm9yZGVyV2lkdGhcIjoyLFxyXG4gICAgICBcInR5cGVcIjpcImxpbmVcIixcclxuICAgICAgXCJ5QXhpc0lEXCI6XCJ5QXhpc19wYXJldG9cIixcclxuICAgICAgXCJkYXRhbGFiZWxzXCI6IHtcclxuICAgICAgICBcImRpc3BsYXlcIjpmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBcInBvaW50UmFkaXVzXCI6IDBcclxuICAgIH0pXHJcblxyXG4gICAgLy8gcHVzaCA4MCUgbGluZSBhcyBhIG5ldyBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpblxyXG4gICAgcHJvcHMuZGF0YS5kYXRhc2V0cy5wdXNoKHtcclxuICAgICAgXCJsYWJlbFwiOlwiODAlIGxpbmVcIixcclxuICAgICAgXCJkYXRhXCI6ZWlnaHR5UGVyY2VudExpbmUsXHJcbiAgICAgIFwiYmFja2dyb3VuZENvbG9yXCI6XCJyZ2JhKDAsMCwwLDApXCIsXHJcbiAgICAgIFwiYm9yZGVyQ29sb3JcIjpcInJnYmEoMCwwLDAsMC44KVwiLFxyXG4gICAgICBcImJvcmRlcldpZHRoXCI6MixcclxuICAgICAgXCJ0eXBlXCI6XCJsaW5lXCIsXHJcbiAgICAgIFwieUF4aXNJRFwiOlwieUF4aXNfcGFyZXRvXCIsXHJcbiAgICAgIFwiZGF0YWxhYmVsc1wiOiB7XHJcbiAgICAgICAgXCJkaXNwbGF5XCI6ZmFsc2VcclxuICAgICAgfSxcclxuICAgICAgXCJwb2ludFJhZGl1c1wiOiAwXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgICAvLyB1bnVzZWQuIE1pZ3JhdGVkIGNvZGUgdG8gTmV1cmFzaWxEYXRhRmlsdGVyUGlwZVxyXG4gIC8vIGZpbHRlckRhdGEoZGF0YTogQXJyYXk8YW55PiwgZGF0YXNldEZpbHRlcjogc3RyaW5nKSB7XHJcblxyXG4gIC8vICAgaWYgKGRhdGFzZXRGaWx0ZXIpIHtcclxuICAvLyAgICAgbGV0IGZpbHRlclRlcm1zID0gZGF0YXNldEZpbHRlci5zcGxpdCgnLCcpO1xyXG4gIC8vICAgICBsZXQgaW5jbHVkZVRlcm1zID0gW107XHJcbiAgLy8gICAgIGxldCBleGNsdWRlVGVybXMgPSBbXTtcclxuICAvLyAgICAgbGV0IGluY2x1ZGVDb2x1bW5zID0gW107XHJcbiAgLy8gICAgIGxldCBleGNsdWRlQ29sdW1ucyA9IFtdO1xyXG4gIC8vICAgICBmb3IgKGxldCBpIGluIGZpbHRlclRlcm1zKSB7XHJcbiAgLy8gICAgICAgaWYgKGZpbHRlclRlcm1zW2ldICE9IG51bGwgJiYgZmlsdGVyVGVybXNbaV0gIT0gdW5kZWZpbmVkICYmIGZpbHRlclRlcm1zW2ldLmxlbmd0aCA+IDEpIHtcclxuICAvLyAgICAgICAgIGxldCB0ZXJtID0gZmlsdGVyVGVybXNbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICBpZiAodGVybVswXSA9PSBcIi1cIikge1xyXG4gIC8vICAgICAgICAgICBleGNsdWRlVGVybXMucHVzaCh0ZXJtLnJlcGxhY2UoXCItXCIsIFwiXCIpLnRyaW0oKSk7XHJcbiAgLy8gICAgICAgICB9IGVsc2UgaWYgKHRlcm1bMF0gPT0gXCJ+XCIpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHRlcm1bMV0gPT0gXCIhXCIpIHtcclxuICAvLyAgICAgICAgICAgICBleGNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn4hXCIsIFwiXCIpLnRyaW0oKSk7XHJcbiAgLy8gICAgICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICAgICAgaW5jbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+XCIsIFwiXCIpLnRyaW0oKSlcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgICAgaW5jbHVkZVRlcm1zLnB1c2godGVybS50cmltKCkpXHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9XHJcblxyXG5cclxuICAvLyAgICAgbGV0IGRhdGFfRmlsdGVyZWQgPSBkYXRhLmZpbHRlcihmdW5jdGlvbiAoZGF0YUl0ZW0pIHtcclxuICAvLyAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgbGV0IHNlYXJjaFN0cmluZyA9IFwiXCI7XHJcbiAgLy8gICAgICAgZm9yIChsZXQgaSBpbiBrX2Fycikge1xyXG4gIC8vICAgICAgICAgbGV0IGN1cnJLZXkgPSBrX2FycltpXTtcclxuICAvLyAgICAgICAgIGxldCB2YWx1ZSA9IGRhdGFJdGVtW2N1cnJLZXldO1xyXG4gIC8vICAgICAgICAgc2VhcmNoU3RyaW5nICs9IHZhbHVlICsgXCIgXCI7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIHNlYXJjaFN0cmluZyA9IHNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAvLyAgICAgICBsZXQgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcclxuICAvLyAgICAgICBpZiAoaW5jbHVkZVRlcm1zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgaW4gaW5jbHVkZVRlcm1zKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoaW5jbHVkZVRlcm1zW2ldKSkge1xyXG4gIC8vICAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcclxuICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH0gZWxzZSB7XHJcbiAgLy8gICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIGlmIChleGNsdWRlVGVybXMubGVuZ3RoID4gMCAmJiBjdXJyZW50UGFzc2luZ1N0YXR1cykge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBleGNsdWRlVGVybXMpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhleGNsdWRlVGVybXNbaV0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcclxuICAvLyAgICAgICAgICAgICBicmVhaztcclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgICBpZiAoY3VycmVudFBhc3NpbmdTdGF0dXMpIHtcclxuXHJcbiAgLy8gICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICB9KTtcclxuXHJcbiAgLy8gICAgIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwICYmIGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICB3aW5kb3cuYWxlcnQoXCJVbnN1cHBvcnRlZCB1c2FnZSBvZiBpbmNsdWRlICYgZXhjbHVkZSBjb2x1bW5zLiBUaGluZ3MgbWF5IGJyZWFrXCIpXHJcbiAgLy8gICAgIH1cclxuICAvLyAgICAgLy9hZnRlciBmaWx0ZXJpbmcgaXMgY29tcGxldGUsIHJlbW92ZSBjb2x1bW5zIGZyb20gY2xvbmUgb2YgZGF0YVxyXG4gIC8vICAgICBlbHNlIGlmIChleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgLy8gICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpXHJcbiAgLy8gICAgICAgLy9jb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAvLyAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcclxuICAvLyAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XHJcbiAgLy8gICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgICAvL2ZvciAobGV0IGkgaW4ga19hcnIpIHtcclxuICAvLyAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcclxuICAvLyAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBEbyBub3QgYWxsb3cgdXNlciB0byBkZWxldGUgZmlyc3QgY29sdW1uXHJcbiAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBleGNsdWRlQ29sdW1ucykge1xyXG4gIC8vICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gIC8vICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhleGNsdWRlQ29sdW1uc1tqXSkpIHtcclxuICAvLyAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICAgIGVsc2UgaWYgKGluY2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICBkYXRhX0ZpbHRlcmVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhX0ZpbHRlcmVkKSk7XHJcbiAgLy8gICAgICAgZm9yICh2YXIgaCBpbiBkYXRhX0ZpbHRlcmVkKSB7XHJcbiAgLy8gICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhX0ZpbHRlcmVkW2hdO1xyXG4gIC8vICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gIC8vICAgICAgICAgICBpZiAoaSA+IDApIHsvLyBza2lwIHRoZSBmaXJzdCBjb2x1bW4uIE5lZWRlZD9cclxuICAvLyAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkS2V5ID0ga19hcnJbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICAgICAgbGV0IGtlZXBDb2x1bW4gPSBmYWxzZTtcclxuICAvLyAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGluY2x1ZGVDb2x1bW5zKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBpZiAocHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgICBrZWVwQ29sdW1uID0gdHJ1ZTtcclxuICAvLyAgICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgICAgIC8vIGlmICghcHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgLy8gICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XHJcbiAgLy8gICAgICAgICAgICAgICAvLyB9XHJcbiAgLy8gICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgIGlmICgha2VlcENvbHVtbikge1xyXG4gIC8vICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgIH1cclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcbiAgLy8gICAgIHJldHVybiBkYXRhX0ZpbHRlcmVkO1xyXG4gIC8vICAgfVxyXG4gIC8vICAgcmV0dXJuIGRhdGE7IC8vIGlmIG5vIGZpbHRlciwgcmV0dXJuIG9yaWdpbmFsIGRhdGFcclxuICAvLyB9XHJcbn1cclxuIl19