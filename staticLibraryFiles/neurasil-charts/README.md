# NeurasilCharts

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.14.

## Usage

Import the module.

````ts
import { NeurasilChartsModule } from 'staticLibraryFiles/neurasil-charts'; // for eg.
@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    NeurasilChartsModule
  ],
})
````

In your typescript file.
````ts
let data = [
  {
    "ItemId": "Pt1",
    "Cost": 400,
    "Profit": 100
  },
  {
    "ItemId": "Item2",
    "Cost": 500,
    "Profit": 300
  },
  {
    "ItemId": "Pt3",
    "Cost": 300,
    "Profit": 500
  }
]
````

Use where ever you need a chart. The component takes up its container size, so wrap it in a div.
````html
<div *ngIf="data" style="width:800px;height:400px;float:left">
    <neurasil-charts 
    [data]="data"></neurasil-charts>
</div>
````



### Filtering

To filter data, use commas to separate data, add - to exclude data.
EITHER use ~ to include columns OR ~! to exclude columns.

### Example data:

| ItemId | Cost | Profit |
| ----- |-----| -----|
| Pt1 | 400 | 100 |
| Item2 | 500 | 300 |
| Pt3 | 300 | 500 |

Filter: `300`

Will return:
| ItemId | Cost | Profit |
| ----- |-----| -----|
| Item2 | 500 | 300 |
| Pt3 | 300 | 500 |

Filter: `300, ~pro`

Will return:
| ItemId | Profit |
| ----- |-----|
| Item2 | 300 |
| Pt3 | 500 |

Filter: `300, ~!pro`

Will return:
| ItemId | Cost |
| ----- |-----| 
| Item2 | 500 |
| Pt3 | 300 |

Filter: `~!ItemId` <<< Attempting to filter by 1st column is ignored
| ItemId | Cost | Profit |
| ----- |-----| -----|
| Pt1 | 400 | 100 |
| Item2 | 500 | 300 |
| Pt3 | 300 | 500 |

Filters the data before it enters the component. Has the expected behaviour of "narrowing" or "zooming-in" at each level. 
````html
<div *ngIf="data" style="width:800px;height:400px;float:left">
  <neurasil-charts 
  [data]="data | neurasilDataFilter : filter" 
  [showToolbar]="true"
  [defaultChartType]="7"
  ></neurasil-charts>
</div> 
````

Consolidate all filters in component before filtering. Has the benefit of "broadening" dataset. Original dataset is not filtered "outside" the component. This, however, may not be the expected behaviour of a filter.
````html
<div *ngIf="data" style="width:800px;height:400px;float:left">
  <neurasil-charts 
  [data]="data" 
  [showToolbar]="true"
  [defaultChartType]="7"
  [globalFilter]="filter"></neurasil-charts>
</div> 
````



## Code scaffolding

Run `ng generate component component-name --project neurasil-charts` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project neurasil-charts`.
> Note: Don't forget to add `--project neurasil-charts` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build neurasil-charts` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build neurasil-charts`, go to the dist folder `cd dist/neurasil-charts` and run `npm publish`.

## Running unit tests

Run `ng test neurasil-charts` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
