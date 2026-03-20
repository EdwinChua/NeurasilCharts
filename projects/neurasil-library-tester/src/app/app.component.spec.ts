import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

import { AppComponent } from './app.component';
import { UtilsService } from './utils.service';

@Pipe({ name: 'neurasilDataFilter', standalone: false })
class MockNeurasilDataFilterPipe implements PipeTransform {
  transform(value: any): any { return value; }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockUtilsService: jasmine.SpyObj<UtilsService>;

  const fakeSampleData = [
    { user: 'Alice', Science: 80, English: 70, Math: 90, History: 75 },
    { user: 'Bob',   Science: 65, English: 85, Math: 72, History: 88 },
  ];

  beforeEach(waitForAsync(() => {
    mockUtilsService = jasmine.createSpyObj('UtilsService', ['generateSampleData', 'csvToJson']);
    mockUtilsService.generateSampleData.and.returnValue(fakeSampleData);
    mockUtilsService.csvToJson.and.returnValue(fakeSampleData);

    TestBed.configureTestingModule({
      declarations: [AppComponent, MockNeurasilDataFilterPipe],
      providers: [{ provide: UtilsService, useValue: mockUtilsService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial state ────────────────────────────────────────────────────────────

  describe('initial state', () => {
    it('should have title "neurasil-library-tester"', () => {
      expect(component.title).toBe('neurasil-library-tester');
    });

    it('should load sample data on init', () => {
      expect(mockUtilsService.generateSampleData).toHaveBeenCalled();
      expect(component.data).toEqual(fakeSampleData);
    });

    it('should default layout to 1', () => {
      expect(component.layout).toBe(1);
    });

    it('should default filter to an empty string', () => {
      expect(component.filter).toBe('');
    });

    it('should initialise chartProps with 9 entries', () => {
      expect(component.chartProps.length).toBe(9);
    });
  });

  // ─── setLayout ────────────────────────────────────────────────────────────────

  describe('setLayout', () => {
    it('should update the layout property', () => {
      component.setLayout(3);
      expect(component.layout).toBe(3);
    });

    it('should accept layout value 1', () => {
      component.setLayout(1);
      expect(component.layout).toBe(1);
    });
  });

  // ─── updateFilter ─────────────────────────────────────────────────────────────

  describe('updateFilter', () => {
    it('should update the filter property from an event target value', () => {
      component.updateFilter({ target: { value: 'alice' } } as any);
      expect(component.filter).toBe('alice');
    });

    it('should update to an empty string when the input is cleared', () => {
      component.filter = 'something';
      component.updateFilter({ target: { value: '' } } as any);
      expect(component.filter).toBe('');
    });
  });

  // ─── parseData ────────────────────────────────────────────────────────────────

  describe('parseData', () => {
    it('should parse valid JSON and update data', () => {
      const jsonArr = [{ Category: 'X', Val: 5 }];
      component.parseData(JSON.stringify(jsonArr));
      expect(component.data).toEqual(jsonArr);
    });

    it('should fall back to csvToJson when input is not valid JSON', () => {
      const csv = 'Name,Score\nAlice,85';
      component.parseData(csv);
      expect(mockUtilsService.csvToJson).toHaveBeenCalledWith(csv);
      expect(component.data).toEqual(fakeSampleData);
    });

    it('should not replace data when the parsed result is empty', () => {
      const previousData = component.data;
      component.parseData(JSON.stringify([]));
      expect(component.data).toEqual(previousData);
    });
  });

});
