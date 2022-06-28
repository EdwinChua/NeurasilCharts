import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NeurasilChartsToolbarComponent } from './neurasil-charts-toolbar/neurasil-charts-toolbar.component';
import { NeurasilChartsComponent } from './neurasil-charts.component';
import { NeurasilDataFilter } from './pipes/neurasil-data-filter/neurasil-data-filter.pipe';
import * as i0 from "@angular/core";
export class NeurasilChartsModule {
}
/** @nocollapse */ NeurasilChartsModule.ɵfac = function NeurasilChartsModule_Factory(t) { return new (t || NeurasilChartsModule)(); };
/** @nocollapse */ NeurasilChartsModule.ɵmod = /** @pureOrBreakMyCode */ i0.ɵɵdefineNgModule({ type: NeurasilChartsModule });
/** @nocollapse */ NeurasilChartsModule.ɵinj = /** @pureOrBreakMyCode */ i0.ɵɵdefineInjector({ imports: [CommonModule,
        FormsModule] });
(function () { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(NeurasilChartsModule, [{
        type: NgModule,
        args: [{
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
            }]
    }], null, null); })();
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(NeurasilChartsModule, { declarations: [NeurasilChartsComponent,
        NeurasilChartsToolbarComponent,
        NeurasilDataFilter], imports: [CommonModule,
        FormsModule], exports: [NeurasilChartsComponent, NeurasilDataFilter] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV1cmFzaWwtY2hhcnRzLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25ldXJhc2lsLWNoYXJ0cy9zcmMvbGliL25ldXJhc2lsLWNoYXJ0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLDZEQUE2RCxDQUFBO0FBQzVHLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOztBQWM1RixNQUFNLE9BQU8sb0JBQW9COzsyR0FBcEIsb0JBQW9CO3FHQUFwQixvQkFBb0I7eUdBTDdCLFlBQVk7UUFDWixXQUFXO3VGQUlGLG9CQUFvQjtjQVpoQyxRQUFRO2VBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLHVCQUF1QjtvQkFDdkIsOEJBQThCO29CQUM5QixrQkFBa0I7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFdBQVc7aUJBQ1o7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsdUJBQXVCLEVBQUMsa0JBQWtCLENBQUM7YUFDdEQ7O3dGQUNZLG9CQUFvQixtQkFWN0IsdUJBQXVCO1FBQ3ZCLDhCQUE4QjtRQUM5QixrQkFBa0IsYUFHbEIsWUFBWTtRQUNaLFdBQVcsYUFFSCx1QkFBdUIsRUFBQyxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuaW1wb3J0IHsgTmV1cmFzaWxDaGFydHNUb29sYmFyQ29tcG9uZW50IH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMtdG9vbGJhci9uZXVyYXNpbC1jaGFydHMtdG9vbGJhci5jb21wb25lbnQnXHJcbmltcG9ydCB7IE5ldXJhc2lsQ2hhcnRzQ29tcG9uZW50IH0gZnJvbSAnLi9uZXVyYXNpbC1jaGFydHMuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTmV1cmFzaWxEYXRhRmlsdGVyIH0gZnJvbSAnLi9waXBlcy9uZXVyYXNpbC1kYXRhLWZpbHRlci9uZXVyYXNpbC1kYXRhLWZpbHRlci5waXBlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCxcclxuICAgIE5ldXJhc2lsQ2hhcnRzVG9vbGJhckNvbXBvbmVudCxcclxuICAgIE5ldXJhc2lsRGF0YUZpbHRlclxyXG4gIF0sXHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgRm9ybXNNb2R1bGVcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtOZXVyYXNpbENoYXJ0c0NvbXBvbmVudCxOZXVyYXNpbERhdGFGaWx0ZXJdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZXVyYXNpbENoYXJ0c01vZHVsZSB7IH1cclxuIl19