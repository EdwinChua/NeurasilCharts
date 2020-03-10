/**
 * @fileoverview added by tsickle
 * Generated from: lib/pipes/neurasil-data-filter/neurasil-data-filter.pipe.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
export class NeurasilDataFilter {
    /**
     * @param {?} data
     * @param {?} filterText
     * @return {?}
     */
    transform(data, filterText) {
        if (filterText === "" || filterText === null || filterText === undefined) {
            return data;
        }
        else {
            if (filterText) {
                /** @type {?} */
                let filterTerms = filterText.split(',');
                /** @type {?} */
                let includeTerms = [];
                /** @type {?} */
                let excludeTerms = [];
                /** @type {?} */
                let includeColumns = [];
                /** @type {?} */
                let excludeColumns = [];
                for (let i in filterTerms) {
                    if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
                        /** @type {?} */
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
                /** @type {?} */
                let data_Filtered = data.filter((/**
                 * @param {?} dataItem
                 * @return {?}
                 */
                function (dataItem) {
                    /** @type {?} */
                    let k_arr = Object.keys(dataItem);
                    /** @type {?} */
                    let searchString = "";
                    for (let i in k_arr) {
                        /** @type {?} */
                        let currKey = k_arr[i];
                        /** @type {?} */
                        let value = dataItem[currKey];
                        searchString += value + " ";
                    }
                    searchString = searchString.toLowerCase().trim();
                    /** @type {?} */
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
                }));
                if (includeColumns.length > 0 && excludeColumns.length > 0) {
                    window.alert("Unsupported usage of include & exclude columns. Things may break");
                }
                //after filtering is complete, remove columns from clone of data
                else if (excludeColumns.length > 0) {
                    data_Filtered = JSON.parse(JSON.stringify(data_Filtered));
                    //console.log("here")
                    for (var h in data_Filtered) {
                        /** @type {?} */
                        let dataItem = data_Filtered[h];
                        /** @type {?} */
                        let k_arr = Object.keys(dataItem);
                        //for (let i in k_arr) {
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Do not allow user to delete first column
                                for (var j in excludeColumns) {
                                    /** @type {?} */
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
                        /** @type {?} */
                        let dataItem = data_Filtered[h];
                        /** @type {?} */
                        let k_arr = Object.keys(dataItem);
                        for (let i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Needed?
                                // skip the first column. Needed?
                                /** @type {?} */
                                let processedKey = k_arr[i].trim().toLowerCase();
                                /** @type {?} */
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
NeurasilDataFilter.decorators = [
    { type: Pipe, args: [{
                name: 'neurasilDataFilter',
                pure: true
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtZGF0YS1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25ldXJhc2lsLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9waXBlcy9uZXVyYXNpbC1kYXRhLWZpbHRlci9uZXVyYXNpbC1kYXRhLWZpbHRlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFNcEQsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7O0lBRTdCLFNBQVMsQ0FBQyxJQUFXLEVBQUUsVUFBa0I7UUFDdkMsSUFBSSxVQUFVLEtBQUssRUFBRSxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUN4RSxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxJQUFJLFVBQVUsRUFBRTs7b0JBQ1YsV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztvQkFDbkMsWUFBWSxHQUFHLEVBQUU7O29CQUNqQixZQUFZLEdBQUcsRUFBRTs7b0JBQ2pCLGNBQWMsR0FBRyxFQUFFOztvQkFDbkIsY0FBYyxHQUFHLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxDQUFDLElBQUksV0FBVyxFQUFFO29CQUN6QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7NEJBQ2xGLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUM5QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7NEJBQ2xCLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzt5QkFDakQ7NkJBQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFOzRCQUN6QixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7Z0NBQ2xCLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQzs2QkFDcEQ7aUNBQU07Z0NBQ0wsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBOzZCQUNsRDt5QkFDRjs2QkFBTTs0QkFDTCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO3lCQUMvQjtxQkFDRjtpQkFDRjs7b0JBR0csYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNOzs7O2dCQUFDLFVBQVUsUUFBUTs7d0JBQzVDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7d0JBQzdCLFlBQVksR0FBRyxFQUFFO29CQUNyQixLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRTs7NEJBQ2YsT0FBTyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7OzRCQUNsQixLQUFLLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQzt3QkFDN0IsWUFBWSxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUM7cUJBQzdCO29CQUNELFlBQVksR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7O3dCQUM3QyxvQkFBb0IsR0FBRyxLQUFLO29CQUNoQyxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUMzQixLQUFLLElBQUksQ0FBQyxJQUFJLFlBQVksRUFBRTs0QkFDMUIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUMxQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7Z0NBQzVCLE1BQU07NkJBQ1A7eUJBQ0Y7cUJBQ0Y7eUJBQU07d0JBQ0wsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO3FCQUM3QjtvQkFDRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLG9CQUFvQixFQUFFO3dCQUNuRCxLQUFLLElBQUksQ0FBQyxJQUFJLFlBQVksRUFBRTs0QkFDMUIsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dDQUMxQyxvQkFBb0IsR0FBRyxLQUFLLENBQUM7Z0NBQzdCLE1BQU07NkJBQ1A7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsSUFBSSxvQkFBb0IsRUFBRTt3QkFFeEIsT0FBTyxRQUFRLENBQUM7cUJBQ2pCO2dCQUNILENBQUMsRUFBQztnQkFFRixJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUMxRCxNQUFNLENBQUMsS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUE7aUJBQ2pGO2dCQUNELGdFQUFnRTtxQkFDM0QsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDbEMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO29CQUN6RCxxQkFBcUI7b0JBQ3JCLEtBQUssSUFBSSxDQUFDLElBQUksYUFBYSxFQUFFOzs0QkFDdkIsUUFBUSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUM7OzRCQUMzQixLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7d0JBQ2pDLHdCQUF3Qjt3QkFDeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7NEJBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLGtFQUFrRTtnQ0FDNUUsS0FBSyxJQUFJLENBQUMsSUFBSSxjQUFjLEVBQUU7O3dDQUN4QixZQUFZLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtvQ0FDaEQsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO3dDQUM1QyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQ0FDM0I7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7cUJBRUksSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDbEMsYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxLQUFLLElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRTs7NEJBQ3ZCLFFBQVEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDOzs0QkFDM0IsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO3dCQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs0QkFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsaUNBQWlDOzs7b0NBQ3ZDLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFOztvQ0FDNUMsVUFBVSxHQUFHLEtBQUs7Z0NBQ3RCLEtBQUssSUFBSSxDQUFDLElBQUksY0FBYyxFQUFFO29DQUM1QixJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0NBQzVDLFVBQVUsR0FBRyxJQUFJLENBQUM7cUNBQ25CO29DQUNELG1EQUFtRDtvQ0FDbkQsaUNBQWlDO29DQUNqQyxJQUFJO2lDQUNMO2dDQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7b0NBQ2YsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzNCOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUVELE9BQU8sYUFBYSxDQUFDO2FBQ3RCO1lBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxxQ0FBcUM7U0FDbkQ7SUFDSCxDQUFDOzs7WUF6SEYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxvQkFBb0I7Z0JBQzFCLElBQUksRUFBRSxJQUFJO2FBQ1giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ25ldXJhc2lsRGF0YUZpbHRlcicsXG4gIHB1cmU6IHRydWVcbn0pXG5leHBvcnQgY2xhc3MgTmV1cmFzaWxEYXRhRmlsdGVyIGltcGxlbWVudHMgUGlwZVRyYW5zZm9ybSB7XG5cbiAgdHJhbnNmb3JtKGRhdGE6IGFueVtdLCBmaWx0ZXJUZXh0OiBzdHJpbmcpOiBhbnkge1xuICAgIGlmIChmaWx0ZXJUZXh0ID09PSBcIlwiIHx8IGZpbHRlclRleHQgPT09IG51bGwgfHwgZmlsdGVyVGV4dCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGZpbHRlclRleHQpIHtcbiAgICAgICAgbGV0IGZpbHRlclRlcm1zID0gZmlsdGVyVGV4dC5zcGxpdCgnLCcpO1xuICAgICAgICBsZXQgaW5jbHVkZVRlcm1zID0gW107XG4gICAgICAgIGxldCBleGNsdWRlVGVybXMgPSBbXTtcbiAgICAgICAgbGV0IGluY2x1ZGVDb2x1bW5zID0gW107XG4gICAgICAgIGxldCBleGNsdWRlQ29sdW1ucyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpIGluIGZpbHRlclRlcm1zKSB7XG4gICAgICAgICAgaWYgKGZpbHRlclRlcm1zW2ldICE9IG51bGwgJiYgZmlsdGVyVGVybXNbaV0gIT0gdW5kZWZpbmVkICYmIGZpbHRlclRlcm1zW2ldLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGxldCB0ZXJtID0gZmlsdGVyVGVybXNbaV0udHJpbSgpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICBpZiAodGVybVswXSA9PSBcIi1cIikge1xuICAgICAgICAgICAgICBleGNsdWRlVGVybXMucHVzaCh0ZXJtLnJlcGxhY2UoXCItXCIsIFwiXCIpLnRyaW0oKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRlcm1bMF0gPT0gXCJ+XCIpIHtcbiAgICAgICAgICAgICAgaWYgKHRlcm1bMV0gPT0gXCIhXCIpIHtcbiAgICAgICAgICAgICAgICBleGNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn4hXCIsIFwiXCIpLnRyaW0oKSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW5jbHVkZUNvbHVtbnMucHVzaCh0ZXJtLnJlcGxhY2UoXCJ+XCIsIFwiXCIpLnRyaW0oKSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaW5jbHVkZVRlcm1zLnB1c2godGVybS50cmltKCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBsZXQgZGF0YV9GaWx0ZXJlZCA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uIChkYXRhSXRlbSkge1xuICAgICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcbiAgICAgICAgICBsZXQgc2VhcmNoU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICBmb3IgKGxldCBpIGluIGtfYXJyKSB7XG4gICAgICAgICAgICBsZXQgY3VycktleSA9IGtfYXJyW2ldO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gZGF0YUl0ZW1bY3VycktleV07XG4gICAgICAgICAgICBzZWFyY2hTdHJpbmcgKz0gdmFsdWUgKyBcIiBcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2VhcmNoU3RyaW5nID0gc2VhcmNoU3RyaW5nLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgICAgICAgIGxldCBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgIGlmIChpbmNsdWRlVGVybXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBpbmNsdWRlVGVybXMpIHtcbiAgICAgICAgICAgICAgaWYgKHNlYXJjaFN0cmluZy5pbmNsdWRlcyhpbmNsdWRlVGVybXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV4Y2x1ZGVUZXJtcy5sZW5ndGggPiAwICYmIGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGV4Y2x1ZGVUZXJtcykge1xuICAgICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmluY2x1ZGVzKGV4Y2x1ZGVUZXJtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50UGFzc2luZ1N0YXR1cykge1xuXG4gICAgICAgICAgICByZXR1cm4gZGF0YUl0ZW07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCAmJiBleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgd2luZG93LmFsZXJ0KFwiVW5zdXBwb3J0ZWQgdXNhZ2Ugb2YgaW5jbHVkZSAmIGV4Y2x1ZGUgY29sdW1ucy4gVGhpbmdzIG1heSBicmVha1wiKVxuICAgICAgICB9XG4gICAgICAgIC8vYWZ0ZXIgZmlsdGVyaW5nIGlzIGNvbXBsZXRlLCByZW1vdmUgY29sdW1ucyBmcm9tIGNsb25lIG9mIGRhdGFcbiAgICAgICAgZWxzZSBpZiAoZXhjbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKVxuICAgICAgICAgIC8vY29uc29sZS5sb2coXCJoZXJlXCIpXG4gICAgICAgICAgZm9yICh2YXIgaCBpbiBkYXRhX0ZpbHRlcmVkKSB7XG4gICAgICAgICAgICBsZXQgZGF0YUl0ZW0gPSBkYXRhX0ZpbHRlcmVkW2hdO1xuICAgICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xuICAgICAgICAgICAgLy9mb3IgKGxldCBpIGluIGtfYXJyKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gRG8gbm90IGFsbG93IHVzZXIgdG8gZGVsZXRlIGZpcnN0IGNvbHVtblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gZXhjbHVkZUNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoZXhjbHVkZUNvbHVtbnNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZSBpZiAoaW5jbHVkZUNvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGFfRmlsdGVyZWQgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGFfRmlsdGVyZWQpKTtcbiAgICAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcbiAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XG4gICAgICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtfYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChpID4gMCkgey8vIHNraXAgdGhlIGZpcnN0IGNvbHVtbi4gTmVlZGVkP1xuICAgICAgICAgICAgICAgIGxldCBwcm9jZXNzZWRLZXkgPSBrX2FycltpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBsZXQga2VlcENvbHVtbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogaW4gaW5jbHVkZUNvbHVtbnMpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGtlZXBDb2x1bW4gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgLy8gaWYgKCFwcm9jZXNzZWRLZXkuaW5jbHVkZXMoaW5jbHVkZUNvbHVtbnNbal0pKSB7XG4gICAgICAgICAgICAgICAgICAvLyAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcbiAgICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFrZWVwQ29sdW1uKSB7XG4gICAgICAgICAgICAgICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkYXRhX0ZpbHRlcmVkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7IC8vIGlmIG5vIGZpbHRlciwgcmV0dXJuIG9yaWdpbmFsIGRhdGFcbiAgICB9XG4gIH1cblxufVxuIl19