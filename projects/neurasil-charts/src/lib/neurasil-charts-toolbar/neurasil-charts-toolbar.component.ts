import { Component,Input, Output, EventEmitter } from '@angular/core';

import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType'

@Component({
  selector: 'neurasil-charts-toolbar',
  templateUrl: './neurasil-charts-toolbar.component.html',
  styleUrls: ['./neurasil-charts-toolbar.component.sass']
})
export class NeurasilChartsToolbarComponent {
  @Input() toolbarProps;
  @Output() toolbarPropsChange = new EventEmitter<any>();
  NEURASIL_CHART_TYPE = NEURASIL_CHART_TYPE;
  toolbarPropsChanged(ev){
    //console.log(ev)
    this.toolbarPropsChange.emit(this.toolbarProps);
  }
}