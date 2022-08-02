# Neurasil Charts

## Description

An Angular wrapper for ChartJS. Provides a few functionalities to flip rows/columns of data sets, perform pareto analysis etc.

This documentation assumes the user has some familarity with ChartJS terminology. eg. Dataset, label, etc... because I'm lazy.

Datasets passed should look like this:

_The first "string" field is assumed to be a label, and the others will be &lt;dataset&gt;:&lt;value&gt;_

````json
[
   {
      "user":"John",
      "Science":91,
      "English":94,
      "Math":58,
      "History":61
   },
   {
      "user":"Mary",
      "Science":75,
      "English":87,
      "Math":61,
      "History":82
   },
   ...
]
````

## Dev Notes

This repository consists of

- NeurasilChart library
- Demo app

### How to build NeurasilChart library

- Run `build-lib.bat` (or look in here to see what I'm doing)
  - Update `projectLocation` in this file before proceeding
- Output is in the `dist` folder. The .bat file copies the build output to a folder that is read and used by the Demo app

### How to run the demo app, and make changes to the library
- `ng serve` to run the demo app
- Whenever the NeurasilChart library is updated, run the .bat file to update the changes

## Documentation TODO

- Chart samples
- Configurable props documentation


### Random side note - Build neurasil-charts command:

````shell
ng build neurasil-charts
````

## How to use other plugins

`YourComponentUsingNeurasilCharts.ts`
````ts
// import and register plugin 
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

export class YourComponentUsingNeurasilCharts {
   // pass this object to the chart component
   additionalPluginOpts = {
      zoom: {
         ...
      }
  }
}

````

`YourComponentUsingNeurasilCharts.html`
````html
<neurasil-charts 
   ...
   [additionalPluginOpts]="additionalPluginOpts">
</neurasil-charts>
````

## How to access click events
`YourComponentUsingNeurasilCharts.html`
````html
<neurasil-charts 
   ...
   (dataOnClick)="propagateClick($event)">
</neurasil-charts>
````

## Enhancement

- Click to select a data point
   - multiselect feature?
   - checkbox like thingy
   - shading of selected points

### Sample code to use the above feature

````ts
  resetColor(event) {
    let ele = event.element[0];
    let datasets = event.chartInstance.data.datasets;
    try {
      for (let i in datasets) {
        for (var j in datasets[i].backgroundColor) {
          datasets[i].backgroundColor[j] = this.changeRGBAOpacity(datasets[i].backgroundColor[j], 0.5)
          datasets[i].hoverBackgroundColor[j] = this.changeRGBAOpacity(datasets[i].backgroundColor[j], 0.3)
          datasets[i].borderColor[j] = this.changeRGBAOpacity(datasets[i].borderColor[j], 1)
          datasets[i].hoverBorderColor[j] = this.changeRGBAOpacity(datasets[i].hoverBorderColor[j], 1)
        }
      }
    } catch (e) {
      //means barchart, only single color string in property. Set to array
      let size = datasets[ele.datasetIndex].data.length;
      let newColorArr = [];
      let newHoverColorArr = [];
      let borderColorArr = [];
      let hoverBorderColorArr = [];
      for (let i = 0; i < size; i++) {
        newColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor, 0.5));
        newHoverColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor, 0.3));
        borderColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].borderColor, 1));
        hoverBorderColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].hoverBorderColor, 1));
      }
      datasets[ele.datasetIndex].backgroundColor = newColorArr;
      datasets[ele.datasetIndex].hoverBackgroundColor = newHoverColorArr;
      datasets[ele.datasetIndex].borderColor = borderColorArr;
      datasets[ele.datasetIndex].hoverBorderColor = hoverBorderColorArr;
    }
    event.chartInstance.update();
  }
  setColor(event) {
    let ele = event.element[0];
    let datasets = event.chartInstance.data.datasets;
    try {
      for (let i in datasets) {
        for (var j in datasets[i].backgroundColor) {
          datasets[i].backgroundColor[j] = this.changeRGBAOpacity(datasets[i].backgroundColor[j], 0.2)
          datasets[i].hoverBackgroundColor[j] = this.changeRGBAOpacity(datasets[i].backgroundColor[j], 0.2)
          datasets[i].borderColor[j] = this.changeRGBAOpacity(datasets[i].borderColor[j], 0.2)
          datasets[i].hoverBorderColor[j] = this.changeRGBAOpacity(datasets[i].hoverBorderColor[j], 0.2)
        }
      }
    } catch (error) {
      //means barchart, only single color string in property. Set to array
      let size = datasets[ele.datasetIndex].data.length;
      let newColorArr = [];
      let newHoverColorArr = [];
      let borderColorArr = [];
      let hoverBorderColorArr = [];
      for (let i = 0; i < size; i++) {
        newColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor, 0.2));
        newHoverColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor, 0.2));
        borderColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].borderColor, 0.2));
        hoverBorderColorArr.push(this.changeRGBAOpacity(datasets[ele.datasetIndex].hoverBorderColor, 0.2));
      }
      datasets[ele.datasetIndex].backgroundColor = newColorArr;
      datasets[ele.datasetIndex].hoverBackgroundColor = newHoverColorArr;
      datasets[ele.datasetIndex].borderColor = borderColorArr;
      datasets[ele.datasetIndex].hoverBorderColor = hoverBorderColorArr;
    }
    datasets[ele.datasetIndex].backgroundColor[ele.index] = this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor[ele.index], 0.9)
    datasets[ele.datasetIndex].hoverBackgroundColor[ele.index] = this.changeRGBAOpacity(datasets[ele.datasetIndex].backgroundColor[ele.index], 0.9)
    datasets[ele.datasetIndex].borderColor[ele.index] = this.changeRGBAOpacity(datasets[ele.datasetIndex].borderColor[ele.index], 1)
    datasets[ele.datasetIndex].hoverBorderColor[ele.index] = this.changeRGBAOpacity(datasets[ele.datasetIndex].hoverBorderColor[ele.index], 1)

    event.chartInstance.update();
  }
  changeRGBAOpacity(colorStr, opacity) {
    let colorArr = this.getRGBFromRGBA(colorStr);
    let r = colorArr[0];
    let g = colorArr[1];
    let b = colorArr[2];
    return `rgba(${r},${g},${b},${opacity})`;
  }
  getRGBFromRGBA(str) {
    return str.toLowerCase().replace("rgba(", "").replace(")", "").split(",");
  }
````

## Some other stuff I want to put somewhere

| label Col (this header is unimportant) | Dataset 1 | Dataset 2 |
| --- | --- | --- |
| Some label 1 | 12 | 8 |
| Some label 2 | 5 | 17 |
| Some label 3 | 23 | 2 |

