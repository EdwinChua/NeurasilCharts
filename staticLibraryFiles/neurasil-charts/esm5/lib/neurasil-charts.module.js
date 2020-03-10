/**
 * @fileoverview added by tsickle
 * Generated from: lib/neurasil-charts.module.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NeurasilChartsToolbarComponent } from './neurasil-charts-toolbar/neurasil-charts-toolbar.component';
import { NeurasilChartsComponent } from './neurasil-charts.component';
import { NeurasilDataFilter } from './pipes/neurasil-data-filter/neurasil-data-filter.pipe';
var NeurasilChartsModule = /** @class */ (function () {
    function NeurasilChartsModule() {
    }
    NeurasilChartsModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        NeurasilChartsComponent,
                        NeurasilChartsToolbarComponent,
                        NeurasilDataFilter
                    ],
                    imports: [
                        CommonModule,
                        FormsModule
                    ],
                    exports: [NeurasilChartsComponent, NeurasilDataFilter]
                },] }
    ];
    return NeurasilChartsModule;
}());
export { NeurasilChartsModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25ldXJhc2lsLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9uZXVyYXNpbC1jaGFydHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLDZEQUE2RCxDQUFBO0FBQzVHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdEQUF3RCxDQUFDO0FBRTVGO0lBQUE7SUFZb0MsQ0FBQzs7Z0JBWnBDLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osdUJBQXVCO3dCQUN2Qiw4QkFBOEI7d0JBQzlCLGtCQUFrQjtxQkFDbkI7b0JBQ0QsT0FBTyxFQUFFO3dCQUNQLFlBQVk7d0JBQ1osV0FBVztxQkFDWjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsRUFBQyxrQkFBa0IsQ0FBQztpQkFDdEQ7O0lBQ21DLDJCQUFDO0NBQUEsQUFackMsSUFZcUM7U0FBeEIsb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE5ldXJhc2lsQ2hhcnRzVG9vbGJhckNvbXBvbmVudCB9IGZyb20gJy4vbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIvbmV1cmFzaWwtY2hhcnRzLXRvb2xiYXIuY29tcG9uZW50J1xuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNDb21wb25lbnQgfSBmcm9tICcuL25ldXJhc2lsLWNoYXJ0cy5jb21wb25lbnQnO1xuaW1wb3J0IHsgTmV1cmFzaWxEYXRhRmlsdGVyIH0gZnJvbSAnLi9waXBlcy9uZXVyYXNpbC1kYXRhLWZpbHRlci9uZXVyYXNpbC1kYXRhLWZpbHRlci5waXBlJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmV1cmFzaWxDaGFydHNDb21wb25lbnQsXG4gICAgTmV1cmFzaWxDaGFydHNUb29sYmFyQ29tcG9uZW50LFxuICAgIE5ldXJhc2lsRGF0YUZpbHRlclxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCxOZXVyYXNpbERhdGFGaWx0ZXJdXG59KVxuZXhwb3J0IGNsYXNzIE5ldXJhc2lsQ2hhcnRzTW9kdWxlIHsgfVxuIl19