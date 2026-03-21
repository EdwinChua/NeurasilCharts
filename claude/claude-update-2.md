# Claude Update 2 — Dependency Upgrades

**Branch:** `claude/optimize-codebase-aSmR8`
**Date:** 2026-03-19
**Commits:** 2

---

## 1. Angular 14 → 19 Upgrade

### Packages updated
| Package | Before | After |
|---------|--------|-------|
| `@angular/*` | `~14.0.3` | `~19.0.0` |
| `@angular/cli` | `~14.0.3` | `~19.0.0` |
| `@angular-devkit/build-angular` | `~14.0.3` | `~19.0.0` |
| `@angular/compiler-cli` | `~14.0.3` | `~19.0.0` |
| `ng-packagr` | `^14.0.2` | `^19.0.0` |
| `typescript` | `~4.7.4` | `~5.6.0` |
| `zone.js` | `~0.11.6` | `~0.15.0` |
| `rxjs` | `~7.5.5` | `~7.8.0` |
| `tslib` | `^2.4.0` | `^2.8.0` |

### Packages removed (deprecated)
- `@angular-devkit/build-ng-packagr` — replaced by `@angular-devkit/build-angular:ng-packagr` builder
- `protractor` — deprecated E2E framework, target removed from `angular.json`
- `tslint` / `codelyzer` — replaced by ESLint in Angular 17+, lint targets removed from `angular.json`
- `tsickle` — no longer used by the Angular compiler
- `@types/jasminewd2` — only needed for Protractor
- `karma-coverage-istanbul-reporter` — replaced by `karma-coverage`

### Configuration changes

**`angular.json`**
- Library build builder: `@angular-devkit/build-ng-packagr:build` → `@angular-devkit/build-angular:ng-packagr`
- Renamed `browserTarget` → `buildTarget` in `serve` and `extract-i18n` targets (Angular 17+ rename)
- Removed deprecated `aot: false` build option (AOT is default since Angular 9)
- Removed `extractCss: true` production option (removed in Angular 15)
- Removed `lint` targets (tslint no longer supported)
- Removed `e2e` target (Protractor no longer supported)

**`tsconfig.json` / `tsconfig.lib.json`**
- `target`: `es2015` → `ES2020`
- `lib`: `["es2018", "dom"]` → `["ES2020", "dom"]`
- Removed deprecated `angularCompilerOptions`: `annotateForClosureCompiler`, `skipTemplateCodegen`

**`polyfills.ts` / `test.ts`**
- `zone.js/dist/zone` → `zone.js`
- `zone.js/dist/zone-testing` → `zone.js/testing`

**`karma.conf.js`** (both projects)
- `karma-coverage-istanbul-reporter` plugin → `karma-coverage`
- `coverageIstanbulReporter` config key → `coverageReporter`

---

## 2. Chart.js v3 → v4 Upgrade

### Packages updated
| Package | Before | After |
|---------|--------|-------|
| `chart.js` | `^3.8.0` | `^4.5.1` |
| `chartjs-plugin-datalabels` | `^2.0.0` | `^2.2.0` |

### Breaking API changes fixed in `neurasil-charts.service.ts`

**`options.title` removed**
- v3: `options.title = { display: true, text: title }`
- v4: `options.plugins = { title: { display: true, text: title } }`

**`options.tooltips` removed**
- v3: `options.tooltips = { callbacks: {} }` was a v2 legacy property kept as dead code
- v4: Removed entirely. Tooltip configuration is handled via `options.plugins.tooltip` in the component.

**`ticks.beginAtZero` removed**
- v3: `ticks: { beginAtZero: true }` inside a scale definition
- v4: `beginAtZero: true` directly on the scale object
