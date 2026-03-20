import { Component,Input, Output, EventEmitter } from '@angular/core';

import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType'

@Component({
  selector: 'neurasil-charts-toolbar',
  standalone: false,
  templateUrl: './neurasil-charts-toolbar.component.html',
  styleUrls: ['./neurasil-charts-toolbar.component.sass']
})
export class NeurasilChartsToolbarComponent {
  @Input() toolbarProps;
  @Output() toolbarPropsChange = new EventEmitter<any>();
  NEURASIL_CHART_TYPE = NEURASIL_CHART_TYPE;
  toolbarPropsChanged(_ev) {
    this.toolbarPropsChange.emit(this.toolbarProps);
  }
}