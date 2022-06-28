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
        console.log("here", yAxisLabel);
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
            console.log(options, JSON.stringify(options));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZXVyYXNpbC1jaGFydHMvc3JjL2xpYi9uZXVyYXNpbC1jaGFydHMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFVBQVUsQ0FBQzs7QUFLL0MsTUFBTSxPQUFPLHFCQUFxQjtJQUVoQyxnQkFBZ0IsQ0FBQztJQUdqQix1QkFBdUIsQ0FBQyxTQUE4QixFQUFFLFlBQXdCLEVBQUUscUJBQThCO1FBQzlHLElBQUksVUFBVSxHQUFHO1lBQ2YsWUFBWSxFQUFFLEVBQUU7WUFDaEIsYUFBYSxFQUFFLElBQUk7WUFDbkIsSUFBSSxFQUFFLElBQUk7U0FDWCxDQUFBO1FBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQywwQkFBMEI7UUFFL0UsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUd0QyxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ25CLEtBQUssSUFBSSxDQUFDLElBQUksSUFB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QUNiLFNBQVMsRUFBQyxjQUFjO1lBQ3hCLFlBQVksRUFBRTtnQkFDWixTQUFTLEVBQUMsS0FBSzthQUNoQjtZQUNELGFBQWEsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQTtRQUVGLDRFQUE0RTtRQUM1RSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7WUFDdkIsT0FBTyxFQUFDLFVBQVU7WUFDbEIsTUFBTSxFQUFDLGlCQUFpQjtZQUN4QixpQkFBaUIsRUFBQyxlQUFlO1lBQ2pDLGFBQWEsRUFBQyxpQkFBaUI7WUFDL0IsYUFBYSxFQUFDLENBQUM7WUFDZixNQUFNLEVBQUMsTUFBTTtZQUNiLFNBQVMsRUFBQyxjQUFjO1lBQ3hCLFlBQVksRUFBRTtnQkFDWixTQUFTLEVBQUMsS0FBSzthQUNoQjtZQUNELGFBQWEsRUFBRSxDQUFDO1NBQ2pCLENBQUMsQ0FBQTtJQUNKLENBQUM7OzZHQXhqQlUscUJBQXFCOzBHQUFyQixxQkFBcUIsV0FBckIscUJBQXFCLG1CQUZwQixNQUFNO3VGQUVQLHFCQUFxQjtjQUhqQyxVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE5FVVJBU0lMX0NIQVJUX1RZUEUgfSBmcm9tICcuL21vZGVscyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c1NlcnZpY2Uge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuXHJcbiAgcGFyc2VEYXRhRnJvbURhdGFzb3VyY2UoY2hhcnRUeXBlOiBORVVSQVNJTF9DSEFSVF9UWVBFLCBpbmNvbWluZ0RhdGE6IEFycmF5PGFueT4sIHN3YXBMYWJlbHNBbmREYXRhc2V0czogYm9vbGVhbik6IHsgX2Nvcm5lcnN0b25lOiBzdHJpbmcsIF9mb3JtYXRPYmplY3Q6IHsgcHJlZml4OiBzdHJpbmcsIHN1ZmZpeDogc3RyaW5nIH0sIGRhdGE6IEFycmF5PGFueT4gfSB7XHJcbiAgICBsZXQgcmV0dXJuRGF0YSA9IHtcclxuICAgICAgX2Nvcm5lcnN0b25lOiBcIlwiLFxyXG4gICAgICBfZm9ybWF0T2JqZWN0OiBudWxsLFxyXG4gICAgICBkYXRhOiBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGluY29taW5nRGF0YSkpOyAvLyBtYWtlIGEgY29weSBvZiB0aGUgZGF0YVxyXG5cclxuICAgIGxldCBrX2Fycl9UZW1wID0gT2JqZWN0LmtleXMoZGF0YVswXSk7XHJcblxyXG5cclxuICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFbMF0pO1xyXG4gICAgbGV0IGNEYXQgPSB7fTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgbGV0IGN1cnJLZXkgPSBrX2FycltpXVxyXG4gICAgICBjRGF0W2N1cnJLZXldID0gW107XHJcbiAgICAgIGZvciAodmFyIGogaW4gZGF0YSkge1xyXG4gICAgICAgIGNEYXRba19hcnJbaV1dLnB1c2goZGF0YVtqXVtjdXJyS2V5XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgbGV0IGZvcm1hdE9iaiA9IHt9O1xyXG4gICAgbGV0IGtfYXJyX25ldyA9IE9iamVjdC5rZXlzKGNEYXQpO1xyXG4gICAgcmV0dXJuRGF0YS5fY29ybmVyc3RvbmUgPSBrX2Fycl9uZXdbMF07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fycl9uZXcubGVuZ3RoOyBpKyspIHsgLy8gZm9yIGVhY2gga2V5IGluIGZvcm1hdHRlZCBvYmplY3RcclxuICAgICAgbGV0IGN1cnJLZXkgPSBrX2Fycl9uZXdbaV07XHJcbiAgICAgIGZvcm1hdE9ialtjdXJyS2V5XSA9IHt9O1xyXG4gICAgICBpZiAoY3VycktleSAhPSByZXR1cm5EYXRhLl9jb3JuZXJzdG9uZSkge1xyXG4gICAgICAgIGxldCB0ZXN0SXRlbTtcclxuICAgICAgICBmb3IgKHZhciBqIGluIGNEYXRbY3VycktleV0pIHtcclxuICAgICAgICAgIGlmIChjRGF0W2N1cnJLZXldW2pdKSB7IC8vIHNldCB0ZXN0IGl0ZW0gYW5kIGJyZWFrIGlmIHRoZSB2YWx1ZSBpcyBub3QgbnVsbFxyXG4gICAgICAgICAgICB0ZXN0SXRlbSA9IGNEYXRbY3VycktleV1bal07XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHByZWZpeCA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHN1ZmZpeCA9IFwiXCI7XHJcbiAgICAgICAgaWYgKHRlc3RJdGVtKSB7XHJcbiAgICAgICAgICBpZiAoIWlzTnVtYmVyKHRlc3RJdGVtKSkge1xyXG4gICAgICAgICAgICBpZiAoaXNOdW1iZXIodGVzdEl0ZW0uc3Vic3RyKDEpKSkge1xyXG4gICAgICAgICAgICAgIHByZWZpeCA9IHRlc3RJdGVtLnN1YnN0cigwLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodGVzdEl0ZW0uc3Vic3RyKDAsIHRlc3RJdGVtLmxlbmd0aCAtIDEpKSkge1xyXG4gICAgICAgICAgICAgIHN1ZmZpeCA9IHRlc3RJdGVtLnN1YnN0cih0ZXN0SXRlbS5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9ybWF0T2JqW2N1cnJLZXldID0ge1xyXG4gICAgICAgICAgcHJlZml4OiBwcmVmaXgsXHJcbiAgICAgICAgICBzdWZmaXg6IHN1ZmZpeFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZm9ybWF0IGVhY2ggZGF0YSBpbiB0aGUgaW5kaXZpZHVhbCBhcnJheXNcclxuICAgICAgICBmb3IgKHZhciBrIGluIGNEYXRbY3VycktleV0pIHtcclxuICAgICAgICAgIGlmIChwcmVmaXggIT0gXCJcIikge1xyXG4gICAgICAgICAgICBjRGF0W2N1cnJLZXldW2tdID0gY0RhdFtjdXJyS2V5XVtrXS5yZXBsYWNlKHByZWZpeCwgXCJcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoc3VmZml4ICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgY0RhdFtjdXJyS2V5XVtrXSA9IGNEYXRbY3VycktleV1ba10ucmVwbGFjZShzdWZmaXgsIFwiXCIpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vbmV3U3RyID0gY0RhdFxyXG4gICAgICAgICAgLy9yZXBsYWNlRGF0YS5wdXNoKClcclxuICAgICAgICB9XHJcblxyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJLZXkgPT0gcmV0dXJuRGF0YS5fY29ybmVyc3RvbmUpIHtcclxuICAgICAgICBmb3JtYXRPYmpbY3VycktleV0gPSB7XHJcbiAgICAgICAgICBwcmVmaXg6IFwiXCIsXHJcbiAgICAgICAgICBzdWZmaXg6IFwiXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGlmICghc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgIC8vIGRvIG5vdGhpbmc7XHJcbiAgICAgIC8vIHJldHVybiBjRGF0O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIGxldCBjRGF0X05ldyA9IHt9O1xyXG5cclxuICAgICAgY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdID0gT2JqZWN0LmtleXMoY0RhdCk7XHJcbiAgICAgIGxldCBpbmRleCA9IGNEYXRfTmV3W3JldHVybkRhdGEuX2Nvcm5lcnN0b25lXS5pbmRleE9mKHJldHVybkRhdGEuX2Nvcm5lcnN0b25lKTtcclxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNEYXRbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY0RhdF9OZXdbY0RhdFtyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV1baV1dID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaiBpbiBjRGF0X05ld1tyZXR1cm5EYXRhLl9jb3JuZXJzdG9uZV0pIHtcclxuICAgICAgICAgIGNEYXRfTmV3W2NEYXRbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdW2ldXS5wdXNoKGNEYXRbY0RhdF9OZXdbcmV0dXJuRGF0YS5fY29ybmVyc3RvbmVdW2pdXVtpXSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgLy9yZXR1cm4gY0RhdF9OZXc7XHJcbiAgICAgIGNEYXQgPSBjRGF0X05ldzsgLy8gcmVhc3NpZ24gdG8gY0RhdFxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgLy8gQWRkIHN1ZmZpeGVzIHRvIGF1dG8tZ2VuZXJhdGVkIGxpbmVzXHJcbiAgICAgIGZvcm1hdE9ialtcIlBhcmV0b1wiXSA9IHtcclxuICAgICAgICBwcmVmaXg6IFwiXCIsXHJcbiAgICAgICAgc3VmZml4OiBcIiVcIlxyXG4gICAgICB9XHJcbiAgICAgIGZvcm1hdE9ialtcIjgwJSBsaW5lXCJdID0ge1xyXG4gICAgICAgIHByZWZpeDogXCJcIixcclxuICAgICAgICBzdWZmaXg6IFwiJVwiXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBpc051bWJlcih2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgIHJldHVybiAoKHZhbHVlICE9IG51bGwpICYmICFpc05hTihOdW1iZXIodmFsdWUudG9TdHJpbmcoKSkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm5EYXRhLl9mb3JtYXRPYmplY3QgPSBmb3JtYXRPYmo7XHJcbiAgICByZXR1cm5EYXRhLmRhdGEgPSBjRGF0O1xyXG4gICAgLy9jb25zb2xlLmxvZyhjRGF0KTtcclxuICAgIHJldHVybiByZXR1cm5EYXRhO1xyXG4gIH1cclxuXHJcblxyXG4gIGNoYXJ0T2JqZWN0QnVpbGRlcihjaGFydFR5cGUsIGNoYXJ0RGF0YSwgdXNlQWx0QXhpcywgdGl0bGUsIHlBeGlzTGFiZWxUZXh0LCB5QXhpc0xhYmVsVGV4dF9BbHQsIHhBeGlzTGFiZWxUZXh0LCBjb3JuZXJzdG9uZSwgc3dhcExhYmVsc0FuZERhdGFzZXRzLCBmb3JtYXRPYmplY3QpIHtcclxuICAgIGlmICgoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkhPUklaT05UQUxfQkFSIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpICYmIHVzZUFsdEF4aXMgPT0gdHJ1ZSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJZb3UgaGF2ZSBlbmFibGVkIGFsdGVybmF0ZSBheGlzIG9uIGEgKHVuc3VwcG9ydGVkKSBjaGFydCB0eXBlLiBJdCBoYXMgYmVlbiBzZXQgdG8gZmFsc2VcIik7XHJcbiAgICAgIHVzZUFsdEF4aXMgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRF9QQVJFVE8pIHtcclxuICAgICAgeUF4aXNMYWJlbFRleHRfQWx0ID0gXCJQYXJldG8gJVwiO1xyXG4gICAgICB1c2VBbHRBeGlzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb3B0aW9uczogYW55ID0ge1xyXG4gICAgICBtYWludGFpbkFzcGVjdFJhdGlvOiBmYWxzZSxcclxuICAgICAgcmVzcG9uc2l2ZTogdHJ1ZSxcclxuICAgIH07XHJcbiAgICBpZiAodGl0bGUpIHtcclxuICAgICAgb3B0aW9ucy50aXRsZSA9IHtcclxuICAgICAgICBkaXNwbGF5OiB0cnVlLFxyXG4gICAgICAgIHRleHQ6IHRpdGxlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgeUF4aXNMYWJlbCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IFwiXCIgfVxyXG4gICAgaWYgKHlBeGlzTGFiZWxUZXh0KSB7XHJcbiAgICAgIHlBeGlzTGFiZWwuZGlzcGxheSA9IHRydWU7XHJcbiAgICAgIHlBeGlzTGFiZWwudGV4dCA9IHlBeGlzTGFiZWxUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB5QXhpc0xhYmVsX0FsdCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IFwiXCIgfVxyXG4gICAgaWYgKHlBeGlzTGFiZWxUZXh0X0FsdCkge1xyXG4gICAgICB5QXhpc0xhYmVsX0FsdC5kaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgeUF4aXNMYWJlbF9BbHQudGV4dCA9IHlBeGlzTGFiZWxUZXh0X0FsdDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgeEF4aXNMYWJlbCA9IHsgZGlzcGxheTogZmFsc2UsIHRleHQ6IFwiXCIgfTtcclxuICAgIGlmICh4QXhpc0xhYmVsVGV4dCkge1xyXG4gICAgICB4QXhpc0xhYmVsLmRpc3BsYXkgPSB0cnVlO1xyXG4gICAgICB4QXhpc0xhYmVsLnRleHQgPSB4QXhpc0xhYmVsVGV4dDtcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKFwiaGVyZVwiLCB5QXhpc0xhYmVsKVxyXG4gICAgaWYgKGNoYXJ0VHlwZSAhPSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSAmJiBjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG5cclxuICAgICAgICBvcHRpb25zLnNjYWxlcyA9IHtcclxuICAgICAgICAgIHg6IHtcclxuICAgICAgICAgICAgc3RhY2tlZDogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHhBeGlzTGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICB0eXBlOidsaW5lYXInLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2xlZnQnLFxyXG4gICAgICAgICAgICBzdGFja2VkOiB0cnVlLFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlNUQUNLRURfUEFSRVRPKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGxldCBhbHRBeGlzT2JqOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIC8vaWQ6ICd5QXhpc19wYXJldG8nLFxyXG4gICAgICAgICAgICB0eXBlOidsaW5lYXInLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogJ3JpZ2h0JyxcclxuICAgICAgICAgICAgZGlzcGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWUsXHJcbiAgICAgICAgICAgIHRpY2tzOnt9LFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbF9BbHRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGFsdEF4aXNPYmoubWluID0gMDtcclxuICAgICAgICAgIGFsdEF4aXNPYmoubWF4ID0gMTAwO1xyXG4gICAgICAgICAgYWx0QXhpc09iai50aWNrcyA9IHtcclxuICAgICAgICAgICAgc3RlcFNpemU6IDgwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgb3B0aW9ucy5zY2FsZXMueUF4aXNfcGFyZXRvPSBhbHRBeGlzT2JqO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvcHRpb25zLnNjYWxlcyA9IHtcclxuICAgICAgICAgIHg6IHtcclxuICAgICAgICAgICAgdGl0bGU6IHhBeGlzTGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5QXhpczoge1xyXG4gICAgICAgICAgICBiZWdpbkF0WmVybzogdHJ1ZSxcclxuICAgICAgICAgICAgdGl0bGU6IHlBeGlzTGFiZWxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodXNlQWx0QXhpcykge1xyXG4gICAgICAgICAgbGV0IGFsdEF4aXNPYmo6IGFueSA9IHtcclxuICAgICAgICAgICAgLy9pZDogJ3lBeGlzX2FsdCcsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHRydWUsXHJcbiAgICAgICAgICAgIHRpY2tzOiB7XHJcbiAgICAgICAgICAgICAgYmVnaW5BdFplcm86IHRydWUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiAncmlnaHQnLFxyXG4gICAgICAgICAgICB0eXBlOidsaW5lYXInLFxyXG4gICAgICAgICAgICB0aXRsZTogeUF4aXNMYWJlbF9BbHRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIC8vIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLm1pbiA9IDA7XHJcbiAgICAgICAgICAvLyAgIGFsdEF4aXNPYmoudGlja3MubWF4ID0gMTAwO1xyXG4gICAgICAgICAgLy8gICBhbHRBeGlzT2JqLnRpY2tzLnN0ZXBTaXplID0gODBcclxuICAgICAgICAgIC8vIH1cclxuICAgICAgICAgIG9wdGlvbnMuc2NhbGVzLnlBeGlzX2FsdCA9IGFsdEF4aXNPYmo7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZyhvcHRpb25zLEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKVxyXG4gICAgfVxyXG5cclxuICAgIGxldCB0eXBlO1xyXG4gICAgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUpIHtcclxuICAgICAgdHlwZSA9ICdsaW5lJ1xyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICB0eXBlID0gJ2JhcidcclxuICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIpIHtcclxuICAgICAgdHlwZSA9ICdiYXInXHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSkge1xyXG4gICAgICB0eXBlID0gJ3BpZSdcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7XHJcbiAgICAgIHR5cGUgPSAnZG91Z2hudXQnXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCBUSElTID0gdGhpcztcclxuXHJcbiAgICAvLyB0b29sdGlwICYgdGl0bGUgcHJlZml4L3N1ZmZpeCBhZGRpdGlvbi4gVGl0bGUgdXNlcyBkZWZhdWx0IGNvbmZpZ3MgZm9yIGJhciAvbGluZVxyXG4gICAgb3B0aW9ucy50b29sdGlwcyA9IHt9O1xyXG4gICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MgPSB7fTtcclxuXHJcbiAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkJBUl9MSU5FIHx8XHJcbiAgICAgIGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkxJTkUgfHxcclxuICAgICAgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fFxyXG4gICAgICBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5sYWJlbCB8fCAnJztcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzd2FwTGFiZWxzQW5kRGF0YXNldHMpIHtcclxuICAgICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iamVjdFt0b29sdGlwSXRlbS54TGFiZWxdLnByZWZpeH1gICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgYCR7Zm9ybWF0T2JqZWN0W3Rvb2x0aXBJdGVtLnhMYWJlbF0uc3VmZml4fWA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICBsZXQgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGZvcm1hdE9iamVjdCk7XHJcbiAgICAgICAgICBsZXQga2V5ID0gb2JqS2V5c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXggKyAxXVxyXG4gICAgICAgICAgbGV0IGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtrZXldO1xyXG4gICAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH1gICsgdG9vbHRpcEl0ZW0ueUxhYmVsICsgYCR7Zm9ybWF0T2JqLnN1ZmZpeH1gOztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLlBJRSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5ET05VVCkge1xyXG4gICAgICBvcHRpb25zLnRvb2x0aXBzLmNhbGxiYWNrcy5sYWJlbCA9IGZ1bmN0aW9uICh0b29sdGlwSXRlbSwgZGF0YSkge1xyXG4gICAgICAgIHZhciBsYWJlbCA9IGRhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XTtcclxuICAgICAgICBpZiAobGFiZWwpIHtcclxuICAgICAgICAgIGxhYmVsICs9ICc6ICc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBmb3JtYXRPYmo7XHJcbiAgICAgICAgaWYgKHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICAgICAgZm9ybWF0T2JqID0gZm9ybWF0T2JqZWN0W2RhdGEubGFiZWxzW3Rvb2x0aXBJdGVtLmluZGV4XV07XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsXTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhYmVsICs9IGAke2Zvcm1hdE9iai5wcmVmaXh9JHtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0uZGF0YVt0b29sdGlwSXRlbS5pbmRleF19JHtmb3JtYXRPYmouc3VmZml4fWA7XHJcbiAgICAgICAgcmV0dXJuIGxhYmVsO1xyXG4gICAgICB9XHJcbiAgICAgIG9wdGlvbnMudG9vbHRpcHMuY2FsbGJhY2tzLnRpdGxlID0gZnVuY3Rpb24gKHRvb2x0aXBJdGVtLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW1bMF0uZGF0YXNldEluZGV4XS5sYWJlbDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5IT1JJWk9OVEFMX0JBUikge1xyXG4gICAgICBvcHRpb25zLmluZGV4QXhpcyA9ICd5JztcclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MubGFiZWwgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuXHJcbiAgICAgICAgdmFyIGxhYmVsID0gZGF0YS5kYXRhc2V0c1t0b29sdGlwSXRlbS5kYXRhc2V0SW5kZXhdLmxhYmVsO1xyXG4gICAgICAgIGlmIChsYWJlbCkge1xyXG4gICAgICAgICAgbGFiZWwgKz0gJzogJztcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGZvcm1hdE9iajtcclxuICAgICAgICBpZiAoc3dhcExhYmVsc0FuZERhdGFzZXRzKSB7XHJcbiAgICAgICAgICBmb3JtYXRPYmogPSBmb3JtYXRPYmplY3RbZGF0YS5sYWJlbHNbdG9vbHRpcEl0ZW0uaW5kZXhdXTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGZvcm1hdE9iaiA9IGZvcm1hdE9iamVjdFtkYXRhLmRhdGFzZXRzW3Rvb2x0aXBJdGVtLmRhdGFzZXRJbmRleF0ubGFiZWxdO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgbGFiZWwgKz0gYCR7Zm9ybWF0T2JqLnByZWZpeH0ke2RhdGEuZGF0YXNldHNbdG9vbHRpcEl0ZW0uZGF0YXNldEluZGV4XS5kYXRhW3Rvb2x0aXBJdGVtLmluZGV4XX0ke2Zvcm1hdE9iai5zdWZmaXh9YDtcclxuICAgICAgICByZXR1cm4gbGFiZWw7XHJcbiAgICAgIH1cclxuICAgICAgb3B0aW9ucy50b29sdGlwcy5jYWxsYmFja3MudGl0bGUgPSBmdW5jdGlvbiAodG9vbHRpcEl0ZW0sIGRhdGEpIHtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRvb2x0aXBJdGVtWzBdLnlMYWJlbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsZXQgcmV0dXJuT3B0cyA9IHtcclxuICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgZGF0YTogdGhpcy5kYXRhUGFyc2VyKGNoYXJ0RGF0YSwgdXNlQWx0QXhpcywgY2hhcnRUeXBlLCBjb3JuZXJzdG9uZSwgc3dhcExhYmVsc0FuZERhdGFzZXRzKSxcclxuICAgICAgb3B0aW9uczogb3B0aW9uc1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldHVybk9wdHM7XHJcbiAgfVxyXG5cclxuICBkYXRhUGFyc2VyKGNoYXJ0RGF0YSwgdXNlQWx0QXhpcyAvKmJvb2xlYW4qLywgY2hhcnRUeXBlIC8qY2hhcnRUeXBlIGVudW0qLywgY29ybmVyc3RvbmUsIHN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG5cclxuICAgIC8vIGhlbHBlciBmdW5jdGlvbiB0byBnZXQgY29sb3IgYXJyYXkgZm9yIGNoYXJ0LiBjeWNsZXMgdGhyb3VnaCB3aGVuIFxyXG4gICAgZnVuY3Rpb24gZ2V0UGFsZXR0ZShvcGFjaXR5LCBub09mQ29sb3JzKSB7XHJcbiAgICAgIGxldCBjb2xvcnMgPSBbXHJcbiAgICAgICAgYHJnYmEoMTk5LDIzMywxODAsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDEyNywyMDUsMTg3LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSg2NSwxODIsMTk2LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyOSwxNDUsMTkyLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgzNCw5NCwxNjgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDM3LDUyLDE0OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoOCwyOSw4OCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjU0LDE3OCw3Niwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjUzLDE0MSw2MCwke29wYWNpdHl9KWAsXHJcbiAgICAgICAgYHJnYmEoMjUyLDc4LDQyLCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgyMjcsMjYsMjgsJHtvcGFjaXR5fSlgLFxyXG4gICAgICAgIGByZ2JhKDE4OSwwLDM4LCR7b3BhY2l0eX0pYCxcclxuICAgICAgICBgcmdiYSgxMjgsMCwzOCwke29wYWNpdHl9KWBcclxuICAgICAgXTtcclxuXHJcbiAgICAgIGlmIChub09mQ29sb3JzID4gY29sb3JzLmxlbmd0aCkgeyAvLyBpZiBtb3JlIGNvbG9ycyBhcmUgcmVxdWlyZWQgdGhhbiBhdmFpbGFibGUsIGN5Y2xlIHRocm91Z2ggYmVnaW5uaW5nIGFnYWluXHJcbiAgICAgICAgbGV0IGRpZmYgPSBub09mQ29sb3JzIC0gY29sb3JzLmxlbmd0aDtcclxuICAgICAgICBsZXQgY29sb3JzTGVuZ3RoID0gY29sb3JzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSBkaWZmOyBpKSB7IC8vIE5PIElOQ1JFTUVOVCBIRVJFXHJcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbG9yc0xlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbG9ycy5wdXNoKGNvbG9yc1tqXSlcclxuICAgICAgICAgICAgaSsrOyAvLyBJTkNSRU1FTlQgSEVSRVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNvbG9ycztcclxuICAgIH1cclxuXHJcbiAgICBsZXQgY29sb3JQYWxhdHRlO1xyXG4gICAgbGV0IGJnQ29sb3JQYWxhdHRlXHJcbiAgICBpZiAoIXN3YXBMYWJlbHNBbmREYXRhc2V0cykge1xyXG4gICAgICBjb2xvclBhbGF0dGUgPSBnZXRQYWxldHRlKDEsIGNoYXJ0RGF0YVtjb3JuZXJzdG9uZV0ubGVuZ3RoKVxyXG4gICAgICBiZ0NvbG9yUGFsYXR0ZSA9IGdldFBhbGV0dGUoMC4zLCBjaGFydERhdGFbY29ybmVyc3RvbmVdLmxlbmd0aClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbG9yUGFsYXR0ZSA9IGdldFBhbGV0dGUoMSwgT2JqZWN0LmtleXMoY2hhcnREYXRhKS5sZW5ndGgpXHJcbiAgICAgIGJnQ29sb3JQYWxhdHRlID0gZ2V0UGFsZXR0ZSgwLjMsIE9iamVjdC5rZXlzKGNoYXJ0RGF0YSkubGVuZ3RoKVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgbGV0IGRhdGFTZXRzID0gW107XHJcbiAgICBsZXQgb2JqS2V5cyA9IE9iamVjdC5rZXlzKGNoYXJ0RGF0YSk7XHJcbiAgICBsZXQgaW5kZXggPSBvYmpLZXlzLmluZGV4T2YoY29ybmVyc3RvbmUpO1xyXG4gICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgb2JqS2V5cy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iaktleXMubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICAgIGxldCB5QXhpcyA9ICd5QXhpcyc7XHJcbiAgICAgIGlmICh1c2VBbHRBeGlzKSB7XHJcbiAgICAgICAgaWYgKGkgPiAwKSB7XHJcbiAgICAgICAgICB5QXhpcyArPSAnX2FsdCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgZGF0YVNldDogYW55ID0ge1xyXG4gICAgICAgIGxhYmVsOiBvYmpLZXlzW2ldLFxyXG4gICAgICAgIGRhdGE6IGNoYXJ0RGF0YVtvYmpLZXlzW2ldXSxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGJnQ29sb3JQYWxhdHRlW2ldLFxyXG4gICAgICAgIGJvcmRlckNvbG9yOiBjb2xvclBhbGF0dGVbaV0sXHJcbiAgICAgICAgYm9yZGVyV2lkdGg6IDJcclxuICAgICAgfTtcclxuXHJcblxyXG4gICAgICBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuQkFSX0xJTkUpIHsgLy8gaWdub3JlcyBzdGFja2VkIGFuZCBiYXIgb3B0aW9ucy4gTWFrZXMgYXNzdW1wdGlvbiB0aGF0IG9ubHkgMXN0IGRhdGFzZXQgaXMgYmFyXHJcbiAgICAgICAgaWYgKGkgPT0gMCkge1xyXG4gICAgICAgICAgZGF0YVNldC50eXBlID0gJ2Jhcic7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFTZXQudHlwZSA9ICdsaW5lJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAgIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuSE9SSVpPTlRBTF9CQVIgfHwgY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGVbaV07XHJcbiAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgfSBlbHNlIGlmIChjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5CQVJfTElORSB8fCBjaGFydFR5cGUgPT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5MSU5FKSB7XHJcbiAgICAgICAgaWYgKGRhdGFTZXQudHlwZSA9PSAnYmFyJykge1xyXG4gICAgICAgICAgZGF0YVNldC5iYWNrZ3JvdW5kQ29sb3IgPSBiZ0NvbG9yUGFsYXR0ZVtpXTtcclxuICAgICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGVbaV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRhdGFTZXQuYm9yZGVyQ29sb3IgPSBjb2xvclBhbGF0dGVbaV07XHJcbiAgICAgICAgICBkYXRhU2V0LmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsMCwwLDApJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY2hhcnRUeXBlID09IE5FVVJBU0lMX0NIQVJUX1RZUEUuUElFIHx8IGNoYXJ0VHlwZSA9PSBORVVSQVNJTF9DSEFSVF9UWVBFLkRPTlVUKSB7Ly8gb3ZlcndyaXRlIHNpbmdsZSBjb2xvciBhc3NpZ25tZW50IHRvIGFycmF5LlxyXG4gICAgICAgIGRhdGFTZXQuYmFja2dyb3VuZENvbG9yID0gYmdDb2xvclBhbGF0dGU7XHJcbiAgICAgICAgZGF0YVNldC5ib3JkZXJDb2xvciA9IGNvbG9yUGFsYXR0ZTtcclxuICAgICAgfVxyXG5cclxuXHJcbiAgICAgIGlmIChjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5QSUUgJiYgY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuRE9OVVQpIHtcclxuICAgICAgICBpZiAoY2hhcnRUeXBlICE9IE5FVVJBU0lMX0NIQVJUX1RZUEUuU1RBQ0tFRCAmJiBjaGFydFR5cGUgIT0gTkVVUkFTSUxfQ0hBUlRfVFlQRS5TVEFDS0VEX1BBUkVUTykge1xyXG4gICAgICAgICAgZGF0YVNldC55QXhpc0lEID0geUF4aXM7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBkYXRhU2V0cy5wdXNoKGRhdGFTZXQpO1xyXG4gICAgfVxyXG4gICAgbGV0IHJldHVybkRhdGEgPSB7XHJcbiAgICAgIGxhYmVsczogY2hhcnREYXRhW2Nvcm5lcnN0b25lXSxcclxuICAgICAgZGF0YXNldHM6IGRhdGFTZXRzXHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0dXJuRGF0YTtcclxuICB9XHJcblxyXG4gIHBlcmZvcm1QYXJldG9BbmFseXNpcyhwcm9wcyl7XHJcbiAgICAvL21vZGlmeSBjaGFydCBvYmplY3RcclxuICAgIGxldCBsb2NhbFN1bUFyciA9IFtdO1xyXG4gICAgbGV0IHRvdGFsU3VtID0gMDtcclxuXHJcbiAgICAvLyBjYWxjdWxhdGUgdGhlIGxvY2FsIHN1bSBvZiBlYWNoIGRhdGFwb2ludCAoaS5lLiBmb3IgZGF0YXNldHMgMSwgMiwgMywgc3VtIG9mIGVhY2ggY29ycmVzcG9uZGluZyBkYXRhcG9pbnQgZHMxWzBdICsgZHMyWzBdICsgZHMzWzBdKSBcclxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcHJvcHMuZGF0YS5kYXRhc2V0c1swXS5kYXRhLmxlbmd0aDsgaisrKSB7IC8vIHRha2VzIHRoZSBmaXJzdCBkYXRhc2V0IGxlbmd0aCBhcyByZWZlcmVuY2VcclxuICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMuZGF0YS5kYXRhc2V0cy5sZW5ndGg7IGkrKykgeyAvLyBmb3IgZWFjaCBkYXRhc2V0XHJcbiAgICAgICAgbGV0IHZhbCA9IHBhcnNlRmxvYXQocHJvcHMuZGF0YS5kYXRhc2V0c1tpXS5kYXRhW2pdKTtcclxuICAgICAgICBpZiAoaXNOYU4odmFsKSkge1xyXG4gICAgICAgICAgdmFsID0gMDsgLy8gc2V0IGludmFsaWQgdmFsdWVzIGFzIDBcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VtICs9IHZhbFxyXG4gICAgICB9XHJcbiAgICAgIGxvY2FsU3VtQXJyLnB1c2goc3VtKTtcclxuICAgICAgdG90YWxTdW0gKz0gc3VtO1xyXG4gICAgfVxyXG5cclxuICAgIC8vcG9wdWxhdGUgbmV3IGFycmF5IHdpdGggbW9kaWZpZWQgc29ydGluZyBvYmplY3RcclxuICAgIGxldCBuZXdBcnIgPSBbXTsgLy8gdGhpcyBhcnJheSBob2xkcyBhbiBvYmplY3Qgd2l0aCB0aGUgc3VtLCBsYWJlbCwgYW5kIGRhdGEgZnJvbSBlYWNoIGRhdGFzZXRcclxuICAgIC8qXHJcbiAgICBFYWNoIG9iamVjdCBsb29rcyBsaWtlIHRoaXM6XHJcbiAgICBvID0ge1xyXG4gICAgICAgICAgICBzdW06IDQxOFxyXG4gICAgICAgICAgICBsYWJlbHM6IFwiV2hhdGV2ZXIgbGFiZWxcIlxyXG4gICAgICAgICAgICAwOiA2NlxyXG4gICAgICAgICAgICAxOiA5OFxyXG4gICAgICAgICAgICAyOiA2N1xyXG4gICAgICAgICAgICAzOiA5NlxyXG4gICAgICAgICAgICA0OiA5MVxyXG4gICAgICAgIH1cclxuICAgICovXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsU3VtQXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGxldCBvID0ge1xyXG4gICAgICAgIHN1bTogbG9jYWxTdW1BcnJbaV0sXHJcbiAgICAgICAgbGFiZWxzOiBwcm9wcy5kYXRhLmxhYmVsc1tpXSxcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHByb3BzLmRhdGEuZGF0YXNldHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICBvW2pdID0gcHJvcHMuZGF0YS5kYXRhc2V0c1tqXS5kYXRhW2ldO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld0Fyci5wdXNoKG8pXHJcbiAgICB9XHJcblxyXG4gICAgLy9zb3J0IG5ldyBhcnJheSAobmV3QXJyKSBkZXNjZW5kaW5nIFtcInN1bVwiXSBwcm9wZXJ0eVxyXG4gICAgbmV3QXJyLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgcmV0dXJuICgoYS5zdW0gPCBiLnN1bSkgPyAxIDogKChhLnN1bSA9PSBiLnN1bSkgPyAwIDogLTEpKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vcmVidWlsZCBhbmQgcmVhc3NpZ24gbGFiZWxzIGFycmF5IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpblxyXG4gICAgbGV0IG5ld0xhYmVsc0FycmF5ID0gW11cclxuICAgIGZvciAobGV0IGkgPTA7IGkgPCBuZXdBcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICBuZXdMYWJlbHNBcnJheS5wdXNoKG5ld0FycltpXVtcImxhYmVsc1wiXSk7XHJcbiAgICB9XHJcbiAgICBwcm9wcy5kYXRhLmxhYmVscyA9IG5ld0xhYmVsc0FycmF5O1xyXG5cclxuICAgIC8vcmVidWlsZCBhbmQgcmVhc3NpZ24gZGF0YSBhcnJheSBmb3IgZWFjaCBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpblxyXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBwcm9wcy5kYXRhLmRhdGFzZXRzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgIGxldCBkYXRhID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmV3QXJyLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICBkYXRhLnB1c2gobmV3QXJyW2ldW2pdKVxyXG4gICAgICB9XHJcbiAgICAgIHByb3BzLmRhdGEuZGF0YXNldHNbal0uZGF0YSA9IGRhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgLy9jcmVhdGUgYSBzb3J0ZWQgbG9jYWwgc3VtIGFycmF5IGZvciBwYXJldG8gY3VydmUgY2FsY3VsYXRpb25zXHJcbiAgICBsZXQgc29ydGVkbG9jYWxTdW1BcnIgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwIDsgaSA8IG5ld0Fyci5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIHNvcnRlZGxvY2FsU3VtQXJyLnB1c2gobmV3QXJyW2ldLnN1bSlcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcm9sbGluZ1N1bSA9IDA7IC8vIGN1bXVsYXRpdmUgc3VtIG9mIHZhbHVlc1xyXG4gICAgbGV0IHBhcmV0b0xpbmVWYWx1ZXMgPSBbXTtcclxuICAgIGxldCBlaWdodHlQZXJjZW50TGluZSA9IFtdOyAvLyBoYXJkIGNvZGVkIHRvIDgwJVxyXG5cclxuICAgIC8vIGNhbGN1bGF0ZSBhbmQgcHVzaCBwYXJldG8gbGluZSwgYWxzbyBwb3B1bGF0ZSA4MCUgbGluZSBhcnJheVxyXG4gICAgZm9yIChsZXQgaSA9IDAgOyBpIDwgc29ydGVkbG9jYWxTdW1BcnIubGVuZ3RoOyBpKyspe1xyXG4gICAgICByb2xsaW5nU3VtICs9IHNvcnRlZGxvY2FsU3VtQXJyW2ldO1xyXG4gICAgICBsZXQgcGFyZXRvVmFsID0gcm9sbGluZ1N1bS90b3RhbFN1bSAqIDEwMDtcclxuICAgICAgcGFyZXRvTGluZVZhbHVlcy5wdXNoKCBNYXRoLmZsb29yKHBhcmV0b1ZhbCAqIDEwMCkgLyAxMDAgKTtcclxuICAgICAgZWlnaHR5UGVyY2VudExpbmUucHVzaCg4MClcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gYWRkIHBhcmV0byBjdXJ2ZSBhcyBhIG5ldyBkYXRhc2V0IC0gZGlyZWN0bHkgbW9kaWZpZXMgY2hhcnQgb2JqZWN0IHBhc3NlZCBpbiBcclxuICAgIHByb3BzLmRhdGEuZGF0YXNldHMucHVzaCh7XHJcbiAgICAgIFwibGFiZWxcIjpcIlBhcmV0b1wiLFxyXG4gICAgICBcImRhdGFcIjpwYXJldG9MaW5lVmFsdWVzLFxyXG4gICAgICBcImJhY2tncm91bmRDb2xvclwiOlwicmdiYSgwLDAsMCwwKVwiLFxyXG4gICAgICBcImJvcmRlckNvbG9yXCI6XCJyZ2JhKDAsMCwwLDAuOClcIixcclxuICAgICAgXCJib3JkZXJXaWR0aFwiOjIsXHJcbiAgICAgIFwidHlwZVwiOlwibGluZVwiLFxyXG4gICAgICBcInlBeGlzSURcIjpcInlBeGlzX3BhcmV0b1wiLFxyXG4gICAgICBcImRhdGFsYWJlbHNcIjoge1xyXG4gICAgICAgIFwiZGlzcGxheVwiOmZhbHNlXHJcbiAgICAgIH0sXHJcbiAgICAgIFwicG9pbnRSYWRpdXNcIjogMFxyXG4gICAgfSlcclxuXHJcbiAgICAvLyBwdXNoIDgwJSBsaW5lIGFzIGEgbmV3IGRhdGFzZXQgLSBkaXJlY3RseSBtb2RpZmllcyBjaGFydCBvYmplY3QgcGFzc2VkIGluXHJcbiAgICBwcm9wcy5kYXRhLmRhdGFzZXRzLnB1c2goe1xyXG4gICAgICBcImxhYmVsXCI6XCI4MCUgbGluZVwiLFxyXG4gICAgICBcImRhdGFcIjplaWdodHlQZXJjZW50TGluZSxcclxuICAgICAgXCJiYWNrZ3JvdW5kQ29sb3JcIjpcInJnYmEoMCwwLDAsMClcIixcclxuICAgICAgXCJib3JkZXJDb2xvclwiOlwicmdiYSgwLDAsMCwwLjgpXCIsXHJcbiAgICAgIFwiYm9yZGVyV2lkdGhcIjoyLFxyXG4gICAgICBcInR5cGVcIjpcImxpbmVcIixcclxuICAgICAgXCJ5QXhpc0lEXCI6XCJ5QXhpc19wYXJldG9cIixcclxuICAgICAgXCJkYXRhbGFiZWxzXCI6IHtcclxuICAgICAgICBcImRpc3BsYXlcIjpmYWxzZVxyXG4gICAgICB9LFxyXG4gICAgICBcInBvaW50UmFkaXVzXCI6IDBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAgIC8vIHVudXNlZC4gTWlncmF0ZWQgY29kZSB0byBOZXVyYXNpbERhdGFGaWx0ZXJQaXBlXHJcbiAgLy8gZmlsdGVyRGF0YShkYXRhOiBBcnJheTxhbnk+LCBkYXRhc2V0RmlsdGVyOiBzdHJpbmcpIHtcclxuXHJcbiAgLy8gICBpZiAoZGF0YXNldEZpbHRlcikge1xyXG4gIC8vICAgICBsZXQgZmlsdGVyVGVybXMgPSBkYXRhc2V0RmlsdGVyLnNwbGl0KCcsJyk7XHJcbiAgLy8gICAgIGxldCBpbmNsdWRlVGVybXMgPSBbXTtcclxuICAvLyAgICAgbGV0IGV4Y2x1ZGVUZXJtcyA9IFtdO1xyXG4gIC8vICAgICBsZXQgaW5jbHVkZUNvbHVtbnMgPSBbXTtcclxuICAvLyAgICAgbGV0IGV4Y2x1ZGVDb2x1bW5zID0gW107XHJcbiAgLy8gICAgIGZvciAobGV0IGkgaW4gZmlsdGVyVGVybXMpIHtcclxuICAvLyAgICAgICBpZiAoZmlsdGVyVGVybXNbaV0gIT0gbnVsbCAmJiBmaWx0ZXJUZXJtc1tpXSAhPSB1bmRlZmluZWQgJiYgZmlsdGVyVGVybXNbaV0ubGVuZ3RoID4gMSkge1xyXG4gIC8vICAgICAgICAgbGV0IHRlcm0gPSBmaWx0ZXJUZXJtc1tpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAvLyAgICAgICAgIGlmICh0ZXJtWzBdID09IFwiLVwiKSB7XHJcbiAgLy8gICAgICAgICAgIGV4Y2x1ZGVUZXJtcy5wdXNoKHRlcm0ucmVwbGFjZShcIi1cIiwgXCJcIikudHJpbSgpKTtcclxuICAvLyAgICAgICAgIH0gZWxzZSBpZiAodGVybVswXSA9PSBcIn5cIikge1xyXG4gIC8vICAgICAgICAgICBpZiAodGVybVsxXSA9PSBcIiFcIikge1xyXG4gIC8vICAgICAgICAgICAgIGV4Y2x1ZGVDb2x1bW5zLnB1c2godGVybS5yZXBsYWNlKFwifiFcIiwgXCJcIikudHJpbSgpKTtcclxuICAvLyAgICAgICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgICAgICBpbmNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn5cIiwgXCJcIikudHJpbSgpKVxyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9IGVsc2Uge1xyXG4gIC8vICAgICAgICAgICBpbmNsdWRlVGVybXMucHVzaCh0ZXJtLnRyaW0oKSlcclxuICAvLyAgICAgICAgIH1cclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH1cclxuXHJcblxyXG4gIC8vICAgICBsZXQgZGF0YV9GaWx0ZXJlZCA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uIChkYXRhSXRlbSkge1xyXG4gIC8vICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcclxuICAvLyAgICAgICBsZXQgc2VhcmNoU3RyaW5nID0gXCJcIjtcclxuICAvLyAgICAgICBmb3IgKGxldCBpIGluIGtfYXJyKSB7XHJcbiAgLy8gICAgICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldO1xyXG4gIC8vICAgICAgICAgbGV0IHZhbHVlID0gZGF0YUl0ZW1bY3VycktleV07XHJcbiAgLy8gICAgICAgICBzZWFyY2hTdHJpbmcgKz0gdmFsdWUgKyBcIiBcIjtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgc2VhcmNoU3RyaW5nID0gc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xyXG4gIC8vICAgICAgIGxldCBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xyXG4gIC8vICAgICAgIGlmIChpbmNsdWRlVGVybXMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSBpbiBpbmNsdWRlVGVybXMpIHtcclxuICAvLyAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhpbmNsdWRlVGVybXNbaV0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSB0cnVlO1xyXG4gIC8vICAgICAgICAgICAgIGJyZWFrO1xyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfSBlbHNlIHtcclxuICAvLyAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgICAgaWYgKGV4Y2x1ZGVUZXJtcy5sZW5ndGggPiAwICYmIGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpIGluIGV4Y2x1ZGVUZXJtcykge1xyXG4gIC8vICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmluY2x1ZGVzKGV4Y2x1ZGVUZXJtc1tpXSkpIHtcclxuICAvLyAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xyXG4gIC8vICAgICAgICAgICAgIGJyZWFrO1xyXG4gIC8vICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICB9XHJcbiAgLy8gICAgICAgfVxyXG4gIC8vICAgICAgIGlmIChjdXJyZW50UGFzc2luZ1N0YXR1cykge1xyXG5cclxuICAvLyAgICAgICAgIHJldHVybiBkYXRhSXRlbTtcclxuICAvLyAgICAgICB9XHJcbiAgLy8gICAgIH0pO1xyXG5cclxuICAvLyAgICAgaWYgKGluY2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDAgJiYgZXhjbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIHdpbmRvdy5hbGVydChcIlVuc3VwcG9ydGVkIHVzYWdlIG9mIGluY2x1ZGUgJiBleGNsdWRlIGNvbHVtbnMuIFRoaW5ncyBtYXkgYnJlYWtcIilcclxuICAvLyAgICAgfVxyXG4gIC8vICAgICAvL2FmdGVyIGZpbHRlcmluZyBpcyBjb21wbGV0ZSwgcmVtb3ZlIGNvbHVtbnMgZnJvbSBjbG9uZSBvZiBkYXRhXHJcbiAgLy8gICAgIGVsc2UgaWYgKGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAvLyAgICAgICBkYXRhX0ZpbHRlcmVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhX0ZpbHRlcmVkKSlcclxuICAvLyAgICAgICAvL2NvbnNvbGUubG9nKFwiaGVyZVwiKVxyXG4gIC8vICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xyXG4gIC8vICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcclxuICAvLyAgICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcclxuICAvLyAgICAgICAgIC8vZm9yIChsZXQgaSBpbiBrX2Fycikge1xyXG4gIC8vICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrX2Fyci5sZW5ndGg7IGkrKykge1xyXG4gIC8vICAgICAgICAgICBpZiAoaSA+IDApIHsvLyBza2lwIHRoZSBmaXJzdCBjb2x1bW4uIERvIG5vdCBhbGxvdyB1c2VyIHRvIGRlbGV0ZSBmaXJzdCBjb2x1bW5cclxuICAvLyAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGV4Y2x1ZGVDb2x1bW5zKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkS2V5ID0ga19hcnJbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgLy8gICAgICAgICAgICAgICBpZiAocHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGV4Y2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gIC8vICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gIC8vICAgICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgZWxzZSBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xyXG4gIC8vICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKTtcclxuICAvLyAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcclxuICAvLyAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XHJcbiAgLy8gICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgLy8gICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgLy8gICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gTmVlZGVkP1xyXG4gIC8vICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAvLyAgICAgICAgICAgICBsZXQga2VlcENvbHVtbiA9IGZhbHNlO1xyXG4gIC8vICAgICAgICAgICAgIGZvciAodmFyIGogaW4gaW5jbHVkZUNvbHVtbnMpIHtcclxuICAvLyAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAgIGtlZXBDb2x1bW4gPSB0cnVlO1xyXG4gIC8vICAgICAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgICAgICAgLy8gaWYgKCFwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XHJcbiAgLy8gICAgICAgICAgICAgICAvLyAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAvLyAgICAgICAgICAgICAgIC8vIH1cclxuICAvLyAgICAgICAgICAgICB9XHJcbiAgLy8gICAgICAgICAgICAgaWYgKCFrZWVwQ29sdW1uKSB7XHJcbiAgLy8gICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gIC8vICAgICAgICAgICAgIH1cclxuICAvLyAgICAgICAgICAgfVxyXG4gIC8vICAgICAgICAgfVxyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG5cclxuICAvLyAgICAgcmV0dXJuIGRhdGFfRmlsdGVyZWQ7XHJcbiAgLy8gICB9XHJcbiAgLy8gICByZXR1cm4gZGF0YTsgLy8gaWYgbm8gZmlsdGVyLCByZXR1cm4gb3JpZ2luYWwgZGF0YVxyXG4gIC8vIH1cclxufVxyXG4iXX0=