# Tasks: Previsão de Sequências (Sala do Eco)

**Input**: Design documents from `specs/001-sequence-learning/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/cli.md`, `quickstart.md`

**Tests**: Automated tests are included because the project constitution requires tests for supported sequence rules, invalid input, boundaries, and ambiguity. Use Node.js `node:test` and `node:assert`.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel in different files with no incomplete-task dependency.
- **[Story]**: User story label from `spec.md`.
- Every task description names its exact file path.

## Phase 1: Setup

**Purpose**: Initialize the Node.js project according to the approved stack.

- [X] T001 Create `package.json` with CommonJS mode, `index.js` as the entry point, Node.js engine `>=24 <25`, `start` and `test` scripts, and no runtime dependencies.

---

## Phase 2: Foundational

**Purpose**: Establish the reusable interactive shell required by all user stories.

- [X] T002 Add terminal lifecycle tests in `test/cli.test.js` for the Portuguese menu, invalid menu choices, explicit exit, and EOF cleanup using injected input/output streams.
- [X] T003 Implement `startCli({ input, output })` in `src/cli.js` using `node:readline/promises`; repeat the menu after invalid choices and close the interface on exit or EOF.
- [X] T004 Create `index.js` to invoke `startCli()` when run as the program entry point and report startup failures in Portuguese without exposing a stack trace.

**Checkpoint**: `node index.js` opens the menu and exits cleanly; `node --test` runs the shell tests.

---

## Phase 3: User Story 1 - Descobrir o próximo termo (Priority: P1) - MVP

**Goal**: Parse a supported sequence and display its next term with an understandable rule, or a clear error when input is invalid or unsupported.

**Independent Test**: Run `node --test` and verify the reference arithmetic, geometric, squares, Fibonacci, decimal-comma, minimum-length, invalid-input, and unsupported-pattern scenarios.

### Tests for User Story 1

- [X] T005 [P] [US1] Add parser tests in `test/parse-sequence.test.js` for comma-separated integers, semicolon-separated comma decimals, whitespace, 2 to 100 terms, empty and non-numeric terms, mixed delimiters, non-finite values, and unsafe integers.
- [X] T006 [P] [US1] Add recognizer tests in `test/recognize-patterns.test.js` for arithmetic progressions, geometric progressions with a nonzero first term, consecutive nonnegative perfect squares, contiguous Fibonacci terms beginning `0, 1, 1`, unsupported patterns, and decimal comparison tolerance `1e-9`.
- [X] T007 [US1] Add prediction flow tests in `test/cli.test.js` for `3, 6, 9, 12` -> `15`, `1, 4, 9, 16` -> `25`, `2, 4, 8` -> `16`, `1, 1, 2, 3, 5` -> `8`, `1,5; 3; 4,5` -> `6`, one-term rejection, and `10, 20, abc` rejection.

### Implementation for User Story 1

- [X] T008 [P] [US1] Implement `parseSequence(rawText)` in `src/parse-sequence.js`; enforce the data-model constraints verbatim: “2 to 100 terms; no empty or non-numeric term; one delimiter style; integers must be within JavaScript's safe-integer range.”
- [X] T009 [P] [US1] Implement `recognizePatterns(terms)` in `src/recognize-patterns.js` for the four approved families; require every term to match, return each supported match with `kind`, `rule`, `nextTerm`, and `parameters`, and use decimal comparison tolerance `1e-9`.
- [X] T010 [US1] Integrate parsing and pattern recognition into action `1` in `src/cli.js`; display a single recognized rule, report an ambiguity without choosing a winner when multiple rules match, and show Portuguese validation or unsupported-pattern messages without terminating the menu.

**Checkpoint**: Story 1 works independently through `node index.js`, and its tests pass with `node --test`.

---

## Phase 4: User Story 2 - Entender padrões possíveis (Priority: P2)

**Goal**: Show all recognized interpretations and predictions for ambiguous input without implying that they are the only mathematically possible continuations.

**Independent Test**: Enter `2, 4` and verify that the CLI separately identifies the arithmetic prediction `6` and geometric prediction `8`; enter an unsupported sequence and verify that no next term is invented.

### Tests for User Story 2

- [X] T011 [US2] Add ambiguity and unsupported-pattern CLI tests in `test/cli.test.js` for `2, 4`, verifying both rules and predictions are shown, and for an unsupported sequence, verifying no prediction is displayed.

