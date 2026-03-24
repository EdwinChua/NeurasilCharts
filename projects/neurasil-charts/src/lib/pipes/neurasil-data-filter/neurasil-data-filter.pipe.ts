import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'neurasilDataFilter',
    pure: true
})
export class NeurasilDataFilter implements PipeTransform {

  transform(data: any[], filterText: string): any {
    if (!filterText) {
      return data;
    }

    const filterTerms = filterText.split(',');
    const includeTerms: string[] = [];
    const excludeTerms: string[] = [];
    const includeColumns: string[] = [];
    const excludeColumns: string[] = [];

    for (const term of filterTerms) {
      if (term != null && term.length > 1) {
        const normalized = term.trim().toLowerCase();
        if (normalized[0] === "-") {
          excludeTerms.push(normalized.replace("-", "").trim());
        } else if (normalized[0] === "~") {
          if (normalized[1] === "!") {
            excludeColumns.push(normalized.replace("~!", "").trim());
          } else {
            includeColumns.push(normalized.replace("~", "").trim());
          }
        } else {
          includeTerms.push(normalized.trim());
        }
      }
    }

    let data_Filtered = data.filter(dataItem => {
      const searchString = Object.values(dataItem).join(" ").toLowerCase().trim();

      let passes = includeTerms.length === 0 || includeTerms.some(t => searchString.includes(t));
      if (passes && excludeTerms.length > 0) {
        passes = !excludeTerms.some(t => searchString.includes(t));
      }
      return passes;
    });

    if (includeColumns.length > 0 && excludeColumns.length > 0) {
      console.warn("Unsupported usage of include & exclude columns. Things may break");
    } else if (excludeColumns.length > 0) {
      data_Filtered = structuredClone(data_Filtered);
      for (const dataItem of data_Filtered) {
        const keys = Object.keys(dataItem);
        for (let i = 1; i < keys.length; i++) { // skip the first column
          const processedKey = keys[i].trim().toLowerCase();
          if (excludeColumns.some(col => processedKey.includes(col))) {
            delete dataItem[keys[i]];
          }
        }
      }
    } else if (includeColumns.length > 0) {
      data_Filtered = structuredClone(data_Filtered);
      for (const dataItem of data_Filtered) {
        const keys = Object.keys(dataItem);
        for (let i = 1; i < keys.length; i++) { // skip the first column
          const processedKey = keys[i].trim().toLowerCase();
          if (!includeColumns.some(col => processedKey.includes(col))) {
            delete dataItem[keys[i]];
          }
        }
      }
    }

    return data_Filtered;
  }

}
