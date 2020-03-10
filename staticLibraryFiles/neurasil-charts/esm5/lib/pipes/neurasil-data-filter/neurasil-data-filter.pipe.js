/**
 * @fileoverview added by tsickle
 * Generated from: lib/pipes/neurasil-data-filter/neurasil-data-filter.pipe.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Pipe } from '@angular/core';
var NeurasilDataFilter = /** @class */ (function () {
    function NeurasilDataFilter() {
    }
    /**
     * @param {?} data
     * @param {?} filterText
     * @return {?}
     */
    NeurasilDataFilter.prototype.transform = /**
     * @param {?} data
     * @param {?} filterText
     * @return {?}
     */
    function (data, filterText) {
        if (filterText === "" || filterText === null || filterText === undefined) {
            return data;
        }
        else {
            if (filterText) {
                /** @type {?} */
                var filterTerms = filterText.split(',');
                /** @type {?} */
                var includeTerms_1 = [];
                /** @type {?} */
                var excludeTerms_1 = [];
                /** @type {?} */
                var includeColumns = [];
                /** @type {?} */
                var excludeColumns = [];
                for (var i in filterTerms) {
                    if (filterTerms[i] != null && filterTerms[i] != undefined && filterTerms[i].length > 1) {
                        /** @type {?} */
                        var term = filterTerms[i].trim().toLowerCase();
                        if (term[0] == "-") {
                            excludeTerms_1.push(term.replace("-", "").trim());
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
                            includeTerms_1.push(term.trim());
                        }
                    }
                }
                /** @type {?} */
                var data_Filtered = data.filter((/**
                 * @param {?} dataItem
                 * @return {?}
                 */
                function (dataItem) {
                    /** @type {?} */
                    var k_arr = Object.keys(dataItem);
                    /** @type {?} */
                    var searchString = "";
                    for (var i in k_arr) {
                        /** @type {?} */
                        var currKey = k_arr[i];
                        /** @type {?} */
                        var value = dataItem[currKey];
                        searchString += value + " ";
                    }
                    searchString = searchString.toLowerCase().trim();
                    /** @type {?} */
                    var currentPassingStatus = false;
                    if (includeTerms_1.length > 0) {
                        for (var i in includeTerms_1) {
                            if (searchString.includes(includeTerms_1[i])) {
                                currentPassingStatus = true;
                                break;
                            }
                        }
                    }
                    else {
                        currentPassingStatus = true;
                    }
                    if (excludeTerms_1.length > 0 && currentPassingStatus) {
                        for (var i in excludeTerms_1) {
                            if (searchString.includes(excludeTerms_1[i])) {
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
                        var dataItem = data_Filtered[h];
                        /** @type {?} */
                        var k_arr = Object.keys(dataItem);
                        //for (let i in k_arr) {
                        for (var i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Do not allow user to delete first column
                                for (var j in excludeColumns) {
                                    /** @type {?} */
                                    var processedKey = k_arr[i].trim().toLowerCase();
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
                        var dataItem = data_Filtered[h];
                        /** @type {?} */
                        var k_arr = Object.keys(dataItem);
                        for (var i = 0; i < k_arr.length; i++) {
                            if (i > 0) { // skip the first column. Needed?
                                // skip the first column. Needed?
                                /** @type {?} */
                                var processedKey = k_arr[i].trim().toLowerCase();
                                /** @type {?} */
                                var keepColumn = false;
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
    };
    NeurasilDataFilter.decorators = [
        { type: Pipe, args: [{
                    name: 'neurasilDataFilter',
                    pure: true
                },] }
    ];
    return NeurasilDataFilter;
}());
export { NeurasilDataFilter };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtZGF0YS1maWx0ZXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25ldXJhc2lsLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9waXBlcy9uZXVyYXNpbC1kYXRhLWZpbHRlci9uZXVyYXNpbC1kYXRhLWZpbHRlci5waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFFcEQ7SUFBQTtJQTJIQSxDQUFDOzs7Ozs7SUFySEMsc0NBQVM7Ozs7O0lBQVQsVUFBVSxJQUFXLEVBQUUsVUFBa0I7UUFDdkMsSUFBSSxVQUFVLEtBQUssRUFBRSxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxLQUFLLFNBQVMsRUFBRTtZQUN4RSxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxJQUFJLFVBQVUsRUFBRTs7b0JBQ1YsV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDOztvQkFDbkMsY0FBWSxHQUFHLEVBQUU7O29CQUNqQixjQUFZLEdBQUcsRUFBRTs7b0JBQ2pCLGNBQWMsR0FBRyxFQUFFOztvQkFDbkIsY0FBYyxHQUFHLEVBQUU7Z0JBQ3ZCLEtBQUssSUFBSSxDQUFDLElBQUksV0FBVyxFQUFFO29CQUN6QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7NEJBQ2xGLElBQUksR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO3dCQUM5QyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUU7NEJBQ2xCLGNBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFB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aUNBQWlDO29DQUNqQyxJQUFJO2lDQUNMO2dDQUNELElBQUksQ0FBQyxVQUFVLEVBQUU7b0NBQ2YsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQzNCOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUVELE9BQU8sYUFBYSxDQUFDO2FBQ3RCO1lBQ0QsT0FBTyxJQUFJLENBQUMsQ0FBQyxxQ0FBcUM7U0FDbkQ7SUFDSCxDQUFDOztnQkF6SEYsSUFBSSxTQUFDO29CQUNKLElBQUksRUFBRSxvQkFBb0I7b0JBQzFCLElBQUksRUFBRSxJQUFJO2lCQUNYOztJQXdIRCx5QkFBQztDQUFBLEFBM0hELElBMkhDO1NBdkhZLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpcGUsIFBpcGVUcmFuc2Zvcm0gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQFBpcGUoe1xuICBuYW1lOiAnbmV1cmFzaWxEYXRhRmlsdGVyJyxcbiAgcHVyZTogdHJ1ZVxufSlcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbERhdGFGaWx0ZXIgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcblxuICB0cmFuc2Zvcm0oZGF0YTogYW55W10sIGZpbHRlclRleHQ6IHN0cmluZyk6IGFueSB7XG4gICAgaWYgKGZpbHRlclRleHQgPT09IFwiXCIgfHwgZmlsdGVyVGV4dCA9PT0gbnVsbCB8fCBmaWx0ZXJUZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZmlsdGVyVGV4dCkge1xuICAgICAgICBsZXQgZmlsdGVyVGVybXMgPSBmaWx0ZXJUZXh0LnNwbGl0KCcsJyk7XG4gICAgICAgIGxldCBpbmNsdWRlVGVybXMgPSBbXTtcbiAgICAgICAgbGV0IGV4Y2x1ZGVUZXJtcyA9IFtdO1xuICAgICAgICBsZXQgaW5jbHVkZUNvbHVtbnMgPSBbXTtcbiAgICAgICAgbGV0IGV4Y2x1ZGVDb2x1bW5zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgaW4gZmlsdGVyVGVybXMpIHtcbiAgICAgICAgICBpZiAoZmlsdGVyVGVybXNbaV0gIT0gbnVsbCAmJiBmaWx0ZXJUZXJtc1tpXSAhPSB1bmRlZmluZWQgJiYgZmlsdGVyVGVybXNbaV0ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgbGV0IHRlcm0gPSBmaWx0ZXJUZXJtc1tpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIGlmICh0ZXJtWzBdID09IFwiLVwiKSB7XG4gICAgICAgICAgICAgIGV4Y2x1ZGVUZXJtcy5wdXNoKHRlcm0ucmVwbGFjZShcIi1cIiwgXCJcIikudHJpbSgpKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGVybVswXSA9PSBcIn5cIikge1xuICAgICAgICAgICAgICBpZiAodGVybVsxXSA9PSBcIiFcIikge1xuICAgICAgICAgICAgICAgIGV4Y2x1ZGVDb2x1bW5zLnB1c2godGVybS5yZXBsYWNlKFwifiFcIiwgXCJcIikudHJpbSgpKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbmNsdWRlQ29sdW1ucy5wdXNoKHRlcm0ucmVwbGFjZShcIn5cIiwgXCJcIikudHJpbSgpKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpbmNsdWRlVGVybXMucHVzaCh0ZXJtLnRyaW0oKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGxldCBkYXRhX0ZpbHRlcmVkID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24gKGRhdGFJdGVtKSB7XG4gICAgICAgICAgbGV0IGtfYXJyID0gT2JqZWN0LmtleXMoZGF0YUl0ZW0pO1xuICAgICAgICAgIGxldCBzZWFyY2hTdHJpbmcgPSBcIlwiO1xuICAgICAgICAgIGZvciAobGV0IGkgaW4ga19hcnIpIHtcbiAgICAgICAgICAgIGxldCBjdXJyS2V5ID0ga19hcnJbaV07XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSBkYXRhSXRlbVtjdXJyS2V5XTtcbiAgICAgICAgICAgIHNlYXJjaFN0cmluZyArPSB2YWx1ZSArIFwiIFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWFyY2hTdHJpbmcgPSBzZWFyY2hTdHJpbmcudG9Mb3dlckNhc2UoKS50cmltKCk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGluY2x1ZGVUZXJtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGluY2x1ZGVUZXJtcykge1xuICAgICAgICAgICAgICBpZiAoc2VhcmNoU3RyaW5nLmluY2x1ZGVzKGluY2x1ZGVUZXJtc1tpXSkpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGFzc2luZ1N0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3VycmVudFBhc3NpbmdTdGF0dXMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXhjbHVkZVRlcm1zLmxlbmd0aCA+IDAgJiYgY3VycmVudFBhc3NpbmdTdGF0dXMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZXhjbHVkZVRlcm1zKSB7XG4gICAgICAgICAgICAgIGlmIChzZWFyY2hTdHJpbmcuaW5jbHVkZXMoZXhjbHVkZVRlcm1zW2ldKSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQYXNzaW5nU3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRQYXNzaW5nU3RhdHVzKSB7XG5cbiAgICAgICAgICAgIHJldHVybiBkYXRhSXRlbTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwICYmIGV4Y2x1ZGVDb2x1bW5zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB3aW5kb3cuYWxlcnQoXCJVbnN1cHBvcnRlZCB1c2FnZSBvZiBpbmNsdWRlICYgZXhjbHVkZSBjb2x1bW5zLiBUaGluZ3MgbWF5IGJyZWFrXCIpXG4gICAgICAgIH1cbiAgICAgICAgLy9hZnRlciBmaWx0ZXJpbmcgaXMgY29tcGxldGUsIHJlbW92ZSBjb2x1bW5zIGZyb20gY2xvbmUgb2YgZGF0YVxuICAgICAgICBlbHNlIGlmIChleGNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpXG4gICAgICAgICAgLy9jb25zb2xlLmxvZyhcImhlcmVcIilcbiAgICAgICAgICBmb3IgKHZhciBoIGluIGRhdGFfRmlsdGVyZWQpIHtcbiAgICAgICAgICAgIGxldCBkYXRhSXRlbSA9IGRhdGFfRmlsdGVyZWRbaF07XG4gICAgICAgICAgICBsZXQga19hcnIgPSBPYmplY3Qua2V5cyhkYXRhSXRlbSk7XG4gICAgICAgICAgICAvL2ZvciAobGV0IGkgaW4ga19hcnIpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBEbyBub3QgYWxsb3cgdXNlciB0byBkZWxldGUgZmlyc3QgY29sdW1uXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBleGNsdWRlQ29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhleGNsdWRlQ29sdW1uc1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGRhdGFJdGVtW2tfYXJyW2ldXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBlbHNlIGlmIChpbmNsdWRlQ29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgZGF0YV9GaWx0ZXJlZCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YV9GaWx0ZXJlZCkpO1xuICAgICAgICAgIGZvciAodmFyIGggaW4gZGF0YV9GaWx0ZXJlZCkge1xuICAgICAgICAgICAgbGV0IGRhdGFJdGVtID0gZGF0YV9GaWx0ZXJlZFtoXTtcbiAgICAgICAgICAgIGxldCBrX2FyciA9IE9iamVjdC5rZXlzKGRhdGFJdGVtKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga19hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7Ly8gc2tpcCB0aGUgZmlyc3QgY29sdW1uLiBOZWVkZWQ/XG4gICAgICAgICAgICAgICAgbGV0IHByb2Nlc3NlZEtleSA9IGtfYXJyW2ldLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIGxldCBrZWVwQ29sdW1uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiBpbmNsdWRlQ29sdW1ucykge1xuICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3NlZEtleS5pbmNsdWRlcyhpbmNsdWRlQ29sdW1uc1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgICAga2VlcENvbHVtbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAvLyBpZiAoIXByb2Nlc3NlZEtleS5pbmNsdWRlcyhpbmNsdWRlQ29sdW1uc1tqXSkpIHtcbiAgICAgICAgICAgICAgICAgIC8vICAgICBkZWxldGUgZGF0YUl0ZW1ba19hcnJbaV1dO1xuICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBDb2x1bW4pIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBkYXRhSXRlbVtrX2FycltpXV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRhdGFfRmlsdGVyZWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTsgLy8gaWYgbm8gZmlsdGVyLCByZXR1cm4gb3JpZ2luYWwgZGF0YVxuICAgIH1cbiAgfVxuXG59XG4iXX0=