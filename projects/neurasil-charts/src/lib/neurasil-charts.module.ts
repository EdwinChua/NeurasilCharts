import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NeurasilChartsToolbarComponent } from './neurasil-charts-toolbar/neurasil-charts-toolbar.component'
import { NeurasilChartsComponent } from './neurasil-charts.component';
import { NeurasilDataFilter } from './pipes/neurasil-data-filter/neurasil-data-filter.pipe';

@NgModule({
  declarations: [
    NeurasilChartsComponent,
    NeurasilChartsToolbarComponent,
    NeurasilDataFilter
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [NeurasilChartsComponent,NeurasilDataFilter]
})
export class NeurasilChartsModule { }
