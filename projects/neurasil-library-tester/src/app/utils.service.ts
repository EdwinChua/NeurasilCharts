import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  generateSampleData():Array<any>{
    let arr = [];
    //let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let users = [[["John","test"],["LLL"],["Test"]], [['Mary'],["test"]],['James'],['Jenny'],['Alvin'],['Nandine']];
    let projects = ['Science','English', 'Math','History']

    for (let i in users){
      let o = {
        user: users[i]
      }
      for (let j in projects){
        let score =  Math.floor(Math.random() *100000)/1000
        if (score < 50)
          score += 50;
        o[projects[j]] =score
      }
      arr.push(o)
    }

    return arr;
  }

  csvToJson(str) :Array<any> {
    const cutlast = (_, i, a) => i < a.length - 1;
    const regex = /(?:[\t ]?)+("+)?(.*?)\1(?:[\t ]?)+(?:,|$)/gm;
    const lines = str.split('\n');
    
    const headers = lines.splice(0, 1)[0].match(regex).filter(cutlast);

    for (let i = 0; i < headers.length - 1; i++){
      
      //if (i < (headers.length -1))
        headers[i] = headers[i].substring(0,headers[i].length -1)
    }

    const list = [];
  
    for (const line of lines) {
      if(line.trim().length == 0){
        break;
      }
      const val = {};
      for (const [i, m] of [...line.matchAll(regex)].filter(cutlast).entries()) {
        // Attempt to convert to Number if possible, also use null if blank
        val[headers[i]] = (m[2].length > 0) ? Number(m[2]) || m[2] : null;
      }
      list.push(val);
    }

    //list.pop();
    console.log(list)
    
    return list;
  }
}
