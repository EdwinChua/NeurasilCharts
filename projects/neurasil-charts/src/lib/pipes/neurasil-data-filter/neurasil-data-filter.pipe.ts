import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'neurasilDataFilter',
  pure: true
})
export class NeurasilDataFilter implements PipeTransform {

  transform(data: any[], filterText: string): any {
    if (filterText === "" || filterText === null || filterText === undefined) {
      return data;
    } else {
      if (filterText) {
        let filterTerms = filterText.split(',');
        let includeTerms = [];
        let excludeTerms = [];
        let includeColumns = [];
        let excludeColumns = [];
        for (let i in filterTerms) {
          if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
            let term = filterTerms[i].trim().toLowerCase();
            if (term[0] == "-") {
              excludeTerms.push(term.replace("-", "").trim());
            } else if (term[0] == "~") {
              if (term[1] == "!") {
                excludeColumns.push(term.replace("~!", "").trim());
              } else {
                includeColumns.push(term.replace("~", "").trim())
              }
            } else {
              includeTerms.push(term.trim())
            }
          }
        }


        let data_Filtered = data.filter(function (dataItem) {
          let k_arr = Object.keys(dataItem);
          let searchString = "";
          for (let i in k_arr) {
            let currKey = k_arr[i];
            let value = dataItem[currKey];
            searchString += value + " ";
          }
          searchString = searchString.toLowerCase().trim();
          let currentPassingStatus = false;
          if (includeTerms.length > 0) {
            for (let i in includeTerms) {
              if (searchString.includes(includeTerms[i])) {
                currentPassingStatus = true;
                break;
              }
            }
          } else {
            currentPassingStatus = true;
          }
          if (excludeTerms.length > 0 && currentPassingStatus) {
            for (let i in excludeTerms) {
              if (searchString.includes(excludeTerms[i])) {
                currentPassingStatus = false;
                break;
              }
            }
          }
          if (currentPassingStatus) {

            return dataItem;
          }
        });

        if (includeColumns.length > 0 && excludeColumns.length > 0) {
          window.alert("Unsupported usage of include & exclude columns. Things may break")
        }
        //after filtering is complete, remove columns from clone of data
        else if (excludeColumns.length > 0) {
          data_Filtered = JSON.parse(JSON.stringify(data_Filtered))
          //console.log("here")
          for (var h in data_Filtered) {
            let dataItem = data_Filtered[h];
            let k_arr = Object.keys(dataItem);
            //for (let i in k_arr) {
            for (let i = 0; i < k_arr.length; i++) {
              if (i > 0) {// skip the first column. Do not allow user to delete first column
                for (var j in excludeColumns) {
                  let processedKey = k_arr[i].trim().toLowerCase();
                  if (processedKey.includes(excludeColumns[j])) {
                    delete dataItem[k_arr[i]];
                  }
                }
              }
            }
          }
        }

        else if (includeColumns.length > 0) {
          data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
          for (var h in data_Filtered) {
            let dataItem = data_Filtered[h];
            let k_arr = Object.keys(dataItem);
            for (let i = 0; i < k_arr.length; i++) {
              if (i > 0) {// skip the first column. Needed?
                let processedKey = k_arr[i].trim().toLowerCase();
                let keepColumn = false;
                for (var j in includeColumns) {
                  if (processedKey.includes(includeColumns[j])) {
                    keepColumn = true;
                  }
                  // if (!processedKey.includes(includeColumns[j])) {
                  //     delete dataItem[k_arr[i]];
                  // }
                }
                if (!keepColumn) {
                  delete dataItem[k_arr[i]];
                }
              }
            }
          }
        }

        return data_Filtered;
      }
      return data; // if no filter, return original data
    }
  }

}
