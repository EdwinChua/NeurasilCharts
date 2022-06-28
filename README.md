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


### Random side note - Build neurasil-charts command:

````shell
ng build neurasil-charts
````

## Some other stuff I want to put somewhere

| label Col (this header is unimportant) | Dataset 1 | Dataset 2 |
| --- | --- | --- |
| Some label 1 | 12 | 8 |
| Some label 2 | 5 | 17 |
| Some label 3 | 23 | 2 |

