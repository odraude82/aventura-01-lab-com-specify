---
description: "Tasks for the Castelo do Eco web experience"
---

# Tasks: Castelo do Eco - Experiência Web

**Input**: Design documents from `/specs/002-castle-echo/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/web-ui.md`, and `quickstart.md`

**Tests**: Included because the specification and plan require regression, accessibility, browser-flow, and session-lifecycle verification.

**Organization**: Tasks are grouped by the four approved user stories, in priority order.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different files with no dependency on incomplete tasks.
- **[Story]**: User-story traceability; setup and foundational tasks have no story label.
- Every task names the files it creates, changes, or validates.

## Phase 1: Setup

**Purpose**: Add the static-web toolchain while preserving the existing CLI scripts.

- [X] T001 Add Vite and Chart.js dependencies, a lockfile, and `dev`/`build` scripts while retaining `start`/`test` in `package.json` and `package-lock.json`.
- [X] T002 [P] Configure the static Vite entry and `dist/` output in `web/vite.config.js` and create the Portuguese document shell in `web/index.html`.

## Phase 2: Foundational

**Purpose**: Establish one synchronous prediction core for Node.js and browser consumers; these tasks block all stories.

- [X] T003 [P] Move `parseSequence` into `src/parse-sequence.mjs` and preserve the current CommonJS API through a thin adapter in `src/parse-sequence.js`.
- [X] T004 [P] Move `recognizePatterns` and its helpers into `src/recognize-patterns.mjs` and preserve the current CommonJS API through a thin adapter in `src/recognize-patterns.js`.
- [X] T005 Verify CommonJS interoperability and unchanged CLI/domain behavior with `test/parse-sequence.test.js`, `test/recognize-patterns.test.js`, and the complete `npm test` suite.

**Checkpoint**: The CLI and tests still use their existing `.js` imports, while browser code can import the same synchronous `.mjs` implementation.

## Phase 3: User Story 1 - Prever uma sequência na web (Priority: P1) - MVP

**Goal**: Accept the Fase 1 input grammar in Portuguese and show every recognized prediction without claiming a unique continuation.

**Independent Test**: Exercise arithmetic, geometric, squares, Fibonacci, decimal-comma, ambiguous, invalid, and unsupported examples; compare validation and predictions with the Fase 1 CLI.

### Tests for User Story 1

- [X] T006 [P] [US1] Add prediction-domain tests for valid, ambiguous, invalid, and unsupported inputs in `test/web-domain.test.js`.

### Implementation for User Story 1

- [X] T007 [US1] Implement the browser prediction adapter using the shared parser and recognizers in `web/src/prediction.mjs`.
- [X] T008 [US1] Build the Portuguese prediction form, results, error states, keyboard-operable navigation shell, and responsive styling in `web/index.html`, `web/src/main.js`, and `web/src/styles.css`.

**Checkpoint**: A user can submit supported and unsupported sequences in the browser and see the same recognized rules, next terms, and validation behavior as the CLI.

## Phase 4: User Story 2 - Visualizar sequências e previsões (Priority: P2)

**Goal**: Plot submitted terms and each supported continuation, with an equivalent semantic text/table representation.

**Independent Test**: For one-match and multi-match examples, verify labels, axes, submitted values, distinct continuations, accessible canvas naming, and every value in the semantic table.

### Tests for User Story 2

- [X] T009 [P] [US2] Add chart-series and data-table value tests in `test/chart-data.test.js` for the model returned by `web/src/chart-data.mjs`.

### Implementation for User Story 2

- [X] T010 [US2] Implement pure chart/table data in `web/src/chart-data.mjs` and labeled Chart.js rendering, replacement/teardown, and accessible fallback in `web/src/chart-view.mjs`.
- [X] T011 [US2] Integrate chart and equivalent semantic table with prediction results and narrow-screen styling in `web/src/main.js` and `web/src/styles.css`.

**Checkpoint**: Every recognized forecast is distinguishable, and the chart's complete information is available without relying on color or visual position.

## Phase 5: User Story 3 - Revisar ecos na sessão atual (Priority: P3)

**Goal**: Retain valid matched predictions in submission order for the current page lifetime only.

**Independent Test**: Add two valid predictions, confirm ordered history with all recognized rules, reject invalid/unsupported entries, and reload to confirm the empty state.

### Tests for User Story 3

- [X] T012 [P] [US3] Add in-memory history ordering, exclusion, and empty-state tests in `test/web-session-history.test.js`.

