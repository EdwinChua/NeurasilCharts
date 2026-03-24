import { NeurasilDataFilter } from './neurasil-data-filter.pipe';

describe('NeurasilDataFilter', () => {
    let pipe: NeurasilDataFilter;

    const sampleData = [
        { name: 'Alice', score: 85, grade: 'B' },
        { name: 'Bob', score: 92, grade: 'A' },
        { name: 'Charlie', score: 60, grade: 'D' },
        { name: 'Diana', score: 78, grade: 'C' },
    ];

    beforeEach(() => {
        pipe = new NeurasilDataFilter();
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    // ─── No filter ────────────────────────────────────────────────────────────────

    it('should return all rows when filterText is an empty string', () => {
        expect(pipe.transform(sampleData, '')).toEqual(sampleData);
    });

    it('should return all rows when filterText is null', () => {
        expect(pipe.transform(sampleData, null)).toEqual(sampleData);
    });

    it('should return all rows when filterText is undefined', () => {
        expect(pipe.transform(sampleData, undefined)).toEqual(sampleData);
    });

    // ─── Include terms ────────────────────────────────────────────────────────────

    describe('include terms', () => {
        it('should filter rows by a single term', () => {
            const result = pipe.transform(sampleData, 'alice');
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Alice');
        });

        it('should be case-insensitive', () => {
            const result = pipe.transform(sampleData, 'ALICE');
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Alice');
        });

        it('should match against all field values, not just the first column', () => {
            // grade 'A' belongs only to Bob
            const result = pipe.transform(sampleData, ' a ');
            const names = result.map(r => r.name);
            expect(names).toContain('Bob');
        });

        it('should apply OR logic across multiple comma-separated include terms', () => {
            const result = pipe.transform(sampleData, 'alice,bob');
            expect(result.length).toBe(2);
            const names = result.map(r => r.name);
            expect(names).toContain('Alice');
            expect(names).toContain('Bob');
        });

        it('should return an empty array when no rows match', () => {
            const result = pipe.transform(sampleData, 'zzznomatch');
            expect(result.length).toBe(0);
        });

        it('should ignore terms whose raw length is exactly 1 (too short)', () => {
            // 'x' has length 1 — ignored; empty includeTerms → all rows pass
            const result = pipe.transform(sampleData, 'x');
            expect(result).toEqual(sampleData);
        });

        it('should trim whitespace from each term before matching', () => {
            const result = pipe.transform(sampleData, '  alice  ');
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Alice');
        });
    });

    // ─── Exclude terms (- prefix) ─────────────────────────────────────────────────

    describe('exclude terms (- prefix)', () => {
        it('should exclude rows matching a term prefixed with -', () => {
            const result = pipe.transform(sampleData, '-alice');
            expect(result.length).toBe(3);
            expect(result.find(r => r.name === 'Alice')).toBeUndefined();
        });

        it('should support multiple exclude terms', () => {
            const result = pipe.transform(sampleData, '-alice,-bob');
            expect(result.length).toBe(2);
            const names = result.map(r => r.name);
            expect(names).not.toContain('Alice');
            expect(names).not.toContain('Bob');
        });

        it('should return all rows when the exclude term matches nothing', () => {
            const result = pipe.transform(sampleData, '-zzznomatch');
            expect(result.length).toBe(sampleData.length);
        });
    });

    // ─── Combined include + exclude ───────────────────────────────────────────────

    describe('combined include and exclude terms', () => {
        it('should apply the include filter first, then the exclude filter', () => {
            // include rows with 'ali' (→ Alice), exclude rows with 'charlie' (no effect here)
            const result = pipe.transform(sampleData, 'ali,-charlie');
            expect(result.length).toBe(1);
            expect(result[0].name).toBe('Alice');
        });

        it('should handle an include term that matches several rows, then narrow via exclude', () => {
            // 'a' matches Alice (85), Bob (grade A), Charlie, Diana
            // then exclude 'alice'
            const result = pipe.transform(sampleData, ' a ,-alice');
            expect(result.find(r => r.name === 'Alice')).toBeUndefined();
        });
    });

    // ─── Column exclude filter (~! prefix) ───────────────────────────────────────

    describe('exclude column filter (~! prefix)', () => {
        it('should remove the named column from every result row', () => {
            const result = pipe.transform(sampleData, '~!grade');
            result.forEach(row => expect(Object.keys(row)).not.toContain('grade'));
        });

        it('should always preserve the first (label) column', () => {
            const result = pipe.transform(sampleData, '~!grade');
            result.forEach(row => expect(row['name']).toBeDefined());
        });

        it('should leave non-excluded columns intact', () => {
            const result = pipe.transform(sampleData, '~!grade');
            result.forEach(row => expect(row['score']).toBeDefined());
        });

        it('should not mutate the original data array', () => {
            const original = JSON.parse(JSON.stringify(sampleData));
            pipe.transform(sampleData, '~!grade');
            expect(sampleData).toEqual(original);
        });
    });

    // ─── Column include filter (~ prefix) ────────────────────────────────────────

    describe('include column filter (~ prefix)', () => {
        it('should keep only the specified column (plus the first column)', () => {
            const result = pipe.transform(sampleData, '~score');
            result.forEach(row => {
                expect(row['score']).toBeDefined();
                expect(row['grade']).toBeUndefined();
            });
        });

        it('should always preserve the first (label) column', () => {
            const result = pipe.transform(sampleData, '~score');
            result.forEach(row => expect(row['name']).toBeDefined());
        });

        it('should not mutate the original data array', () => {
            const original = JSON.parse(JSON.stringify(sampleData));
            pipe.transform(sampleData, '~score');
            expect(sampleData).toEqual(original);
        });
    });

    // ─── Conflicting column filters ───────────────────────────────────────────────

    describe('conflicting include and exclude column filters', () => {
        it('should emit a console.warn when both ~ and ~! filters are used together', () => {
            vi.spyOn(console, 'warn');
            pipe.transform(sampleData, '~score,~!grade');
            expect(console.warn).toHaveBeenCalled();
        });
    });

    // ─── Edge cases ───────────────────────────────────────────────────────────────

    describe('edge cases', () => {
        it('should handle an empty data array gracefully', () => {
            expect(pipe.transform([], 'alice')).toEqual([]);
        });

        it('should handle a filter with only commas (no actual terms)', () => {
            const result = pipe.transform(sampleData, ',,,');
            expect(result).toEqual(sampleData);
        });
    });

});
