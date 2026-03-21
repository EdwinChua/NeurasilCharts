# Claude Update 4 — Unit Tests & Testing Documentation

**Branch:** `claude/optimize-codebase-aSmR8`
**Date:** 2026-03-20

---

## Overview

Comprehensive unit tests were written for every testable unit in the workspace. All pre-existing spec files were also modernised (deprecated `async` → `waitForAsync`, `TestBed.get` → `TestBed.inject`).

A guide explaining how to run the tests was added as `claude/running-tests.md`.

---

## New spec file

| File | Notes |
|------|-------|
| `projects/neurasil-charts/src/lib/utils.spec.ts` | New — `Utils` had no spec file |

---

## Rewritten spec files

### `neurasil-charts` library

#### `utils.spec.ts` (new)

Tests for the three static helpers on the `Utils` class:

- **`hexToRgba`** — 6-digit hex, 3-digit hex, custom alpha, edge values (black, white, alpha 0)
- **`rgbToRgba`** — default opacity, custom opacity, rgba input (alpha override)
- **`colorIsHex`** — valid 6-digit, valid 3-digit, uppercase, rgb string, no `#`, too-short, invalid character

#### `neurasil-data-filter.pipe.spec.ts`

Replaces the single "create an instance" stub with 20+ focused tests:

- No-filter pass-through (`''`, `null`, `undefined`)
- Include terms: single term, case-insensitivity, OR logic across multiple terms, no-match empty result, length-1 term ignored, whitespace trimming
- Exclude terms (`-` prefix): single, multiple, no-match
- Combined include + exclude
- Exclude column filter (`~!` prefix): column removed, first column preserved, non-excluded columns intact, original array not mutated
- Include column filter (`~` prefix): only named column kept, first column preserved, original not mutated
- Conflicting column filters: `console.warn` emitted
- Edge cases: empty data array, filter with only commas

#### `neurasil-charts.service.spec.ts`

Replaces the single "should be created" stub. Uses `TestBed.inject` (was `TestBed.get`).

**`parseDataFromDatasource`**
- Cornerstone identification (first key)
- Row-to-column transposition
- Dollar prefix detection and stripping
- Percentage suffix detection and stripping
- No prefix/suffix for plain numbers
- `swapLabelsAndDatasets` transposition
- STACKED_PARETO format entries added
- Original input not mutated

**`chartObjectBuilder`**
- Chart.js type mapping for all `NEURASIL_CHART_TYPE` values
- `indexAxis: 'y'` for `HORIZONTAL_BAR`
- `plugins.title` added when title is provided, absent when empty
- Scales present for bar/line, absent for pie/donut
- Logarithmic vs linear scale
- Stacked axes for `STACKED`
- `useAltAxis` disabled (with `console.warn`) for unsupported types
- Secondary `yAxis_alt` added for `BAR_LINE` with `useAltAxis: true`
- `yAxis_pareto` (max 100) added for `STACKED_PARETO`
- Dataset count matches data column count
- Labels from cornerstone column
- Custom hex colour palette applied

**`performParetoAnalysis`**
- Data sorted descending by sum
- Exactly 2 datasets appended (`Pareto`, `80% line`)
- Pareto last value equals 100 (cumulative 100%)
- 80% line filled with 80 for every point
- Multi-dataset sum correctly aggregated

#### `neurasil-charts.component.spec.ts`

Replaces the outdated stub (used deprecated `async`, no service mocks).

**Approach:**
- `NeurasilChartsService` and `NeurasilDataFilter` replaced with `jasmine.createSpyObj` fakes
- `NO_ERRORS_SCHEMA` used to avoid declaring the toolbar child component
- `drawChart` is spied on in most `describe` blocks so Chart.js doesn't run unnecessarily
- A dedicated `describe('drawChart (real execution)')` block re-configures `TestBed` without the spy, mocks the service, and lets Chart.js render against a real canvas (Karma/Chrome)

**Tests cover:**
- Component creation
- `ngOnInit`: `hasData` flags, `toolbarProps` initialised from `@Input()` values, defaults
- `@Input()` defaults (`showToolbar`, `useAltAxis`, `showDataLabels`, `additionalOpts_*`)
- `updateToolbarProps`: all three `@Output()` emissions, `drawChart` called
- `ngOnChanges`: calls `drawChart`
- `drawChart` behaviour: empty filtered data skips chart creation, correct service calls, Pareto branch, `additionalOpts_Plugins` merge, filter string combination, previous chart destroyed before new one

#### `neurasil-charts-toolbar.component.spec.ts`

Replaces the outdated stub (used deprecated `async`, no `toolbarProps` initialised).

- `FormsModule` imported (required by `[(ngModel)]` bindings in template)
- `toolbarProps` set before `detectChanges` to satisfy template bindings
- `NEURASIL_CHART_TYPE` enum exposed on component instance
- `toolbarPropsChanged`: emits with current props, reflects updated `chartType`, `_datasetFilter`, and `swapLabelsAndDatasets`
- Template: filter input, chart-type `<select>`, swap `<checkbox>` all present

---

### `neurasil-library-tester` application

#### `utils.service.spec.ts`

Replaces `TestBed.get` (deprecated) with `TestBed.inject`.

**`generateSampleData`**
- Returns a non-empty array
- Every row has a `user` field
- Every row has numeric scores for all four subjects
- Scores are in the [50, 100] range

**`csvToJson`**
- Correct number of rows
- Header row becomes object keys
- String values parsed correctly
- Numeric strings coerced to numbers
- Single-row CSV handled

#### `app.component.spec.ts`

Replaces `RouterTestingModule` (removed in Angular 19), deprecated `async`, and fragile DOM text assertions.

- `UtilsService` replaced with a `jasmine.createSpyObj` fake
- `NO_ERRORS_SCHEMA` used to avoid declaring `neurasil-charts` components
- Tests cover: component creation, title value, `generateSampleData` called on init, default layout/filter, `chartProps` length, `setLayout`, `updateFilter`, `parseData` (JSON path, CSV fallback, empty array no-op)

---

## New documentation file

`claude/running-tests.md` — a user-facing guide covering:

- Prerequisites and Chrome requirement
- `ng test` commands for each project (watch mode, single run, code coverage)
- Running both projects simultaneously
- Headless / CI configuration (`ChromeHeadless`, `--no-sandbox`)
- Table of all spec files with descriptions
- Test configuration file reference
- Framework and tooling summary
