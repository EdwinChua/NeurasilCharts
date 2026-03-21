import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── generateSampleData ───────────────────────────────────────────────────────

  describe('generateSampleData', () => {
    it('should return a non-empty array', () => {
      const data = service.generateSampleData();
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should include a "user" field on every row', () => {
      const data = service.generateSampleData();
      data.forEach(row => expect(row.user).toBeDefined());
    });

    it('should include numeric scores for each subject on every row', () => {
      const data = service.generateSampleData();
      const subjects = ['Science', 'English', 'Math', 'History'];
      data.forEach(row => {
        subjects.forEach(subject => {
          expect(typeof row[subject]).toBe('number');
        });
      });
    });

    it('should produce scores between 50 and 100', () => {
      const data = service.generateSampleData();
      const subjects = ['Science', 'English', 'Math', 'History'];
      data.forEach(row => {
        subjects.forEach(subject => {
          expect(row[subject]).toBeGreaterThanOrEqual(50);
          expect(row[subject]).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  // ─── csvToJson ────────────────────────────────────────────────────────────────

  describe('csvToJson', () => {
    const csv = `Name,Score,Grade\nAlice,85,B\nBob,92,A\nCharlie,60,D`;

    it('should return an array with one object per data row', () => {
      const result = service.csvToJson(csv);
      expect(result.length).toBe(3);
    });

    it('should use the first CSV line as object keys', () => {
      const result = service.csvToJson(csv);
      expect(Object.keys(result[0])).toContain('Name');
      expect(Object.keys(result[0])).toContain('Score');
      expect(Object.keys(result[0])).toContain('Grade');
    });

    it('should parse a string value correctly', () => {
      const result = service.csvToJson(csv);
      expect(result[0]['Name']).toBe('Alice');
    });

    it('should convert numeric strings to numbers', () => {
      const result = service.csvToJson(csv);
      expect(result[0]['Score']).toBe(85);
    });

    it('should handle a single-row CSV', () => {
      const singleRow = `Label,Value\nFoo,42`;
      const result = service.csvToJson(singleRow);
      expect(result.length).toBe(1);
      expect(result[0]['Label']).toBe('Foo');
      expect(result[0]['Value']).toBe(42);
    });
  });

});
