# Running Tests — NeurasilCharts

This document explains how to run the unit tests for both projects in this Angular workspace.

---

## Prerequisites

Make sure all dependencies are installed before running tests:

```bash
npm install
```

Karma uses **Google Chrome** as its default browser. Ensure Chrome is installed on your system. For headless CI environments see the [Headless / CI section](#headless--ci-environments) below.

---

## Projects

The workspace contains two testable projects:

| Project | Path | Description |
|---------|------|-------------|
| `neurasil-charts` | `projects/neurasil-charts/` | The main chart library |
| `neurasil-library-tester` | `projects/neurasil-library-tester/` | The demo/tester application |

---

## Running Tests

### Library — `neurasil-charts`

```bash
ng test neurasil-charts
```

Karma will open a Chrome window, run all spec files, and watch for file changes. Press `Ctrl+C` to stop.

**Single run (no watch):**

```bash
ng test neurasil-charts --watch=false
```

**With code coverage:**

```bash
ng test neurasil-charts --watch=false --code-coverage
```

Coverage reports are written to `coverage/neurasil-charts/`. Open `coverage/neurasil-charts/index.html` in a browser to view the HTML report.

---

### Tester Application — `neurasil-library-tester`

```bash
ng test neurasil-library-tester
```

**Single run (no watch):**

```bash
ng test neurasil-library-tester --watch=false
```

---

### Running Both Projects

Run each project in a separate terminal:

```bash
# Terminal 1
ng test neurasil-charts --watch=false

# Terminal 2
ng test neurasil-library-tester --watch=false
```

---

## Headless / CI Environments

For environments without a display (Docker, GitHub Actions, etc.), use the `ChromeHeadless` browser:

```bash
ng test neurasil-charts --watch=false --browsers=ChromeHeadless
ng test neurasil-library-tester --watch=false --browsers=ChromeHeadless
```

Alternatively, add a `ChromeHeadlessNoSandbox` configuration to `karma.conf.js`:

```javascript
customLaunchers: {
  ChromeHeadlessNoSandbox: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox']
  }
},
browsers: ['ChromeHeadlessNoSandbox']
```

---

## Test File Locations

### `neurasil-charts` library

| File | What it tests |
|------|---------------|
| `src/lib/utils.spec.ts` | `Utils` static colour-conversion helpers |
| `src/lib/pipes/neurasil-data-filter/neurasil-data-filter.pipe.spec.ts` | `NeurasilDataFilter` pipe — include/exclude row & column filtering |
| `src/lib/neurasil-charts.service.spec.ts` | `NeurasilChartsService` — data parsing, chart object building, Pareto analysis |
| `src/lib/neurasil-charts.component.spec.ts` | `NeurasilChartsComponent` — inputs, lifecycle hooks, toolbar integration, draw logic |
| `src/lib/neurasil-charts-toolbar/neurasil-charts-toolbar.component.spec.ts` | `NeurasilChartsToolbarComponent` — event emission, template bindings |

### `neurasil-library-tester` application

| File | What it tests |
|------|---------------|
| `src/app/utils.service.spec.ts` | `UtilsService` — sample data generation, CSV → JSON parsing |
| `src/app/app.component.spec.ts` | `AppComponent` — initialisation, layout switching, filter updates, data parsing |

---

## Test Configuration Files

| File | Purpose |
|------|---------|
| `projects/neurasil-charts/karma.conf.js` | Karma config for the library |
| `projects/neurasil-charts/tsconfig.spec.json` | TypeScript config for library tests |
| `projects/neurasil-library-tester/karma.conf.js` | Karma config for the tester app |
| `projects/neurasil-library-tester/tsconfig.spec.json` | TypeScript config for tester app tests |

---

## Framework & Tooling

- **Test framework:** [Jasmine](https://jasmine.github.io/)
- **Test runner:** [Karma](https://karma-runner.github.io/)
- **Browser:** Google Chrome (via `karma-chrome-launcher`)
- **Coverage tool:** `karma-coverage` (Istanbul v2)
- **Angular testing utilities:** `TestBed`, `ComponentFixture`, `waitForAsync` from `@angular/core/testing`