### Implementation for User Story 3

- [X] T013 [US3] Implement the page-lifetime history store and clear operation in `web/src/session-history.mjs` without browser storage or network access.
- [X] T014 [US3] Connect successful predictions to the history view and render its ordered and empty states in `web/src/main.js` and `web/src/styles.css`.

**Checkpoint**: Only valid predictions appear in the current page's history; reload starts with no prior records.

## Phase 6: User Story 4 - Consultar conceitos matemáticos (Priority: P4)

**Goal**: Provide local Portuguese explanations for the four recognized patterns and the limits of finite-sequence prediction.

**Independent Test**: Open every topic from keyboard-operable navigation and check its examples against the shared recognizers, including the explanation that multiple continuations may fit.

### Tests for User Story 4

- [X] T015 [P] [US4] Add documentation-topic coverage tests for all four patterns and ambiguity in `test/documentation.test.js`.

### Implementation for User Story 4

- [X] T016 [US4] Implement local Portuguese rule and ambiguity content in `web/src/documentation.mjs`.
- [X] T017 [US4] Integrate documentation navigation, active-state announcements, and readable responsive topic rendering in `web/src/main.js` and `web/src/styles.css`.

**Checkpoint**: Each topic is reachable without a remote request and its examples agree with the behavior exposed by the application.

## Phase 7: Polish & Cross-Cutting Validation

**Purpose**: Confirm the approved scope, production build, accessibility, responsive behavior, and quickstart instructions.

- [X] T018 [P] Update `specs/002-castle-echo/quickstart.md` with the final install, test, build, development-server, and acceptance-flow commands.
- [X] T019 Verify responsive layouts, keyboard-only prediction/history/documentation flows, chart-table equivalence, and reload-cleared history against `web/index.html`, `web/src/main.js`, and `web/src/styles.css` in a real browser at desktop and narrow viewports.
- [X] T020 Run `npm test` and `npm run build`; verify the static entry and bundled assets in `dist/` and confirm the web app introduces no persistence, teacher access, login, sharing, exports, or remote API in `web/`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup**: T001 and T002 can start immediately; they touch separate files.
- **Foundational**: T003 and T004 depend on setup and can run in parallel; T005 depends on both adapters.
- **User stories**: All depend on the foundation. US2 and US3 use the US1 prediction result; US4 is functionally independent after the foundation, but follows the approved priority order.
- **Polish**: T018-T020 depend on all four stories; T019 and T020 validate the integrated application.

### User Story Dependencies

- **US1 (P1)**: Starts after the foundation; no dependency on another story.
- **US2 (P2)**: Starts after US1 because it charts the prediction result.
- **US3 (P3)**: Starts after US1 because it records valid matched predictions.
- **US4 (P4)**: Needs only the shared pattern definitions, but is sequenced after US3 to honor story priority; its content test and implementation do not change prediction rules.

### Parallel Opportunities

- T003 and T004 operate on separate parser and recognizer module pairs.
- Once US1 is complete, the US2 chart tests and US3 history tests use separate files and can be prepared in parallel; integration tasks that both edit `web/src/main.js` remain sequential.
- T015 documentation tests can be developed independently from US2/US3 test files after the shared-core foundation.
- T018 quickstart edits are isolated from application source; browser and build validation happen after all story integrations.

## Parallel Examples

```text
After Setup:
Task T003: Move the parser into src/parse-sequence.mjs with a CommonJS adapter
Task T004: Move the recognizers into src/recognize-patterns.mjs with a CommonJS adapter

After US1:
Task T009: Add chart-series tests in test/chart-data.test.js
Task T012: Add session-history tests in test/web-session-history.test.js
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases; preserve CLI compatibility before web UI work.
2. Complete US1 and validate browser predictions against the CLI.
3. Stop for the US1 checkpoint; the prediction interface is the first independently usable increment.

### Incremental Delivery

1. Add US2 and verify every chart has an equivalent accessible table.
2. Add US3 and verify its page-memory lifecycle, including reload.
3. Add US4 and verify every documented example against the supported rules.
4. Complete T018-T020 for responsive, keyboard, browser, test-suite, and production-build validation.

## Notes

- Every task uses a checkbox, sequential task ID, optional parallel marker, story label where required, and explicit file paths.
- Shared `.mjs` modules must remain synchronous; `.js` adapters preserve the existing CommonJS API.
- The approved scope excludes persistence, teacher access, login, sharing, exports, longitudinal analytics, and remote services.