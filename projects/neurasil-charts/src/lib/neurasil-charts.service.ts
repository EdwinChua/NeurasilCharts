import { Injectable } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';

@Injectable({
  providedIn: 'root'
})
export class NeurasilChartsService {

  constructor() { }


  parseDataFromDatasource(chartType: NEURASIL_CHART_TYPE, incomingData: Array<any>, swapLabelsAndDatasets: boolean): { _cornerstone: string, _formatObject: { prefix: string, suffix: string }, data: Array<any> } {
    let returnData = {
      _cornerstone: "",
      _formatObject: null,
      data: null
    }

    let data = JSON.parse(JSON.stringify(incomingData)); // make a copy of the data

    let k_arr_Temp = Object.keys(data[0]);


    let k_arr = Object.keys(data[0]);
    let cDat = {};
    for (let i = 0; i < k_arr.length; i++) {
      let currKey = k_arr[i]
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

            } else if (isNumber(testItem.substr(0, testItem.length - 1))) {
              suffix = testItem.substr(testItem.length - 1);
            }
          }
        }

        formatObj[currKey] = {
          prefix: prefix,
          suffix: suffix
        }

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

      } else if (currKey == returnData._cornerstone) {
        formatObj[currKey] = {
          prefix: "",
          suffix: ""
        }
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
          cDat_New[cDat[returnData._cornerstone][i]].push(cDat[cDat_New[returnData._cornerstone][j]][i])
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
      }
      formatObj["80% line"] = {
        prefix: "",
        suffix: "%"
      }
    }

    function isNumber(value: string | number): boolean {
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

    let options: any = {
      maintainAspectRatio: false,
      responsive: true,
    };
    if (title) {
      options.title = {
        display: true,
        text: title
      }
    }

    let yAxisLabel = { display: false, text: "" }
    if (yAxisLabelText) {
      yAxisLabel.display = true;
      yAxisLabel.text = yAxisLabelText;
    }

    let yAxisLabel_Alt = { display: false, text: "" }
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
            type:'linear',
            position: 'left',
            stacked: true,
            title: yAxisLabel
          }
        }

        if (chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
          
          let altAxisObj: any = {
            //id: 'yAxis_pareto',
            type:'linear',
            position: 'right',
            display: true,
            beginAtZero: true,
            ticks:{},
            title: yAxisLabel_Alt
          }
          altAxisObj.min = 0;
          altAxisObj.max = 100;
          altAxisObj.ticks = {
            stepSize: 80
          }

          options.scales.yAxis_pareto= altAxisObj;
          
        }

      } else {
        options.scales = {
          x: {
            title: xAxisLabel
          },
          yAxis: {
            beginAtZero: true,
            title: yAxisLabel
          },
        }

        if (useAltAxis) {
          let altAxisObj: any = {
            //id: 'yAxis_alt',
            display: true,
            ticks: {
              beginAtZero: true,
            },
            position: 'right',
            type:'linear',
            title: yAxisLabel_Alt
          }
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
      type = 'line'
    } else if (chartType == NEURASIL_CHART_TYPE.BAR ||
      chartType == NEURASIL_CHART_TYPE.BAR_LINE ||
      chartType == NEURASIL_CHART_TYPE.STACKED ||
      chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
      type = 'bar'
    } else if (chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
      type = 'bar'
    } else if (chartType == NEURASIL_CHART_TYPE.PIE) {
      type = 'pie'
    }
    else if (chartType == NEURASIL_CHART_TYPE.DONUT) {
      type = 'doughnut'
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
        } else {

          let objKeys = Object.keys(formatObject);
          let key = objKeys[tooltipItem.datasetIndex + 1]
          let formatObj = formatObject[key];
          label += `${formatObj.prefix}` + tooltipItem.yLabel + `${formatObj.suffix}`;;
        }
        return label;
      }
    } else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) {
      options.tooltips.callbacks.label = function (tooltipItem, data) {
        var label = data.labels[tooltipItem.index];
        if (label) {
          label += ': ';
        }
        let formatObj;
        if (swapLabelsAndDatasets) {
          formatObj = formatObject[data.labels[tooltipItem.index]];

        } else {
          formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];

        }
        label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
        return label;
      }
      options.tooltips.callbacks.title = function (tooltipItem, data) {
        return data.datasets[tooltipItem[0].datasetIndex].label;
      }
    } else if (chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR) {
      options.indexAxis = 'y';
      options.tooltips.callbacks.label = function (tooltipItem, data) {

        var label = data.datasets[tooltipItem.datasetIndex].label;
        if (label) {
          label += ': ';
        }
        let formatObj;
        if (swapLabelsAndDatasets) {
          formatObj = formatObject[data.labels[tooltipItem.index]];

        } else {
          formatObj = formatObject[data.datasets[tooltipItem.datasetIndex].label];

        }
        label += `${formatObj.prefix}${data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]}${formatObj.suffix}`;
        return label;
      }
      options.tooltips.callbacks.title = function (tooltipItem, data) {

        return tooltipItem[0].yLabel;
      }
    }


    let returnOpts = {
      type: type,
      data: this.dataParser(chartData, useAltAxis, chartType, cornerstone, swapLabelsAndDatasets),
      options: options
    }
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
            colors.push(colors[j])
            i++; // INCREMENT HERE
          }
        }
      }

      return colors;
    }

    let colorPalatte;
    let bgColorPalatte
    if (!swapLabelsAndDatasets) {
      colorPalatte = getPalette(1, chartData[cornerstone].length)
      bgColorPalatte = getPalette(0.3, chartData[cornerstone].length)
    } else {
      colorPalatte = getPalette(1, Object.keys(chartData).length)
      bgColorPalatte = getPalette(0.3, Object.keys(chartData).length)
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

      let dataSet: any = {
        label: objKeys[i],
        data: chartData[objKeys[i]],
        backgroundColor: bgColorPalatte[i],
        borderColor: colorPalatte[i],
        borderWidth: 2
      };


      if (chartType == NEURASIL_CHART_TYPE.BAR_LINE) { // ignores stacked and bar options. Makes assumption that only 1st dataset is bar
        if (i == 0) {
          dataSet.type = 'bar';
        } else {
          dataSet.type = 'line';
        }
      }




      if (chartType == NEURASIL_CHART_TYPE.BAR || chartType == NEURASIL_CHART_TYPE.HORIZONTAL_BAR || chartType == NEURASIL_CHART_TYPE.STACKED || chartType == NEURASIL_CHART_TYPE.STACKED_PARETO) {
        dataSet.backgroundColor = bgColorPalatte[i];
        dataSet.borderColor = colorPalatte[i];
      } else if (chartType == NEURASIL_CHART_TYPE.BAR_LINE || chartType == NEURASIL_CHART_TYPE.LINE) {
        if (dataSet.type == 'bar') {
          dataSet.backgroundColor = bgColorPalatte[i];
          dataSet.borderColor = colorPalatte[i];
        } else {
          dataSet.borderColor = colorPalatte[i];
          dataSet.backgroundColor = 'rgba(0,0,0,0)';
        }
      } else if (chartType == NEURASIL_CHART_TYPE.PIE || chartType == NEURASIL_CHART_TYPE.DONUT) {// overwrite single color assignment to array.
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
    }
    return returnData;
  }

  performParetoAnalysis(props){
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
        sum += val
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
      }
      for (let j = 0; j < props.data.datasets.length; j++) {
        o[j] = props.data.datasets[j].data[i];
      }
      newArr.push(o)
    }

    //sort new array (newArr) descending ["sum"] property
    newArr.sort(function (a, b) {
      return ((a.sum < b.sum) ? 1 : ((a.sum == b.sum) ? 0 : -1));
    });

    //rebuild and reassign labels array - directly modifies chart object passed in
    let newLabelsArray = []
    for (let i =0; i < newArr.length; i++){
      newLabelsArray.push(newArr[i]["labels"]);
    }
    props.data.labels = newLabelsArray;

    //rebuild and reassign data array for each dataset - directly modifies chart object passed in
    for (let j = 0; j < props.data.datasets.length; j++) {
      let data = [];
      for (let i = 0; i < newArr.length; i++){
        data.push(newArr[i][j])
      }
      props.data.datasets[j].data = data;
    }

    //create a sorted local sum array for pareto curve calculations
    let sortedlocalSumArr = [];
    for (let i = 0 ; i < newArr.length; i++){
      sortedlocalSumArr.push(newArr[i].sum)
    }

    let rollingSum = 0; // cumulative sum of values
    let paretoLineValues = [];
    let eightyPercentLine = []; // hard coded to 80%

    // calculate and push pareto line, also populate 80% line array
    for (let i = 0 ; i < sortedlocalSumArr.length; i++){
      rollingSum += sortedlocalSumArr[i];
      let paretoVal = rollingSum/totalSum * 100;
      paretoLineValues.push( Math.floor(paretoVal * 100) / 100 );
      eightyPercentLine.push(80)
    }
    
    // add pareto curve as a new dataset - directly modifies chart object passed in 
    props.data.datasets.push({
      "label":"Pareto",
      "data":paretoLineValues,
      "backgroundColor":"rgba(0,0,0,0)",
      "borderColor":"rgba(0,0,0,0.8)",
      "borderWidth":2,
      "type":"line",
      "yAxisID":"yAxis_pareto",
      "datalabels": {
        "display":false
      },
      "pointRadius": 0
    })

    // push 80% line as a new dataset - directly modifies chart object passed in
    props.data.datasets.push({
      "label":"80% line",
      "data":eightyPercentLine,
      "backgroundColor":"rgba(0,0,0,0)",
      "borderColor":"rgba(0,0,0,0.8)",
      "borderWidth":2,
      "type":"line",
      "yAxisID":"yAxis_pareto",
      "datalabels": {
        "display":false
      },
      "pointRadius": 0
    })
  }

    // unused. Migrated code to NeurasilDataFilterPipe
  // filterData(data: Array<any>, datasetFilter: string) {

  //   if (datasetFilter) {
  //     let filterTerms = datasetFilter.split(',');
  //     let includeTerms = [];
  //     let excludeTerms = [];
  //     let includeColumns = [];
  //     let excludeColumns = [];
  //     for (let i in filterTerms) {
  //       if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
  //         let term = filterTerms[i].trim().toLowerCase();
  //         if (term[0] == "-") {
  //           excludeTerms.push(term.replace("-", "").trim());
  //         } else if (term[0] == "~") {
  //           if (term[1] == "!") {
  //             excludeColumns.push(term.replace("~!", "").trim());
  //           } else {
  //             includeColumns.push(term.replace("~", "").trim())
  //           }
  //         } else {
  //           includeTerms.push(term.trim())
  //         }
  //       }
  //     }


  //     let data_Filtered = data.filter(function (dataItem) {
  //       let k_arr = Object.keys(dataItem);
  //       let searchString = "";
  //       for (let i in k_arr) {
  //         let currKey = k_arr[i];
  //         let value = dataItem[currKey];
  //         searchString += value + " ";
  //       }
  //       searchString = searchString.toLowerCase().trim();
  //       let currentPassingStatus = false;
  //       if (includeTerms.length > 0) {
  //         for (let i in includeTerms) {
  //           if (searchString.includes(includeTerms[i])) {
  //             currentPassingStatus = true;
  //             break;
  //           }
  //         }
  //       } else {
  //         currentPassingStatus = true;
  //       }
  //       if (excludeTerms.length > 0 && currentPassingStatus) {
  //         for (let i in excludeTerms) {
  //           if (searchString.includes(excludeTerms[i])) {
  //             currentPassingStatus = false;
  //             break;
  //           }
  //         }
  //       }
  //       if (currentPassingStatus) {

  //         return dataItem;
  //       }
  //     });

  //     if (includeColumns.length > 0 && excludeColumns.length > 0) {
  //       window.alert("Unsupported usage of include & exclude columns. Things may break")
  //     }
  //     //after filtering is complete, remove columns from clone of data
  //     else if (excludeColumns.length > 0) {
  //       data_Filtered = JSON.parse(JSON.stringify(data_Filtered))
  //       //console.log("here")
  //       for (var h in data_Filtered) {
  //         let dataItem = data_Filtered[h];
  //         let k_arr = Object.keys(dataItem);
  //         //for (let i in k_arr) {
  //         for (let i = 0; i < k_arr.length; i++) {
  //           if (i > 0) {// skip the first column. Do not allow user to delete first column
  //             for (var j in excludeColumns) {
  //               let processedKey = k_arr[i].trim().toLowerCase();
  //               if (processedKey.includes(excludeColumns[j])) {
  //                 delete dataItem[k_arr[i]];
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }

  //     else if (includeColumns.length > 0) {
  //       data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
  //       for (var h in data_Filtered) {
  //         let dataItem = data_Filtered[h];
  //         let k_arr = Object.keys(dataItem);
  //         for (let i = 0; i < k_arr.length; i++) {
  //           if (i > 0) {// skip the first column. Needed?
  //             let processedKey = k_arr[i].trim().toLowerCase();
  //             let keepColumn = false;
  //             for (var j in includeColumns) {
  //               if (processedKey.includes(includeColumns[j])) {
  //                 keepColumn = true;
  //               }
  //               // if (!processedKey.includes(includeColumns[j])) {
  //               //     delete dataItem[k_arr[i]];
  //               // }
  //             }
  //             if (!keepColumn) {
  //               delete dataItem[k_arr[i]];
  //             }
  //           }
  //         }
  //       }
  //     }

  //     return data_Filtered;
  //   }
  //   return data; // if no filter, return original data
  // }
}
