import { Pipe } from '@angular/core';
import * as i0 from "@angular/core";
export class NeurasilDataFilter {
    transform(data, filterText) {
        if (filterText === "" || filterText === null || filterText === undefined) {
            return data;
        }
        else {
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
                        }
                        else if (term[0] == "~") {
                            if (term[1] == "!") {
                                excludeColumns.push(term.replace("~!", "").trim());
                            }
                            else {
                                includeColumns.push(term.replace("~", "").trim());
                            }
                        }
                        else {
                            includeTerms.push(term.trim());
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
                    }
                    else {
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
                    window.alert("Unsupported usage of include & exclude columns. Things may break");
                }
                //after filtering is complete, remove columns from clone of data
                else if (excludeColumns.length > 0) {
                    data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
                    //console.log("here")
                    for (var h in data_Filtered) {
                        let dataItem = data_Filtered[h];
                        let k_arr = Object.keys(dataItem);
                        //for (let i in k_arr) {
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Do not allow user to delete first column
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
                            if (i > 0) { // skip the first column. Needed?
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
/** @nocollapse */ NeurasilDataFilter.ɵfac = function NeurasilDataFilter_Factory(t) { return new (t || NeurasilDataFilter)(); };
/** @nocollapse */ NeurasilDataFilter.ɵpipe = /** @pureOrBreakMyCode */ i0.ɵɵdefinePipe({ name: "neurasilDataFilter", type: NeurasilDataFilter, pure: true });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilDataFilter, [{
        type: Pipe,
        args: [{
                name: 'neurasilDataFilter',
                pure: true
            }]
    }], null, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtZGF0YS1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL3BpcGVzL25ldXJhc2lsLWRhdGEtZmlsdGVyL25ldXJhc2lsLWRhdGEtZmlsdGVyLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7O0FBTXBELE1BQU0sT0FBTyxrQkFBa0I7SUFFN0IsU0FBUyxDQUFDLElBQVcsRUFBRSxVQUFrQjtRQUN2QyxJQUFJLFVBQVUsS0FBSyxFQUFFLElBQUksVUFBVSxLQUFLLElBQUksSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ3hFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7YUFBTTtZQUNMLElBQUksVUFBVSxFQUFFO2dCQUNkLElBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztnQkFDdEIsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO2dCQUN0QixJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7Z0JBQ3hCLElBQUksY0FBYyxHQUFHLEVBQUUsQ0FBQztnQkFDeEIsS0FBSyxJQUFJLENBQUMsSUFBSSxXQUFXLEVBQUU7b0JBQ3pCLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUN0RixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7d0JBQy9DLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFB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SSxVQUFVLEdBQUcsS0FBSyxDQUFDO2dDQUN2QixLQUFLLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRTtvQ0FDNUIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dDQUM1QyxVQUFVLEdBQUcsSUFBSSxDQUFDO3FDQUNuQjtvQ0FDRCxtREFBbUQ7b0NBQ25ELGlDQUFpQztvQ0FDakMsSUFBSTtpQ0FDTDtnQ0FDRCxJQUFJLENBQUMsVUFBVSxFQUFFO29DQUNmLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUMzQjs2QkFDRjt5QkFDRjtxQkFDRjtpQkFDRjtnQkFFRCxPQUFPLGFBQWEsQ0FBQzthQUN0QjtZQUNELE9BQU8sSUFBSSxDQUFDLENBQUMscUNBQXFDO1NBQ25EO0lBQ0gsQ0FBQzs7dUdBckhVLGtCQUFrQjs0SEFBbEIsa0JBQWtCO3VGQUFsQixrQkFBa0I7Y0FKOUIsSUFBSTtlQUFDO2dCQUNKLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLElBQUksRUFBRSxJQUFJO2FBQ1giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AUGlwZSh7XHJcbiAgbmFtZTogJ25ldXJhc2lsRGF0YUZpbHRlcicsXHJcbiAgcHVyZTogdHJ1ZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxEYXRhRmlsdGVyIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XHJcblxyXG4gIHRyYW5zZm9ybShkYXRhOiBhbnlbXSwgZmlsdGVyVGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgIGlmIChmaWx0ZXJUZXh0ID09PSBcIlwiIHx8IGZpbHRlclRleHQgPT09IG51bGwgfHwgZmlsdGVyVGV4dCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGZpbHRlclRleHQpIHtcclxuICAgICAgICBsZXQgZmlsdGVyVGVybXMgPSBmaWx0ZXJUZXh0LnNwbGl0KCcsJyk7XHJcbiAgICAgICAgbGV0IGluY2x1ZGVUZXJtcyA9IFtdO1xyXG4gICAgICAgIGxldCBleGNsdWRlVGVybXMgPSBbXTtcclxuICAgICAgICBsZXQgaW5jbHVkZUNvbHVtbnMgPSBbXTtcclxuICAgICAgICBsZXQgZXhjbHVkZUNvbHVtbnMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpIGluIGZpbHRlclRlcm1zKSB7XHJcbiAgICAgICAgICBpZiAoZmlsdGVyVGVybXNbaV0gIT0gbnVsbCAmJiBmaWx0ZXJUZXJtc1tpXSAhPSB1bmRlZmluZWQgJiYgZmlsdGVyVGVybXNbaV0ubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICBsZXQgdGVybSA9IGZpbHRlclRlcm1zW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAodGVybVswXSA9PSBcIi1cIikge1xyXG4gICAgICAgICAgICAgIGV4Y2x1ZGVUZXJtcy5wdXNoKHRlcm0ucmVwbGFjZShcIi1cIiwgXCJcIikudHJpbSgpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0ZXJtWzBdID09IFwiflwiKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHRlcm1bMV0gPT0gXCIhXCIpIHtcclxuICAgICAgICAgICAgICAgIGV4Y2x1ZGVDb2x1bW5zLnB1c2godGVybS5yZXBsYWNlKFwifiFcIiwgXCJcIikudHJpbSgpKTtcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaW5jbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+XCIsIFwiXCIpLnRyaW0oKSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgaW5jbHVkZVRlcm1zLnB1c2godGVybS50cmltKCkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBsZXQgZGF0YV9GaWx0ZXJlZCA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uIChkYXRhSXRlbSkge1xyXG4gICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gICAgICAgICAgbGV0IHNlYXJjaFN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgICBmb3IgKGxldCBpIGluIGtfYXJyKSB7XHJcbiAgICAgICAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJbaV07XHJcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGRhdGFJdGVtW2N1cnJLZXldO1xyXG4gICAgICAgICAgICBzZWFyY2hTdHJpbmcgKz0gdmFsdWUgKyBcIiBcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHNlYXJjaFN0cmluZyA9IHNlYXJjaFN0cmluZy50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcclxuICAgICAgICAgIGxldCBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKGluY2x1ZGVUZXJtcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gaW5jbHVkZVRlcm1zKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhpbmNsdWRlVGVybXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmIChleGNsdWRlVGVybXMubGVuZ3RoID4gMCAmJiBjdXJyZW50UGFzc2luZ1N0YXR1cykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGV4Y2x1ZGVUZXJtcykge1xyXG4gICAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoZXhjbHVkZVRlcm1zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YUl0ZW07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwICYmIGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIHdpbmRvdy5hbGVydChcIlVuc3VwcG9ydGVkIHVzYWdlIG9mIGluY2x1ZGUgJiBleGNsdWRlIGNvbHVtbnMuIFRoaW5ncyBtYXkgYnJlYWtcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9hZnRlciBmaWx0ZXJpbmcgaXMgY29tcGxldGUsIHJlbW92ZSBjb2x1bW5zIGZyb20gY2xvbmUgb2YgZGF0YVxyXG4gICAgICAgIGVsc2UgaWYgKGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKVxyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhlcmVcIilcclxuICAgICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhX0ZpbHRlcmVkW2hdO1xyXG4gICAgICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XHJcbiAgICAgICAgICAgIC8vZm9yIChsZXQgaSBpbiBrX2Fycikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBEbyBub3QgYWxsb3cgdXNlciB0byBkZWxldGUgZmlyc3QgY29sdW1uXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqIGluIGV4Y2x1ZGVDb2x1bW5zKSB7XHJcbiAgICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhleGNsdWRlQ29sdW1uc1tqXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNlIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBkYXRhX0ZpbHRlcmVkID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhX0ZpbHRlcmVkKSk7XHJcbiAgICAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcclxuICAgICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcclxuICAgICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBOZWVkZWQ/XHJcbiAgICAgICAgICAgICAgICBsZXQgcHJvY2Vzc2VkS2V5ID0ga19hcnJbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQga2VlcENvbHVtbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBpbmNsdWRlQ29sdW1ucykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGtlZXBDb2x1bW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIC8vIGlmICghcHJvY2Vzc2VkS2V5LmluY2x1ZGVzKGluY2x1ZGVDb2x1bW5zW2pdKSkge1xyXG4gICAgICAgICAgICAgICAgICAvLyAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcclxuICAgICAgICAgICAgICAgICAgLy8gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwQ29sdW1uKSB7XHJcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZGF0YV9GaWx0ZXJlZDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGF0YTsgLy8gaWYgbm8gZmlsdGVyLCByZXR1cm4gb3JpZ2luYWwgZGF0YVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19