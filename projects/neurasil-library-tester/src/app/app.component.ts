import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilsService } from './utils.service';
import { NEURASIL_CHART_TYPE, NeurasilChartsModule, BUILD_TIMESTAMP } from 'staticLibraryFiles/neurasil-charts/'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, NeurasilChartsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  @ViewChild('customStringTextArea', { static: false }) textArea: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  
  title = 'neurasil-library-tester';
  filter = "";
  data:Array<any>; 
  data2:Array<any>;
  layout = 1;
  displayStr = "";
  chartProps: Array<any> = [
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.GRID, swapLabelsAndDatasets: false},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.HORIZONTAL_BAR, swapLabelsAndDatasets: true},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.LINE, swapLabelsAndDatasets: false},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.BAR_LINE, swapLabelsAndDatasets: true},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.PIE, swapLabelsAndDatasets: false},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.DONUT, swapLabelsAndDatasets: true},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.STACKED, swapLabelsAndDatasets: false},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.STACKED_PARETO, swapLabelsAndDatasets: true},
    {showToolbar:true, chartType: NEURASIL_CHART_TYPE.HORIZONTAL_BAR, swapLabelsAndDatasets: false}

  ]

  constructor(public utilsService:UtilsService){}
  ngOnInit (){
    console.log('[neurasil-charts] BUILD_TIMESTAMP:', BUILD_TIMESTAMP);
    this.data = this.utilsService.generateSampleData();
  }

  btnClick(ev){
    this.parseData(this.textArea.nativeElement.value)
  }

  parseData(str){
    let arr = [];
    try{
      arr = JSON.parse(str)
    } catch (ex){
      arr = this.utilsService.csvToJson(str);
    }
    if (arr.length > 0){
      this.data = arr;
    }
  }

  uploadFromFile(event) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      console.log('csv content',  e.target.result);
      let res:string = e.target.result;
      res=res.replace('data:application/json;base64,','');
      res=res.replace('data:application/vnd.ms-excel;base64,','');
      this.textArea.nativeElement.value = atob(res)
      this.btnClick(null);
      console.log(atob(res));
    };
    reader.readAsDataURL(event.target.files[0]);
    console.log(reader.result)
  }

  setLayout(num){
    this.layout = num
  }

  updateFilter(event){
    console.log(event)
    this.filter = event.target.value;
  }
  test(event){
    console.log(event.data)
  }
}
