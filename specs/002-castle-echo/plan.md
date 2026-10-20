# Implementation Plan: Castelo do Eco - Experiência Web

**Branch**: `002-castle-echo` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: Approved Phase 2 scope in `specs/002-castle-echo/spec.md`

## Summary

Add a Portuguese, client-side web experience and mathematical reference area while preserving the Fase 1 CLI and its shared prediction rules. Use Vite to develop and build static files, Chart.js for per-sequence plots, and page-memory state for session history. No backend, account, teacher view, browser persistence, or remote API is introduced.

## Technical Context

**Language/Version**: JavaScript; Node.js 24.x LTS for the existing project and build tools

**Primary Dependencies**: Vite for development/build; Chart.js for accessible line plots; no runtime service dependencies

**Storage**: In-memory state in the current browser page only; no localStorage, files, or API

**Testing**: Existing Node.js `node:test` suite; web-domain and history tests with `node:test`; Vite production build; browser interaction and viewport checks

**Target Platform**: Modern desktop and mobile browsers; built output is a static site

**Project Type**: Existing Node.js CLI plus a static browser application rooted at `web/`

**Performance Goals**: At least 95% of prediction and chart updates for up to 100 terms complete within one second

**Constraints**: Portuguese UI; reuse Fase 1 parser and recognizers; keyboard operation; text alternative for every chart; session-only history; no backend, login, sharing, teacher access, persistent storage, exports, or longitudinal history analytics

**Scale/Scope**: One active learner per browser page; four pattern families; one prediction workspace, one in-session history view, and a concise set of mathematical help pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Evidence |
|---|---|---|
| Mathematical honesty | PASS | Reuse the Fase 1 recognizers; display all matches and explicitly preserve ambiguity. |
| Student privacy | PASS | Records remain in page memory and disappear on reload/close; teacher access is excluded. |
| Explicit scope | PASS | Static client app, per-sequence charts, session history, and math documentation only. |
| Tested behavior | PASS | Plan includes parser/pattern regression tests, UI flows, boundaries, accessibility, and session reset. |
| Accessible interaction | PASS | Keyboard navigation, labeled controls, contrast-safe chart series, and a textual equivalent. |

No unresolved clarification markers or constitution violations remain.

**Post-Design Review**: PASS. The design contains no API, user identity, persistence, shared access, or backend. Chart data is exposed in text, all patterns come from the approved core, and each major user journey has an independent validation path.

## Project Structure

### Documentation (this feature)

```text
specs/002-castle-echo/
  spec.md
  plan.md
  research.md
  data-model.md
  contracts/web-ui.md
  quickstart.md
  tasks.md
```

### Source Code (repository root)

```text
index.js                         # Existing Fase 1 CLI entry point
src/                              # Shared ESM parser/recognizers with CommonJS CLI adapters
web/
  index.html
  vite.config.js
  src/
    main.js                       # Accessible app navigation and prediction flow
    prediction.mjs                # Testable ESM adapter over the shared prediction core
    styles.css
    chart-data.mjs                 # Pure chart and accessible-table data
    chart-view.mjs                # Chart.js rendering and teardown
    session-history.mjs            # Browser-page-only history
    documentation.mjs              # Local Portuguese math topics
test/
  web-session-history.test.js
  web-domain.test.js
```

The Vite build writes static assets to the existing ignored `dist/` directory. The app imports Chart.js through its bundler entry and imports the shared ESM parser and recognizer. Existing CommonJS `.js` adapters keep the CLI and its tests on the same implementation; the ESM modules stay synchronous so Node.js 24 can load them from CommonJS.

**Structure Decision**: Keep the current CLI at the repository root and add a separate `web/` client. Vite is a development/build tool only; production output is static and needs no application server. Keep the parser and recognizers as shared ESM source with CommonJS adapters for the existing CLI. Use Chart.js rather than custom canvas drawing; pair its canvas with an accessible name and an adjacent semantic data table.

## Complexity Tracking

No constitution violations or exceptions require justification.
