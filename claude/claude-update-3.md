# Claude Update 3 — Code Cleanup & Optimisation

**Branch:** `claude/optimize-codebase-aSmR8`
**Date:** 2026-03-19
**Commits:** 2

---

## 1. README Update

Updated the description line to reflect the current dependency versions:

- Before: `An Angular wrapper for ChartJS.`
- After: `An Angular 19 wrapper for Chart.js 4.`

---

## 2. Library Source Cleanup

### Bug fixes

**`neurasil-charts.component.ts` — incorrect `isPieOrDonut` check**

The pie/donut tooltip callback check was reading `this.chartType` (the static `@Input()`) instead of `this.toolbarProps.chartType` (the active chart type that tracks toolbar changes). This meant the correct tooltip format was only applied if the *initial* chart type was pie/donut — switching to pie/donut from the toolbar would still render with the bar/line tooltip format.

```typescript
// Before
const isPieOrDonut = this.chartType === NEURASIL_CHART_TYPE.DONUT || this.chartType === NEURASIL_CHART_TYPE.PIE;

// After
const isPieOrDonut = this.toolbarProps.chartType === NEURASIL_CHART_TYPE.DONUT || this.toolbarProps.chartType === NEURASIL_CHART_TYPE.PIE;
```

**`neurasil-charts.component.ts` — `additionalOpts_Plugins` replacing instead of merging**

The `additionalOpts_Plugins` input was assigned directly over `props.options.plugins`, wiping out any previously set properties (e.g. the chart title). Since its default value is `{}` (always truthy), the chart title was being silently cleared on every render even when no plugins were passed by the consumer.

```typescript
// Before
props.options.plugins = this.additionalOpts_Plugins;

// After
props.options.plugins = { ...props.options.plugins, ...this.additionalOpts_Plugins };
```

### Code quality

**`neurasil-data-filter.pipe.ts` — `window.alert` replaced with `console.warn`**

A library should never call `window.alert`. Replaced the conflict warning for simultaneous include/exclude column filters with a `console.warn`.

**`neurasil-charts.component.ts` — cleaned up JSDoc on `useAltAxis`**

Removed an inappropriate comment; replaced with a clear description.

```typescript
// Before
/** Show right axis for shits and giggles */

// After
/** Show data on a secondary Y-axis */
```

**`neurasil-charts.component.ts` — simplified `ngOnChanges`**

The `if (changes)` guard was always truthy — Angular only invokes `ngOnChanges` when there are changes. Removed the redundant wrapper.

```typescript
// Before
ngOnChanges(changes: SimpleChanges) {
  if (changes) {
    this.drawChart();
  }
}

// After
ngOnChanges(_changes: SimpleChanges) {
  this.drawChart();
}
```

**`neurasil-charts-toolbar.component.ts` — removed dead commented-out code**

Removed `//console.log(ev)` left over from debugging.

**`neurasil-data-filter.pipe.ts` — simplified redundant null check**

`!= null` already covers both `null` and `undefined` in JavaScript/TypeScript, so `&& term !== undefined` was redundant.

```typescript
// Before
if (term != null && term !== undefined && term.length > 1)

// After
if (term != null && term.length > 1)
```

**`utils.ts` — removed stray semicolon**

Removed an erroneous `;` after the closing brace of the `hexToRgba` method.
