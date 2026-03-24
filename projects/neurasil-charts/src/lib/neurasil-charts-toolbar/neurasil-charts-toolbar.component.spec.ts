import type { Mock } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { NeurasilChartsToolbarComponent } from './neurasil-charts-toolbar.component';
import { NEURASIL_CHART_TYPE } from '../models/NeurasilChartType';

describe('NeurasilChartsToolbarComponent', () => {
    let component: NeurasilChartsToolbarComponent;
    let fixture: ComponentFixture<NeurasilChartsToolbarComponent>;

    const defaultToolbarProps = {
        chartType: NEURASIL_CHART_TYPE.BAR,
        _datasetFilter: '',
        swapLabelsAndDatasets: false,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, NeurasilChartsToolbarComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NeurasilChartsToolbarComponent);
        component = fixture.componentInstance;
        // toolbarProps must be set before detectChanges to satisfy template bindings
        component.toolbarProps = { ...defaultToolbarProps };
        fixture.detectChanges();
    });

    // ─── Creation ────────────────────────────────────────────────────────────────

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ─── Inputs ───────────────────────────────────────────────────────────────────

    it('should expose NEURASIL_CHART_TYPE enum to the template', () => {
        expect(component.NEURASIL_CHART_TYPE).toBe(NEURASIL_CHART_TYPE);
    });

    it('should reflect the toolbarProps @Input on the component', () => {
        expect(component.toolbarProps.chartType).toBe(NEURASIL_CHART_TYPE.BAR);
        expect(component.toolbarProps._datasetFilter).toBe('');
        expect(component.toolbarProps.swapLabelsAndDatasets).toBe(false);
    });

    // ─── toolbarPropsChanged ──────────────────────────────────────────────────────

    describe('toolbarPropsChanged', () => {
        it('should emit toolbarPropsChange with the current toolbarProps object', () => {
            vi.spyOn(component.toolbarPropsChange, 'emit');
            component.toolbarPropsChanged(null);
            expect(component.toolbarPropsChange.emit).toHaveBeenCalledWith(component.toolbarProps);
        });

        it('should emit the updated chartType after it changes', () => {
            vi.spyOn(component.toolbarPropsChange, 'emit');
            component.toolbarProps.chartType = NEURASIL_CHART_TYPE.PIE;
            component.toolbarPropsChanged(null);
            const emitted = vi.mocked((component.toolbarPropsChange.emit as Mock)).mock.lastCall[0];
            expect(emitted.chartType).toBe(NEURASIL_CHART_TYPE.PIE);
        });

        it('should emit the updated filter string after it changes', () => {
            vi.spyOn(component.toolbarPropsChange, 'emit');
            component.toolbarProps._datasetFilter = 'alice';
            component.toolbarPropsChanged(null);
            const emitted = vi.mocked((component.toolbarPropsChange.emit as Mock)).mock.lastCall[0];
            expect(emitted._datasetFilter).toBe('alice');
        });

        it('should emit the updated swap flag after it changes', () => {
            vi.spyOn(component.toolbarPropsChange, 'emit');
            component.toolbarProps.swapLabelsAndDatasets = true;
            component.toolbarPropsChanged(null);
            const emitted = vi.mocked((component.toolbarPropsChange.emit as Mock)).mock.lastCall[0];
            expect(emitted.swapLabelsAndDatasets).toBe(true);
        });
    });

    // ─── Template bindings ────────────────────────────────────────────────────────

    describe('template', () => {
        it('should render a filter text input', () => {
            const input: HTMLInputElement = fixture.nativeElement.querySelector('input[type="text"]');
            expect(input).toBeTruthy();
        });

        it('should render a chart-type select dropdown', () => {
            const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
            expect(select).toBeTruthy();
        });

        it('should render a swap checkbox', () => {
            const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('input[type="checkbox"]');
            expect(checkbox).toBeTruthy();
        });
    });

});
