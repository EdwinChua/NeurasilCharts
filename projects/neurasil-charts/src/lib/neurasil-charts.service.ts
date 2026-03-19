import { Injectable } from '@angular/core';
import { NEURASIL_CHART_TYPE } from './models';
import { Utils } from './utils';

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
            } else if (isNumber(testItem.substr(0, testItem.length - 1))) {
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

      } else {
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

    function isNumber(value: string | number): boolean {
      return ((value != null) && !isNaN(Number(value.toString())));
    }

    returnData._formatObject = formatObj;
    returnData.data = cDat;
    return returnData;
  }


  chartObjectBuilder(
    chartType,
    chartData,
    useAltAxis,
    title,
    yAxisLabelText,
    yAxisLabelText_Alt,
    xAxisLabelText,
    cornerstone,
    swapLabelsAndDatasets,
    formatObject,
    useLogScale,
    colorPalette,
    hoverOpacity,
    defaultOpacity,
    hoverOpacity_border,
    defaultOpacity_border
  ) {
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

    let options: any = {
      maintainAspectRatio: false,
      responsive: true,
    };
    if (title) {
      options.title = {
        display: true,
        text: title
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
      return label.map(item =>
        item[0].length <= 10 ? item[0] : [item[0].substr(0, 8) + "..."]
      );
    };

    if (chartType !== NEURASIL_CHART_TYPE.PIE && chartType !== NEURASIL_CHART_TYPE.DONUT) {
      const isStacked = chartType === NEURASIL_CHART_TYPE.STACKED || chartType === NEURASIL_CHART_TYPE.STACKED_PARETO;
      options.scales = {
        x: {
          stacked: isStacked || undefined,
          title: xAxisLabel,
          ticks: { callback: labelTickCallback }
        },
        yAxis: {
          type: useLogScale ? 'logarithmic' : 'linear',
          position: 'left',
          stacked: isStacked || undefined,
          beginAtZero: isStacked ? undefined : true,
          title: yAxisLabel
        }
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
      } else if (useAltAxis) {
        options.scales.yAxis_alt = {
          display: true,
          ticks: { beginAtZero: true },
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

    // Tooltip callbacks are set per chart type in the component (Chart.js v3 API)
    options.tooltips = { callbacks: {} };

    let returnOpts = {
      plugins: [],
      type: type,
      data: this.dataParser(
        chartData,
        useAltAxis,
        chartType,
        cornerstone,
        swapLabelsAndDatasets,
        colorPalette,
        hoverOpacity,
        defaultOpacity,
        hoverOpacity_border,
        defaultOpacity_border),
      options: options
    };
    return returnOpts;
  }

  dataParser(
    chartData,
    useAltAxis: boolean,
    chartType: NEURASIL_CHART_TYPE,
    cornerstone,
    swapLabelsAndDatasets,
    colorPaletteToUse: Array<string> = null,
    hoverOpacity,
    defaultOpacity,
    hoverOpacity_border,
    defaultOpacity_border)
  {
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

    function getPalette(opacity: number, noOfColors: number): string[] {
      let baseColors: string[];
      if (colorPaletteToUse) {
        baseColors = colorPaletteToUse.map(color =>
          Utils.colorIsHex(color)
            ? Utils.hexToRgba(color, opacity)
            : Utils.rgbToRgba(color, opacity)
        );
      } else {
        baseColors = BASE_COLORS.map(c => c.replace('{a}', String(opacity)));
      }

      if (noOfColors <= baseColors.length) {
        return baseColors.slice(0, noOfColors);
      }

      // cycle through colors if more are needed
      const result: string[] = [];
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

      let dataSet: any = {
        label: key,
        data: chartData[key],
        borderWidth: 2
      };

      if (isPieOrDonut) {
        dataSet.backgroundColor = bgColorPalette;
        dataSet.borderColor = colorPalette;
        dataSet.hoverBackgroundColor = bgColorPalette_hover;
        dataSet.hoverBorderColor = colorPalette;
      } else if (chartType === NEURASIL_CHART_TYPE.BAR_LINE || chartType === NEURASIL_CHART_TYPE.LINE) {
        if (chartType === NEURASIL_CHART_TYPE.BAR_LINE) {
          dataSet.type = i === 0 ? 'bar' : 'line';
        }
        if (dataSet.type === 'bar' || chartType === NEURASIL_CHART_TYPE.LINE) {
          dataSet.borderColor = colorPalette[i];
          if (dataSet.type !== 'line' && chartType !== NEURASIL_CHART_TYPE.LINE) {
            dataSet.backgroundColor = bgColorPalette[i];
            dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
            dataSet.hoverBorderColor = colorPalette[i];
          } else {
            dataSet.backgroundColor = 'rgba(0,0,0,0)';
          }
        } else {
          dataSet.borderColor = colorPalette[i];
          dataSet.backgroundColor = 'rgba(0,0,0,0)';
        }
      } else {
        // BAR, HORIZONTAL_BAR, STACKED, STACKED_PARETO
        dataSet.backgroundColor = bgColorPalette[i];
        dataSet.borderColor = colorPalette[i];
        dataSet.hoverBackgroundColor = bgColorPalette_hover[i];
        dataSet.hoverBorderColor = colorPalette[i];
      }

      if (!isPieOrDonut && !isStacked) {
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
    const localSumArr = Array.from({ length: dataLength }, (_, j) =>
      datasets.reduce((sum, ds) => {
        const val = parseFloat(ds.data[j]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0)
    );
    const totalSum = localSumArr.reduce((a, b) => a + b, 0);

    // build sortable array
    const sortable = localSumArr.map((sum, i) => {
      const entry: any = { sum, labels: labels[i] };
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
}