### Implementation for User Story 2

- [X] T012 [US2] Update action `1` in `src/cli.js` to display every returned pattern match with its rule and next term, preserve stable match ordering, and explicitly avoid claiming the results cover all possible continuations.

**Checkpoint**: Story 2 passes independently on top of the predictor from Story 1.

---

## Phase 5: User Story 3 - Revisar tentativas anteriores (Priority: P3)

**Goal**: Let the learner review valid echoes in submission order during the current process session only.

**Independent Test**: Make two supported predictions, view history in order, exit and restart the app, then verify that the new session is empty.

### Tests for User Story 3

- [X] T013 [P] [US3] Add session-history tests in `test/session-history.test.js` for empty startup, insertion order, recording only valid predictions, and an empty store for each new session.
- [X] T014 [P] [US3] Add history menu tests in `test/cli.test.js` for the empty state, displaying submitted sequences with all shown matches in order, and history not being available after a new CLI session starts.

### Implementation for User Story 3

- [X] T015 [US3] Implement `createSessionHistory()` in `src/session-history.js` with add, list, and clear operations; keep records in memory only, expose them only during the current process, and discard them when the process exits.
- [X] T016 [US3] Integrate the history action in `src/cli.js`; record only valid predictions with at least one supported match, display them in submission order, and never persist or share records with teachers.

**Checkpoint**: Story 3 passes independently; starting a fresh process produces an empty history.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verify the performance target, full acceptance flow, and documentation consistency.

- [X] T017 [P] Add a performance regression test in `test/performance.test.js` that measures 100-term parsing and recognition over repeated runs and verifies the p95 is under 1 second.
- [X] T018 Run `node --test` and validate every acceptance scenario in `specs/001-sequence-learning/quickstart.md`; update that guide with any corrected invocation or observed output.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; complete before implementation work.
- **Foundational (Phase 2)**: Depends on Setup; provides the terminal shell required by all stories.
- **User Story 1 (Phase 3)**: Depends on Foundation; delivers the MVP sequence predictor.
- **User Story 2 (Phase 4)**: Depends on Story 1's parser and recognizer; adds transparent multi-match presentation.
- **User Story 3 (Phase 5)**: Depends on Story 1's Prediction Result; can be developed after the shared shell and predictor are stable.
- **Polish (Phase 6)**: Depends on all selected stories.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on another story.
- **US2 (P2)**: Depends on US1 because it presents the matches produced by its recognizer.
- **US3 (P3)**: Depends on US1's prediction result; it does not depend on US2's presentation behavior.

### Parallel Opportunities

- In US1, T005, T006, and T007 target separate test files and can be authored in parallel after Phase 2. T008 and T009 target separate implementation files and can proceed in parallel after their tests are in place.
- In US3, T013 and T014 target separate test files and can be authored in parallel after US1. T015 and T016 are sequential because CLI integration consumes the history module.
- US2 and US3 can be developed in parallel after US1 only if CLI integration work is coordinated; both implementation tasks update `src/cli.js`, so T012 and T016 must not run concurrently.
- T017 targets a separate performance test file and can run independently after the predictor exists.

## Parallel Examples

### User Story 1

```text
Task: T005 parser tests in test/parse-sequence.test.js
Task: T006 pattern tests in test/recognize-patterns.test.js
Task: T007 prediction flow tests in test/cli.test.js
```

After tests are in place:

```text
Task: T008 parser implementation in src/parse-sequence.js
Task: T009 recognizer implementation in src/recognize-patterns.js
```

### User Story 3

```text
Task: T013 store tests in test/session-history.test.js
Task: T014 history-menu tests in test/cli.test.js
```

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 and run its independent checks with `node --test` and `node index.js`.
3. Stop and validate arithmetic, geometric, square, Fibonacci, decimal, invalid, and unsupported cases before adding later stories.

### Incremental Delivery

1. Add US2 to show all recognized interpretations for ambiguous input.
2. Add US3 for in-session history after US1 is stable.
3. Complete the performance check and run all `quickstart.md` acceptance scenarios.

## Notes

- Every executable task uses `- [ ] T###`, includes a story label only in user-story phases, and names the file it changes.
- Test tasks are included to satisfy the project constitution's automated testing requirement.
- No web UI, persistent storage, authentication, exports, or teacher access is part of these tasks.
